import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';
import Footer from './components/Footer';
import PAForm from './components/PAForm';
import LeadGenForm from './components/LeadGenForm';
import HRForm from './components/HRForm';
import PersonalAssist from './pages/PersonalAssist';
import LeadGenerator from './pages/LeadGenerator';
import HRAgent from './pages/HRAgent';
import Services from './pages/Services';

function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [demoOutput, setDemoOutput] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDemoOutput(null); // Clear previous demo output
    setRegistrationStatus(null); // Clear previous registration status

    // API call for Generate Demo
    const generateDemoApiUrl = process.env.NODE_ENV === 'production'
      ? '/api/GenerateDemo'
      : 'http://localhost:7071/api/GenerateDemo';

    try {
      const demoResponse = await fetch(generateDemoApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: selectedProduct.id, formData }),
      });

      if (!demoResponse.ok) {
        throw new Error(`HTTP error! status: ${demoResponse.status}`);
      }

      const demoData = await demoResponse.json();
      setDemoOutput(demoData);
    } catch (error) {
      console.error('Error generating demo:', error);
      setDemoOutput({ error: 'Failed to generate demo. Please try again.' });
    }

    // API call for Client Registration
    const registerClientApiUrl = process.env.NODE_ENV === 'production'
      ? '/api/RegisterClient'
      : 'http://localhost:7071/api/RegisterClient';

    try {
      const registrationResponse = await fetch(registerClientApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName || '',
          email: formData.email || '',
          firstName: formData.firstName || '',
          surname: formData.surname || '',
          phoneNo: formData.phoneNo || '',
          agentRequested: selectedProduct.name,
        }),
      });

      if (!registrationResponse.ok) {
        throw new Error(`HTTP error! status: ${registrationResponse.status}`);
      }

      setRegistrationStatus({ success: true, message: 'Client registered successfully!' });
    } catch (error) {
      console.error('Error registering client:', error);
      setRegistrationStatus({ success: false, message: `Failed to register client: ${error.message}` });
    }
  };

  const products = [
    {
      id: 'pa',
      name: 'Personal Assistant Agent',
      description: 'An AI-powered personal assistant to streamline your daily tasks.',
      formComponent: PAForm,
    },
    {
      id: 'leadgen',
      name: 'Lead Generator',
      description: 'Generate high-quality leads with automated follow-up actions.',
      formComponent: LeadGenForm,
    },
    {
      id: 'hr',
      name: 'Human Resources Agent',
      description: 'Automate HR tasks, from onboarding to employee support.',
      formComponent: HRForm,
    },
  ];

  const ProductForm = selectedProduct ? selectedProduct.formComponent : null;

  return (
    <div className="container mt-4">
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedProduct(product);
                    setFormData({}); // Clear form data when selecting a new product
                    setDemoOutput(null); // Clear demo output when selecting a new product
                    setRegistrationStatus(null); // Clear registration status
                  }}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="mt-5">
          <h2>{selectedProduct.name} Demo Configuration</h2>
          {ProductForm && (
            <ProductForm
              formData={formData}
              handleFormChange={handleFormChange}
              handleSubmit={handleSubmit}
              selectedProduct={selectedProduct}
            />
          )}

          {demoOutput && (
            <div className="mt-4 p-3 border rounded bg-light">
              <h4>Demo Output:</h4>
              {demoOutput.error ? (
                <p className="text-danger">{demoOutput.error}</p>
              ) : (
                <>
                  <p><strong>Prompt:</strong> {demoOutput.prompt}</p>
                  <p><strong>Demo:</strong> {demoOutput.demo}</p>
                </>
              )}
            </div>
          )}

          {registrationStatus && (
            <div className={`mt-3 alert ${registrationStatus.success ? 'alert-success' : 'alert-danger'}`}>
              {registrationStatus.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personal-assist" element={<PersonalAssist />} />
        <Route path="/lead-generator" element={<LeadGenerator />} />
        <Route path="/hr-agent" element={<HRAgent />} />
        <Route path="/services" element={<Services />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
