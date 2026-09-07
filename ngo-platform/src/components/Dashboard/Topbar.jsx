import React, { useState } from 'react';
import Icon from './Icons';
import { initials } from '../../data/mockData';

export default function Topbar({ org, unreadCount, onToggleSidebar, onOpenNewCampaignModal, onOpenNewWorkshopModal, onNav, onSearch }) {
  const [searchInput, setSearchInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchInput);
    }
  };

  return (
    <header id="topbar">
      <button 
        id="menu-btn" 
        className="icon-btn" 
        onClick={onToggleSidebar} 
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>

      <div className="search-box">
        <Icon name="search" />
        <input 
          type="text" 
          placeholder="Search campaigns, volunteers, evidence…" 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="topbar-right">
        <button className="btn btn-secondary btn-sm" onClick={onOpenNewWorkshopModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          🎓 Organize Workshop
        </button>
        <button className="btn btn-primary btn-sm" onClick={onOpenNewCampaignModal}>
          <Icon name="plus" /> New campaign
        </button>
        <button 
          className="icon-btn" 
          aria-label="Notifications" 
          onClick={() => onNav('overview')}
        >
          <Icon name="bell" />
          {unreadCount > 0 && <span className="dot-badge"></span>}
        </button>
        <div className="topbar-org">
          <div className="org-avatar">{initials(org.shortName)}</div>
          <div className="org-meta">
            <div className="n">{org.name}</div>
            <div className="v">
              <Icon name="check" /> Platform-verified
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
