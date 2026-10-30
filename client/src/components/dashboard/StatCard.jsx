function StatCard({ icon, label, value }) {
  return (
    <div className="eventora-stat-card">

      <div className="eventora-stat-icon">
        {icon}
      </div>

      <div className="eventora-stat-details">

        <p className="eventora-stat-label">
          {label}
        </p>

        <p className="eventora-stat-value">
          {value}
        </p>

      </div>

    </div>
  );
}

export default StatCard;