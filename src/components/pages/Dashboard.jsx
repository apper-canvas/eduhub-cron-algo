import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { courseService } from "@/services/api/courseService";
import { gradeService } from "@/services/api/gradeService";
import { enrollmentService } from "@/services/api/enrollmentService";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [students, courses, grades, enrollments] = await Promise.all([
        studentService.getAll(),
        courseService.getAll(),
        gradeService.getAll(),
        enrollmentService.getAll()
      ]);

      // Calculate statistics
      const activeStudents = students.filter(s => s.status === "Active").length;
      const totalEnrolled = enrollments.filter(e => e.status === "Enrolled").length;
      const averageGPA = students.reduce((sum, s) => sum + s.gpa, 0) / students.length;
      const coursesOffered = courses.length;

      setStats({
        totalStudents: students.length,
        activeStudents,
        coursesOffered,
        totalEnrolled,
        averageGPA: averageGPA.toFixed(2)
      });

      // Generate recent activity
      const activity = [
        {
          id: 1,
          type: "enrollment",
          message: "25 new student enrollments for Spring 2024",
          timestamp: new Date(),
          icon: "UserPlus"
        },
        {
          id: 2,
          type: "grade",
          message: "Grades updated for CS201 - Data Structures",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          icon: "BookOpen"
        },
        {
          id: 3,
          type: "course",
          message: "New course added: Advanced Web Development",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          icon: "Plus"
        },
        {
          id: 4,
          type: "attendance",
          message: "Attendance records updated for all courses",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          icon: "Calendar"
        }
      ];

      setRecentActivity(activity);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to EduHub</h1>
            <p className="text-primary-100">
              Manage your college operations with ease and efficiency
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon="Users"
            change="+12%"
            trend="up"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Active Students"
            value={stats.activeStudents}
            icon="UserCheck"
            change="+8%"
            trend="up"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Courses Offered"
            value={stats.coursesOffered}
            icon="BookOpen"
            change="+3"
            trend="up"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Average GPA"
            value={stats.averageGPA}
            icon="TrendingUp"
            change="+0.2"
            trend="up"
          />
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg card-shadow"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                  <ApperIcon name="UserPlus" className="w-4 h-4 text-primary-600" />
                </div>
                <h4 className="font-medium text-gray-900">Add Student</h4>
                <p className="text-sm text-gray-600">Register new student</p>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mb-3">
                  <ApperIcon name="BookOpen" className="w-4 h-4 text-accent-600" />
                </div>
                <h4 className="font-medium text-gray-900">Add Course</h4>
                <p className="text-sm text-gray-600">Create new course</p>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center mb-3">
                  <ApperIcon name="GraduationCap" className="w-4 h-4 text-success-600" />
                </div>
                <h4 className="font-medium text-gray-900">Enter Grades</h4>
                <p className="text-sm text-gray-600">Update student grades</p>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
                <div className="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center mb-3">
                  <ApperIcon name="BarChart3" className="w-4 h-4 text-info-600" />
                </div>
                <h4 className="font-medium text-gray-900">View Reports</h4>
                <p className="text-sm text-gray-600">Generate analytics</p>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg card-shadow"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon 
                      name={activity.icon} 
                      className="w-4 h-4 text-gray-600" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(activity.timestamp, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg card-shadow"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Users" className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Student Management</h4>
              <p className="text-sm text-gray-600">
                Comprehensive student records, enrollment, and profile management
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="BookOpen" className="w-6 h-6 text-accent-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Course Catalog</h4>
              <p className="text-sm text-gray-600">
                Complete course management with scheduling and capacity tracking
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="BarChart3" className="w-6 h-6 text-success-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Analytics & Reports</h4>
              <p className="text-sm text-gray-600">
                Detailed reporting and insights for institutional decision-making
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;