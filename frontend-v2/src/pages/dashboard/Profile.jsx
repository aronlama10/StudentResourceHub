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
          <div className="profile-card__avatar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="34px"
              viewBox="0 -960 960 960"
              width="34px"
              fill="#e3e3e3"
            >
              <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z" />
            </svg>
          </div>
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
