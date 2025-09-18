import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import RadioGroup from "@/components/atoms/RadioGroup";
import StarRating from "@/components/atoms/StarRating";
import CurrencyInput from "@/components/atoms/CurrencyInput";
import CheckboxGroup from "@/components/atoms/CheckboxGroup";
import ApperIcon from "@/components/ApperIcon";
const StudentModal = ({ isOpen, onClose, onSave, student }) => {
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    major: "",
    year: "",
    status: "Active",
    gender: "",
    rating: 0,
    amountPaid: "",
    hobbies: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
if (student) {
      setFormData({
        firstName: student.first_name_c || "",
        lastName: student.last_name_c || "",
        email: student.email_c || "",
        phone: student.phone_c || "",
        studentId: student.student_id_c || "",
        major: student.major_c || "",
        year: student.year_c || "",
        status: student.status_c || "Active",
        gender: student.gender_c || "",
        rating: student.rating_c || 0,
        amountPaid: student.amount_paid_c || "",
        hobbies: student.hobbies_c || ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        studentId: "",
        major: "",
        year: "",
        status: "Active",
        gender: "",
        rating: 0,
        amountPaid: "",
        hobbies: []
      });
    }
    setErrors({});
  }, [student, isOpen]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (!formData.major.trim()) newErrors.major = "Major is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required";
    if (formData.amountPaid && isNaN(parseFloat(formData.amountPaid))) {
      newErrors.amountPaid = "Amount must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
  ];

  const hobbiesOptions = [
    { value: "Reading", label: "Reading" },
    { value: "Sports", label: "Sports" },
    { value: "Music", label: "Music" },
    { value: "Art", label: "Art" },
    { value: "Programming", label: "Programming" },
    { value: "Photography", label: "Photography" },
    { value: "Travel", label: "Travel" },
    { value: "Cooking", label: "Cooking" },
    { value: "Gaming", label: "Gaming" },
    { value: "Writing", label: "Writing" },
    { value: "Technology", label: "Technology" },
    { value: "Science", label: "Science" },
    { value: "Business", label: "Business" },
    { value: "Fitness", label: "Fitness" },
    { value: "Gardening", label: "Gardening" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {student ? "Edit Student" : "Add Student"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </div>

            <Input
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              error={errors.studentId}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                error={errors.major}
              />
              <Select
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                error={errors.year}
              >
                <option value="">Select Year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Graduate">Graduate</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
              <RadioGroup
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={genderOptions}
                error={errors.gender}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StarRating
                label="Rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                error={errors.rating}
              />
              <CurrencyInput
                label="Amount Paid"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                error={errors.amountPaid}
              />
            </div>

            <CheckboxGroup
              label="Hobbies"
              name="hobbies"
              value={formData.hobbies}
              onChange={handleChange}
              options={hobbiesOptions}
              error={errors.hobbies}
            />

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {student ? "Update Student" : "Add Student"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentModal;