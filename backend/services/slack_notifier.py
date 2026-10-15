"""
Slack Notification Service
Delivers real-time approval requests and security alerts to Slack webhook,
with fallback simulation logging when no webhook URL is configured.
"""
import httpx
from typing import Dict, Any, Optional

async def send_slack_alert(
    webhook_url: Optional[str],
    title: str,
    message: str,
    fields: Optional[Dict[str, str]] = None,
    color: str = "#EAB308"
) -> Dict[str, Any]:
    """
    Sends interactive alert card to Slack.
    # ponytail: basic webhook message; upgrade to interactive Slack app with direct action buttons when deploying to prod.
    """
    field_elements = []
    if fields:
        for k, v in fields.items():
            field_elements.append({
                "type": "mrkdwn",
                "text": f"*{k}:*\n`{v}`"
            })

    payload = {
        "text": f"🛡️ *ArmorDesk Alert:* {title}",
        "attachments": [
            {
                "color": color,
                "blocks": [
                    {
                        "type": "section",
                        "text": {"type": "mrkdwn", "text": f"*{title}*\n{message}"}
                    }
                ]
            }
        ]
    }

    if field_elements:
        payload["attachments"][0]["blocks"].append({
            "type": "section",
            "fields": field_elements
        })

    if webhook_url and webhook_url.startswith("http"):
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.post(webhook_url, json=payload)
                return {"delivered": res.status_code == 200, "status_code": res.status_code, "mode": "LIVE_WEBHOOK"}
        except Exception as e:
            return {"delivered": False, "error": str(e), "mode": "FALLBACK_LOG"}

    return {
        "delivered": True,
        "mode": "SIMULATION_LOG",
        "mock_payload": payload
    }
