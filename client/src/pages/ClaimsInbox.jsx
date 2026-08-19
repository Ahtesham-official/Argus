import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ClaimsInbox.css';
const initialClaims = [
  { id: 'NHCX-260184', patient: 'Ananya Sharma', provider: 'Apollo Mumbai', amount: '₹42,800', risk: 'Green', riskLabel: '🟢 Green' },
  { id: 'NHCX-260185', patient: 'Rahul Verma', provider: 'Fortis Delhi', amount: '₹1,18,000', risk: 'Yellow', riskLabel: '🟡 Yellow' },
  { id: 'NHCX-260186', patient: 'Meera Iyer', provider: 'Care Hyderabad', amount: '₹2,76,500', risk: 'Red', riskLabel: '🔴 Red' }
];

const ClaimsInbox = () => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  const filteredClaims = initialClaims.filter(claim => {
    const matchesSearch = Object.values(claim).some(val => 
      val.toLowerCase().includes(search.toLowerCase())
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
