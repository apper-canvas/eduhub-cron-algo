import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import CurrencyInput from "@/components/atoms/CurrencyInput";
import CheckboxGroup from "@/components/atoms/CheckboxGroup";
import RadioGroup from "@/components/atoms/RadioGroup";
import Range from "@/components/atoms/Range";
import Tag from "@/components/atoms/Tag";
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
    time: "",
    phone: "",
    email: "",
    website: "",
    amount: "",
    specializations: [],
    experienceLevel: "",
    isActive: true,
    topics: "",
    deliveryMethods: [],
    difficulty: "",
    range_c: "",
    tag_c: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
if (course) {
setFormData({
        courseCode: course.course_code_c || "",
        title: course.title_c || "",
        credits: course.credits_c ? course.credits_c.toString() : "",
        department: course.department_c || "",
        semester: course.semester_c || "",
        year: course.year_c ? course.year_c.toString() : "",
        capacity: course.capacity_c ? course.capacity_c.toString() : "",
        instructor: course.instructor_c || "",
        room: course.room_c || "",
        days: course.schedule_c ? course.schedule_c.split(',') : [],
        time: course.schedule_c || "",
        phone: course.phone_c || "",
        email: course.email_c || "",
        website: course.website_c || "",
        amount: course.amount_c ? course.amount_c.toString() : "",
        specializations: course.specializations ? course.specializations.split(',').filter(s => s.trim()) : [],
        experienceLevel: course.experienceLevel || "",
        isActive: course.isActive !== undefined ? course.isActive : true,
        topics: course.topics || "",
        deliveryMethods: course.deliveryMethods ? course.deliveryMethods.split(',').filter(d => d.trim()) : [],
        difficulty: course.difficulty || "",
        range_c: course.range_c || "",
        tag_c: course.tag_c || ""
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
        time: "",
        phone: "",
        email: "",
        website: "",
        amount: "",
        specializations: [],
        experienceLevel: "",
        isActive: true,
        topics: [],
        deliveryMethods: [],
        difficulty: ""
      });
    }
    setErrors({});
  }, [course, isOpen]);

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
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
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email required";
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) newErrors.website = "Valid website URL required";
    if (formData.amount && isNaN(formData.amount)) newErrors.amount = "Valid amount required";
    if (!formData.difficulty.trim()) newErrors.difficulty = "Difficulty level is required";
    if (formData.range_c && !formData.range_c.includes('-')) newErrors.range_c = "Range must contain min and max values";
    if (!formData.tag_c.trim()) newErrors.tag_c = "At least one tag is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const courseData = {
course_code_c: formData.courseCode,
        title_c: formData.title,
        credits_c: parseInt(formData.credits),
        department_c: formData.department,
        semester_c: formData.semester,
        year_c: parseInt(formData.year),
        capacity_c: parseInt(formData.capacity),
        instructor_c: formData.instructor,
        room_c: formData.room,
        schedule_c: formData.days.join(','),
        phone_c: formData.phone,
        email_c: formData.email,
        website_c: formData.website,
        amount_c: formData.amount ? parseFloat(formData.amount) : null,
        specializations: formData.specializations.join(','),
        topics: formData.topics,
        deliveryMethods: formData.deliveryMethods.join(','),
        difficulty: formData.difficulty,
        range_c: formData.range_c,
        tag_c: formData.tag_c
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="e.g., (555) 123-4567"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="e.g., course@university.edu"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Website (Optional)"
                name="website"
                value={formData.website}
                onChange={handleChange}
                error={errors.website}
                placeholder="e.g., https://course-website.com"
              />
              <CurrencyInput
                label="Course Amount (Optional)"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                error={errors.amount}
                placeholder="0.00"
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

            {/* MultiPicklist - Course Specializations */}
            <CheckboxGroup
              label="Course Specializations"
              name="specializations"
              value={formData.specializations}
              onChange={handleChange}
              options={[
                { value: "Theory", label: "Theory" },
                { value: "Lab", label: "Laboratory" },
                { value: "Project", label: "Project-Based" },
                { value: "Research", label: "Research" },
                { value: "Internship", label: "Internship" }
              ]}
              error={errors.specializations}
            />

            {/* Range - Student Experience Level */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Student Experience Level Required
              </label>
              <Select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                error={errors.experienceLevel}
              >
                <option value="">Select Experience Level</option>
                <option value="0-1">Beginner (0-1 years)</option>
                <option value="1-3">Intermediate (1-3 years)</option>
                <option value="3-5">Advanced (3-5 years)</option>
                <option value="5+">Expert (5+ years)</option>
</Select>
              {errors.experienceLevel && (
                <p className="text-sm text-error-600">{errors.experienceLevel}</p>
              )}
            </div>

            {/* Range Field */}
            <Range
              label="Range"
              name="range_c"
              value={formData.range_c}
              onChange={handleChange}
              error={errors.range_c}
              min={0}
              max={100}
            />

            {/* Tag Field */}
            <Tag
              label="Tag"
              name="tag_c"
              value={formData.tag_c}
              onChange={handleChange}
              error={errors.tag_c}
              placeholder="Add tag..."
            />

            {/* Boolean - Course Active Status */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">Course is active and available for enrollment</span>
              </label>
              {errors.isActive && (
                <p className="text-sm text-error-600">{errors.isActive}</p>
              )}
            </div>

            {/* Tag - Course Topics */}
            <CheckboxGroup
              label="Course Topics/Keywords"
              name="topics"
              value={formData.topics}
              onChange={handleChange}
              options={[
                { value: "Programming", label: "Programming" },
                { value: "Mathematics", label: "Mathematics" },
                { value: "Science", label: "Science" },
                { value: "Engineering", label: "Engineering" },
                { value: "Business", label: "Business" },
                { value: "Arts", label: "Arts" },
                { value: "Languages", label: "Languages" },
                { value: "Social Studies", label: "Social Studies" }
              ]}
              error={errors.topics}
            />

            {/* Checkbox - Delivery Methods */}
            <CheckboxGroup
              label="Course Delivery Methods"
              name="deliveryMethods"
              value={formData.deliveryMethods}
              onChange={handleChange}
              options={[
                { value: "Online", label: "Online" },
                { value: "In-Person", label: "In-Person" },
                { value: "Hybrid", label: "Hybrid" },
                { value: "Self-Paced", label: "Self-Paced" }
              ]}
              error={errors.deliveryMethods}
            />

            {/* Radio - Difficulty Level */}
            <RadioGroup
              label="Course Difficulty Level"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              options={[
                { value: "Beginner", label: "Beginner" },
                { value: "Intermediate", label: "Intermediate" },
                { value: "Advanced", label: "Advanced" }
              ]}
              error={errors.difficulty}
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