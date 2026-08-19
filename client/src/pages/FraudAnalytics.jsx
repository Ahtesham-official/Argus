import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import './FraudAnalytics.css';

const FraudAnalytics = () => {
  const [metrics, setMetrics] = useState({
    exposure: 0,
    highRiskClaims: 0,
    rulesTriggered: 0
  });

  useEffect(() => {
    const fetchFraudData = async () => {
      try {
        // Fetch KPIs to get the total fraud prevented (exposure)
        const kpis = await api.get('/kpis/summary');
        
        // Fetch high-risk claims
        const claimsData = await api.get('/claims');
        const highRisk = claimsData.claims.filter(c => c.riskBand === 'RED' || c.riskBand === 'HIGH');
        
        setMetrics({
          exposure: kpis.fraudPrevented || 0,
          highRiskClaims: highRisk.length,
          rulesTriggered: highRisk.length * 2 + 15 // Mock logic: assume some multiplier for rules triggered
        });
      } catch (err) {
        console.error("Failed to fetch fraud data:", err);
      }
    };
    fetchFraudData();
  }, []);  return (
    <div className="fraud-page">
      <header className="fraud-header">
        <div className="fraud-eyebrow">
          Claims &amp; Fraud Management
        </div>
        <h1 className="fraud-title">
          Fraud <span>Analytics &amp; Rules</span>
        </h1>
        <p className="fraud-description">
          Active rule triggers identify duplicate claims, overlapping hospitalizations, and excessive billing.
        </p>
      </header>

      <section className="fraud-metrics">
        <div className="fraud-metric-card">
          <h3 className="fraud-metric-label">Rules triggered today</h3>
          <p className="fraud-metric-value">{metrics.rulesTriggered}</p>
        </div>
        <div className="fraud-metric-card">
          <h3 className="fraud-metric-label">Potential exposure</h3>
          <p className="fraud-metric-value">₹{(metrics.exposure / 100000).toFixed(2)}L</p>
        </div>
        <div className="fraud-metric-card danger">
          <h3 className="fraud-metric-label">High-risk claims</h3>
          <p className="fraud-metric-value danger">{metrics.highRiskClaims}</p>
        </div>
      </section>

      <section className="fraud-rules-card">
        <div className="fraud-rules-header">
          <h2 className="fraud-rules-title">Active rule triggers</h2>
        </div>
        <div className="fraud-rules-list">
          <div className="fraud-rule-item">
            <div className="fraud-rule-content">
              <h4 className="fraud-rule-name">Duplicate claim submission</h4>
              <p className="fraud-rule-desc">Same ABHA, procedure and invoice detected within 30 days.</p>
            </div>
            <div className="fraud-rule-badge red">
              12 alerts
            </div>
          </div>
          <div className="fraud-rule-item">
            <div className="fraud-rule-content">
              <h4 className="fraud-rule-name">Overlapping hospitalization</h4>
              <p className="fraud-rule-desc">Admission dates overlap across provider records.</p>
            </div>
            <div className="fraud-rule-badge yellow">
              8 alerts
            </div>
          </div>
          <div className="fraud-rule-item">
            <div className="fraud-rule-content">
              <h4 className="fraud-rule-name">Excessive billing anomaly</h4>
              <p className="fraud-rule-desc">Tariff exceeds peer provider baseline.</p>
            </div>
            <div className="fraud-rule-badge yellow">
              19 alerts
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FraudAnalytics;
