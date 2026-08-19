import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import './ClaimsInbox.css';

const ClaimsInbox = () => {
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await api.get('/claims');
        // Map the backend format to the component's expected format
        const mapped = data.claims.map(c => {
          let riskLabel = '⚪ Unknown';
          let risk = 'Unknown';
          if (c.riskBand === 'GREEN' || c.riskBand === 'LOW') { risk = 'Green'; riskLabel = '🟢 Green'; }
          else if (c.riskBand === 'YELLOW' || c.riskBand === 'MEDIUM') { risk = 'Yellow'; riskLabel = '🟡 Yellow'; }
          else if (c.riskBand === 'RED' || c.riskBand === 'HIGH') { risk = 'Red'; riskLabel = '🔴 Red'; }

          return {
            id: c.claimId,
            patient: c.patientName || c.patientId,
            provider: c.providerId,
            amount: `₹${c.billedAmount.toLocaleString()}`,
            risk,
            riskLabel,
          };
        });
        setClaims(mapped);
      } catch (err) {
        console.error("Failed to fetch claims:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = Object.values(claim).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    );
    const matchesRisk = !riskFilter || claim.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="claims-inbox-page">
      <header className="claims-inbox-header">
        <div className="claims-inbox-eyebrow">
          Claims &amp; Fraud Management
        </div>
        <h1 className="claims-inbox-title">
          Claims <span>Inbox</span>
        </h1>
        <p className="claims-inbox-description">
          Search and filter incoming claims by risk band: 🟢 Green, 🟡 Yellow, and 🔴 Red.
        </p>
      </header>
      
      <main className="claims-inbox-main-card">
        <div className="claims-inbox-controls">
          <div className="claims-inbox-search">
            <span className="material-symbols-outlined claims-inbox-search-icon">search</span>
            <input 
              className="claims-inbox-search-input"
              placeholder="Search claim ID, patient or provider" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="claims-inbox-filter"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="">All risk bands</option>
            <option value="Green">Green</option>
            <option value="Yellow">Yellow</option>
            <option value="Red">Red</option>
          </select>
        </div>
        
        <div className="claims-inbox-table-wrapper">
          <table className="claims-inbox-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Patient</th>
                <th>Provider</th>
                <th>Amount</th>
                <th>Risk band</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((claim) => (
                <tr key={claim.id}>
                  <td className="claims-id-cell">{claim.id}</td>
                  <td>{claim.patient}</td>
                  <td>{claim.provider}</td>
                  <td className="claims-amount-cell">{claim.amount}</td>
                  <td>
                    <div className={`claims-risk-badge ${claim.risk.toLowerCase()}`}>
                      {claim.riskLabel}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClaims.length === 0 && (
                <tr>
                  <td colSpan="5" className="claims-empty-state">
                    No claims match the given filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ClaimsInbox;
