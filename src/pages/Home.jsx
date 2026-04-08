import { Link } from 'react-router-dom';

// Add entries here as you add new themes
const availableThemes = [
  { id: 'nikke', name: 'NIKKE' },
];

export default function Home() {
  return (
    <div className="page-center">
      <h1>Crucible</h1>
      <p>Choose a theme to begin.</p>
      <ul className="theme-list">
        {availableThemes.map((t) => (
          <li key={t.id}>
            <Link to={`/${t.id}`}>{t.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
