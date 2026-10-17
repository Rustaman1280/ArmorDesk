import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { StoredConfig } from "./types.js";

export function getConfigDir(): string {
  return join(homedir(), ".armordesk");
}

export function getConfigPath(): string {
  return join(getConfigDir(), "config.json");
}

export function loadStoredConfig(): StoredConfig {
  try {
    const configPath = getConfigPath();
    if (existsSync(configPath)) {
      const raw = readFileSync(configPath, "utf8");
      return JSON.parse(raw);
    }
  } catch {
    // ignore parse/read errors
  }
  return {};
}

export function saveStoredConfig(config: StoredConfig): void {
  try {
    const dir = getConfigDir();
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true, mode: 0o700 });
    }
    const configPath = getConfigPath();
    writeFileSync(configPath, JSON.stringify(config, null, 2), {
      encoding: "utf8",
      mode: 0o600,
    });
  } catch (err: any) {
    console.warn(`[ArmorDesk] Could not write config to ${getConfigPath()}: ${err.message}`);
  }
}

export function clearStoredConfig(): boolean {
  try {
    const configPath = getConfigPath();
    if (existsSync(configPath)) {
      unlinkSync(configPath);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}
