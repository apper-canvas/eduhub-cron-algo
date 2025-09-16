import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";

const Schedule = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM"
  ];

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError(err.message || "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const getCoursesForTimeSlot = (day, timeSlot) => {
    return courses.filter(course => 
      course.schedule.days.includes(day) && 
      course.schedule.time === timeSlot
    );
  };

  const getFilteredCourses = () => {
    if (selectedDay === "all") {
      return courses;
    }
    return courses.filter(course => course.schedule.days.includes(selectedDay));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  const filteredCourses = getFilteredCourses();

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
            <h1 className="text-2xl font-bold text-gray-900">Class Schedule</h1>
            <p className="text-gray-600 mt-1">View course schedules and room assignments</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Filter by day:</span>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedDay === "all" ? "primary" : "outline"}
                onClick={() => setSelectedDay("all")}
              >
                All Days
              </Button>
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  size="sm"
                  variant={selectedDay === day ? "primary" : "outline"}
                  onClick={() => setSelectedDay(day)}
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      {selectedDay === "all" ? (
        <div className="bg-white rounded-lg card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Time
                  </th>
                  {daysOfWeek.map((day) => (
                    <th
                      key={day}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                      {timeSlot}
                    </td>
                    {daysOfWeek.map((day) => {
                      const coursesInSlot = getCoursesForTimeSlot(day, timeSlot);
                      return (
                        <td key={`${day}-${timeSlot}`} className="px-6 py-4 text-sm">
                          {coursesInSlot.length > 0 ? (
                            <div className="space-y-2">
                              {coursesInSlot.map((course) => (
                                <motion.div
                                  key={course.Id}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="bg-primary-50 border border-primary-200 rounded-lg p-3 hover:bg-primary-100 transition-colors duration-200"
                                >
                                  <div className="font-medium text-primary-900">
                                    {course.courseCode}
                                  </div>
                                  <div className="text-xs text-primary-700 mb-1">
                                    {course.title}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="primary" className="text-xs">
                                      {course.room}
                                    </Badge>
                                    <span className="text-xs text-primary-600">
                                      {course.enrolled}/{course.capacity}
                                    </span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-400 italic text-center">
                              No classes
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* List View for Selected Day */
        <div className="bg-white rounded-lg card-shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDay} Schedule
            </h3>
          </div>
          
          {filteredCourses.length === 0 ? (
            <Empty
              title={`No classes on ${selectedDay}`}
              description="There are no courses scheduled for this day"
              icon="Calendar"
            />
          ) : (
            <div className="p-6">
              <div className="grid gap-4">
                {filteredCourses
                  .sort((a, b) => a.schedule.time.localeCompare(b.schedule.time))
                  .map((course, index) => (
                    <motion.div
                      key={course.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-12 bg-primary-500 rounded-full"></div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {course.courseCode} - {course.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {course.instructor}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-gray-500">
                                  <ApperIcon name="Clock" className="w-4 h-4 inline mr-1" />
                                  {course.schedule.time}
                                </span>
                                <span className="text-sm text-gray-500">
                                  <ApperIcon name="MapPin" className="w-4 h-4 inline mr-1" />
                                  {course.room}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="primary">
                            {course.enrolled}/{course.capacity}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {course.credits} Credits
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-5 h-5 text-accent-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Time Slots Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(courses.map(c => c.schedule.time)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="MapPin" className="w-5 h-5 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rooms Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(courses.map(c => c.room)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Schedule;