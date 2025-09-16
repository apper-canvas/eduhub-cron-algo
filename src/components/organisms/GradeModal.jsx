import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const GradeModal = ({ isOpen, onClose, onSave, grade, students, courses }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    grade: "",
    points: "",
    semester: "",
    year: ""
  });
  const [errors, setErrors] = useState({});

  const gradePoints = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "D-": 0.7,
    "F": 0.0
  };

  useEffect(() => {
    if (grade) {
      setFormData({
        studentId: grade.studentId || "",
        courseId: grade.courseId || "",
        grade: grade.grade || "",
        points: grade.points.toString() || "",
        semester: grade.semester || "",
        year: grade.year.toString() || ""
      });
    } else {
      setFormData({
        studentId: "",
        courseId: "",
        grade: "",
        points: "",
        semester: "Spring",
        year: "2024"
      });
    }
    setErrors({});
  }, [grade, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "grade") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        points: gradePoints[value]?.toString() || ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentId) newErrors.studentId = "Student is required";
    if (!formData.courseId) newErrors.courseId = "Course is required";
    if (!formData.grade) newErrors.grade = "Grade is required";
    if (!formData.semester) newErrors.semester = "Semester is required";
    if (!formData.year) newErrors.year = "Year is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const gradeData = {
        ...formData,
        points: parseFloat(formData.points),
        year: parseInt(formData.year)
      };
      onSave(gradeData);
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
              {grade ? "Edit Grade" : "Add Grade"}
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
              <Select
                label="Student"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                error={errors.studentId}
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.Id} value={student.Id.toString()}>
                    {student.firstName} {student.lastName} ({student.studentId})
                  </option>
                ))}
              </Select>

              <Select
                label="Course"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                error={errors.courseId}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.Id} value={course.Id.toString()}>
                    {course.courseCode} - {course.title}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                error={errors.grade}
              >
                <option value="">Select Grade</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D+">D+</option>
                <option value="D">D</option>
                <option value="D-">D-</option>
                <option value="F">F</option>
              </Select>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Grade Points
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                  {formData.points || "0.0"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                error={errors.semester}
              >
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </Select>

              <Select
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                error={errors.year}
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </Select>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {grade ? "Update Grade" : "Add Grade"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GradeModal;