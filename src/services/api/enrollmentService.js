import enrollmentsData from "@/services/mockData/enrollments.json";

let enrollments = [...enrollmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const enrollmentService = {
  async getAll() {
    await delay(300);
    return [...enrollments];
  },

  async getById(id) {
    await delay(200);
    const enrollment = enrollments.find(e => e.Id === parseInt(id));
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    return { ...enrollment };
  },

  async getByStudentId(studentId) {
    await delay(250);
    return enrollments.filter(enrollment => enrollment.studentId === studentId.toString());
  },

  async getByCourseId(courseId) {
    await delay(250);
    return enrollments.filter(enrollment => enrollment.courseId === courseId.toString());
  },

  async create(enrollmentData) {
    await delay(500);
    const newId = Math.max(...enrollments.map(e => e.Id)) + 1;
    const newEnrollment = {
      ...enrollmentData,
      Id: newId,
      enrollmentDate: new Date().toISOString().split("T")[0],
      attendance: 100
    };
    enrollments.push(newEnrollment);
    return { ...newEnrollment };
  },

  async update(id, enrollmentData) {
    await delay(400);
    const index = enrollments.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Enrollment not found");
    }
    enrollments[index] = { ...enrollments[index], ...enrollmentData };
    return { ...enrollments[index] };
  },

  async delete(id) {
    await delay(300);
    const index = enrollments.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Enrollment not found");
    }
    const deletedEnrollment = enrollments.splice(index, 1)[0];
    return { ...deletedEnrollment };
  }
};