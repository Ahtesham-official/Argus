import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import './ProviderIntelligence.css';

const ProviderIntelligence = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await api.get('/providers');
        setProviders(data.providers);
      } catch (err) {
        console.error("Failed to fetch providers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);  return (
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
              {loading ? (
                <tr><td colSpan="4" className="text-center p-4">Loading providers...</td></tr>
              ) : providers.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-4">No providers found.</td></tr>
              ) : (
                providers.map((p) => (
                  <tr key={p.providerId}>
                    <td className="provider-intel-registry-cell">{p.providerId}</td>
                    <td className="provider-intel-name-cell">{p.name} <span className="text-[10px] text-gray-500 ml-2">({p.specialty})</span></td>
                    <td className="provider-intel-anomaly-cell">{p.flaggedCount > 0 ? `${p.flaggedCount} flags detected` : 'No anomalies'}</td>
                    <td>
                      <div className={`provider-intel-risk-badge ${p.riskBand.toLowerCase()}`}>{p.riskBand}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ProviderIntelligence;
