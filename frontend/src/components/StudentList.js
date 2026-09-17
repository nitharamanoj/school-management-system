import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/students';

function StudentList() {
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [deleteModal, setDeleteModal] = useState(null); // student to delete
  const [alert, setAlert]         = useState(null);
  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API, { params: search ? { search } : {} });
      setStudents(res.data.data);
    } catch (err) {
      showAlert('error', 'Failed to load students. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const delay = setTimeout(() => fetchStudents(), 300);
    return () => clearTimeout(delay);
  }, [fetchStudents]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await axios.delete(`${API}/${deleteModal._id}`);
      showAlert('success', `"${deleteModal.fullName}" deleted successfully.`);
      setDeleteModal(null);
      fetchStudents();
    } catch (err) {
      showAlert('error', 'Failed to delete student.');
      setDeleteModal(null);
    }
  };

  // Build department stats
  const departments = [...new Set(students.map((s) => s.department))];
  const courses     = [...new Set(students.map((s) => s.course))];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Dashboard</h1>
          <p className="page-subtitle">Manage all student records in one place</p>
        </div>
        <Link to="/add" id="btn-add-student" className="btn btn-primary">
          ➕ Add Student
        </Link>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? '✅' : '❌'} {alert.message}
        </div>
      )}

      {/* Stats strip */}
      <div className="stats-strip">
        <div className="stat-card">
          <div className="stat-icon blue">👨‍🎓</div>
          <div>
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📚</div>
          <div>
            <div className="stat-value">{courses.length}</div>
            <div className="stat-label">Courses</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🏫</div>
          <div>
            <div className="stat-value">{departments.length}</div>
            <div className="stat-label">Departments</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">📅</div>
          <div>
            <div className="stat-value">
              {[...new Set(students.map((s) => s.yearOfStudy))].length}
            </div>
            <div className="stat-label">Year Groups</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            className="search-input"
            placeholder="Search by name, student ID, email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <button id="btn-clear-search" className="btn btn-secondary" onClick={() => setSearch('')}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div> Loading students...
        </div>
      ) : students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{search ? '🔍' : '👨‍🎓'}</div>
          <h3>{search ? 'No results found' : 'No students yet'}</h3>
          <p>
            {search
              ? `No students match "${search}"`
              : 'Click "Add Student" to register the first student.'}
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="students-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Course</th>
                <th>Department</th>
                <th>Year</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {index + 1}
                  </td>
                  <td>
                    <span className="badge badge-blue">{student.studentId}</span>
                  </td>
                  <td>
                    <strong>{student.fullName}</strong>
                  </td>
                  <td>{student.course}</td>
                  <td>
                    <span className="badge badge-purple">{student.department}</span>
                  </td>
                  <td>
                    <span className="badge badge-green">Year {student.yearOfStudy}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{student.email}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        id={`btn-view-${student._id}`}
                        className="btn btn-info btn-sm"
                        onClick={() => navigate(`/student/${student._id}`)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        id={`btn-edit-${student._id}`}
                        className="btn btn-warning btn-sm"
                        onClick={() => navigate(`/edit/${student._id}`)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        id={`btn-delete-${student._id}`}
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteModal(student)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">⚠️ Confirm Delete</h3>
            <p className="modal-body">
              Are you sure you want to delete{' '}
              <strong>{deleteModal.fullName}</strong> ({deleteModal.studentId})?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                id="btn-cancel-delete"
                className="btn btn-secondary"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
