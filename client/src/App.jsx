import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import AdminOversight from './pages/AdminOversight';
import Claims from './pages/Claims';
import ClaimsInbox from './pages/ClaimsInbox';
import ClinicalDocument from './pages/ClinicalDocument';
import ConsentSinger from './pages/ConsentSinger';
import Contact from './pages/Contact';
import ErpInventoryMapper from './pages/ErpInventoryMapper';
import FhirInspector from './pages/FhirInspector';
import FraudAnalytics from './pages/FraudAnalytics';
import InsurerCommand from './pages/InsurerCommand';
import Investigator from './pages/Investigator';
import LinkABHA from './pages/LinkABHA';
import ModelFeedback from './pages/ModelFeedback';
import ProviderIntelligence from './pages/ProviderIntelligence';
import SystemKpis from './pages/SystemKpis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route element={<Layout />}>
          <Route path="/about" element={<About />} />
          <Route path="/admin_oversight" element={<AdminOversight />} />
          <Route path="/claim_entry" element={<Navigate to="/claims" replace />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/claims_inbox" element={<ClaimsInbox />} />
          <Route path="/clinical_document" element={<ClinicalDocument />} />
          <Route path="/consent_signer" element={<ConsentSinger />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/erp_Inventory_Mapper" element={<ErpInventoryMapper />} />
          <Route path="/fhir_inspector" element={<FhirInspector />} />
          <Route path="/fraud_analytics" element={<FraudAnalytics />} />
          <Route path="/insurer_command" element={<InsurerCommand />} />
          <Route path="/investigator" element={<Investigator />} />
          <Route path="/kanban_board" element={<Navigate to="/investigator" replace />} />
          <Route path="/link_ABHA" element={<LinkABHA />} />
          <Route path="/model_feedback" element={<ModelFeedback />} />
          <Route path="/provider_intelligence" element={<ProviderIntelligence />} />
          <Route path="/system_kpis" element={<SystemKpis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
