import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';


const Contact = () => {


  return (
    <div className="contact-page">
      <div className="contact-layout">
        <header className="contact-header">
          <div className="contact-eyebrow">
            Get in touch
          </div>
          <h1 className="contact-title">
            Let’s make claims <span>simpler.</span>
          </h1>
          <p className="contact-description">
            Connect with the Argus team to discuss the NHCX claim, fraud detection, and healthcare interoperability workflows.
          </p>
          <div className="contact-info">
            <p>
              <span className="material-symbols-outlined">mail</span>
              sofiyasonu128@gmail.com
            </p>
            <p>
              <span className="material-symbols-outlined">groups</span>
              Argus Claims Intelligence team
            </p>
          </div>
        </header>

        <form className="contact-form-card" onSubmit={(e) => e.preventDefault()}>
          <h2 className="contact-form-title">Send a message</h2>
          
          <div className="contact-form-group">
            <label className="contact-label">Name</label>
            <input 
              type="text" 
              required
              className="contact-input"
              placeholder="Your name" 
            />
          </div>

          <div className="contact-form-group">
            <label className="contact-label">Email</label>
            <input 
              type="email" 
              required
              className="contact-input"
              placeholder="you@example.com" 
            />
          </div>

          <div className="contact-form-group">
            <label className="contact-label">Message</label>
            <textarea 
              required
              className="contact-textarea"
              placeholder="How can we help?"
            ></textarea>
          </div>

          <button type="submit" className="contact-submit-btn">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
