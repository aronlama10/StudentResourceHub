import { useState } from "react";
import { toast } from "react-toastify";
import "../../css/admin/admin.css";

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  resourceAlerts: true,
  compactLayout: false,
};

function readSettings() {
  try {
    const saved = localStorage.getItem("adminSettings");
    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(readSettings);

  const updateSetting = (name) => {
    setSettings((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  const saveSettings = () => {
    localStorage.setItem("adminSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully.");
  };

  const resetSettings = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    localStorage.setItem("adminSettings", JSON.stringify(DEFAULT_SETTINGS));
    toast.info("Settings reset to defaults.");
  };

  const options = [
    {
      key: "emailNotifications",
      title: "Email notifications",
      description: "Preference for receiving email notifications.",
    },
    {
      key: "resourceAlerts",
      title: "Resource alerts",
      description: "Preference for resource moderation alerts.",
    },
    {
      key: "compactLayout",
      title: "Compact layout",
      description: "Use a more compact layout for admin content.",
    },
  ];

  return (
    <section className="admin-page">
      <header className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION</p>
          <h1>Settings</h1>
          <p>Manage your admin panel preferences.</p>
        </div>
      </header>

      <div className="admin-settings-list">
        {options.map((option) => (
          <div className="admin-settings-card" key={option.key}>
            <div>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
            </div>

            <label className="admin-switch">
              <input
                type="checkbox"
                checked={settings[option.key]}
                onChange={() => updateSetting(option.key)}
              />
              <span className="admin-switch-slider" />
            </label>
          </div>
        ))}
      </div>

      <div className="admin-settings-actions">
        <button
          className="admin-button admin-button-secondary"
          onClick={resetSettings}
        >
          Reset defaults
        </button>

        <button className="admin-button" onClick={saveSettings}>
          Save settings
        </button>
      </div>

      <p className="admin-settings-note">
        These are local preferences. They do not change server-side account
        settings or send email notifications by themselves.
      </p>
    </section>
  );
}
