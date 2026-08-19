import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (paths) => paths.includes(location.pathname) || (location.pathname === '/' && paths.includes('/index.html'));

  const MenuLink = ({ to, icon, label, paths }) => (
    <NavLink
      to={to}
      className={({ isActive: navIsActive }) => 
        `argus-nav-link ${navIsActive || isActive(paths) ? 'is-active' : ''}`
      }
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );

  const MenuGroup = ({ id, label, icon, items, paths }) => {
    const isGroupActive = isActive(paths);
    const isOpen = openMenus[id] || isGroupActive;

    return (
      <section className={`argus-menu ${isGroupActive ? 'is-active' : ''} ${isOpen ? 'is-open' : ''}`}>
        <button 
          className="argus-menu-toggle" 
          type="button" 
          aria-expanded={isOpen}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu(id);
          }}
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span>{label}</span>
          <span className="material-symbols-outlined argus-chevron">expand_more</span>
        </button>
        <div className="argus-submenu" id={`${id}-menu`}>
          {items.map((item, idx) => (
            <MenuLink key={idx} {...item} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <div 
        id="sidebar-backdrop" 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden ${isOpen ? '' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside 
        id="sidebar" 
        className={`fixed top-0 left-0 h-screen w-[260px] z-50 flex flex-col pt-6 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-6 mb-6 flex items-center justify-between">
        <Link to="/" className="sidebar-logo flex items-center gap-3">
          <img className="argus-brand-logo" src="/argus_logo_white.png" alt="Argus Claims Intelligence" />
          <span className="text-[22px] font-bold tracking-widest text-[#007979]">ARGUS</span>
        </Link>
          <button 
            id="sidebar-close-btn" 
            className="md:hidden text-[#007979] hover:bg-[#007979]/10 p-1.5 rounded-xl"
            onClick={() => setIsOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar pb-5">
          <MenuLink to="/" icon="home" label="Home" paths={['/']} />
          <MenuLink to="/link_ABHA" icon="link" label="ABHA Link" paths={['/link_ABHA']} />
          <MenuLink to="/clinical_document" icon="description" label="Clinical FHIR" paths={['/clinical_document']} />
          
          <div className="px-6 pt-4 pb-1">
            <span className="text-[10px] uppercase tracking-widest text-[#007979]/70 font-bold">Dashboards</span>
          </div>

          <MenuGroup 
            id="submission-ingest"
            label="Submission & Ingest"
            icon="upload_file"
            paths={['/claim_entry', '/claims', '/erp_Inventory_Mapper', '/consent_signer', '/fhir_inspector']}
            items={[
              { to: '/claim_entry', label: 'Claims Entry', icon: 'post_add', paths: ['/claim_entry', '/claims'] },
              { to: '/erp_Inventory_Mapper', label: 'ERP Inventory Mapper', icon: 'inventory_2', paths: ['/erp_Inventory_Mapper'] },
              { to: '/consent_signer', label: 'Consent & Digital Signer', icon: 'fingerprint', paths: ['/consent_signer'] },
              { to: '/fhir_inspector', label: 'FHIR Payload Inspector', icon: 'data_object', paths: ['/fhir_inspector'] }
            ]}
          />

          <MenuGroup 
            id="claims-fraud"
            label="Claims & Fraud Management"
            icon="policy"
            paths={['/claims_inbox', '/kanban_board', '/fraud_analytics', '/investigator', '/insurer_command']}
            items={[
              { to: '/claims_inbox', label: 'Claims Inbox', icon: 'inbox', paths: ['/claims_inbox'] },
              { to: '/kanban_board', label: 'Kanban Board', icon: 'view_kanban', paths: ['/kanban_board'] },
              { to: '/fraud_analytics', label: 'Fraud Analytics & Rules', icon: 'shield_with_heart', paths: ['/fraud_analytics'] },
              { to: '/investigator', label: 'Investigator Workbench', icon: 'find_in_page', paths: ['/investigator', '/insurer_command'] }
            ]}
          />

          <MenuGroup 
            id="admin-oversight"
            label="Admin Oversight"
            icon="monitoring"
            paths={['/admin_oversight', '/system_kpis', '/provider_intelligence', '/model_feedback']}
            items={[
              { to: '/admin_oversight', label: 'Admin Overview', icon: 'admin_panel_settings', paths: ['/admin_oversight'] },
              { to: '/system_kpis', label: 'System KPIs', icon: 'dashboard', paths: ['/system_kpis'] },
              { to: '/provider_intelligence', label: 'Provider Intelligence', icon: 'domain', paths: ['/provider_intelligence'] },
              { to: '/model_feedback', label: 'Model Feedback & Self-Healing', icon: 'model_training', paths: ['/model_feedback'] }
            ]}
          />

          <MenuLink to="/about" icon="groups" label="About" paths={['/about']} />
          <MenuLink to="/contact" icon="contact_support" label="Contact" paths={['/contact']} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
