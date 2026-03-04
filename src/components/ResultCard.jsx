import { useNavigate } from "react-router-dom"

export default function ResultCard({ item, type }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === "doctor") navigate(`/doctor/${item.id}`);
    if (type === "clinic") navigate(`/clinic/${item.id}`);
  };

  return (
    <div className="result-card" onClick={handleClick}>
      {type === "doctor" ? (
        <>
          <h3 style={{ fontWeight: 700 }}>{item.name}</h3>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
            {item.specialty} • {item.clinicName || 'Independent'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#888', fontSize: 14, marginBottom: 8 }}>
            <span style={{ marginRight: 4 }}>📍</span>
            <span style={{ color: '#888' }}>{item.location}</span>
          </div>
          <button className="result-action-btn" onClick={e => { e.stopPropagation(); navigate(`/doctor/${item.id}`); }}>
            Book
          </button>
        </>
      ) : (
        <>
          <h3 style={{ fontWeight: 700 }}>{item.name}</h3>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{item.specialty}</div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#888', fontSize: 14, marginBottom: 8 }}>
            <span style={{ marginRight: 4 }}>📍</span>
            <span style={{ color: '#888' }}>{item.location}</span>
          </div>
          <button className="result-action-btn" onClick={e => { e.stopPropagation(); navigate(`/clinic/${item.id}`); }}>
            View Doctors
          </button>
        </>
      )}
    </div>
  );
}
