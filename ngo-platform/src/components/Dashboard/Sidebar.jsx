import React from 'react';
import Icon from './Icons';

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "overview" },
  { id: "campaigns", label: "Campaigns", icon: "campaigns" },
  { id: "workshops", label: "Workshops", icon: "activities" },
  { id: "activities", label: "Activities", icon: "activities" },
  { id: "volunteers", label: "Volunteers", icon: "volunteers" },
  { id: "resources", label: "Resources", icon: "resources" },
  { id: "donations", label: "Donations", icon: "donations" },
  { id: "expenses", label: "Expenses", icon: "expenses" },
  { id: "evidence", label: "Evidence", icon: "evidence" },
  { id: "reports", label: "Reports", icon: "reports" },
  { id: "feedback", label: "Feedback", icon: "feedback" },
  { id: "transparency", label: "Transparency", icon: "transparency" },
  { id: "org-profile", label: "Organisation Profile", icon: "org" },
];

export default function Sidebar({ currentView, onNav, pendingVolCount, missingEvidenceCount, orgName, isSidebarOpen, onCloseSidebar }) {
  const activeItem = currentView === "campaign-detail" ? "campaigns" : currentView;

  return (
    <>
      <div
        id="sidebar-scrim"
        style={{ display: isSidebarOpen ? "block" : "none" }}
        onClick={onCloseSidebar}
      />
      <aside id="sidebar" className={isSidebarOpen ? "open" : ""}>
        <div className="brand">
          <div className="brand-mark">
            <div className="brand-logo"></div>
            <div className="brand-name">AidLink</div>
          </div>
          <div className="brand-org">{orgName}</div>
        </div>
        <nav className="mainnav">
          {NAV_ITEMS.map((item) => {
            let badge = null;
            if (item.id === "volunteers" && pendingVolCount > 0) {
              badge = <span className="nav-badge">{pendingVolCount}</span>;
            }
            if (item.id === "expenses" && missingEvidenceCount > 0) {
              badge = <span className="nav-badge">{missingEvidenceCount}</span>;
            }
            return (
              <button
                key={item.id}
                className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => onNav(item.id)}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {badge}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          Data shown is illustrative.<br />Donations are simulated, not live payments.
        </div>
      </aside>
    </>
  );
}
