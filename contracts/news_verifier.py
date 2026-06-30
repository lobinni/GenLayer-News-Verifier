# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

import json
from genlayer import *


class NewsVerifier(gl.Contract):
    news_data: TreeMap[str, str]
    news_count: u256

    def __init__(self):
        self.news_count = u256(0)

    @gl.public.write
    def submit_news(self, headline: str, source_url: str) -> str:
        headline = str(headline).strip()
        source_url = str(source_url).strip()
        if not headline:
            raise Exception("headline required")
        if not source_url:
            raise Exception("source_url required")

        key = str(int(self.news_count))
        record = {
            "submitter": str(gl.message.sender_address),
            "headline": headline,
            "source_url": source_url,
            "status": "pending",
            "confidence": "",
            "reasoning": "",
        }
        self.news_data[key] = json.dumps(record)
        self.news_count += u256(1)
        return key

    @gl.public.write
    def verify_news(self, news_id: str) -> str:
        news_id = str(news_id).strip()
        if news_id not in self.news_data:
            raise Exception("News not found")

        record = json.loads(self.news_data[news_id])
        if record["status"] != "pending":
            raise Exception("Already verified")

        verdict = self._fact_check(record["headline"], record["source_url"])

        record["status"] = verdict["status"]
        record["confidence"] = verdict["confidence"]
        record["reasoning"] = verdict["reasoning"]
        self.news_data[news_id] = json.dumps(record)
        return news_id

    def _fact_check(self, headline: str, source_url: str) -> dict:
        def leader_fn() -> str:
            page_content = "(could not fetch)"
            try:
                raw = gl.nondet.web.render(source_url, mode="text")
                page_content = raw[:4000]
            except Exception:
                pass

            prompt = f"""You are a professional fact-checker. Analyze this news headline for accuracy.

HEADLINE: {headline}
SOURCE URL: {source_url}
PAGE CONTENT:
{page_content}

RULES:
1. Compare the headline claim against the actual page content.
2. If the page supports the headline, mark as "verified".
3. If the page contradicts the headline, mark as "false".
4. If the page cannot be fetched or content is insufficient, mark as "unverifiable".
5. Rate confidence: high (clear evidence), medium (some indicators), low (uncertain).

Reply ONLY valid JSON:
{{"status": "verified"/"false"/"unverifiable", "confidence": "high"/"medium"/"low", "reasoning": "<brief explanation>"}}"""

            raw = gl.nondet.exec_prompt(prompt, response_format="json")
            data = raw if isinstance(raw, dict) else json.loads(str(raw).strip())

            status = str(data.get("status", "")).strip().lower()
            if status not in ("verified", "false", "unverifiable"):
                status = "unverifiable"

            confidence = str(data.get("confidence", "")).strip().lower()
            if confidence not in ("high", "medium", "low"):
                confidence = "low"

            reasoning = str(data.get("reasoning", "")).strip()
            if not reasoning:
                reasoning = "no reasoning provided"

            return json.dumps({
                "status": status,
                "confidence": confidence,
                "reasoning": reasoning,
            })

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            try:
                data = json.loads(leader_result.calldata)
                if data.get("status") not in ("verified", "false", "unverifiable"):
                    return False
                if data.get("confidence") not in ("high", "medium", "low"):
                    return False
                reasoning = data.get("reasoning")
                if not isinstance(reasoning, str) or not reasoning.strip():
                    return False
                return True
            except Exception:
                return False

        return json.loads(gl.vm.run_nondet_unsafe(leader_fn, validator_fn))

    @gl.public.view
    def get_news(self, news_id: str) -> dict:
        news_id = str(news_id)
        if news_id not in self.news_data:
            return {"exists": False}
        return json.loads(self.news_data[news_id])

    @gl.public.view
    def get_all_news(self) -> list:
        result = []
        for key in self.news_data:
            entry = json.loads(self.news_data[key])
            entry["id"] = key
            result.append(entry)
        return result

    @gl.public.view
    def get_count(self) -> dict:
        return {"total": int(self.news_count)}
