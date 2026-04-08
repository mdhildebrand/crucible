import { useParams, Link } from 'react-router-dom';
import { getSession, resetSession } from '../utils/cookie';
import { useEffect, useState } from 'react';

const themes = import.meta.glob('../themes/*.json', { eager: true });

function loadTheme(themeId) {
  const key = `../themes/${themeId}.json`;
  return themes[key]?.default ?? null;
}

export default function Results() {
  const { themeId } = useParams();
  const [theme, setTheme] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const loaded = loadTheme(themeId);
    setTheme(loaded);
    setSession(getSession(themeId));
  }, [themeId]);

  function handleReset() {
    const characterIds = theme.characters.map((c) => c.id);
    const fresh = resetSession(themeId, characterIds);
    setSession({ ...fresh });
  }

  if (!theme || !session) return <div className="page-center">Loading...</div>;

  const smashed = theme.characters.filter(
    (c) => session.verdicts[c.id] === 'smash'
  );
  const passed = theme.characters.filter(
    (c) => session.verdicts[c.id] === 'pass'
  );

  return (
    <div className="results-page">
      <h1>Your Results — {theme.name}</h1>

      <div className="results-grid">
        <section>
          <h2>Smash ({smashed.length})</h2>
          <ul>
            {smashed.map((c) => <li key={c.id}>{c.name}</li>)}
          </ul>
        </section>

        <section>
          <h2>Pass ({passed.length})</h2>
          <ul>
            {passed.map((c) => <li key={c.id}>{c.name}</li>)}
          </ul>
        </section>
      </div>

      <div className="results-actions">
        <Link to={`/${themeId}`} onClick={handleReset} className="btn-primary">
          Start Over
        </Link>
      </div>
    </div>
  );
}
