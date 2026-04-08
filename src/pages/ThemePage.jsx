import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';
import VerdictButtons from '../components/VerdictButtons';
import ProgressBar from '../components/ProgressBar';
import {
  getSession,
  createSession,
  recordVerdict,
  resetSession,
  isComplete,
  getCurrentCharacterId,
} from '../utils/cookie';

// Dynamically import all theme JSON files
const themes = import.meta.glob('../themes/*.json', { eager: true });

function loadTheme(themeId) {
  const key = `../themes/${themeId}.json`;
  return themes[key]?.default ?? null;
}

export default function ThemePage() {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(null);
  const [session, setSession] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loaded = loadTheme(themeId);
    if (!loaded) {
      setNotFound(true);
      return;
    }
    setTheme(loaded);
    const characterIds = loaded.characters.map((c) => c.id);
    const existing = getSession(themeId);
    const activeSession = existing ?? createSession(themeId, characterIds);
    setSession(activeSession);
  }, [themeId]);

  useEffect(() => {
    if (session && isComplete(session)) {
      navigate(`/${themeId}/results`);
    }
  }, [session, themeId, navigate]);

  function handleVerdict(verdict) {
    const currentId = getCurrentCharacterId(session);
    if (!currentId) return;
    const updated = recordVerdict(themeId, currentId, verdict);
    setSession({ ...updated });
  }

  function handleReset() {
    const characterIds = theme.characters.map((c) => c.id);
    const fresh = resetSession(themeId, characterIds);
    setSession({ ...fresh });
  }

  if (notFound) {
    return <div className="page-center">Theme &quot;{themeId}&quot; not found.</div>;
  }

  if (!theme || !session) {
    return <div className="page-center">Loading...</div>;
  }

  const currentId = getCurrentCharacterId(session);
  const currentCharacter = theme.characters.find((c) => c.id === currentId);

  return (
    <div className="theme-page">
      <header className="theme-header">
        <h1>{theme.name}</h1>
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </header>

      <ProgressBar
        current={session.progress}
        total={session.queue.length}
      />

      {currentCharacter && (
        <>
          <CharacterCard character={currentCharacter} />
          <VerdictButtons onVerdict={handleVerdict} />
        </>
      )}
    </div>
  );
}
