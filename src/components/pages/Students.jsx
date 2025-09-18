import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import TableHeader from "@/components/molecules/TableHeader";
import Pagination from "@/components/molecules/Pagination";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import StudentModal from "@/components/organisms/StudentModal";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const itemsPerPage = 10;

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);

    if (!value.trim()) {
      setFilteredStudents(students);
    } else {
const filtered = students.filter(student => {
        const hobbiesString = student.hobbies_c || '';
        return (
          student.first_name_c?.toLowerCase().includes(value.toLowerCase()) ||
          student.last_name_c?.toLowerCase().includes(value.toLowerCase()) ||
          student.email_c?.toLowerCase().includes(value.toLowerCase()) ||
          student.student_id_c?.toLowerCase().includes(value.toLowerCase()) ||
          student.major_c?.toLowerCase().includes(value.toLowerCase()) ||
          (student.gender_c && student.gender_c.toLowerCase().includes(value.toLowerCase())) ||
          hobbiesString.toLowerCase().includes(value.toLowerCase())
        );
      });
      setFilteredStudents(filtered);
    }
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        toast.success("Student deleted successfully");
        loadStudents();
      } catch (err) {
        toast.error(err.message || "Failed to delete student");
      }
    }
  };

  const handleModalSave = async (studentData) => {
    try {
      if (selectedStudent) {
        await studentService.update(selectedStudent.Id, studentData);
        toast.success("Student updated successfully");
      } else {
        await studentService.create(studentData);
        toast.success("Student created successfully");
      }
      setIsModalOpen(false);
      loadStudents();
    } catch (err) {
      toast.error(err.message || "Failed to save student");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg card-shadow overflow-hidden">
        <TableHeader
          title="Students"
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          onAdd={handleAddStudent}
          addLabel="Add Student"
        />

        {filteredStudents.length === 0 ? (
          <Empty
            title="No students found"
            description={searchTerm ? "Try adjusting your search criteria" : "Start by adding your first student"}
            actionLabel="Add Student"
            onAction={handleAddStudent}
            icon="Users"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-hover">
                <thead className="bg-gray-50">
<tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Major
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
{paginatedStudents.map((student, index) => (
                    <motion.tr
                      key={student.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {student.first_name_c?.[0] || ''}{student.last_name_c?.[0] || ''}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.first_name_c} {student.last_name_c}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.email_c}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {student.hobbies_c || 'No hobbies'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.student_id_c}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.major_c}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.year_c}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">{student.gpa_c}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.gender_c || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <ApperIcon
                              key={i}
                              name="Star"
                              size={14}
                              className={`${
                                i < (student.rating_c || 0) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-xs text-gray-600">
                            {student.rating_c || 0}/5
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium text-success-600">
                          ${parseFloat(student.amount_paid_c || 0).toLocaleString('en-US', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={student.status_c === "Active" ? "active" : "inactive"}>
                          {student.status_c}
                        </Badge>
                      </td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditStudent(student)}
                          >
                            <ApperIcon name="Edit" className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(`/documents?studentId=${student.Id}`, '_blank')}
                            title="View Documents"
                          >
                            <ApperIcon name="FileText" className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteStudent(student.Id)}
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4 text-error-600" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredStudents.length}
            />
          </>
        )}
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        student={selectedStudent}
      />
    </motion.div>
  );
};

export default Students;