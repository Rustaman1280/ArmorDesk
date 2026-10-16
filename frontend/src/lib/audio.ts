/**
 * ElevenLabs Voice AI Telemetry & Audio Service
 * Provides low-latency audio playback with seamless Web Speech API browser fallback.
 */

const API_BASE = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || "/api")
  : (process.env.INTERNAL_API_URL || "http://127.0.0.1:8000/api");

type AudioPlayListener = (isPlaying: boolean) => void;
const listeners: Set<AudioPlayListener> = new Set();
let currentAudio: HTMLAudioElement | null = null;
let isCurrentlyPlaying = false;

function notifyListeners(playing: boolean) {
  isCurrentlyPlaying = playing;
  listeners.forEach((fn) => fn(playing));
}

export function subscribeAudioPlaying(listener: AudioPlayListener): () => void {
  listeners.add(listener);
  listener(isCurrentlyPlaying);
  return () => {
    listeners.delete(listener);
  };
}

export function isVoiceEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const val = localStorage.getItem("armordesk_voice_enabled");
  return val === null ? true : val === "true";
}

export function setVoiceEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("armordesk_voice_enabled", String(enabled));
  if (!enabled) {
    stopVoiceAlert();
  }
}

export function stopVoiceAlert(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  notifyListeners(false);
}

/**
 * Fallback to browser built-in Web Speech API synthesis
 */
export function playBrowserTTS(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")) && v.lang.startsWith("en")
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => notifyListeners(true);
      utterance.onend = () => {
        notifyListeners(false);
        resolve();
      };
      utterance.onerror = () => {
        notifyListeners(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      notifyListeners(false);
      resolve();
    }
  });
}

/**
 * Primary Voice Synthesizer
 * Calls ElevenLabs FastAPI endpoint, falls back to Web Speech API automatically
 */
export async function playVoiceAlert(
  text: string,
  voiceType: "security" | "executive" = "security",
  customApiKey?: string
): Promise<boolean> {
  if (!isVoiceEnabled()) {
    return false;
  }

  stopVoiceAlert();

  const storedKey = typeof window !== "undefined" ? localStorage.getItem("armordesk_elevenlabs_key") || undefined : undefined;
  const apiKey = customApiKey || storedKey;

  try {
    const res = await fetch(`${API_BASE}/voice/synthesize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voice_type: voiceType,
        api_key: apiKey
      })
    });

    if (!res.ok) {
      throw new Error(`Synthesis HTTP ${res.status}`);
    }

    const data = await res.json();

    if (data.success && data.audio_base64) {
      // Play real ElevenLabs audio
      const audioUrl = `data:${data.content_type || "audio/mpeg"};base64,${data.audio_base64}`;
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onplay = () => notifyListeners(true);
      audio.onended = () => {
        notifyListeners(false);
        currentAudio = null;
      };
      audio.onerror = () => {
        // Fall back to browser speech if audio buffer decode fails
        currentAudio = null;
        playBrowserTTS(text);
      };

      await audio.play();
      return true;
    } else {
      // Backend returned fallback flag
      await playBrowserTTS(text);
      return true;
    }
  } catch (e) {
    console.warn("ElevenLabs backend request failed, falling back to browser TTS:", e);
    await playBrowserTTS(text);
    return true;
  }
}

/**
 * Play dynamic executive audio briefing for pending transactions
 */
export async function playExecutiveBriefing(
  tenantId: string = "acme-corp",
  userName: string = "Sarah Chen",
  customApiKey?: string
): Promise<{ success: boolean; script: string }> {
  if (!isVoiceEnabled()) {
    return { success: false, script: "Voice is currently muted." };
  }

  stopVoiceAlert();
  const storedKey = typeof window !== "undefined" ? localStorage.getItem("armordesk_elevenlabs_key") || undefined : undefined;
  const apiKey = customApiKey || storedKey;

  try {
    const res = await fetch(`${API_BASE}/voice/briefing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant_id: tenantId,
        user_name: userName,
        api_key: apiKey
      })
    });

    if (!res.ok) {
      throw new Error(`Briefing HTTP ${res.status}`);
    }

    const data = await res.json();
    const script = data.script || `Briefing for ${userName}. All agents nominal.`;

    if (data.success && data.audio_base64) {
      const audioUrl = `data:audio/mpeg;base64,${data.audio_base64}`;
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onplay = () => notifyListeners(true);
      audio.onended = () => {
        notifyListeners(false);
        currentAudio = null;
      };
      audio.onerror = () => {
        currentAudio = null;
        playBrowserTTS(script);
      };

      await audio.play();
      return { success: true, script };
    } else {
      await playBrowserTTS(script);
      return { success: true, script };
    }
  } catch (e) {
    console.warn("Briefing audio failed, using browser speech fallback:", e);
    const fallbackScript = `Executive briefing for ${userName}. Reviewing pending escrow tickets.`;
    await playBrowserTTS(fallbackScript);
    return { success: true, script: fallbackScript };
  }
}

