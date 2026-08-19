import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import './SystemKpis.css';

const SystemKpis = () => {
  const [kpis, setKpis] = useState({
    totalClaims: 0,
    autoApprovalRate: 0,
    fraudPrevented: 0,
    avgDecisionTimeMinutes: 0
  });

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const data = await api.get('/kpis/summary');
        setKpis(data);
      } catch (err) {
        console.error("Failed to fetch KPIs:", err);
      }
    };
    fetchKpis();
  }, []);  return (
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
          <p className="kpi-metric-value">{kpis.totalClaims.toLocaleString()}</p>
        </div>
        <div className="kpi-metric-card">
          <h3 className="kpi-metric-label">Auto-approval rate</h3>
          <p className="kpi-metric-value">{kpis.autoApprovalRate}%</p>
        </div>
        <div className="kpi-metric-card">
          <h3 className="kpi-metric-label">Fraud prevented</h3>
          <p className="kpi-metric-value">₹{(kpis.fraudPrevented / 10000000).toFixed(2)}Cr</p>
        </div>
        <div className="kpi-metric-card">
          <h3 className="kpi-metric-label">Avg decision time</h3>
          <p className="kpi-metric-value">{kpis.avgDecisionTimeMinutes}m</p>
        </div>
      </section>
    </div>
  );
};

export default SystemKpis;
