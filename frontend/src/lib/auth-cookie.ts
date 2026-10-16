/**
 * Auth Cookie Utility for Next.js Middleware & Client State
 */

export const AUTH_COOKIE_NAME = "armordesk_token";
export const USER_COOKIE_NAME = "armordesk_user";
export const TENANT_COOKIE_NAME = "armordesk_tenant";

export function setAuthCookies(token: string, user: any, tenantId: string) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${USER_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${TENANT_COOKIE_NAME}=${encodeURIComponent(tenantId)}; path=/; max-age=${maxAge}; SameSite=Lax`;

  try {
    localStorage.setItem("armordesk_is_auth", "true");
    localStorage.setItem("armordesk_token", token);
    localStorage.setItem("armordesk_user", JSON.stringify(user));
    localStorage.setItem("armordesk_tenant", tenantId);
  } catch {}
}

export function clearAuthCookies() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${USER_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${TENANT_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;

  try {
    localStorage.setItem("armordesk_is_auth", "false");
    localStorage.removeItem("armordesk_token");
    localStorage.removeItem("armordesk_user");
  } catch {}
}

export function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : null;
}
