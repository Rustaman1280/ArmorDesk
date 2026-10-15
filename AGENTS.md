# Spesifikasi Proyek: ArmorDesk — Enterprise AI Agent Control Plane, Approval Inbox & Trust Center

Aplikasi web SaaS B2B kelas enterprise untuk hackathon ArmorIQ dan MCP (Model Context Protocol).

## 1. Kriteria Utama
1. **Kejelasan Visual Demo:** Split-Screen Gauntlet prompt injection (Unprotected vs ArmorIQ Governed).
2. **Kegunaan Live Demo:** Human-in-the-Loop Approval Inbox, Role Switcher (`for_user`: CFO vs Intern), Tenant Switcher (`Acme Corp` vs `Globex Inc`), Break-the-Agent CTF Arena.
3. **Integrasi ArmorTools Pro:** Status badge & config modal, fallback simulasi kriptografis SHA-256 Plan Hash & Merkle Proofs.
4. **Takeaways & Visi Produk:** Wawasan arsitektur, FinOps/DevOps SaaS Control Plane, Roadmap.

## 2. 5 Skenario Demo
1. Micro Refund ($20) -> ALLOWED (auto executed, receipt issued)
2. High-Value Refund ($500) & Legitimate Invoice ($8,000) -> HELD FOR APPROVAL (`await_approval()`, `delegation_id`)
3. Poisoned Invoice Attack ($9,000 Wire Exfiltration) -> Standard Agent COMPROMISED ($9,000 stolen, CRM leaked); ArmorDesk BLOCKED (blocked by `delegate()` scope & `vendor_allowlist`)
4. Unknown Account Refund Attempt -> BLOCKED by policy
5. Role Policy Comparison (`for_user`) -> Intern (Blocked) vs Manager (Allowed)
