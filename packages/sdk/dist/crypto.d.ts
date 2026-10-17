import type { VerifyProofRequest, VerifyProofResponse } from "./types.js";
/**
 * Deterministic JSON serialization compliant with RFC 8785.
 * Recursively sorts keys and formats numbers/booleans without whitespace.
 */
export declare function canonicalJson(data: any): string;
/**
 * SHA-256 Hex Digest helper
 */
export declare function hashSha256(data: string): string;
/**
 * Computes deterministic SHA-256 Plan Hash from orchestrator plan dictionary
 */
export declare function generatePlanHash(planDict: Record<string, any>): string;
/**
 * Builds a deterministic Merkle Tree over leaf items.
 * Uses pairwise SHA-256 folding matching ArmorIQ core engine specs.
 */
export declare function buildMerkleTree(leafItems: string[]): {
    root: string;
    leafHashes: string[];
};
/**
 * Verifies if leaf items form the expected Merkle Root
 */
export declare function verifyMerkleRoot(leafItems: string[], expectedRoot: string): boolean;
/**
 * Validates a digital execution receipt against plan hash and Merkle root
 */
export declare function verifyProof(request: VerifyProofRequest): VerifyProofResponse;
//# sourceMappingURL=crypto.d.ts.map