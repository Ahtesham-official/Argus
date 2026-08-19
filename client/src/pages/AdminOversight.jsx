import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import './AdminOversight.css';

const AdminOversight = () => {
  const [kpis, setKpis] = useState({ totalClaims: 0 });

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
  }, []);
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-eyebrow">
          Administration
        </div>
        <h1 className="admin-title">
          Admin <span>Oversight</span>
        </h1>
        <p className="admin-description">
          A connected view of performance, provider risk and learning-loop health.
        </p>
      </header>
      
      <section className="admin-grid">
        <Link to="/system_kpis" className="admin-card">
          <span className="material-symbols-outlined">dashboard</span>
          <h2>System KPIs</h2>
          <p>Volume, approvals and fraud prevention. ({kpis.totalClaims ? `${kpis.totalClaims} claims processed` : 'Loading...'})</p>
        </Link>
        <Link to="/provider_intelligence" className="admin-card">
          <span className="material-symbols-outlined">domain</span>
          <h2>Provider Intelligence</h2>
          <p>HFR/HPR risk registries and anomalies.</p>
        </Link>
        <Link to="/model_feedback" className="admin-card">
          <span className="material-symbols-outlined">model_training</span>
          <h2>Model Feedback</h2>
          <p>Mapping overrides and ML tuning.</p>
        </Link>
      </section>
    </div>
  );
};

export default AdminOversight;
