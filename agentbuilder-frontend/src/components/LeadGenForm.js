import React from 'react';
import RegistrationForm from './RegistrationForm';

function LeadGenForm({ formData, handleFormChange, handleSubmit, selectedProduct }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="industry" className="form-label">Industry</label>
        <input type="text" className="form-control" id="industry" onChange={handleFormChange} value={formData.industry || ''} />
      </div>
      <div className="mb-3">
        <label htmlFor="targetAudience" className="form-label">Target Audience</label>
        <input type="text" className="form-control" id="targetAudience" onChange={handleFormChange} value={formData.targetAudience || ''} />
      </div>
      <RegistrationForm formData={formData} handleFormChange={handleFormChange} selectedProduct={selectedProduct} />
      <button type="submit" className="btn btn-primary mt-3">Generate Demo & Register</button>
    </form>
  );
}

export default LeadGenForm;
