// frontend/src/components/AdminDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  const courses = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Information Technology",
    "Electrical",
  ];

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/students");
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch students");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search and filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);

    const matchesCourse = filterCourse ? student.course === filterCourse : true;

    return matchesSearch && matchesCourse;
  });

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Delete student
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${studentId}`);
        fetchStudents(); // Refresh the list
        if (selectedStudent && selectedStudent._id === studentId) {
          setSelectedStudent(null);
        }
      } catch (err) {
        setError("Failed to delete student");
        console.error("Error deleting student:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Student Management Dashboard</h1>
        <p>Total Students: {students.length}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Search and Filter Section */}
      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-box">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="filter-select"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <button onClick={fetchStudents} className="refresh-btn">
          Refresh
        </button>
      </div>

      <div className="dashboard-content">
        {/* Students List */}
        <div className="students-list">
          <h2>Registered Students ({filteredStudents.length})</h2>

          {filteredStudents.length === 0 ? (
            <div className="no-students">
              {students.length === 0
                ? "No students registered yet"
                : "No students match your search"}
            </div>
          ) : (
            <div className="students-grid">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className={`student-card ${
                    selectedStudent && selectedStudent._id === student._id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="student-avatar">
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </div>

                  <div className="student-info">
                    <h3>
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="student-email">{student.email}</p>
                    <p className="student-course">
                      {student.course} - Year {student.year}
                    </p>
                    <p className="student-phone">{student.phone}</p>
                  </div>

                  <div className="student-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStudent(student._id);
                      }}
                      className="delete-btn"
                      title="Delete Student"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Details */}
        <div className="student-details">
          {selectedStudent ? (
            <div className="details-card">
              <div className="details-header">
                <h2>Student Details</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="close-btn"
                >
                  ×
                </button>
              </div>

              <div className="details-content">
                {/* Personal Information */}
                <div className="details-section">
                  <h3>Personal Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Full Name:</label>
                      <span>
                        {selectedStudent.firstName} {selectedStudent.lastName}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedStudent.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date of Birth:</label>
                      <span>{formatDate(selectedStudent.dateOfBirth)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Age:</label>
                      <span>
                        {calculateAge(selectedStudent.dateOfBirth)} years
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Gender:</label>
                      <span>{selectedStudent.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="details-section">
                  <h3>Academic Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Course:</label>
                      <span>{selectedStudent.course}</span>
                    </div>
                    <div className="detail-item">
                      <label>Year:</label>
                      <span>Year {selectedStudent.year}</span>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="details-section">
                  <h3>Address Information</h3>
                  <div className="details-grid">
                    <div className="detail-item full-width">
                      <label>Street:</label>
                      <span>{selectedStudent.address.street}</span>
                    </div>
                    <div className="detail-item">
                      <label>City:</label>
                      <span>{selectedStudent.address.city}</span>
                    </div>
                    <div className="detail-item">
                      <label>State:</label>
                      <span>{selectedStudent.address.state}</span>
                    </div>
                    <div className="detail-item">
                      <label>Zip Code:</label>
                      <span>{selectedStudent.address.zipCode}</span>
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div className="details-section">
                  <h3>Guardian Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Guardian Name:</label>
                      <span>{selectedStudent.guardianName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Guardian Phone:</label>
                      <span>{selectedStudent.guardianPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Registration Info */}
                <div className="details-section">
                  <h3>Registration Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Registered On:</label>
                      <span>{formatDate(selectedStudent.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Student ID:</label>
                      <span className="student-id">{selectedStudent._id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-content">
                <h3>Select a Student</h3>
                <p>Click on a student card to view detailed information</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
