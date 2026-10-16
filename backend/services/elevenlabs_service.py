"""
ElevenLabs Voice AI Service for ArmorDesk
Provides low-latency speech synthesis for Security SOC Telemetry and Executive Briefings.
Includes automatic zero-crash resilience with client-side fallback flags.
"""
import os
import base64
import logging
from typing import Dict, Any, Optional, Tuple
import httpx

logger = logging.getLogger("armordesk.voice")

# Pre-configured default key provided for the hackathon
DEFAULT_ELEVENLABS_KEY = os.environ.get("ELEVENLABS_API_KEY") or "sk_722c315aa87c45ba21d7278fd5001dd0edc02be2658b00f3"

# Voice ID Mappings (using official high-performance premade voices)
VOICE_MAP = {
    # Aegis SOC Alert: Authoritative, steady, decisive
    "security": "onwK4e9ZLuTAKqWW03F9",  # Daniel - Steady Broadcaster
    # Chief of Staff / Executive Briefing: Reassuring, polished, professional
    "executive": "EXAVITQu4vr4xnSDxMaL",  # Sarah - Confident & Professional
}

# Preferred model: lowest latency (~75ms)
PREFERRED_MODEL = "eleven_flash_v2_5"

def synthesize_speech(
    text: str,
    voice_type: str = "security",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Synthesizes speech via ElevenLabs Text-to-Speech API.
    Zero-crash resilience: returns fallback flag if API request fails.
    """
    key = api_key or DEFAULT_ELEVENLABS_KEY
    voice_id = VOICE_MAP.get(voice_type, VOICE_MAP["security"])
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    if not key or len(key.strip()) < 10:
        return {
            "success": False,
            "audio_base64": None,
            "fallback_browser_tts": True,
            "text": text,
            "reason": "Missing or invalid ElevenLabs API key"
        }

    try:
        headers = {
            "xi-api-key": key.strip(),
            "Content-Type": "application/json",
            "Accept": "audio/mpeg"
        }
        payload = {
            "text": text,
            "model_id": PREFERRED_MODEL,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }

        with httpx.Client(timeout=10.0) as client:
            resp = client.post(url, json=payload, headers=headers)

        if resp.status_code == 200:
            audio_bytes = resp.content
            audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
            return {
                "success": True,
                "audio_base64": audio_b64,
                "fallback_browser_tts": False,
                "text": text,
                "voice_type": voice_type,
                "voice_id": voice_id,
                "content_type": "audio/mpeg"
            }
        else:
            logger.warning(f"ElevenLabs TTS returned HTTP {resp.status_code}: {resp.text[:120]}")
            return {
                "success": False,
                "audio_base64": None,
                "fallback_browser_tts": True,
                "text": text,
                "status_code": resp.status_code,
                "reason": f"API returned {resp.status_code}"
            }

    except Exception as exc:
        logger.error(f"ElevenLabs synthesis exception: {exc}")
        return {
            "success": False,
            "audio_base64": None,
            "fallback_browser_tts": True,
            "text": text,
            "reason": str(exc)
        }

def build_executive_briefing_text(
    tenant_name: str,
    user_name: str,
    pending_items: list
) -> str:
    """Builds a crisp, natural executive speech script."""
    count = len(pending_items)
    if count == 0:
        return (
            f"Good day, {user_name}. Treasury buffer for {tenant_name} is stable with zero held transactions. "
            f"All autonomous agents are operating within designated policy scopes."
        )

    total_amount = sum(float(item.get("amount", 0.0)) for item in pending_items)
    top_item = pending_items[0]
    top_recipient = top_item.get("recipient", "Unknown Vendor")
    top_amount = float(top_item.get("amount", 0.0))

    if count == 1:
        return (
            f"Security briefing for {user_name}. You have 1 high-value disbursement held in escrow by ArmorIQ policy, "
            f"totaling ${total_amount:,.2f}. The transaction is payable to {top_recipient} for ${top_amount:,.2f}. "
            f"Awaiting dual-control authorization."
        )

    return (
        f"Executive briefing for {user_name}. You have {count} pending high-value items held in escrow by ArmorIQ policy, "
        f"totaling ${total_amount:,.2f}. The largest request is for {top_recipient} at ${top_amount:,.2f}. "
        f"Awaiting your authorization in the Approval Inbox."
    )
