const TOKEN_KEY = "paymanni_token";
const USER_KEY = "paymanni_user";
const USER_ID_KEY = "userId";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token");
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY) || localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getUserId() {
  return localStorage.getItem(USER_ID_KEY) || getStoredUser()?.id || getStoredUser()?._id;
}

export function getUserUpi() {
  const user = getStoredUser();
  return user?.upi || user?.upiId || user?.virtualUpiId || "";
}

export function getUserName() {
  const user = getStoredUser();
  return user?.name || "User";
}

export function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function updateStoredUser(patch) {
  const current = getStoredUser() || {};
  const merged = {
    ...current,
    ...patch,
    id: patch.id || patch._id || current.id || current._id,
    _id: patch._id || patch.id || current._id || current.id,
    upi: patch.upi || patch.upiId || current.upi || current.upiId,
    upiId: patch.upiId || patch.upi || current.upiId || current.upi,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(merged));
  localStorage.setItem("user", JSON.stringify(merged));
  if (merged.id || merged._id) {
    localStorage.setItem(USER_ID_KEY, merged.id || merged._id);
  }
  return merged;
}

export function setAuthSession({ token, user }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem("token", token);
  }
  if (user) {
    const normalized = {
      ...user,
      id: user.id || user._id,
      _id: user._id || user.id,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    localStorage.setItem("user", JSON.stringify(normalized));
    localStorage.setItem(USER_ID_KEY, normalized.id || normalized._id);
  }
}

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
}

export function getApiBase() {
  const backend = import.meta.env.VITE_BACKEND || "localhost:8000";
  const isLocal =
    backend.includes("localhost") ||
    backend.startsWith("127.0.0.1") ||
    backend.startsWith("0.0.0.0");
  const protocol = isLocal ? "http" : "https";
  return `${protocol}://${backend}`;
}

export function apiUrl(path = "") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBase()}${normalized}`;
}
