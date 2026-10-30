function DashboardSection({
  title,
  action,
  children,
}) {
  return (
    <section className="eventora-dashboard-section">

      <div className="eventora-section-header">

        <h2 className="eventora-section-title">
          {title}
        </h2>

        {action}

      </div>

      {children}

    </section>
  );
}

export default DashboardSection;