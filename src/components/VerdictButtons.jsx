export default function VerdictButtons({ onVerdict }) {
  return (
    <div className="verdict-buttons">
      <button
        className="verdict-btn smash"
        onClick={() => onVerdict('smash')}
      >
        Smash
      </button>
      <button
        className="verdict-btn pass"
        onClick={() => onVerdict('pass')}
      >
        Pass
      </button>
    </div>
  );
}
