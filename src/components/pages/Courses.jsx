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
import { courseService } from "@/services/api/courseService";
import CourseModal from "@/components/organisms/CourseModal";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const itemsPerPage = 8;

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);

    if (!value.trim()) {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
course.title.toLowerCase().includes(value.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(value.toLowerCase()) ||
        course.department.toLowerCase().includes(value.toLowerCase()) ||
        course.instructor.toLowerCase().includes(value.toLowerCase()) ||
        course.phone?.toLowerCase().includes(value.toLowerCase()) ||
        course.email?.toLowerCase().includes(value.toLowerCase()) ||
        course.website?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseService.delete(courseId);
        toast.success("Course deleted successfully");
        loadCourses();
      } catch (err) {
        toast.error(err.message || "Failed to delete course");
      }
    }
  };

  const handleModalSave = async (courseData) => {
    try {
      if (selectedCourse) {
        await courseService.update(selectedCourse.Id, courseData);
        toast.success("Course updated successfully");
      } else {
        await courseService.create(courseData);
        toast.success("Course created successfully");
      }
      setIsModalOpen(false);
      loadCourses();
    } catch (err) {
      toast.error(err.message || "Failed to save course");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  const getCapacityStatus = (enrolled, capacity) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return "error";
    if (percentage >= 75) return "warning";
    return "success";
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg card-shadow overflow-hidden">
        <TableHeader
          title="Courses"
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          onAdd={handleAddCourse}
          addLabel="Add Course"
        />

        {filteredCourses.length === 0 ? (
          <Empty
            title="No courses found"
            description={searchTerm ? "Try adjusting your search criteria" : "Start by adding your first course"}
            actionLabel="Add Course"
            onAction={handleAddCourse}
            icon="BookOpen"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-hover">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCourses.map((course, index) => (
                    <motion.tr
                      key={course.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {course.courseCode}
                          </div>
                          <div className="text-sm text-gray-500">
                            {course.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.instructor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {course.schedule.days.join(", ")}
                          </div>
                          <div className="text-gray-500">
                            {course.schedule.time}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-2">
                            {course.enrolled}/{course.capacity}
                          </span>
                          <Badge variant={getCapacityStatus(course.enrolled, course.capacity)}>
                            {Math.round((course.enrolled / course.capacity) * 100)}%
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCourse(course)}
                          >
                            <ApperIcon name="Edit" className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCourse(course.Id)}
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
              totalItems={filteredCourses.length}
            />
          </>
        )}
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        course={selectedCourse}
      />
    </motion.div>
  );
};

export default Courses;