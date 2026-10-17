import os, json, urllib.request, subprocess

with open('/home/ubuntu/ArmorDesk/backend/.env') as f:
    env = {}
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env[k] = v

api_key = env.get('ELEVENLABS_API_KEY')
voice_id = "SAz9YHcvj6GT2YYXdXww" # River - Informative, Neutral Tech Tone

scripts = {
    "scene1_problem": (
        "Autonomous AI coding agents are increasingly given high-privilege access to corporate databases, cloud infra, and financial APIs. "
        "The problem? Indirect Prompt Injection. When an agent reads an unvetted invoice or email containing hidden instructions, it can be tricked into wiring funds or corrupting data. "
        "Who is this for? CISOs, enterprise security architects, and FinOps teams who need to govern autonomous agents without slowing down engineering innovation."
    ),
    "scene2_architecture": (
        "Meet ArmorDesk: a governed Model Context Protocol gateway that acts as a zero-trust cryptographic firewall. "
        "Instead of relying on LLM self-discipline, ArmorDesk intercepts tool calls at the JSON-RPC wire level. "
        "With one command, developers authenticate through browser OAuth and automatically connect up to twelve local agents, including Antigravity, OpenCode, Codex, Hermes, Cursor, and Claude."
    ),
    "scene3_demo": (
        "Here is the product working end to end. "
        "A low-risk autonomous SLA refund of twenty dollars passes instantly under our policy threshold. "
        "Next, when an agent attempts an unauthorized eight thousand dollar wire transfer, ArmorDesk immediately freezes execution into Dual-Control Escrow. "
        "In the Approval Inbox, the transaction requires human cryptographic sign-off before funds leave the bank."
    ),
    "scene4_armoriq": (
        "Inside the ArmorIQ Console and Policy Studio at tools dot armoriq dot ai, we configure attestation rules that anchor agent intent. "
        "Our rules mandate vendor whitelist verification, enforce spend ceilings, and compute SHA-256 Plan Hashes. "
        "Every execution mints an immutable cryptographic receipt with a Merkle proof, verifiable offline by compliance auditors."
    ),
    "scene5_takeaways": (
        "Our key takeaway: agent security cannot rely on prompt engineering. True enterprise governance requires deterministic control at the protocol layer. "
        "Next, we are building distributed Hardware Security Module escrows on AWS Nitro Enclaves and multi-agent threshold voting. "
        "Inspect the open source SDK on npm, check our repository on GitHub, and explore the live gateway at armordesk dot crusts dot dev."
    )
}

out_dir = "/home/ubuntu/ArmorDesk/frontend/public/voiceover"
os.makedirs(out_dir, exist_ok=True)

durations = {}

for name, text in scripts.items():
    print(f"Generating {name} ({len(text)} chars)...")
    payload = json.dumps({
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.55,
            "similarity_boost": 0.75,
            "style": 0.15,
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
        "file": f"/voiceover/{name}.mp3",
        "durationSec": dur,
        "framesAt30Fps": int(round(dur * 30)),
        "text": text
    }
    print(f"  -> Generated {out_file}: {dur:.2f}s ({durations[name]['framesAt30Fps']} frames)")

with open(os.path.join(out_dir, "manifest.json"), "w") as f:
    json.dump(durations, f, indent=2)

print("\nAll audio generated successfully!")
print("Total duration:", sum(d["durationSec"] for d in durations.values()), "seconds")
