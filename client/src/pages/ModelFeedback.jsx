import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ModelFeedback.css';

const ModelFeedback = () => {


  return (
    <div className="model-feedback-page">
      <header className="model-feedback-header">
        <div className="model-feedback-eyebrow">
          Admin oversight
        </div>
        <h1 className="model-feedback-title">
          Model Feedback <span>&amp; Self-Healing</span>
        </h1>
        <p className="model-feedback-description">
          Accuracy logs for zero-shot mapping overrides and ML false-positive tuning.
        </p>
      </header>

      <main className="model-feedback-main-card">
        <h2 className="model-feedback-section-title">Latest feedback log</h2>
        <div className="model-feedback-log-list">
          <div className="model-feedback-log-item">
            <h3 className="model-feedback-log-title">Inventory mapping override accepted</h3>
            <p className="model-feedback-log-desc">
              Local code IMPL-771 mapped to NAMASTE: orthopaedic implant · confidence updated to 97.2%.
            </p>
          </div>
          <div className="model-feedback-log-item warning">
            <h3 className="model-feedback-log-title">False-positive tuning queued</h3>
            <p className="model-feedback-log-desc">
              Duplicate-claim rule threshold adjusted after investigator confirmation.
            </p>
          </div>
          <div className="model-feedback-log-item">
            <h3 className="model-feedback-log-title">Model health</h3>
            <p className="model-feedback-log-desc">
              Precision 94.8% · recall 91.6% · last evaluated 18 Aug 2026.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelFeedback;
