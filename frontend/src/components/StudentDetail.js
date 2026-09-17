import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/students';

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    axios.get(`${API}/${id}`)
      .then((res) => setStudent(res.data.data))
      .catch(() => setError('Student not found or server error.'))
      .finally(() => setLoading(false));
  }, [id]);

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div> Loading student details...
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="empty-state">
        <div className="empty-icon">❌</div>
        <h3>{error || 'Student not found'}</h3>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>← Back to List</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Details</h1>
          <p className="page-subtitle">Complete information for this student</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            id="btn-edit-from-detail"
            className="btn btn-warning"
            onClick={() => navigate(`/edit/${student._id}`)}
          >
            ✏️ Edit
          </button>
          <Link to="/" id="btn-back-from-detail" className="btn btn-secondary">← Back</Link>
        </div>
      </div>

      <div className="detail-card">
        {/* Header */}
        <div className="detail-header">
          <div className="detail-avatar">{getInitials(student.fullName)}</div>
          <div>
            <div className="detail-name">{student.fullName}</div>
            <div className="detail-id">
              <span className="badge badge-blue">{student.studentId}</span>
              &nbsp;
              <span className="badge badge-green">Year {student.yearOfStudy}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">📧 Email</span>
            <span className="detail-value">{student.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📞 Phone</span>
            <span className="detail-value">{student.phone}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">🎂 Age</span>
            <span className="detail-value">{student.age} years old</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">🚻 Gender</span>
            <span className="detail-value">{student.gender}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📚 Course</span>
            <span className="detail-value">{student.course}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">🏫 Department</span>
            <span className="detail-value">{student.department}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📅 Year of Study</span>
            <span className="detail-value">Year {student.yearOfStudy}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">🕐 Registered</span>
            <span className="detail-value">
              {new Date(student.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          </div>
          <div className="detail-item full-width">
            <span className="detail-label">📍 Address</span>
            <span className="detail-value">{student.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;
