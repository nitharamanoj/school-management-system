import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/students';

const INITIAL_FORM = {
  studentId: '',
  fullName: '',
  age: '',
  gender: '',
  email: '',
  phone: '',
  course: '',
  department: '',
  yearOfStudy: '',
  address: '',
};

function AddStudent() {
  const [form, setForm]     = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [alert, setAlert]   = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.studentId.trim()) e.studentId = 'Student ID is required';
    if (!form.fullName.trim())  e.fullName  = 'Full name is required';
    if (!form.age || form.age < 10 || form.age > 100) e.age = 'Age must be between 10 and 100';
    if (!form.gender)           e.gender    = 'Gender is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Valid email is required';
    if (!form.phone.trim())     e.phone     = 'Phone number is required';
    if (!form.course.trim())    e.course    = 'Course is required';
    if (!form.department.trim()) e.department = 'Department is required';
    if (!form.yearOfStudy || form.yearOfStudy < 1 || form.yearOfStudy > 6)
      e.yearOfStudy = 'Year of study must be 1–6';
    if (!form.address.trim())   e.address   = 'Address is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      setLoading(true);
      await axios.post(API, form);
      setAlert({ type: 'success', message: 'Student added successfully!' });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to add student.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Student</h1>
          <p className="page-subtitle">Fill in the details to register a new student</p>
        </div>
        <Link to="/" id="btn-back-list" className="btn btn-secondary">← Back to List</Link>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '❌'} {alert.message}
        </div>
      )}

      <div className="form-card">
        <form id="add-student-form" onSubmit={handleSubmit} noValidate>
          {/* Personal Info */}
          <p className="form-section-title">Personal Information</p>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="studentId" className="form-label">
                Student ID <span className="required">*</span>
              </label>
              <input id="studentId" name="studentId" type="text" className="form-input"
                placeholder="e.g. STU-2024-001" value={form.studentId} onChange={handleChange} />
              {errors.studentId && <span className="error-msg">{errors.studentId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input id="fullName" name="fullName" type="text" className="form-input"
                placeholder="e.g. John Smith" value={form.fullName} onChange={handleChange} />
              {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="age" className="form-label">
                Age <span className="required">*</span>
              </label>
              <input id="age" name="age" type="number" className="form-input"
                placeholder="e.g. 20" min="10" max="100" value={form.age} onChange={handleChange} />
              {errors.age && <span className="error-msg">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                Gender <span className="required">*</span>
              </label>
              <select id="gender" name="gender" className="form-select"
                value={form.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="error-msg">{errors.gender}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email <span className="required">*</span>
              </label>
              <input id="email" name="email" type="email" className="form-input"
                placeholder="e.g. john@example.com" value={form.email} onChange={handleChange} />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number <span className="required">*</span>
              </label>
              <input id="phone" name="phone" type="tel" className="form-input"
                placeholder="e.g. +1-555-0123" value={form.phone} onChange={handleChange} />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>
          </div>

          {/* Academic Info */}
          <p className="form-section-title">Academic Information</p>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="course" className="form-label">
                Course <span className="required">*</span>
              </label>
              <input id="course" name="course" type="text" className="form-input"
                placeholder="e.g. Computer Science" value={form.course} onChange={handleChange} />
              {errors.course && <span className="error-msg">{errors.course}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department <span className="required">*</span>
              </label>
              <input id="department" name="department" type="text" className="form-input"
                placeholder="e.g. Engineering" value={form.department} onChange={handleChange} />
              {errors.department && <span className="error-msg">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="yearOfStudy" className="form-label">
                Year of Study <span className="required">*</span>
              </label>
              <select id="yearOfStudy" name="yearOfStudy" className="form-select"
                value={form.yearOfStudy} onChange={handleChange}>
                <option value="">Select Year</option>
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
              {errors.yearOfStudy && <span className="error-msg">{errors.yearOfStudy}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="address" className="form-label">
                Address <span className="required">*</span>
              </label>
              <textarea id="address" name="address" className="form-textarea"
                placeholder="Enter full address" value={form.address} onChange={handleChange} />
              {errors.address && <span className="error-msg">{errors.address}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button id="btn-submit-add" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Saving...' : '✅ Add Student'}
            </button>
            <Link to="/" id="btn-cancel-add" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
