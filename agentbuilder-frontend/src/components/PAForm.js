import React from 'react';
import RegistrationForm from './RegistrationForm';

function PAForm({ formData, handleFormChange, handleSubmit, selectedProduct }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="companyName" className="form-label">Company Name</label>
        <input type="text" className="form-control" id="companyName" onChange={handleFormChange} value={formData.companyName || ''} />
      </div>
      <div className="mb-3">
        <label htmlFor="priorities" className="form-label">Priorities</label>
        <select className="form-select" id="priorities" onChange={handleFormChange} value={formData.priorities || ''}>
          <option value="">Select a priority</option>
          <option value="scheduling">Scheduling</option>
          <option value="email_management">Email Management</option>
          <option value="data_entry">Data Entry</option>
        </select>
      </div>
      <RegistrationForm formData={formData} handleFormChange={handleFormChange} selectedProduct={selectedProduct} />
      <button type="submit" className="btn btn-primary mt-3">Generate Demo & Register</button>
    </form>
  );
}

export default PAForm;
