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
import { gradeService } from "@/services/api/gradeService";
import { studentService } from "@/services/api/studentService";
import { courseService } from "@/services/api/courseService";
import GradeModal from "@/components/organisms/GradeModal";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrichedGrades, setEnrichedGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const itemsPerPage = 10;

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [gradesData, studentsData, coursesData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        courseService.getAll()
      ]);

      setGrades(gradesData);
      setStudents(studentsData);
      setCourses(coursesData);

      // Enrich grades with student and course information
const enriched = gradesData.map(grade => {
        const student = studentsData.find(s => s.Id.toString() === (grade.student_id_c?.Id || grade.student_id_c)?.toString());
        const course = coursesData.find(c => c.Id.toString() === (grade.course_id_c?.Id || grade.course_id_c)?.toString());
        
        return {
          ...grade,
          studentName: student ? `${student.first_name_c} ${student.last_name_c}` : "Unknown Student",
          studentEmail: student?.email_c || "",
          courseTitle: course?.title_c || "Unknown Course",
          courseCode: course?.course_code_c || ""
        };
      });

      setEnrichedGrades(enriched);
      setFilteredGrades(enriched);
    } catch (err) {
      setError(err.message || "Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);

    if (!value.trim()) {
      setFilteredGrades(enrichedGrades);
    } else {
const filtered = enrichedGrades.filter(grade =>
        grade.studentName.toLowerCase().includes(value.toLowerCase()) ||
        grade.courseTitle.toLowerCase().includes(value.toLowerCase()) ||
        grade.courseCode.toLowerCase().includes(value.toLowerCase()) ||
        grade.grade_c?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGrades(filtered);
    }
  };

  const handleAddGrade = () => {
    setSelectedGrade(null);
    setIsModalOpen(true);
  };

  const handleEditGrade = (grade) => {
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await gradeService.delete(gradeId);
        toast.success("Grade deleted successfully");
        loadData();
      } catch (err) {
        toast.error(err.message || "Failed to delete grade");
      }
    }
  };

  const handleModalSave = async (gradeData) => {
    try {
      if (selectedGrade) {
        await gradeService.update(selectedGrade.Id, gradeData);
        toast.success("Grade updated successfully");
      } else {
        await gradeService.create(gradeData);
        toast.success("Grade added successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save grade");
    }
  };

  const getGradeVariant = (grade) => {
    switch (grade) {
      case "A":
      case "A+":
      case "A-":
        return "success";
      case "B":
      case "B+":
      case "B-":
        return "info";
      case "C":
      case "C+":
      case "C-":
        return "warning";
      case "D":
      case "D+":
      case "D-":
        return "warning";
      case "F":
        return "error";
      default:
        return "default";
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredGrades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGrades = filteredGrades.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg card-shadow overflow-hidden">
        <TableHeader
          title="Grades"
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          onAdd={handleAddGrade}
          addLabel="Add Grade"
        />

        {filteredGrades.length === 0 ? (
          <Empty
            title="No grades found"
            description={searchTerm ? "Try adjusting your search criteria" : "Start by adding grades for students"}
            actionLabel="Add Grade"
            onAction={handleAddGrade}
            icon="GraduationCap"
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
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Entered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
{paginatedGrades.map((grade, index) => (
                    <motion.tr
                      key={grade.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {grade.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {grade.studentEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {grade.courseCode}
                          </div>
                          <div className="text-sm text-gray-500">
                            {grade.courseTitle}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getGradeVariant(grade.grade_c)}>
                          {grade.grade_c}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {parseFloat(grade.points_c || 0).toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grade.semester_c} {grade.year_c}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(grade.date_entered_c || grade.CreatedOn).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditGrade(grade)}
                          >
                            <ApperIcon name="Edit" className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteGrade(grade.Id)}
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
              totalItems={filteredGrades.length}
            />
          </>
        )}
      </div>

      <GradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        grade={selectedGrade}
        students={students}
        courses={courses}
      />
    </motion.div>
  );
};

export default Grades;