import React, { useState } from 'react';
import Icon from '../../../components/Dashboard/Icons';

export default function WorkshopsPage({ workshops, onOpenNewWorkshopModal }) {
  const [query, setQuery] = useState('');

  const list = (workshops || []).filter(w => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (w.title && w.title.toLowerCase().includes(q)) ||
      (w.city && w.city.toLowerCase().includes(q)) ||
      (w.location && w.location.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Community Workshops</h1>
          <div className="page-sub">Skill development, first responder training, and crisis preparedness workshops organized by your NGO.</div>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewWorkshopModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          🎓 Organize workshop
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div className="pillrow">
          <span className="pill-filter active">All Workshops ({list.length})</span>
        </div>
        <div className="search-box" style={{ maxWidth: '260px' }}>
          <Icon name="search" />
          <input 
            type="text" 
            placeholder="Search workshops…" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />
        </div>
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <Icon name="activities" />
          <div className="empty-title">No workshops organized yet</div>
          <div className="empty-sub">Create community training sessions on first aid, evacuation drills, or sanitation.</div>
          <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={onOpenNewWorkshopModal}>
            Organize first workshop
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Workshop Title</th>
                <th>Date &amp; Time</th>
                <th>Venue / Location</th>
                <th>City</th>
                <th>Capacity</th>
                <th>Registration Form</th>
              </tr>
            </thead>
            <tbody>
              {list.map(w => (
                <tr key={w.id}>
                  <td>
                    <div className="cell-main" style={{ fontWeight: 600 }}>{w.title}</div>
                    {w.description && <div className="cell-sub" style={{ maxWidth: '380px' }}>{w.description}</div>}
                  </td>
                  <td>
                    <div className="mono" style={{ fontWeight: 600 }}>{w.date || 'Upcoming'}</div>
                    <div className="faint" style={{ fontSize: '11.5px' }}>{w.time || 'Scheduled'}</div>
                  </td>
                  <td>{w.location || 'On-ground'}</td>
                  <td>
                    <span className="badge badge-neutral">{w.city || 'Patiala'}</span>
                  </td>
                  <td className="mono">{w.target_capacity || 50} seats</td>
                  <td>
                    {w.form_url ? (
                      <a href={w.form_url} target="_blank" rel="noreferrer" className="badge badge-success" style={{ textDecoration: 'none' }}>
                        <Icon name="check" /> Linked
                      </a>
                    ) : (
                      <span className="faint" style={{ fontSize: '12px' }}>No form attached</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
