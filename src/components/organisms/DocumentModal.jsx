import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const DocumentModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  document, 
  students = [], 
  defaultStudentId = null 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    studentId: defaultStudentId || "",
    status: "Active",
    file: null
  });
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || "",
        description: document.description || "",
        category: document.category || "",
        studentId: document.studentId || defaultStudentId || "",
        status: document.status || "Active",
        file: null // Don't pre-fill file for editing
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        studentId: defaultStudentId || "",
        status: "Active",
        file: null
      });
    }
    setErrors({});
  }, [document, isOpen, defaultStudentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    // File type validation - only allow academic document types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ 
        ...prev, 
        file: "Only PDF, Word documents, and images are allowed" 
      }));
      return;
    }

    // File size validation (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ 
        ...prev, 
        file: "File size must be less than 10MB" 
      }));
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    if (errors.file) {
      setErrors(prev => ({ ...prev, file: "" }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.studentId) newErrors.studentId = "Student selection is required";
    if (!document && !formData.file) newErrors.file = "File is required for new documents";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate file processing
      const processedData = {
        ...formData,
        fileName: formData.file ? formData.file.name : document?.fileName || "",
        fileSize: formData.file ? formData.file.size : document?.fileSize || 0,
        fileType: formData.file ? formData.file.type.split('/')[1] : document?.fileType || "pdf",
        fileUrl: formData.file ? URL.createObjectURL(formData.file) : document?.fileUrl || "",
        uploadDate: document?.uploadDate || new Date().toISOString()
      };
      
      onSave(processedData);
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
              {document ? "Edit Document" : "Upload Document"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* File Upload Area */}
            {!document && (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <ApperIcon name="Upload" className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  <label htmlFor="file-upload" className="cursor-pointer text-primary-600 hover:text-primary-500">
                    Click to upload
                  </label>
                  {" "}or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, Word documents, images up to 10MB</p>
                <input
                  id="file-upload"
                  name="file"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
                {formData.file && (
                  <div className="mt-3 text-sm text-gray-900">
                    Selected: {formData.file.name}
                  </div>
                )}
                {errors.file && (
                  <p className="mt-2 text-sm text-error-600">{errors.file}</p>
                )}
              </div>
            )}

            {/* Document Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Document Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="e.g., Fall 2023 Transcript"
              />
              
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
              >
                <option value="">Select Category</option>
                <option value="Transcript">Official Transcript</option>
                <option value="Certificate">Certificate</option>
                <option value="Report Card">Report Card</option>
                <option value="Diploma">Diploma</option>
                <option value="Letter">Recommendation Letter</option>
                <option value="Other">Other</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Student"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                error={errors.studentId}
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.Id} value={student.Id}>
                    {student.firstName} {student.lastName} - {student.studentId}
                  </option>
                ))}
              </Select>

              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
                <option value="Pending">Pending Review</option>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Additional notes or description..."
              />
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <ApperIcon name="Shield" className="h-5 w-5 text-blue-400" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    Document Security
                  </h4>
                  <p className="mt-1 text-sm text-blue-700">
                    All documents are stored securely and are only accessible to authorized personnel. 
                    Academic records are protected according to FERPA guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {document ? "Update Document" : "Upload Document"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DocumentModal;