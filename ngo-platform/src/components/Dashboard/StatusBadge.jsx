import React from 'react';

const STATUS_MAP = {
  active: ["success", "Active"],
  on_track: ["success", "On track"],
  at_risk: ["warn", "At risk"],
  delayed: ["danger", "Delayed"],
  not_started: ["neutral", "Not started"],
  closed: ["neutral", "Closed"],
  completed: ["success", "Completed"],
  draft: ["neutral", "Draft"],
  pending: ["warn", "Pending"],
  approved: ["success", "Approved"],
  rejected: ["danger", "Rejected"],
  in_progress: ["info", "In progress"],
  scheduled: ["neutral", "Scheduled"],
  verified: ["success", "Verified"],
  missing_evidence: ["warn", "Missing evidence"],
  declared: ["neutral", "Declared"],
  published: ["success", "Published"],
  unverified: ["neutral", "Unverified"],
};

export default function StatusBadge({ status }) {
  const [tone, label] = STATUS_MAP[status] || ["neutral", status];
  return (
    <span className={`badge badge-${tone}`}>
      <span className="badge-dot"></span>
      {label}
    </span>
  );
}
