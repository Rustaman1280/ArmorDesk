import os, json, urllib.request, subprocess

with open('/home/ubuntu/ArmorDesk/backend/.env') as f:
    env = {}
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env[k] = v

api_key = env.get('ELEVENLABS_API_KEY')
voice_id = "pNInz6obpgDQGcFmaJgB" # Adam

supplemental = {
    "scene2_onboarding": (
        "[excited] With one simple curl command and browser OAuth, "
        "ArmorDesk instantly connects up to twelve local coding agents in seconds."
    ),
    "scene4_dashboard": (
        "Here in our live ARMOR Tools dashboard, we monitor OpenCode and Claude Code, "
        "tracking three point five million tokens and enforcing strict spend controls."
    )
}

out_dir = "/home/ubuntu/ArmorDesk/frontend/public/voiceover"
os.makedirs(out_dir, exist_ok=True)

durations = {}

for name, text in supplemental.items():
    print(f"Generating {name} ({len(text)} chars) with eleven_v4...")
    payload = json.dumps({
        "text": text,
        "model_id": "eleven_v4",
        "voice_settings": {
            "stability": 0.40,
            "similarity_boost": 0.85,
            "style": 0.40,
            "use_speaker_boost": True
        }
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        data=payload,
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg"
        }
    )
    
    out_file = os.path.join(out_dir, f"{name}.mp3")
    with urllib.request.urlopen(req) as resp:
        with open(out_file, "wb") as f:
            f.write(resp.read())
            
    # Measure duration with ffprobe
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", out_file]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, text=True)
    dur = float(res.stdout.strip())
    durations[name] = {
        "file": f"voiceover/{name}.mp3",
        "durationSec": dur,
        "framesAt30Fps": int(round(dur * 30)),
        "text": text
    }
    print(f"  -> Generated {out_file}: {dur:.2f}s ({durations[name]['framesAt30Fps']} frames)")

print("\nSupplemental audio generated successfully!")
