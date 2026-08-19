import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProviderIntelligence.css';

const ProviderIntelligence = () => {


  return (
    <div className="provider-intel-page">
      <header className="provider-intel-header">
        <div className="provider-intel-eyebrow">
          Admin oversight
        </div>
        <h1 className="provider-intel-title">
          Provider <span>Intelligence</span>
        </h1>
        <p className="provider-intel-description">
          High-risk hospital/HFR and doctor/HPR registries with anomaly tracking.
        </p>
      </header>

      <main className="provider-intel-main-card">
        <div className="provider-intel-table-wrapper">
          <table className="provider-intel-table">
            <thead>
              <tr>
                <th>Registry</th>
                <th>Name</th>
                <th>Anomaly</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="provider-intel-registry-cell">HFR-MH-44021</td>
                <td className="provider-intel-name-cell">Apollo Super Speciality, Mumbai</td>
                <td className="provider-intel-anomaly-cell">Above-peer implant billing</td>
                <td>
                  <div className="provider-intel-risk-badge watch">Watch</div>
                </td>
              </tr>
              <tr>
                <td className="provider-intel-registry-cell">HPR-DL-23881</td>
                <td className="provider-intel-name-cell">Dr. S. Khanna</td>
                <td className="provider-intel-anomaly-cell">Repeated procedure pattern</td>
                <td>
                  <div className="provider-intel-risk-badge high">High</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ProviderIntelligence;
