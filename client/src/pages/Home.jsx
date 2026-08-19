import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';


const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigation = (e) => {
      if (e.detail?.path) {
        navigate(e.detail.path);
      }
    };
    window.addEventListener('dashboard-navigate', handleNavigation);
    return () => {
      window.removeEventListener('dashboard-navigate', handleNavigation);
    };
  }, [navigate]);

  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
    (() => {
      const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show') }), { threshold: .12 });
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));

      const art = document.querySelector('.heroArt');
      window.addEventListener('mousemove', e => {
        if (!art) return;
        const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
        art.style.transform = \`translate(\${x * 7}px,\${y * 5}px)\`;
      });
      window.requestDemo = function(e) {
        e.preventDefault();
        const email = document.getElementById('accessEmail').value;
        document.getElementById('accessBtn').textContent = 'Request received ✓';
        document.getElementById('accessNote').textContent = 'Prototype mode: request captured for ' + email + '. No data was sent.';
      };
    })();
  

    (() => {
      const headline = document.querySelector('.heroHeadlineScan');
      if (!headline) return;

      const words = [...headline.querySelectorAll('.heroWord')];
      const scanner = headline.querySelector('.heroScanner');
      if (!words.length || !scanner) return;

      let active = -1;
      let timer = null;

      function clearWord() {
        words.forEach(w => w.classList.remove('scanGreen', 'scanRed'));
      }

      function scan(index) {
        if (!words[index]) return;

        clearWord();

        const word = words[index];
        const rect = word.getBoundingClientRect();
        const parent = headline.getBoundingClientRect();

        scanner.style.left = \`\${rect.left - parent.left + rect.width / 2}px\`;
        scanner.style.top = \`\${rect.top - parent.top + rect.height / 2}px\`;

        // Alternate positive/attention states.
        word.classList.add(index % 4 === 2 ? 'scanRed' : 'scanGreen');

        active = index;
      }

      function next() {
        active = (active + 1) % words.length;
        scan(active);
      }

      function start() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          scan(0);
          return;
        }
        next();
        timer = setInterval(next, 1150);
      }

      window.addEventListener('resize', () => {
        if (active >= 0) scan(active);
      });

      start();
    })();
  

    (() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
      gsap.from('.nav .logo, .navlinks > a, .navlinks > .dashMenu, .navRequest', {
        opacity: 0, y: -12, duration: 0.45, stagger: 0.055, ease: 'power2.out', clearProps: 'transform,opacity'
      });
    })();
  

    (() => {
      const overviews = {
        claimDesk: 'Quick overview: verify ABHA, validate the policy, add treatment details and attach FHIR-ready supporting documents.',
        investigator: 'Quick overview: monitor risk bands, duplicate claims, overlapping hospitalizations and excessive-billing rules.',
        oversight: 'Quick overview: verify ABHA health IDs, link insurance records and audit ABDM consent tokens before claim processing.'
      };
      Object.entries(overviews).forEach(([id, copy]) => {
        const card = document.getElementById(id);
        const description = card?.querySelector('.dashInfo p');
        if (description) description.textContent = copy;
        card?.querySelectorAll('.mockLogo').forEach((mark) => {
          mark.innerHTML = '<img src="/argus_logo_white.png" alt="Argus" style="width:100%;height:100%;object-fit:contain">';
        });

        card?.addEventListener('click', (event) => {
          if (event.target.closest('button, a')) return;
          // Trigger custom event instead of location.href to let React Router handle it
          const link = card.dataset.dashboardLink;
          if (link) {
            window.dispatchEvent(new CustomEvent('dashboard-navigate', { detail: { path: link } }));
          }
        });
        card?.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') { 
            event.preventDefault(); 
            const link = card.dataset.dashboardLink;
            if (link) {
              window.dispatchEvent(new CustomEvent('dashboard-navigate', { detail: { path: link } }));
            }
          }
        });
      });
      const claimCard = document.getElementById('claimDesk');
      if (claimCard) {
        claimCard.querySelector('.mockHeader b').textContent = 'Claim Entry';
        claimCard.querySelector('.mockStatus').textContent = 'NHCX READY';
        claimCard.querySelector('.mockFooter span').textContent = 'ABHA, policy and document checks complete';
      }
      const fhirCard = document.getElementById('investigator');
      if (fhirCard) {
        fhirCard.querySelector('.mockHeader b').textContent = 'Clinical FHIR';
        fhirCard.querySelector('.mockStatus').textContent = 'FHIR R4 READY';
        ['DOCUMENTS', 'PARSING', 'FHIR BUNDLE', 'REVIEW'].forEach((label, index) => {
          const columnLabel = fhirCard.querySelectorAll('.kanbanCol label')[index];
          if (columnLabel) columnLabel.childNodes[0].textContent = label + ' ';
        });
        const riskStrip = fhirCard.querySelector('.riskStrip');
        if (riskStrip) riskStrip.innerHTML = '<span><b>FHIR R4</b> Bundle</span><span>Clinical document parsing</span><span>Structured resources</span><button>Inspect payload →</button>';
      }
      const abhaCard = document.getElementById('oversight');
      if (abhaCard) {
        abhaCard.querySelector('.mockHeader b').textContent = 'ABHA Link & Verification';
        abhaCard.querySelector('.mockStatus').textContent = 'ABDM CONNECTED';
        const labels = ['ABHA linked', 'Active consents', 'Risk checks', 'Link success'];
        abhaCard.querySelectorAll('.adminMetrics small').forEach((item, index) => item.textContent = labels[index]);
        abhaCard.querySelector('.trendPanel b').textContent = 'Verification trend';
        abhaCard.querySelector('.providerPanel b').textContent = 'Linked members';
      }
    })();
  `;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <>
      {/* Invisible link for React Router custom navigation from the script */}
      <Link id="hiddenRouterLink" to="/" style={{display: 'none'}} />

      <nav className="nav">
        <a className="logo" href="#"><img src="/argus_logo_white_full.png" alt="Argus Claims Intelligence"
            style={{"height":"80px","width":"auto","display":"block"}} /></a>
        <div className="navlinks">
          <div className="dashMenu">
            <button type="button" aria-haspopup="true">Dashboards <span style={{"fontSize":"10px"}}>⌄</span></button>
            <div className="dashDropdown">
              <a href="#platform">Platform</a>
              <a href="#how">How it works</a>
              <a href="#intelligence">Intelligence</a>
            </div>
          </div>

          <Link to="/link_ABHA">ABHA Link</Link>
          <Link to="/clinical_document">Clinical FHIR</Link>

          <div className="dashMenu">
            <button type="button" aria-haspopup="true">Submission &Ingest <span style={{"fontSize":"10px"}}>⌄</span></button>
            <div className="dashDropdown">
              <Link to="/claim_entry">Claims Entry</Link>
              <Link to="/erp_Inventory_Mapper">ERP Inventory Mapper</Link>
              <Link to="/consent_signer">Consent and Digital Signer</Link>
              <Link to="/fhir_inspector">FHIR Payload Inspector</Link>
            </div>
          </div>

          <div className="dashMenu">
            <button type="button" aria-haspopup="true">Claims & Fraud Management <span style={{"fontSize":"10px"}}>⌄</span></button>
            <div className="dashDropdown">
              <Link to="/claims_inbox">Claims Inbox</Link>
              <Link to="/kanban_board">Kanban Board</Link>
              <Link to="/fraud_analytics">Fraud Analytics and Rules</Link>
              <Link to="/investigator">Investigator Workbench</Link>
            </div>
          </div>

          <div className="dashMenu">
            <button type="button" aria-haspopup="true">Admin Oversight <span style={{"fontSize":"10px"}}>⌄</span></button>
            <div className="dashDropdown">
              <Link to="/admin_oversight">Admin Overview</Link>
              <Link to="/system_kpis">System KPIs</Link>
              <Link to="/provider_intelligence">Provider Intelligence</Link>
              <Link to="/model_feedback">Model Feedback & Self-Healing</Link>
            </div>
          </div>

          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <a className="navCta navRequest" href="#request">Get Started →</a>
      </nav>
      <main>
        <header className="hero" id="demo">
          <div className="container heroGrid">
            <div className="reveal">
              <div className="kicker" style={{"backgroundColor":"rgba(163, 210, 212, 0.3)"}}><span className="dot"></span> NHCX-powered claims intelligence</div>
              <h1 className="heroHeadlineScan">
                <span className="heroHeadlineWords"><span className="heroWord" data-word="0">Healthcare</span> <span
                    className="heroWord" data-word="1">claims,</span> <span className="heroWord" data-word="2">made</span> <span
                    className="heroWord" data-word="3">easier</span> <span className="heroWord" data-word="4">to</span> <span
                    className="heroWord" data-word="5">trust.</span></span>
                <span className="heroScanner" aria-hidden="true">
                  <svg viewBox="0 0 64 64" role="presentation">
                    <circle cx="27" cy="27" r="16"></circle>
                    <path d="M39 39 L54 54"></path>
                  </svg>
                </span>
              </h1>
              <p className="heroText">Argus helps insurers and healthcare teams understand which claims look normal, which need attention, and why — using NHCX, ABDM, rules and AI together.</p>
              <div className="actions"><a className="btn primary" href="#platform">See the platform →</a><a className="btn secondary" href="#how">See how it works ▷</a></div>
              <div className="trust">
                <div className="miniFaces"><i className="face"></i><i className="face"></i><i className="face"></i></div>
                <span><strong>Simple for everyone.</strong><br />Useful for hospitals, claims teams and decision-makers.</span>
              </div>
            </div>
            <div className="heroArt reveal">
              <div className="blob"></div><span className="spark s1"></span><span className="spark s2"></span><span className="spark s3"></span>
              <div className="floatCard fc1"><b>Claim received ✓</b>Information is ready to check</div>
              <div className="floatCard fc2"><b>Risk assessed</b>18 / 100 · Low risk</div>
              <div className="floatCard fc3"><b>Evidence explained</b>Every alert comes with a reason</div>
              <div className="dashboard">
                <div className="dashHead"><span className="dashBrand"><i className="tinyMark">F</i> Argus</span><span style={{"color":"#7a8981"}}>Claim #84921</span></div>
                <div className="dashBody">
                  <div className="claim">
                    <div className="claimTop"><span>Hospitalisation claim</span><span className="safe">LOW RISK</span></div>
                    <div className="scoreRow">
                      <div className="scoreCircle"></div>
                      <div className="scoreText"><b>Looks consistent</b><span>Identity, provider and claim details checked</span></div>
                    </div>
                    <div className="signals">
                      <div className="signal"><b>✓ Patient</b>Verified</div>
                      <div className="signal"><b>✓ Provider</b>Verified</div>
                      <div className="signal"><b>✓ Documents</b>Checked</div>
                      <div className="signal"><b>✓ Pattern</b>Normal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="metrics container reveal">
          <div className="metricBox">
            <div className="metric"><strong>3</strong><span>Connected dashboards</span></div>
            <div className="metric"><strong>0–100</strong><span>Easy-to-read risk score</span></div>
            <div className="metric"><strong>7+</strong><span>Signals can be combined</span></div>
            <div className="metric"><strong>Human</strong><span>Final decision stays with people</span></div>
          </div>
        </div>

        <section id="platform">
          <div className="container">
            <div className="center reveal">
              <div className="eyebrow">THE PLATFORM</div>
              <h2 className="headline">Three dashboards.<br />One claim intelligence system.</h2>
              <p className="sub center">From claim submission to investigation and ecosystem oversight, every surface is connected to the same lifecycle.</p>
            </div>

            <div className="dashboardShowcase">
              <article className="dashVisualCard reveal" id="claimDesk" data-dashboard-link="/claim_entry" role="link" tabIndex="0">
                <div className="dashMock claimMock">
                  <div className="mockHeader">
                    <div><span className="mockLogo" style={{"width":"80px","height":"80px"}}></span><b>Claim Submission</b></div><span className="mockStatus" style={{"backgroundColor":"rgba(163, 210, 212, 0.3)"}}>STEP 3 OF 3</span>
                  </div>
                  <div className="mockBody">
                    <aside className="mockSteps" style={{"backgroundColor":"rgba(163, 210, 212, 0.3)"}}>
                      <div className="active"><b>01</b> Patient</div>
                      <div className="active"><b>02</b> Insurance</div>
                      <div className="active"><b>03</b> Claim details</div>
                      <div><b>04</b> Documents</div>
                    </aside>
                    <main className="claimForm">
                      <div className="mockTitle">Review claim</div>
                      <div className="fieldGrid">
                        <div><small>Patient / ABHA</small><strong>ABHA•••• 4821</strong></div>
                        <div><small>Policy</small><strong>Health Secure Plus</strong></div>
                        <div><small>Hospital / HFR</small><strong>MetroCare · HFR-2194</strong></div>
                        <div><small>Doctor / HPR</small><strong>Dr. A. Mehta · HPR-3812</strong></div>
                      </div>
                      <div className="docRow"><span style={{"backgroundColor":"rgba(163, 210, 212, 0.3)"}}>✓ Hospital bill</span><span style={{"backgroundColor":"rgba(163, 210, 212, 0.3)"}}>✓ Discharge summary</span><span style={{"backgroundColor":"rgba(163, 210, 212, 0.3)"}}>✓ Prescription</span></div>
                      <div className="claimAmount"><span>Claim amount</span><strong>₹ 84,600</strong></div>
                    </main>
                  </div>
                  <div className="mockFooter"><span>Validation complete · 8/8 checks passed</span><button>Generate Claim ID →</button></div>
                </div>
                <div className="dashInfo"><span className="dashNumber">01</span>
                  <div>
                    <h3>Claim Entry</h3>
                    <p>Structured intake, document checklist, validation and claim generation — designed like a guided workflow, not a complex form.</p>
                  </div>
                </div>
              </article>

              <article className="dashVisualCard reveal" id="investigator" data-dashboard-link="/investigator" role="link" tabIndex="0">
                <div className="dashMock fraudMock">
                  <div className="mockHeader">
                    <div><span className="mockLogo" style={{"width":"80px","height":"80px"}}></span><b>Fraud Management</b></div><span className="mockStatus" style={{"backgroundColor":"rgba(163, 210, 212, 0.3)"}}>LIVE QUEUE</span>
                  </div>
                  <div className="kanbanBoard">
                    <div className="kanbanCol"><label>SUBMITTED <i>12</i></label>
                      <div className="claimMini"><b>CLM-84291</b><span>₹42,800</span><small>City Health</small></div>
                      <div className="claimMini"><b>CLM-84295</b><span>₹18,400</span><small>Sunrise</small></div>
                    </div>
                    <div className="kanbanCol"><label>PROCESSING <i>8</i></label>
                      <div className="claimMini"><b>CLM-84302</b><span>₹66,200</span><small>MetroCare</small></div>
                    </div>
                    <div className="kanbanCol flag"><label>FLAGGED <i>4</i></label>
                      <div className="claimMini high"><b>CLM-84921</b><span>92<span className="pctUnit">%</span></span><small>High risk · Review</small></div>
                      <div className="claimMini med"><b>CLM-84888</b><span>78<span className="pctUnit">%</span></span><small>Medium risk</small></div>
                    </div>
                    <div className="kanbanCol"><label>APPROVED <i>19</i></label>
                      <div className="claimMini"><b>CLM-84177</b><span>₹31,900</span><small>Completed review</small></div>
                    </div>
                  </div>
                  <div className="riskStrip"><span><b>92<span className="pctUnit">%</span></b> Risk</span><span>Excessive billing</span><span>Provider anomaly</span><span>Related activity</span><button>Open investigation ↗</button></div>
                </div>
                <div className="dashInfo"><span className="dashNumber">02</span>
                  <div>
                    <h3>Fraud Analytics &amp; Rules</h3>
                    <p>A real claim-lifecycle Kanban: verification, risk scoring, flagged review, investigation, approval and completion — with evidence behind every alert.</p>
                  </div>
                </div>
              </article>

              <article className="dashVisualCard reveal" id="oversight" data-dashboard-link="/admin_oversight" role="link" tabIndex="0">
                <div className="dashMock adminMock">
                  <div className="mockHeader">
                    <div><span className="mockLogo" style={{"width":"80px","height":"80px"}}></span><b>Insurer Command</b></div><span className="mockStatus" style={{"backgroundColor":"rgba(163, 210, 212, 0.3)"}}>AUG 2026 · SYSTEM HEALTH 98%</span>
                  </div>
                  <div className="adminMetrics">
                    <div><small>Total claims</small><strong>48,291</strong><span>↑ 8.4%</span></div>
                    <div><small>Flagged</small><strong>1,284</strong><span>2.7% of claims</span></div>
                    <div><small>Confirmed fraud</small><strong>318</strong><span>₹4.82Cr exposure</span></div>
                    <div><small>Avg. review</small><strong>18m</strong><span>↓ 31%</span></div>
                  </div>
                  <div className="adminLower">
                    <div className="trendPanel"><b>Fraud & claim trend</b>
                      <div className="trendBars"><i style={{"height":"32%"}}></i><i style={{"height":"44%"}}></i><i style={{"height":"39%"}}></i><i style={{"height":"58%"}}></i><i style={{"height":"50%"}}></i><i style={{"height":"70%"}}></i><i style={{"height":"64%"}}></i><i style={{"height":"88%"}}></i><i style={{"height":"77%"}}></i><i style={{"height":"93%"}}></i></div>
                    </div>
                    <div className="providerPanel"><b>Provider intelligence</b>
                      <div><span>MetroCare Hospital</span><em>High</em></div>
                      <div><span>City Health Network</span><em>Review</em></div>
                      <div><span>Sunrise Medical</span><strong>Low</strong></div>
                    </div>
                  </div>
                </div>
                <div className="dashInfo"><span className="dashNumber">03</span>
                  <div>
                    <h3>ABHA Link &amp; Verification</h3>
                    <p>An ecosystem-level view of claim volume, fraud, exposure, trends and provider behaviour — built for insurers and oversight teams.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="how" className="how">
          <div className="container">
            <div className="center reveal">
              <div className="eyebrow">HOW IT WORKS</div>
              <h2 className="headline">One claim.<br />Five easy steps.</h2>
              <p className="sub">You don't need to understand the technology to understand what happens next.</p>
            </div>
            <div className="steps">
              <div className="step reveal">
                <div className="stepNum">01</div>
                <h4>Claim arrives</h4>
                <p>Structured claim information enters through the NHCX-aligned flow.</p>
              </div>
              <div className="step reveal">
                <div className="stepNum">02</div>
                <h4>Details verified</h4>
                <p>Patient, provider and claim information is checked against available trusted signals.</p>
              </div>
              <div className="step reveal">
                <div className="stepNum">03</div>
                <h4>Risk is checked</h4>
                <p>Rules, ML and anomaly detection look for suspicious or unusual patterns.</p>
              </div>
              <div className="step reveal">
                <div className="stepNum">04</div>
                <h4>Evidence appears</h4>
                <p>The system shows the reasons and supporting signals behind an alert.</p>
              </div>
              <div className="step reveal">
                <div className="stepNum">05</div>
                <h4>People decide</h4>
                <p>An authorized investigator reviews the evidence and takes the final action.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="intelligence" className="explain">
          <div className="container">
            <div className="center reveal">
              <div className="eyebrow">EXPLAINABLE AI</div>
              <h2 className="headline">Don't just say “high risk”.<br />Show why.</h2>
              <p className="sub">A risk score is only useful when a reviewer can understand the evidence behind it.</p>
            </div>
            <div className="explainGrid">
              <div className="risk reveal">
                <div className="riskTop"><span>Claim CLM-84921</span><span className="review">NEEDS REVIEW</span></div>
                <div className="bigScore">92<span style={{"fontSize":"50px","color":"#829088"}}> / 100</span></div>
                <div className="meter"><i style={{"width":"92%"}}></i></div>
                <div style={{"fontSize":"9px","color":"#829088","margin":"9px 0 17px"}}>Rules + ML + anomaly + verification signals</div>
                <div className="reason"><b>01 · Unusual billing</b>The amount is significantly above comparable claims.</div>
                <div className="reason"><b>02 · Provider pattern</b>Recent activity looks unusual compared with similar providers.</div>
                <div className="reason"><b>03 · Related activity</b>A similar claim or entity relationship may need review.</div>
              </div>
              <div className="plainList">
                <div className="plainItem reveal">
                  <div className="icon">✓</div>
                  <h3>Clear reason codes</h3>
                  <p>No mysterious model output. Reviewers see understandable reasons and supporting evidence.</p>
                </div>
                <div className="plainItem reveal">
                  <div className="icon">◎</div>
                  <h3>Investigation workspace</h3>
                  <p>Open the claim, inspect history and evidence, then mark genuine, confirm fraud, request documents or escalate.</p>
                </div>
                <div className="plainItem reveal">
                  <div className="icon">→</div>
                  <h3>Human in control</h3>
                  <p>Automation highlights what matters. The final decision remains with the authorized reviewer.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="oversight" className="admin">
          <div className="container">
            <div className="center reveal">
              <div className="eyebrow">ADMIN OVERSIGHT</div>
              <h2 className="headline">A clear view of<br />the whole ecosystem.</h2>
              <p className="sub">Leaders can quickly see claim volumes, cases needing attention, confirmed fraud and provider-level signals.</p>
            </div>
            <div className="adminPanel reveal">
              <div className="kpis">
                <div className="kpi"><small>Total claims</small><strong>48,291</strong></div>
                <div className="kpi"><small>Needs attention</small><strong>1,284</strong></div>
                <div className="kpi"><small>Confirmed fraud</small><strong>318</strong></div>
                <div className="kpi"><small>Potential exposure</small><strong>₹4.82Cr</strong></div>
              </div>
              <div className="adminGrid">
                <div className="panel"><b style={{"fontSize":"12px"}}>Claims & review trend</b>
                  <div className="bars"><i style={{"height":"34%"}}></i><i style={{"height":"48%"}}></i><i style={{"height":"41%"}}></i><i style={{"height":"63%"}}></i><i style={{"height":"57%"}}></i><i style={{"height":"78%"}}></i><i style={{"height":"69%"}}></i><i style={{"height":"91%"}}></i><i style={{"height":"75%"}}></i><i style={{"height":"86%"}}></i></div>
                </div>
                <div className="panel"><b style={{"fontSize":"12px"}}>Provider signals</b>
                  <div className="provider"><span>MetroCare Hospital</span><span className="badge">Review</span></div>
                  <div className="provider"><span>City Health Network</span><span className="badge">Review</span></div>
                  <div className="provider"><span>Sunrise Medical</span><span style={{"color":"#18805d"}}>Normal</span></div>
                  <div className="provider"><span>LifePoint Centre</span><span style={{"color":"#a36d10"}}>Watch</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <div className="ctaBox reveal">
              <div className="eyebrow" style={{"color":"#79d9ae"}}>ARGUS</div>
              <h2>Make complex claims<br />feel simple.</h2>
              <p>One connected experience for submission, verification, fraud detection, investigation and oversight.</p><a className="btn primary" href="#demo">Explore the experience →</a>
            </div>
          </div>
        </section>

        <section className="request" id="request">
          <div className="container">
            <div className="requestBox reveal">
              <div>
                <div className="eyebrow" style={{"color":"#79d9ae"}}>JUDGES · INSURERS · TPAs</div>
                <h2>See Argus<br />from the inside.</h2>
                <p>Request prototype access and explore the claim journey, fraud investigation workflow and oversight analytics.</p>
                <div className="requestPoints">
                  <div><span>✓</span>Explore structured claim submission & verification</div>
                  <div><span>✓</span>Inspect risk scoring, reason codes & evidence</div>
                  <div><span>✓</span>Explore provider intelligence & fraud analytics</div>
                </div>
              </div>
              <form className="emailCard" onSubmit={(e) => { e.preventDefault(); window.requestDemo(e); }}>
                <label>WORK / ORGANISATION EMAIL</label>
                <input id="accessEmail" type="email" placeholder="zenova@28.com" required />
                <button id="accessBtn" type="submit">Request demo access →</button>
              </form>
            </div>
          </div>
        </section>

        <footer className="mt-auto bg-white border-t border-gray-100 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <span className="font-bold text-primary">© 2026 Argus Intelligence Platform</span>
            <div className="flex gap-6">
              <a className="text-sage-text hover:text-secondary underline transition-colors" href="#">System Status</a>
              <a className="text-sage-text hover:text-secondary underline transition-colors" href="#">Security Policy</a>
              <a className="text-sage-text hover:text-secondary underline transition-colors" href="#">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
