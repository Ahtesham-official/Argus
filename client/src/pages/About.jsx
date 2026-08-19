import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';


const About = () => {


  return (
    <div className="about-page">
      <header className="about-header">
        <div className="about-eyebrow">
          Claims intelligence
        </div>
        <h1 className="about-title">
          Designed for a more <span>trustworthy claim journey.</span>
        </h1>
        <p className="about-description">
          Argus connects claim submission, FHIR interoperability, fraud signals, investigation and oversight in one NHCX-ready workspace.
        </p>
      </header>

      <section className="about-team-section">
        <h2 className="about-section-title">Our Team</h2>
        <div className="about-team-grid">
          <div className="about-team-card">
            <h3 className="about-member-name">Sofiya Gowda</h3>
            <p className="about-member-role">Core Front-End development for Argus Website and UI architecture.</p>
          </div>
          <div className="about-team-card">
            <h3 className="about-member-name">Ahtesham Shaikh</h3>
            <p className="about-member-role">Architecting backend services and managing server-side claims processing logic.</p>
          </div>
          <div className="about-team-card">
            <h3 className="about-member-name">Adityapratap Singh</h3>
            <p className="about-member-role">Crafting front-end UI/UX designs, component styling, and visual architecture.</p>
          </div>
          <div className="about-team-card">
            <h3 className="about-member-name">Rajdeep Yadav</h3>
            <p className="about-member-role">Structuring product presentations, documentation, and project showcase materials.</p>
          </div>
          <div className="about-team-card">
            <h3 className="about-member-name">Ayush Chaudhary</h3>
            <p className="about-member-role">Developing backend APIs and handling database connections and system operations.</p>
          </div>
          <div className="about-team-card">
            <h3 className="about-member-name">Urvi Dhakate</h3>
            <p className="about-member-role">Conducting technical research, domain analysis, and requirements gathering to guide development.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
