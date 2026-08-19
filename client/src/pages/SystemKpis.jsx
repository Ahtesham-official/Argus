import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SystemKpis.css';

const SystemKpis = () => {


  return (
    <div className="kpi-page">
      <header className="kpi-header">
        <div className="kpi-eyebrow">
          Admin oversight
        </div>
        <h1 className="kpi-title">
          System <span>KPIs</span>
        </h1>
        <p className="kpi-description">
          Overview of claim volume, auto-approval rates, and the total fraud amount prevented.
        </p>
      </header>

      <section className="kpi-metrics-grid">
        <div className="kpi-metric-card">
          <h3 className="kpi-metric-label">Claims processed</h3>
          <p className="kpi-metric-value">48,291</p>
        </div>
        <div className="kpi-metric-card">
          <h3 className="kpi-metric-label">Auto-approval rate</h3>
          <p className="kpi-metric-value">74.6%</p>
        </div>
        <div className="kpi-metric-card">
          <h3 className="kpi-metric-label">Fraud prevented</h3>
          <p className="kpi-metric-value">₹4.82Cr</p>
        </div>
        <div className="kpi-metric-card">
          <h3 className="kpi-metric-label">Avg decision time</h3>
          <p className="kpi-metric-value">4.8m</p>
        </div>
      </section>
    </div>
  );
};

export default SystemKpis;
