import "../../css/dashboard/profile.css";

function Profile() {
  return (
    <section className="dashboard-section">
      <header className="dashboard-section__header">
        <div>
          <h2 className="dashboard-section__title">Profile</h2>
          <p className="dashboard-section__subtitle">
            Manage your details and dashboard preferences.
          </p>
        </div>
      </header>

      <div className="profile-grid">
        <article className="profile-card">
          <div className="profile-card__avatar">A</div>
          <h3 className="profile-card__name">Alex Johnson</h3>
          <p className="profile-card__meta">Computer Science · Year 2</p>
          <button className="profile-card__btn">Edit Profile</button>
        </article>

        <article className="profile-panel">
          <h3 className="profile-panel__title">Account Settings</h3>
          <div className="profile-settings">
            <div className="profile-setting">
              <div>
                <p className="profile-setting__label">Email</p>
                <p className="profile-setting__value">alex@studenthub.com</p>
              </div>
              <button className="profile-setting__btn">Update</button>
            </div>
            <div className="profile-setting">
              <div>
                <p className="profile-setting__label">Notifications</p>
                <p className="profile-setting__value">Weekly digest enabled</p>
              </div>
              <button className="profile-setting__btn">Manage</button>
            </div>
            <div className="profile-setting">
              <div>
                <p className="profile-setting__label">Privacy</p>
                <p className="profile-setting__value">Public profile</p>
              </div>
              <button className="profile-setting__btn">Review</button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Profile;
