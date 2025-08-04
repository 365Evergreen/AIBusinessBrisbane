import React from 'react';
import RegistrationForm from './RegistrationForm';

function HRForm({ formData, handleFormChange, handleSubmit, selectedProduct }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="hrTask" className="form-label">HR Task</label>
        <select className="form-select" id="hrTask" onChange={handleFormChange} value={formData.hrTask || ''}>
          <option value="">Select an HR task</option>
          <option value="onboarding">Onboarding</option>
          <option value="payroll">Payroll Inquiry</option>
          <option value="benefits">Benefits Information</option>
        </select>
      </div>
      <RegistrationForm formData={formData} handleFormChange={handleFormChange} selectedProduct={selectedProduct} />
      <button type="submit" className="btn btn-primary mt-3">Generate Demo & Register</button>
    </form>
  );
}

export default HRForm;
