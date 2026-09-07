import React, { useState } from 'react';
import Icon from '../../../components/Dashboard/Icons';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import { fmtDate, initials } from '../../../data/mockData';

export default function VolunteersPage({ campaigns, onNavCampaign, onDecideVolunteer }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');

  const allVolunteers = campaigns.flatMap(c => 
    (c.volunteers || []).map(v => ({ 
      ...v, 
      campaignId: c.id, 
      campaignName: c.name 
    }))
  );

  let list = allVolunteers;
  if (statusFilter !== "all") {
    list = list.filter(v => (v.status || '').toLowerCase() === statusFilter.toLowerCase());
  }
  if (query) {
    list = list.filter(v => (v.name || '').toLowerCase().includes(query.toLowerCase()));
  }

  const counts = { all: allVolunteers.length };
  ["pending", "active", "rejected"].forEach(s => {
    counts[s] = allVolunteers.filter(v => (v.status || '').toLowerCase() === s).length;
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Volunteers</h1>
          <div className="page-sub">Applications, supporting documents, and participation across every campaign.</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div className="pillrow">
          <button className={`pill-filter ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
            All ({counts.all})
          </button>
          <button className={`pill-filter ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => setStatusFilter('pending')}>
            Pending review ({counts.pending})
          </button>
          <button className={`pill-filter ${statusFilter === 'active' ? 'active' : ''}`} onClick={() => setStatusFilter('active')}>
            Active ({counts.active})
          </button>
          <button className={`pill-filter ${statusFilter === 'rejected' ? 'active' : ''}`} onClick={() => setStatusFilter('rejected')}>
            Declined ({counts.rejected})
          </button>
        </div>
        <div className="search-box" style={{ maxWidth: '220px' }}>
          <Icon name="search" />
          <input 
            type="text" 
            placeholder="Search name…" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <Icon name="volunteers" />
          <div className="empty-title">No volunteers found</div>
          <div className="empty-sub">Try a different filter or search term.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Campaign</th>
                <th>Role &amp; Skills</th>
                <th>Applied</th>
                <th>Hours</th>
                <th>Supporting Document / CV</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(v => {
                const docPath = v.document_path || v.documentPath;
                const isPending = (v.status || '').toLowerCase() === 'pending' || v.status === 'APPLIED';
                return (
                  <tr key={v.id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div className="avatar-sm">{initials(v.name || 'V')}</div>
                      <div>
                        <div className="cell-main">{v.name}</div>
                      </div>
                    </td>
                    <td className="faint row-clickable" onClick={() => onNavCampaign(v.campaignId, 'volunteers')}>
                      {v.campaignName}
                    </td>
                    <td>
                      <div className="cell-main">{v.role || 'Volunteer'}</div>
                      {v.skills && (
                        <div className="cell-sub faint">
                          {Array.isArray(v.skills) ? v.skills.join(', ') : v.skills}
                        </div>
                      )}
                    </td>
                    <td className="mono">{fmtDate(v.appliedOn || v.applied_on)}</td>
                    <td className="mono">{v.hoursLogged || v.hours_logged || 0}</td>
                    <td>
                      {docPath ? (
                        <a
                          href={`http://localhost:5000/${docPath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}
                        >
                          <Icon name="reports" /> View CV / Doc
                        </a>
                      ) : (
                        <span className="faint" style={{ fontSize: '11px' }}>—</span>
                      )}
                    </td>
                    <td><StatusBadge status={v.status} /></td>
                    <td>
                      {isPending ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            title="Decline Volunteer"
                            className="btn btn-secondary btn-sm"
                            onClick={() => onDecideVolunteer(v.campaignId, v.id, 'rejected')}
                          >
                            <Icon name="x" /> Decline
                          </button>
                          <button
                            title="Approve Volunteer"
                            className="btn btn-primary btn-sm"
                            onClick={() => onDecideVolunteer(v.campaignId, v.id, 'active')}
                          >
                            <Icon name="check" /> Approve
                          </button>
                        </div>
                      ) : (
                        <span className="faint" style={{ fontSize: '12px' }}>Decided</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
