import Cookies from 'js-cookie';

const COOKIE_PREFIX = 'crucible_';
const COOKIE_EXPIRY = 365; // days

function getCookieKey(themeId) {
  return `${COOKIE_PREFIX}${themeId}`;
}

export function getSession(themeId) {
  const raw = Cookies.get(getCookieKey(themeId));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function createSession(themeId, characterIds) {
  const shuffled = [...characterIds].sort(() => Math.random() - 0.5);
  const session = {
    queue: shuffled,
    progress: 0,
    verdicts: {},
  };
  saveSession(themeId, session);
  return session;
}

export function saveSession(themeId, session) {
  Cookies.set(getCookieKey(themeId), JSON.stringify(session), {
    expires: COOKIE_EXPIRY,
  });
}

export function recordVerdict(themeId, characterId, verdict) {
  const session = getSession(themeId);
  if (!session) return null;
  session.verdicts[characterId] = verdict;
  session.progress = Math.min(session.progress + 1, session.queue.length);
  saveSession(themeId, session);
  return session;
}

export function resetSession(themeId, characterIds) {
  Cookies.remove(getCookieKey(themeId));
  return createSession(themeId, characterIds);
}

export function isComplete(session) {
  return session && session.progress >= session.queue.length;
}

export function getCurrentCharacterId(session) {
  if (!session || isComplete(session)) return null;
  return session.queue[session.progress];
}