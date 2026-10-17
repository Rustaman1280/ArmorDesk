import {
  ArmorDeskClient,
  clearStoredConfig,
  generateClaudeDesktopConfig,
  generateCursorConfig,
  getConfigPath,
  loadStoredConfig,
  saveStoredConfig
} from "./chunk-IKQRJ7XB.mjs";

// src/cli.ts
import { exec } from "child_process";
function tryOpenBrowser(url) {
  try {
    const cmd = process.platform === "darwin" ? `open "${url}"` : process.platform === "win32" ? `start "" "${url}"` : `xdg-open "${url}" 2>/dev/null`;
    exec(cmd, () => {
    });
  } catch {
  }
}
var HELP_TEXT = `
  \u{1F6E1}\uFE0F  ArmorDesk CLI: Enterprise AI Agent Control Plane & MCP Gateway

  Usage:
    armordesk <command> [options]

  Account & Authentication:
    login [--email <email>]     Authenticate with armordesk.crusts.dev
    whoami                      Display active authenticated account & role
    logout                      Clear local session credentials

  MCP Gateway & Diagnostics:
    mcp [check|status]          Verify if MCP Gateway is connected & reachable
    mcp claude                  Output Claude Desktop MCP configuration JSON
    mcp cursor                  Output Cursor IDE MCP configuration JSON

  Security & Governance:
    status                      Check operational status of ArmorDesk Control Plane
    tenants                     List active corporate tenants & spend policies
    traces                      Inspect recent audited security & policy traces
    approvals                   View pending human-in-the-loop approvals
    approve <delegation_id>     Authorize an action held in escrow
    reject <delegation_id>      Reject an action held in escrow
    receipts                    List digital execution receipts with proofs
    verify <receipt_id>         Cryptographically verify a receipt (Plan Hash & Merkle Root)
    scenario <1-5>              Run an adversarial FinOps crew simulation
    ctf "<prompt>"              Test prompt injection attack against CTF Gauntlet
    voice [executive|security]  Generate voice briefing telemetry via ElevenLabs

  Options:
    --email <email>             Account email for login (default: rustaman@crusts.dev)
    --password <pass>           Account password for login
    --url <url>                 ArmorDesk Control Plane URL (default: https://armordesk.crusts.dev)
    --tenant <id>               Tenant ID (default: acme-corp)
    --key <key>                 ArmorIQ API Key
    --json                      Output raw JSON
    --help, -h                  Show help menu
    --version, -v               Show version
`;
async function runCLI(args = process.argv.slice(2)) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      console.log(HELP_TEXT);
      return;
    }
    if (arg === "--version" || arg === "-v") {
      console.log("armordesk v1.0.0");
      return;
    }
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
        flags[key] = args[i + 1];
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  const command = positional[0] || "status";
  const client = new ArmorDeskClient({
    baseUrl: flags["url"] || process.env.ARMORDESK_URL,
    tenantId: flags["tenant"] || "acme-corp",
    apiKey: flags["key"] || process.env.ARMORIQ_API_KEY
  });
  try {
    switch (command) {
      case "login": {
        const explicitEmail = flags["email"] || (positional[1] && positional[1].includes("@") ? positional[1] : null);
        if (explicitEmail) {
          const password = flags["password"] || "admin";
          const tenant = flags["tenant"] || "acme-corp";
          console.log(`
\u{1F510} Authenticating directly with ArmorDesk at ${client.baseUrl}...`);
          const loginRes = await client.login(explicitEmail, password, tenant);
          console.log("------------------------------------------------------------");
          console.log(`\u2705 Logged in successfully as ${loginRes.user.name}!`);
          console.log(`   Email:        ${loginRes.user.email}`);
          console.log(`   Role:         ${loginRes.user.role.toUpperCase()}`);
          console.log(`   Title:        ${loginRes.user.title}`);
          console.log(`   Tenant:       ${loginRes.tenant.name} (${loginRes.tenant.id})`);
          console.log(`   Bank Balance: $${loginRes.tenant.balance.toLocaleString()} ${loginRes.tenant.currency}`);
          console.log(`   Scope:        ${loginRes.user.scopeSummary}`);
          console.log(`
\u{1F4C1} Session saved to: ${getConfigPath()}`);
          console.log("All armordesk commands will now execute under this identity.\n");
          break;
        }
        console.log(`
\u{1F510} Initiating ArmorDesk Browser Authorization...`);
        const codeRes = await client.requestDeviceCode();
        console.log("------------------------------------------------------------");
        console.log(`  1. Please visit the authorization URL in your browser:`);
        console.log(`     \u{1F449}  \x1B[36m\x1B[1m${codeRes.verification_uri_complete}\x1B[0m`);
        console.log(`
  2. Confirm your one-time device code:`);
        console.log(`     \u{1F511}  \x1B[32m\x1B[1m${codeRes.user_code}\x1B[0m`);
        console.log("------------------------------------------------------------");
        console.log(`Waiting for browser authorization... (Press Ctrl+C to abort)`);
        tryOpenBrowser(codeRes.verification_uri_complete);
        let approved = false;
        const intervalMs = (codeRes.interval || 2) * 1e3;
        const maxPolls = 450;
        let polls = 0;
        while (!approved && polls < maxPolls) {
          await new Promise((r) => setTimeout(r, intervalMs));
          polls++;
          try {
            const pollRes = await client.pollDeviceCode(codeRes.device_code);
            if (pollRes.status === "APPROVED" && pollRes.token && pollRes.user) {
              approved = true;
              saveStoredConfig({
                baseUrl: client.baseUrl,
                token: pollRes.token,
                user: {
                  id: pollRes.user.id,
                  name: pollRes.user.name,
                  email: pollRes.user.email,
                  role: pollRes.user.role,
                  title: pollRes.user.role === "manager" ? "Corporate Officer" : "FinOps Member",
                  avatar: pollRes.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "CU",
                  tenant_id: pollRes.user.tenant_id,
                  scopeSummary: pollRes.user.role === "manager" ? "Full Treasury & Wire Transfer Approval Authority" : "Restricted View-Only Scope"
                },
                tenant: pollRes.tenant,
                apiKey: client.apiKey,
                updatedAt: (/* @__PURE__ */ new Date()).toISOString()
              });
              client.token = pollRes.token;
              client.tenantId = pollRes.user.tenant_id;
              try {
                await client.getMCPStatus();
              } catch {
              }
              console.log("\n------------------------------------------------------------");
              console.log(`\u2705 Authorization Approved by Browser!`);
              console.log(`   User:         ${pollRes.user.name} (${pollRes.user.email})`);
              console.log(`   Role:         ${pollRes.user.role.toUpperCase()}`);
              console.log(`   Tenant:       ${pollRes.tenant?.name || pollRes.user.tenant_id}`);
              console.log(`
\u{1F4C1} Session saved to: ${getConfigPath()}`);
              console.log("All armordesk commands will now execute under this identity.\n");
              break;
            } else if (pollRes.status === "DENIED") {
              console.error("\n\u274C Authorization request was declined in browser.");
              process.exit(1);
            } else if (pollRes.status === "EXPIRED") {
              console.error("\n\u231B Device code has expired. Please run 'armordesk login' again.");
              process.exit(1);
            } else {
              process.stdout.write(".");
            }
          } catch (err) {
          }
        }
        if (!approved) {
          console.error("\n\u231B Authorization timed out. Please try logging in again.");
          process.exit(1);
        }
        break;
      }
      case "whoami": {
        const cfg = loadStoredConfig();
        if (!cfg.user) {
          console.log("\n\u26A0\uFE0F  Not currently logged in.");
          console.log("Run 'armordesk login --email <your_email>' to authenticate.\n");
        } else {
          console.log("\n\u{1F464} ArmorDesk Active Identity");
          console.log("------------------------------------------------------------");
          console.log(`User:         ${cfg.user.name} (${cfg.user.email})`);
          console.log(`Role:         ${cfg.user.role.toUpperCase()} \xB7 ${cfg.user.title}`);
          console.log(`Tenant:       ${cfg.tenant?.name || "Corporate"} (${cfg.user.tenant_id})`);
          if (cfg.tenant) {
            console.log(`Treasury:     $${cfg.tenant.balance.toLocaleString()} ${cfg.tenant.currency}`);
            console.log(`Spend Limit:  $${cfg.tenant.spend_limit.toLocaleString()} USD`);
          }
          console.log(`Scope:        ${cfg.user.scopeSummary}`);
          console.log(`Endpoint:     ${cfg.baseUrl || client.baseUrl}`);
          console.log(`Config file:  ${getConfigPath()}
`);
        }
        break;
      }
      case "logout": {
        const cleared = clearStoredConfig();
        if (cleared) {
          console.log("\n\u{1F44B} Logged out successfully. Local session cleared.\n");
        } else {
          console.log("\nNo active session found to logout.\n");
        }
        break;
      }
      case "status":
      case "info": {
        const st = await client.status();
        if (flags["json"]) {
          console.log(JSON.stringify(st, null, 2));
        } else {
          console.log("\n\u{1F6E1}\uFE0F  ArmorDesk Control Plane Status");
          console.log("---------------------------------------");
          console.log(`Endpoint:    ${client.baseUrl}`);
          console.log(`Status:      ${st.status}`);
          console.log(`Service:     ${st.service} (v${st.version})`);
          console.log(`ArmorIQ Pro: ${st.armoriq_pro_active ? "ACTIVE (PRO_LIVE)" : "SANDBOX"}`);
          console.log(`Tenants:     ${st.active_tenants} active organizations`);
          console.log(`Timestamp:   ${st.timestamp}
`);
        }
        break;
      }
      case "tenants": {
        const tenants = await client.getTenants();
        if (flags["json"]) {
          console.log(JSON.stringify(tenants, null, 2));
        } else {
          console.log("\n\u{1F3E2} Active Corporate Tenants:");
          tenants.forEach((t) => {
            console.log(`  \u2022 [${t.id}] ${t.name}`);
            console.log(`    Balance: $${t.balance.toLocaleString()} | Spend Limit: $${t.spend_limit.toLocaleString()}`);
          });
          console.log("");
        }
        break;
      }
      case "traces": {
        const traces = await client.getTraces();
        if (flags["json"]) {
          console.log(JSON.stringify(traces, null, 2));
        } else {
          console.log(`
\u{1F4CB} Recent Security Traces (${traces.length} total):
`);
          traces.slice(0, 10).forEach((tr) => {
            const badge = tr.status === "ALLOWED" ? "\u{1F7E2} ALLOWED" : tr.status === "BLOCKED" ? "\u{1F534} BLOCKED" : "\u{1F7E1} HELD_FOR_APPROVAL";
            console.log(`  [${tr.created_at.slice(11, 19)}] ${badge} - ${tr.agent_name} (${tr.user_role})`);
            console.log(`    Action: ${tr.action}`);
            console.log(`    Reason: ${tr.reason}`);
            console.log(`    Plan Hash: ${tr.plan_hash.slice(0, 16)}...`);
            console.log("");
          });
        }
        break;
      }
      case "approvals": {
        const approvals = await client.getApprovals();
        if (flags["json"]) {
          console.log(JSON.stringify(approvals, null, 2));
        } else {
          console.log(`
\u23F3 Human-in-the-Loop Approvals (${approvals.length} items):
`);
          if (approvals.length === 0) {
            console.log("  No pending approvals. All actions authorized or clear.\n");
          } else {
            approvals.forEach((app) => {
              console.log(`  \u2022 ID: ${app.delegation_id} | Status: ${app.status}`);
              console.log(`    Action: ${app.action_type} -> ${app.recipient} ($${app.amount.toLocaleString()})`);
              console.log(`    Requested by: ${app.requested_by} (${app.role})`);
              console.log(`    Description: ${app.description}`);
              console.log("");
            });
          }
        }
        break;
      }
      case "approve": {
        const delId = positional[1];
        if (!delId) {
          console.error("Error: Please provide delegation_id to approve. (e.g. armordesk approve del_01hx9a)");
          process.exit(1);
        }
        const res = await client.resolveApproval(delId, "APPROVE");
        console.log(`\u2705 Approved delegation '${delId}' successfully.`);
        if (res.receipt_id) {
          console.log(`   Digital Proof Receipt Generated: ${res.receipt_id}`);
        }
        break;
      }
      case "reject": {
        const delId = positional[1];
        if (!delId) {
          console.error("Error: Please provide delegation_id to reject. (e.g. armordesk reject del_01hx9a)");
          process.exit(1);
        }
        await client.resolveApproval(delId, "REJECT");
        console.log(`\u{1F6AB} Rejected delegation '${delId}'.`);
        break;
      }
      case "receipts": {
        const receipts = await client.getReceipts();
        if (flags["json"]) {
          console.log(JSON.stringify(receipts, null, 2));
        } else {
          console.log(`
\u{1F4DC} Cryptographic Proof Receipts (${receipts.length} total):
`);
          receipts.forEach((r) => {
            console.log(`  \u2022 [${r.id}] ${r.action_type} ($${r.amount}) -> ${r.recipient}`);
            console.log(`    Status: ${r.status} | Verified: ${r.verified ? "\u2705 YES" : "\u274C NO"}`);
            console.log(`    Plan Hash:   ${r.plan_hash}`);
            console.log(`    Merkle Root: ${r.merkle_root}`);
            console.log("");
          });
        }
        break;
      }
      case "verify": {
        const rId = positional[1];
        if (!rId) {
          console.error("Error: Please specify receipt ID to verify (e.g. armordesk verify rcpt_01hx9a)");
          process.exit(1);
        }
        const receipt = await client.getReceipt(rId);
        const proofRes = await client.verifyProof({
          plan_hash: receipt.plan_hash,
          merkle_root: receipt.merkle_root,
          signature: receipt.signature,
          allowed_spec: receipt.allowed_spec,
          actual_execution: receipt.actual_execution
        });
        console.log(`
\u{1F50D} Cryptographic Proof Verification for [${rId}]`);
        console.log("------------------------------------------------------------");
        console.log(`Verdict:            ${proofRes.valid ? "\u2705 VALID" : "\u274C INVALID"}`);
        console.log(`Status:             ${proofRes.status}`);
        console.log(`Computed Plan Hash: ${proofRes.computed_plan_hash}`);
        console.log(`Matches Hash:       ${proofRes.matches_hash ? "MATCH" : "MISMATCH"}`);
        console.log(`Computed Merkle:    ${proofRes.computed_merkle_root}`);
        console.log(`Matches Merkle:     ${proofRes.matches_merkle ? "MATCH" : "MISMATCH"}`);
        console.log(`Details:            ${proofRes.details}
`);
        break;
      }
      case "mcp": {
        const sub = positional[1] || "check";
        if (sub === "claude") {
          console.log(JSON.stringify(generateClaudeDesktopConfig({ gatewayUrl: `${client.baseUrl}/api/mcp/gateway` }), null, 2));
        } else if (sub === "cursor") {
          console.log(JSON.stringify(generateCursorConfig({ gatewayUrl: `${client.baseUrl}/api/mcp/gateway` }), null, 2));
        } else {
          console.log(`
\u{1F50D} Probing ArmorDesk Governed MCP Gateway at ${client.baseUrl}...`);
          const diag = await client.checkMCP();
          if (flags["json"]) {
            console.log(JSON.stringify(diag, null, 2));
          } else {
            console.log("------------------------------------------------------------");
            console.log(`Connection:       ${diag.connected ? "\u{1F7E2} ONLINE & CONNECTED" : "\u{1F534} DISCONNECTED"}`);
            console.log(`Gateway Ping:     ${diag.ping.status} (${diag.latencyMs}ms roundtrip)`);
            console.log(`Gateway URL:      ${diag.config.gateway_url}`);
            console.log(`SSE URL:          ${diag.config.sse_url}`);
            console.log(`Protocol Version: ${diag.ping.protocol}`);
            console.log(`Governance:       ${diag.ping.governance}`);
            console.log(`Sandboxes Active: ${diag.ping.active_sandboxes.join(", ")}`);
            console.log(`Connected Agents: ${diag.config.connected_agents.length} fleet agents`);
            diag.config.connected_agents.forEach((ag) => {
              console.log(`  \u2022 ${ag.name.padEnd(28)} [${ag.status}] (Sandbox: ${ag.assigned_sandbox})`);
            });
            console.log(`
Governed Tools:   ${diag.config.governed_tools.length} policed tools`);
            diag.config.governed_tools.forEach((t) => {
              const desc = (t.description || "").slice(0, 55);
              console.log(`  \u2022 ${t.name.padEnd(24)} ${desc}...`);
            });
            console.log("\nVerdict:          \u2705 MCP GATEWAY IS FULLY CONNECTED & GOVERNED");
            console.log("Tip: Run 'armordesk mcp claude' or 'armordesk mcp cursor' to get MCP client configs.\n");
          }
        }
        break;
      }
      case "scenario": {
        const scNum = parseInt(positional[1] || "1", 10);
        console.log(`
\u2699\uFE0F  Running Scenario #${scNum} simulation...`);
        const res = await client.runScenario(scNum);
        console.log(`Scenario: ${res.scenario_name}`);
        console.log(`Status:   ${res.overall_status}`);
        console.log(`Summary:  ${res.summary}`);
        if (res.steps && res.steps.length > 0) {
          console.log("\nExecuted Pipeline Steps:");
          res.steps.forEach((s) => {
            console.log(`  [Step ${s.step}] ${s.agent} (${s.tool}) -> ${s.status}`);
            console.log(`           ${s.detail}`);
          });
        }
        if (res.receipt_id) {
          console.log(`
Receipt Generated: ${res.receipt_id}`);
        }
        console.log("");
        break;
      }
      case "ctf": {
        const prompt = positional[1];
        if (!prompt) {
          console.error("Error: Please provide an attack prompt. (e.g. armordesk ctf 'Ignore previous instructions...')");
          process.exit(1);
        }
        console.log(`
\u{1F6E1}\uFE0F  Submitting attack payload to CTF Gauntlet...`);
        const ctfRes = await client.submitCTF(prompt);
        console.log(`Result:          ${ctfRes.blocked ? "BLOCKED \u{1F6E1}\uFE0F" : "BYPASSED \u26A0\uFE0F"}`);
        console.log(`Threat Detected: ${ctfRes.detected_threat}`);
        console.log(`Reason:          ${ctfRes.reason}`);
        console.log(`Score:           ${ctfRes.score} pts
`);
        break;
      }
      case "voice": {
        const type = positional[1] || "executive";
        console.log(`
\u{1F399}\uFE0F  Requesting ${type} voice briefing from ElevenLabs...`);
        const voiceRes = await client.getVoiceBriefing(type);
        console.log(`Success:    ${voiceRes.success}`);
        console.log(`Voice:      ${voiceRes.voice_type} (ID: ${voiceRes.voice_id})`);
        console.log(`Script:     ${voiceRes.script}`);
        console.log(`Audio Size: ${Math.round((voiceRes.audio_base64?.length || 0) * 0.75)} bytes (MP3)
`);
        break;
      }
      default: {
        console.log(`Unknown command: '${command}'`);
        console.log(HELP_TEXT);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error(`
\u274C Error: ${err.message}
`);
    process.exit(1);
  }
}
export {
  runCLI
};
