const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'enrollment_c';

// Field visibility mapping for enrollment_c table
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'enrollment_date_c', 'status_c', 'attendance_c', 
  'student_id_c', 'course_id_c'
];

const ALL_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'enrollment_date_c', 'status_c', 'attendance_c', 'student_id_c', 'course_id_c'
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const enrollmentService = {
  async getAll() {
    try {
      const params = {
        fields: ALL_FIELDS.map(field => ({ field: { Name: field } })),
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching enrollments:", error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to fetch enrollments");
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ALL_FIELDS.map(field => ({ field: { Name: field } }))
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Enrollment with ID ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollment ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Enrollment not found");
    }
  },

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: ALL_FIELDS.map(field => ({ field: { Name: field } })),
        where: [{ FieldName: "student_id_c", Operator: "EqualTo", Values: [parseInt(studentId)] }],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching enrollments for student ${studentId}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to fetch student enrollments");
    }
  },

  async getByCourseId(courseId) {
    try {
      const params = {
        fields: ALL_FIELDS.map(field => ({ field: { Name: field } })),
        where: [{ FieldName: "course_id_c", Operator: "EqualTo", Values: [parseInt(courseId)] }],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching enrollments for course ${courseId}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to fetch course enrollments");
    }
  },

  async create(enrollmentData) {
    try {
      // Only include updateable fields
      const createData = {
        Name: `Enrollment - ${enrollmentData.enrollment_date_c || enrollmentData.enrollmentDate || new Date().toISOString().split("T")[0]}`,
        enrollment_date_c: enrollmentData.enrollment_date_c || enrollmentData.enrollmentDate || new Date().toISOString().split("T")[0],
        status_c: enrollmentData.status_c || enrollmentData.status || "Enrolled",
        attendance_c: parseInt(enrollmentData.attendance_c || enrollmentData.attendance || 100),
        student_id_c: parseInt(enrollmentData.student_id_c || enrollmentData.studentId),
        course_id_c: parseInt(enrollmentData.course_id_c || enrollmentData.courseId)
      };

      const params = { records: [createData] };

      const response = await apperClient.createRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} enrollments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating enrollment:", error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to create enrollment");
    }
  },

  async update(id, enrollmentData) {
    try {
      // Only include updateable fields
      const updateFields = {
        Id: parseInt(id),
        Name: `Enrollment - ${enrollmentData.enrollment_date_c || enrollmentData.enrollmentDate || ''}`,
        enrollment_date_c: enrollmentData.enrollment_date_c || enrollmentData.enrollmentDate,
        status_c: enrollmentData.status_c || enrollmentData.status,
        attendance_c: parseInt(enrollmentData.attendance_c || enrollmentData.attendance || 0),
        student_id_c: parseInt(enrollmentData.student_id_c || enrollmentData.studentId),
        course_id_c: parseInt(enrollmentData.course_id_c || enrollmentData.courseId)
      };

      const params = { records: [updateFields] };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} enrollments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error(`Error updating enrollment ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to update enrollment");
    }
  },

  async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} enrollments:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error(`Error deleting enrollment ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to delete enrollment");
    }
  }
};