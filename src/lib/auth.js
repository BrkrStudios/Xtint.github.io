const ADMIN_CODE_HASH = '386f88ee83e176aaae1b2bbffccfd3712b660422e7528c42bebc865627b4cba6';
const SESSION_KEY = 'xtint_admin_session';

export async function hashCode(code) {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyCode(code) {
  const hashed = await hashCode(code);
  return hashed === ADMIN_CODE_HASH;
}

export function setSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, Date.now().toString());
  }
}

export function checkSession() {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(SESSION_KEY) !== null;
  }
  return false;
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_KEY);
  }
}
