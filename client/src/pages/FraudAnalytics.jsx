import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FraudAnalytics.css';

const FraudAnalytics = () => {


  return (
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
          <p className="fraud-metric-value">84</p>
        </div>
        <div className="fraud-metric-card">
          <h3 className="fraud-metric-label">Potential exposure</h3>
          <p className="fraud-metric-value">₹18.6L</p>
        </div>
        <div className="fraud-metric-card danger">
          <h3 className="fraud-metric-label">High-risk claims</h3>
          <p className="fraud-metric-value danger">12</p>
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
