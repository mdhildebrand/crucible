export default function CharacterCard({ character }) {
  return (
    <div className="character-card">
      <video
        key={character.id}
        src={character.asset}
        autoPlay
        loop
        muted
        playsInline
      />
      <h2 className="character-name">{character.name}</h2>
    </div>
  );
}
