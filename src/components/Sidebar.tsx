
import { CloudSun, LayoutDashboard, MapPin, Settings, Plus } from "lucide-react";

type SidebarProps = {
  city: string;
  savedCities: string[];
  onSelectCity: (city: string) => void;
  onAddCity: () => void;
  onNavigate: (page: string) => void;
  activePage: string;
};

export default function Sidebar({
  city,
  savedCities,
  onSelectCity,
  onAddCity,
  onNavigate,
  activePage,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon"><CloudSun size={25} /></span>
        <span>weatherly<span className="brand-dot">.</span></span>
      </div>

      <p className="sidebar-label">MENU</p>

      <button
        className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
        onClick={() => onNavigate("dashboard")}
      >
        <LayoutDashboard size={19} /> Dashboard
      </button>

      <button
        className={`nav-item ${activePage === "locations" ? "active" : ""}`}
        onClick={() => onNavigate("locations")}
      >
        <MapPin size={19} /> My locations
      </button>

      <button
        className={`nav-item ${activePage === "settings" ? "active" : ""}`}
        onClick={() => onNavigate("settings")}
      >
        <Settings size={19} /> Settings
      </button>

      <div className="saved-heading">
        <p className="sidebar-label">SAVED LOCATIONS</p>
        <button className="icon-button" onClick={onAddCity} aria-label="Add location">
          <Plus size={17} />
        </button>
      </div>

      <div className="saved-list">
        {savedCities.map((savedCity) => (
          <button
            key={savedCity}
            className={`saved-city ${city === savedCity ? "selected" : ""}`}
            onClick={() => onSelectCity(savedCity)}
          >
            <MapPin size={16} />
            <span>{savedCity}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="mini-weather-icon"><CloudSun size={23} /></div>
        <p>Weather updates</p>
        <span>Your day, forecasted.</span>
      </div>
    </aside>
  );
}
