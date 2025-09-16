import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const CourseModal = ({ isOpen, onClose, onSave, course }) => {
  const [formData, setFormData] = useState({
    courseCode: "",
    title: "",
    credits: "",
    department: "",
    semester: "",
    year: "",
    capacity: "",
    instructor: "",
    room: "",
    days: [],
    time: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (course) {
      setFormData({
        courseCode: course.courseCode || "",
        title: course.title || "",
        credits: course.credits.toString() || "",
        department: course.department || "",
        semester: course.semester || "",
        year: course.year.toString() || "",
        capacity: course.capacity.toString() || "",
        instructor: course.instructor || "",
        room: course.room || "",
        days: course.schedule?.days || [],
        time: course.schedule?.time || ""
      });
    } else {
      setFormData({
        courseCode: "",
        title: "",
        credits: "",
        department: "",
        semester: "Spring",
        year: "2024",
        capacity: "",
        instructor: "",
        room: "",
        days: [],
        time: ""
      });
    }
    setErrors({});
  }, [course, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
    if (errors.days) {
      setErrors(prev => ({ ...prev, days: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.courseCode.trim()) newErrors.courseCode = "Course code is required";
    if (!formData.title.trim()) newErrors.title = "Course title is required";
    if (!formData.credits || isNaN(formData.credits)) newErrors.credits = "Valid credits required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.capacity || isNaN(formData.capacity)) newErrors.capacity = "Valid capacity required";
    if (!formData.instructor.trim()) newErrors.instructor = "Instructor is required";
    if (formData.days.length === 0) newErrors.days = "At least one day must be selected";
    if (!formData.time.trim()) newErrors.time = "Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits),
        year: parseInt(formData.year),
        capacity: parseInt(formData.capacity),
        schedule: {
          days: formData.days,
          time: formData.time
        }
      };
      delete courseData.days;
      delete courseData.time;
      onSave(courseData);
    }
  };

  if (!isOpen) return null;

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {course ? "Edit Course" : "Add Course"}
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
                label="Course Code"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                error={errors.courseCode}
                placeholder="e.g., CS201"
              />
              <Input
                label="Credits"
                name="credits"
                type="number"
                value={formData.credits}
                onChange={handleChange}
                error={errors.credits}
                min="1"
                max="6"
              />
            </div>

            <Input
              label="Course Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="e.g., Data Structures and Algorithms"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
                placeholder="e.g., Computer Science"
              />
              <Input
                label="Instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                error={errors.instructor}
                placeholder="e.g., Dr. Sarah Chen"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </Select>
              <Input
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                min="2024"
                max="2030"
              />
              <Input
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                error={errors.capacity}
                min="1"
                max="200"
              />
            </div>

            <Input
              label="Room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              placeholder="e.g., CS Building 201"
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Schedule Days
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayChange(day)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                      formData.days.includes(day)
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {errors.days && (
                <p className="text-sm text-error-600">{errors.days}</p>
              )}
            </div>

            <Input
              label="Time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              error={errors.time}
              placeholder="e.g., 10:00 AM - 11:00 AM"
            />

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {course ? "Update Course" : "Add Course"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CourseModal;