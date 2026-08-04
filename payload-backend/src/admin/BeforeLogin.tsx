import React from 'react'

export const BeforeLogin: React.FC = () => (
  <div style={{ marginBottom: 'calc(var(--base) * 1.2)' }}>
    <span
      style={{
        display: 'inline-block',
        background: '#e8ef3d',
        color: '#171717',
        borderRadius: 999,
        padding: '4px 12px',
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 8,
      }}
    >
      Developer space
    </span>
    <p style={{ margin: 0 }}>
      A calm, organized workspace for Quranic technical resources. Log in to manage listings and
      review contributions.
    </p>
  </div>
)
