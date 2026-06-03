import "../../css/dashboard/home.css";

function DashboardHome() {
  return (
    <section className="dashboard-home">
      <div className="dashboard-home__welcome">
        <h2 className="dashboard-home__greeting">Welcome back 👋</h2>
        <p className="dashboard-home__greeting-sub">
          Here's a quick snapshot of your activity.
        </p>
      </div>

      <div className="dashboard-home__grid">
        <article className="dashboard-card">
          <div className="dashboard-card__icon-wrap dashboard-card__icon-wrap--blue">
            📚
          </div>
          <p className="dashboard-card__label">Resources Saved</p>
          <h3 className="dashboard-card__value">128</h3>
          <p className="dashboard-card__hint">
            <span className="dashboard-card__hint-badge dashboard-card__hint-badge--up">+12</span>
            this week
          </p>
        </article>
        <article className="dashboard-card">
          <div className="dashboard-card__icon-wrap dashboard-card__icon-wrap--purple">
            ⬆️
          </div>
          <p className="dashboard-card__label">Uploads</p>
          <h3 className="dashboard-card__value">24</h3>
          <p className="dashboard-card__hint">
            <span className="dashboard-card__hint-badge dashboard-card__hint-badge--pending">3</span>
            pending review
          </p>
        </article>
        <article className="dashboard-card">
          <div className="dashboard-card__icon-wrap dashboard-card__icon-wrap--cyan">
            🔥
          </div>
          <p className="dashboard-card__label">Study Streak</p>
          <h3 className="dashboard-card__value">9 days</h3>
          <p className="dashboard-card__hint">Keep it going 🎯</p>
        </article>
      </div>

      <div className="dashboard-panels">
        <section className="dashboard-panel">
          <h2 className="dashboard-panel__title">Quick Actions</h2>
          <div className="dashboard-actions">
            <button className="dashboard-action">
              <span className="dashboard-action__icon">⬆️</span>
              Upload Notes
            </button>
            <button className="dashboard-action">
              <span className="dashboard-action__icon">🔎</span>
              Find Resources
            </button>
            <button className="dashboard-action">
              <span className="dashboard-action__icon">✅</span>
              Track Goals
            </button>
          </div>
        </section>

        <section className="dashboard-panel">
          <h2 className="dashboard-panel__title">Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-item__dot"></span>
              <div>
                <p className="activity-item__title">
                  Uploaded "Data Structures Cheatsheet"
                </p>
                <p className="activity-item__meta">2 hours ago · CS101</p>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-item__dot"></span>
              <div>
                <p className="activity-item__title">
                  Saved "Linear Algebra Study Pack"
                </p>
                <p className="activity-item__meta">Yesterday · MATH201</p>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-item__dot"></span>
              <div>
                <p className="activity-item__title">Updated profile details</p>
                <p className="activity-item__meta">2 days ago</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default DashboardHome;
