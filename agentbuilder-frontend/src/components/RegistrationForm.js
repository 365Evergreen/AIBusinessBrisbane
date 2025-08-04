import React from 'react';

function RegistrationForm({ formData, handleFormChange, selectedProduct }) {
  return (
    <>
      <h4 className="mt-4">Client Registration</h4>
      <div className="mb-3">
        <label htmlFor="firstName" className="form-label">First Name</label>
        <input type="text" className="form-control" id="firstName" onChange={handleFormChange} value={formData.firstName || ''} required />
      </div>
      <div className="mb-3">
        <label htmlFor="surname" className="form-label">Surname</label>
        <input type="text" className="form-control" id="surname" onChange={handleFormChange} value={formData.surname || ''} required />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" className="form-control" id="email" onChange={handleFormChange} value={formData.email || ''} required />
      </div>
      <div className="mb-3">
        <label htmlFor="phoneNo" className="form-label">Phone Number</label>
        <input type="tel" className="form-control" id="phoneNo" onChange={handleFormChange} value={formData.phoneNo || ''} required />
      </div>
      <div className="mb-3">
        <label htmlFor="agentRequested" className="form-label">Agent Requested</label>
        <input type="text" className="form-control" id="agentRequested" value={selectedProduct ? selectedProduct.name : ''} readOnly />
      </div>
    </>
  );
}

export default RegistrationForm;
