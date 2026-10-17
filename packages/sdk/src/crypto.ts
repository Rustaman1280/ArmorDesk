import { createHash } from "node:crypto";
import type { VerifyProofRequest, VerifyProofResponse } from "./types.js";

/**
 * Deterministic JSON serialization compliant with RFC 8785.
 * Recursively sorts keys and formats numbers/booleans without whitespace.
 */
export function canonicalJson(data: any): string {
  if (data === null || data === undefined) {
    return "null";
  }
  if (typeof data === "number" || typeof data === "boolean") {
    return JSON.stringify(data);
  }
  if (typeof data === "string") {
    return JSON.stringify(data);
  }
  if (Array.isArray(data)) {
    return "[" + data.map((item) => canonicalJson(item)).join(",") + "]";
  }
  if (typeof data === "object") {
    const keys = Object.keys(data).sort();
    const entries = keys.map((k) => JSON.stringify(k) + ":" + canonicalJson(data[k]));
    return "{" + entries.join(",") + "}";
  }
  return JSON.stringify(data);
}

/**
 * SHA-256 Hex Digest helper
 */
export function hashSha256(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

/**
 * Computes deterministic SHA-256 Plan Hash from orchestrator plan dictionary
 */
export function generatePlanHash(planDict: Record<string, any>): string {
  const canonical = canonicalJson(planDict);
  return hashSha256(canonical);
}

/**
 * Builds a deterministic Merkle Tree over leaf items.
 * Uses pairwise SHA-256 folding matching ArmorIQ core engine specs.
 */
export function buildMerkleTree(leafItems: string[]): {
  root: string;
  leafHashes: string[];
} {
  const leafHashes =
    leafItems.length === 0
      ? [hashSha256("empty_tree_node")]
      : leafItems.map((item) => hashSha256(item));

  let currentLevel = [...leafHashes];

  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
      const combined = hashSha256(left + right);
      nextLevel.push(combined);
    }
    currentLevel = nextLevel;
  }

  return {
    root: currentLevel[0],
    leafHashes,
  };
}

/**
 * Verifies if leaf items form the expected Merkle Root
 */
export function verifyMerkleRoot(
  leafItems: string[],
  expectedRoot: string
): boolean {
  const { root } = buildMerkleTree(leafItems);
  return root.toLowerCase() === expectedRoot.toLowerCase();
}

/**
 * Validates a digital execution receipt against plan hash and Merkle root
 */
export function verifyProof(request: VerifyProofRequest): VerifyProofResponse {
  const computedPlanHash = generatePlanHash(request.allowed_spec);
  const matchesHash =
    computedPlanHash.toLowerCase() === request.plan_hash.toLowerCase();

  // Leaves extracted from execution telemetry
  const executionItems = Object.entries(request.actual_execution)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${canonicalJson(v)}`);

  const { root: computedMerkleRoot } = buildMerkleTree(executionItems);
  const matchesMerkle =
    computedMerkleRoot.toLowerCase() === request.merkle_root.toLowerCase();

  const valid = matchesHash && matchesMerkle;

  return {
    valid,
    computed_plan_hash: computedPlanHash,
    computed_merkle_root: computedMerkleRoot,
    matches_hash: matchesHash,
    matches_merkle: matchesMerkle,
    status: valid ? "CRYPTOGRAPHICALLY_VERIFIED" : "VERIFICATION_FAILED",
    details: valid
      ? "Plan hash matches allowed specification and Merkle root confirms un-tampered execution proof."
      : `Discrepancy detected: hashMatch=${matchesHash}, merkleMatch=${matchesMerkle}`,
  };
}
