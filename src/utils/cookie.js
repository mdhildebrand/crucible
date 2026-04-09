const STORAGE_PREFIX = 'crucible_';

function getKey(themeId) {
  return `${STORAGE_PREFIX}${themeId}`;
}

export function getSession(themeId) {
  try {
    const raw = localStorage.getItem(getKey(themeId));
    if (!raw) return null;
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
  localStorage.setItem(getKey(themeId), JSON.stringify(session));
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
  localStorage.removeItem(getKey(themeId));
  return createSession(themeId, characterIds);
}

export function isComplete(session) {
  return session && session.progress >= session.queue.length;
}

export function getCurrentCharacterId(session) {
  if (!session || isComplete(session)) return null;
  return session.queue[session.progress];
}