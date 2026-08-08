import React, { useState, useEffect } from "react";
import "../../css/dashboard/profile.css";
import "../../css/dashboard/upload.css"; // Reuse input and button styles
import {
  getProfile,
  updateProfile,
  updateEmail,
  updatePassword,
} from "../../services/userService";
import { handleSuccess, handleError } from "../../utils";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null); // 'profile' | 'email' | 'password' | null

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    department: "",
    year: "",
    profilePrivacy: "public",
    notificationsEnabled: true,
  });

  const [emailForm, setEmailForm] = useState({
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      if (response.success) {
        setProfile(response.user);
        setProfileForm({
          name: response.user.name || "",
          department: response.user.department || "Computer Eng",
          year: response.user.year || "Year 1",
          profilePrivacy: response.user.profilePrivacy || "public",
          notificationsEnabled: response.user.notificationsEnabled !== false,
        });
        setEmailForm({ email: response.user.email || "" });
      } else {
        handleError(response.message || "Failed to fetch profile.");
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      handleError("An error occurred while loading profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(profileForm);
      if (response.success) {
        handleSuccess(response.message || "Profile updated successfully!");
        localStorage.setItem("loggedInUser", profileForm.name);
        window.dispatchEvent(new Event("local-storage-user"));
        setProfile(response.user);
        setEditMode(null);
      } else {
        handleError(response.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      handleError("An error occurred while saving profile.");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateEmail(emailForm.email);
      if (response.success) {
        handleSuccess(response.message || "Email updated successfully!");
        setProfile((prev) => ({ ...prev, email: emailForm.email }));
        setEditMode(null);
      } else {
        handleError(response.message || "Failed to update email.");
      }
    } catch (err) {
      console.error(err);
      handleError("An error occurred while saving email.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      handleError("New passwords do not match.");
      return;
    }
    try {
      const response = await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      if (response.success) {
        handleSuccess(response.message || "Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setEditMode(null);
      } else {
        handleError(response.message || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      handleError("An error occurred while saving password.");
    }
  };

  const toggleNotifications = async () => {
    const updatedNotifications = !profileForm.notificationsEnabled;
    const updatedForm = {
      ...profileForm,
      notificationsEnabled: updatedNotifications,
    };
    setProfileForm(updatedForm);

    try {
      const response = await updateProfile(updatedForm);
      if (response.success) {
        setProfile(response.user);
        handleSuccess("Notifications preference updated.");
      } else {
        handleError(
          response.message || "Failed to update notification settings.",
        );
      }
    } catch (err) {
      console.error(err);
      handleError("An error occurred updating notifications settings.");
    }
  };

  if (loading) {
    return (
      <section className="dashboard-section">
        <p>Loading profile details...</p>
      </section>
    );
  }

  const avatarText = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

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
          <div className="profile-card__avatar">{avatarText}</div>
          <h3 className="profile-card__name">{profile?.name}</h3>
          <p className="profile-card__meta">
            {profile?.department
              ? `${profile.department} · ${profile.year}`
              : "No Department Set"}
          </p>
          <button
            className="profile-card__btn"
            onClick={() => setEditMode("profile")}
          >
            Edit Profile
          </button>
        </article>

        {/* Dynamic Panels based on Edit States */}
        {editMode === null && (
          <article className="profile-panel">
            <h3 className="profile-panel__title">Account Settings</h3>
            <div className="profile-settings">
              <div className="profile-setting">
                <div>
                  <p className="profile-setting__label">Email</p>
                  <p className="profile-setting__value">{profile?.email}</p>
                </div>
                <button
                  className="profile-setting__btn"
                  onClick={() => setEditMode("email")}
                >
                  Update
                </button>
              </div>
              <div className="profile-setting">
                <div>
                  <p className="profile-setting__label">Password</p>
                  <p className="profile-setting__value">••••••••</p>
                </div>
                <button
                  className="profile-setting__btn"
                  onClick={() => setEditMode("password")}
                >
                  Change
                </button>
              </div>
              <div className="profile-setting">
                <div>
                  <p className="profile-setting__label">Notifications</p>
                  <p className="profile-setting__value">
                    {profile?.notificationsEnabled
                      ? "Weekly digest enabled"
                      : "Notifications disabled"}
                  </p>
                </div>
                <button
                  className="profile-setting__btn"
                  onClick={toggleNotifications}
                >
                  Toggle
                </button>
              </div>
              <div className="profile-setting">
                <div>
                  <p className="profile-setting__label">Privacy</p>
                  <p className="profile-setting__value">
                    {profile?.profilePrivacy === "public"
                      ? "Public profile"
                      : "Private profile"}
                  </p>
                </div>
                <button
                  className="profile-setting__btn"
                  onClick={() => setEditMode("profile")}
                >
                  Manage
                </button>
              </div>
            </div>
          </article>
        )}

        {editMode === "profile" && (
          <article className="profile-panel">
            <h3 className="profile-panel__title">Edit Basic Profile Details</h3>
            <form onSubmit={handleProfileSubmit}>
              <div className="upload-section">
                <label className="form-label">
                  Full Name
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    required
                  />
                </label>

                <div className="form-row">
                  <label className="form-label">
                    Department
                    <select
                      className="form-input form-select"
                      value={profileForm.department}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          department: e.target.value,
                        })
                      }
                    >
                      <option>Computer Engineering</option>
                      <option>Civil Engineering</option>
                      <option>CS & IT</option>
                      <option>Architecture Engineering</option>
                      <option>Electrical & Electronics Engineering</option>
                    </select>
                  </label>

                  <label className="form-label">
                    Year
                    <select
                      className="form-input form-select"
                      value={profileForm.year}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, year: e.target.value })
                      }
                    >
                      <option>Year 1</option>
                      <option>Year 2</option>
                      <option>Year 3</option>
                      {/* <option>Year 4</option> */}
                    </select>
                  </label>
                </div>

                <label className="form-label">
                  Profile Privacy
                  <select
                    className="form-input form-select"
                    value={profileForm.profilePrivacy}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        profilePrivacy: e.target.value,
                      })
                    }
                  >
                    <option value="public">
                      Public - Others can see your uploads
                    </option>
                    <option value="private">
                      Private - Keep your profile private
                    </option>
                  </select>
                </label>

                <div
                  style={{ marginTop: "24px", display: "flex", gap: "12px" }}
                >
                  <button type="submit" className="primary-btn">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setEditMode(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </article>
        )}

        {editMode === "email" && (
          <article className="profile-panel">
            <h3 className="profile-panel__title">Update Email Address</h3>
            <form onSubmit={handleEmailSubmit}>
              <div className="upload-section">
                <label className="form-label">
                  New Email Address
                  <input
                    type="email"
                    className="form-input"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({ email: e.target.value })}
                    required
                  />
                </label>

                <div
                  style={{ marginTop: "24px", display: "flex", gap: "12px" }}
                >
                  <button type="submit" className="primary-btn">
                    Update Email
                  </button>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setEditMode(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </article>
        )}

        {editMode === "password" && (
          <article className="profile-panel">
            <h3 className="profile-panel__title">Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="upload-section">
                <label className="form-label">
                  Current Password
                  <input
                    type="password"
                    className="form-input"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <div className="form-row">
                  <label className="form-label">
                    New Password
                    <input
                      type="password"
                      className="form-input"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label className="form-label">
                    Confirm New Password
                    <input
                      type="password"
                      className="form-input"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </label>
                </div>

                <div
                  style={{ marginTop: "24px", display: "flex", gap: "12px" }}
                >
                  <button type="submit" className="primary-btn">
                    Change Password
                  </button>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setEditMode(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </article>
        )}
      </div>
    </section>
  );
}

export default Profile;
