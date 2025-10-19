// backend/models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please enter a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function (value) {
          const age =
            (new Date() - new Date(value)) / (1000 * 60 * 60 * 24 * 365);
          return age >= 15 && age <= 100;
        },
        message: "Age must be between 15 and 100 years",
      },
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      enum: [
        "Computer Science",
        "Electronics",
        "Mechanical",
        "Civil",
        "Information Technology",
        "Electrical",
      ],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1, "Year must be between 1 and 4"],
      max: [4, "Year must be between 1 and 4"],
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      zipCode: {
        type: String,
        required: [true, "Zip code is required"],
        match: [/^[0-9]{6}$/, "Please enter a valid 6-digit zip code"],
      },
    },
    guardianName: {
      type: String,
      required: [true, "Guardian name is required"],
    },
    guardianPhone: {
      type: String,
      required: [true, "Guardian phone is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
  },
  {
    timestamps: true,
  }
);

// Custom validation method
studentSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
