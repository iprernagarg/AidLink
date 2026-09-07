import React from 'react';
import Icon from '../../../components/Dashboard/Icons';

export default function ResourcesPage({ campaigns, onNavCampaign }) {
  const list = campaigns.flatMap(c => c.resources.map(r => ({ ...r, campaignId: c.id, campaignName: c.name })));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Resources</h1>
          <div className="page-sub">Relief materials and equipment allocated and deployed across campaigns.</div>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Resource</th><th>Campaign</th><th>Source</th><th>Allocated</th><th>Deployed</th><th>Utilisation</th></tr>
          </thead>
          <tbody>
            {list.map(r => {
              const pct = Math.round((r.deployed / r.allocated) * 100);
              const low = (r.allocated - r.deployed) < r.allocated * 0.15;
              return (
                <tr key={r.id} className="row-clickable" onClick={() => onNavCampaign(r.campaignId, 'resources')}>
                  <td className="cell-main">{r.name}</td>
                  <td className="faint">{r.campaignName}</td>
                  <td className="faint">{r.source}</td>
                  <td className="mono">{r.allocated.toLocaleString("en-IN")} {r.unit}</td>
                  <td className="mono">{r.deployed.toLocaleString("en-IN")} {r.unit}</td>
                  <td>
                    <div className="progress-row" style={{ maxWidth: '150px' }}>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: low ? 'var(--warn)' : 'var(--accent)' }}></div>
                      </div>
                      <div className="progress-num">{pct}%</div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
