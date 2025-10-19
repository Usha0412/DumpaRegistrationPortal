// frontend/src/components/StudentForm.jsx
import { useState } from "react";
import axios from "axios";
import "./StudentForm.css";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    course: "",
    year: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    guardianName: "",
    guardianPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const courses = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Information Technology",
    "Electrical",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    // Course validation
    if (!formData.course) {
      newErrors.course = "Course is required";
    }

    // Year validation
    if (!formData.year) {
      newErrors.year = "Year is required";
    }

    // Address validation
    if (!formData.address.street.trim()) {
      newErrors["address.street"] = "Street is required";
    }
    if (!formData.address.city.trim()) {
      newErrors["address.city"] = "City is required";
    }
    if (!formData.address.state.trim()) {
      newErrors["address.state"] = "State is required";
    }
    if (!formData.address.zipCode.trim()) {
      newErrors["address.zipCode"] = "Zip code is required";
    } else if (!/^[0-9]{6}$/.test(formData.address.zipCode)) {
      newErrors["address.zipCode"] = "Zip code must be 6 digits";
    }

    // Guardian validation
    if (!formData.guardianName.trim()) {
      newErrors.guardianName = "Guardian name is required";
    }
    if (!formData.guardianPhone.trim()) {
      newErrors.guardianPhone = "Guardian phone is required";
    } else if (!phoneRegex.test(formData.guardianPhone)) {
      newErrors.guardianPhone = "Phone must be 10 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/students",
        formData
      );

      if (response.data.success) {
        setSuccessMessage("Student registered successfully!");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          course: "",
          year: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
          },
          guardianName: "",
          guardianPhone: "",
        });
        setErrors({});

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.data.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: "Failed to register student. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Student Registration Form</h1>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <form onSubmit={handleSubmit} className="student-form">
        {/* Personal Information */}
        <div className="form-section">
          <h2>Personal Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? "error" : ""}
              />
              {errors.firstName && (
                <span className="error-text">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? "error" : ""}
              />
              {errors.lastName && (
                <span className="error-text">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10 digits"
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && (
                <span className="error-text">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? "error" : ""}
              />
              {errors.dateOfBirth && (
                <span className="error-text">{errors.dateOfBirth}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? "error" : ""}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <span className="error-text">{errors.gender}</span>
              )}
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="form-section">
          <h2>Academic Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="course">Course *</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={errors.course ? "error" : ""}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              {errors.course && (
                <span className="error-text">{errors.course}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="year">Year *</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={errors.year ? "error" : ""}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              {errors.year && <span className="error-text">{errors.year}</span>}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="form-section">
          <h2>Address Information</h2>

          <div className="form-group">
            <label htmlFor="address.street">Street Address *</label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className={errors["address.street"] ? "error" : ""}
            />
            {errors["address.street"] && (
              <span className="error-text">{errors["address.street"]}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address.city">City *</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className={errors["address.city"] ? "error" : ""}
              />
              {errors["address.city"] && (
                <span className="error-text">{errors["address.city"]}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address.state">State *</label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className={errors["address.state"] ? "error" : ""}
              />
              {errors["address.state"] && (
                <span className="error-text">{errors["address.state"]}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address.zipCode">Zip Code *</label>
              <input
                type="text"
                id="address.zipCode"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                placeholder="6 digits"
                className={errors["address.zipCode"] ? "error" : ""}
              />
              {errors["address.zipCode"] && (
                <span className="error-text">{errors["address.zipCode"]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="form-section">
          <h2>Guardian Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="guardianName">Guardian Name *</label>
              <input
                type="text"
                id="guardianName"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                className={errors.guardianName ? "error" : ""}
              />
              {errors.guardianName && (
                <span className="error-text">{errors.guardianName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="guardianPhone">Guardian Phone *</label>
              <input
                type="tel"
                id="guardianPhone"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                placeholder="10 digits"
                className={errors.guardianPhone ? "error" : ""}
              />
              {errors.guardianPhone && (
                <span className="error-text">{errors.guardianPhone}</span>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Register Student"}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
