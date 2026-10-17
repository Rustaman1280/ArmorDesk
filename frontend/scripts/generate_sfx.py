import math, random, wave, struct, os, subprocess

os.makedirs("/home/ubuntu/ArmorDesk/frontend/public/sfx", exist_ok=True)
sr = 44100

def write_wav(filename, samples):
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        for s in samples:
            val = max(-32767, min(32767, int(s * 32767)))
            wf.writeframes(struct.pack('<h', val))

# 1. Whoosh
samples = []
duration = 0.35
num_samples = int(sr * duration)
for i in range(num_samples):
    t = i / sr
    env = math.sin(math.pi * (t / duration)) ** 2
    noise = random.uniform(-1, 1)
    sweep = math.sin(2 * math.pi * (200 + 600 * (t / duration)) * t)
    samples.append((0.6 * sweep + 0.4 * noise) * env * 0.5)
write_wav("/home/ubuntu/ArmorDesk/frontend/public/sfx/whoosh.wav", samples)

# 2. Click
samples = []
duration = 0.05
num_samples = int(sr * duration)
for i in range(num_samples):
    t = i / sr
    samples.append(math.sin(2 * math.pi * 1800 * t) * math.exp(-t * 120) * 0.7)
write_wav("/home/ubuntu/ArmorDesk/frontend/public/sfx/click.wav", samples)

# 3. Success Chime (Major triad C5 + E5 + G5)
samples = []
duration = 0.6
num_samples = int(sr * duration)
for i in range(num_samples):
    t = i / sr
    chime = (
        0.4 * math.sin(2 * math.pi * 523.25 * t) +
        0.35 * math.sin(2 * math.pi * 659.25 * t) +
        0.35 * math.sin(2 * math.pi * 783.99 * t)
    ) * math.exp(-t * 5.0) * 0.6
    samples.append(chime)
write_wav("/home/ubuntu/ArmorDesk/frontend/public/sfx/success.wav", samples)

# 4. Laser Scan
samples = []
duration = 0.4
num_samples = int(sr * duration)
for i in range(num_samples):
    t = i / sr
    laser = math.sin(2 * math.pi * (400 + 800 * math.sin(math.pi * t / duration)) * t) * (math.sin(math.pi * t / duration) ** 1.5) * 0.3
    samples.append(laser)
write_wav("/home/ubuntu/ArmorDesk/frontend/public/sfx/laser.wav", samples)

# 5. Lock Latch
samples = []
duration = 0.2
num_samples = int(sr * duration)
for i in range(num_samples):
    t = i / sr
    samples.append((math.sin(2 * math.pi * 120 * t) + 0.5 * math.sin(2 * math.pi * 340 * t)) * math.exp(-t * 25) * 0.7)
write_wav("/home/ubuntu/ArmorDesk/frontend/public/sfx/lock.wav", samples)

# Convert all to MP3 with ffmpeg
for name in ["whoosh", "click", "success", "laser", "lock"]:
    wav_p = f"/home/ubuntu/ArmorDesk/frontend/public/sfx/{name}.wav"
    mp3_p = f"/home/ubuntu/ArmorDesk/frontend/public/sfx/{name}.mp3"
    subprocess.run(["ffmpeg", "-y", "-i", wav_p, "-codec:a", "libmp3lame", "-qscale:a", "2", mp3_p], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(wav_p)
    print(f"Generated {mp3_p}")
