import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { courseService } from "@/services/api/courseService";
import { gradeService } from "@/services/api/gradeService";
import { enrollmentService } from "@/services/api/enrollmentService";

const Reports = () => {
  const [data, setData] = useState({
    students: [],
    courses: [],
    grades: [],
    enrollments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportType, setReportType] = useState("overview");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [students, courses, grades, enrollments] = await Promise.all([
        studentService.getAll(),
        courseService.getAll(),
        gradeService.getAll(),
        enrollmentService.getAll()
      ]);

      setData({ students, courses, grades, enrollments });
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Analytics calculations
  const getAnalytics = () => {
    const { students, courses, grades, enrollments } = data;

    // Student distribution by year
    const yearDistribution = students.reduce((acc, student) => {
      acc[student.year] = (acc[student.year] || 0) + 1;
      return acc;
    }, {});

    // Grade distribution
    const gradeDistribution = grades.reduce((acc, grade) => {
      const letter = grade.grade.charAt(0);
      acc[letter] = (acc[letter] || 0) + 1;
      return acc;
    }, {});

    // Department enrollment
    const departmentEnrollment = courses.reduce((acc, course) => {
      acc[course.department] = (acc[course.department] || 0) + course.enrolled;
      return acc;
    }, {});

    // Average GPA
    const averageGPA = students.length > 0 
      ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
      : "0.00";

    // Enrollment rate
    const totalCapacity = courses.reduce((sum, c) => sum + c.capacity, 0);
    const totalEnrolled = courses.reduce((sum, c) => sum + c.enrolled, 0);
    const enrollmentRate = totalCapacity > 0 
      ? ((totalEnrolled / totalCapacity) * 100).toFixed(1)
      : "0.0";

    return {
      yearDistribution,
      gradeDistribution,
      departmentEnrollment,
      averageGPA,
      enrollmentRate,
      totalStudents: students.length,
      totalCourses: courses.length,
      activeStudents: students.filter(s => s.status === "Active").length
    };
  };

  const exportReport = (type) => {
    // Simulated export functionality
    const filename = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
    alert(`Exporting ${type} report as ${filename}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const analytics = getAnalytics();

  // Chart configurations
  const yearChartOptions = {
    chart: { type: 'donut', toolbar: { show: false } },
    labels: Object.keys(analytics.yearDistribution),
    colors: ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'],
    legend: { position: 'bottom' },
    plotOptions: {
      pie: { donut: { size: '60%' } }
    }
  };

  const gradeChartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { categories: Object.keys(analytics.gradeDistribution) },
    colors: ['#059669'],
    plotOptions: {
      bar: { borderRadius: 4, horizontal: false }
    }
  };

  const departmentChartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { 
      categories: Object.keys(analytics.departmentEnrollment),
      labels: { style: { fontSize: '12px' } }
    },
    colors: ['#f59e0b'],
    plotOptions: {
      bar: { borderRadius: 4, horizontal: true }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-lg p-6 card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Institutional insights and data analysis</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="min-w-[150px]"
            >
              <option value="overview">Overview</option>
              <option value="academic">Academic Performance</option>
              <option value="enrollment">Enrollment Analysis</option>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => exportReport(reportType)}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Download" className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={analytics.totalStudents}
          icon="Users"
          change="+5.2%"
          trend="up"
        />
        <StatCard
          title="Active Students"
          value={analytics.activeStudents}
          icon="UserCheck"
          change="+3.1%"
          trend="up"
        />
        <StatCard
          title="Average GPA"
          value={analytics.averageGPA}
          icon="TrendingUp"
          change="+0.15"
          trend="up"
        />
        <StatCard
          title="Enrollment Rate"
          value={`${analytics.enrollmentRate}%`}
          icon="Target"
          change="+2.3%"
          trend="up"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Distribution by Year */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 card-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Student Distribution by Year
          </h3>
          <Chart
            options={yearChartOptions}
            series={Object.values(analytics.yearDistribution)}
            type="donut"
            height={300}
          />
        </motion.div>

        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 card-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Grade Distribution
          </h3>
          <Chart
            options={gradeChartOptions}
            series={[{ data: Object.values(analytics.gradeDistribution) }]}
            type="bar"
            height={300}
          />
        </motion.div>
      </div>

      {/* Department Enrollment Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg p-6 card-shadow"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Enrollment by Department
        </h3>
        <Chart
          options={departmentChartOptions}
          series={[{ data: Object.values(analytics.departmentEnrollment) }]}
          type="bar"
          height={400}
        />
      </motion.div>

      {/* Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Students */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg card-shadow overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Students</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data.students
                .sort((a, b) => b.gpa - a.gpa)
                .slice(0, 5)
                .map((student, index) => (
                  <div key={student.Id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-medium text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{student.major}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-success-600">
                      {student.gpa.toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>

        {/* Course Enrollment Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg card-shadow overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Course Enrollment Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data.courses
                .sort((a, b) => (b.enrolled / b.capacity) - (a.enrolled / a.capacity))
                .slice(0, 5)
                .map((course) => (
                  <div key={course.Id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{course.courseCode}</p>
                      <p className="text-sm text-gray-600">{course.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {course.enrolled}/{course.capacity}
                      </p>
                      <p className="text-sm text-gray-600">
                        {Math.round((course.enrolled / course.capacity) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Reports;