const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'grade_c';

// Field visibility mapping for grade_c table
const UPDATEABLE_FIELDS = [
  'Name', 'Tags', 'grade_c', 'points_c', 'semester_c', 'year_c', 
  'date_entered_c', 'student_id_c', 'course_id_c'
];

const ALL_FIELDS = [
  'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'grade_c', 'points_c', 'semester_c', 'year_c', 'date_entered_c', 
  'student_id_c', 'course_id_c'
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
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
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to fetch grades");
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ALL_FIELDS.map(field => ({ field: { Name: field } }))
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error(`Grade with ID ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Grade not found");
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
      console.error(`Error fetching grades for student ${studentId}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to fetch student grades");
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
      console.error(`Error fetching grades for course ${courseId}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to fetch course grades");
    }
  },

  async create(gradeData) {
    try {
      // Only include updateable fields
      const createData = {
        Name: `${gradeData.grade_c || gradeData.grade || ''} - ${gradeData.semester_c || gradeData.semester || ''} ${gradeData.year_c || gradeData.year || ''}`,
        grade_c: gradeData.grade_c || gradeData.grade,
        points_c: parseFloat(gradeData.points_c || gradeData.points || 0),
        semester_c: gradeData.semester_c || gradeData.semester,
        year_c: parseInt(gradeData.year_c || gradeData.year || new Date().getFullYear()),
        date_entered_c: gradeData.date_entered_c || gradeData.dateEntered || new Date().toISOString().split("T")[0],
        student_id_c: parseInt(gradeData.student_id_c || gradeData.studentId),
        course_id_c: parseInt(gradeData.course_id_c || gradeData.courseId)
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
          console.error(`Failed to create ${failed.length} grades:`, failed);
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
      console.error("Error creating grade:", error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to create grade");
    }
  },

  async update(id, gradeData) {
    try {
      // Only include updateable fields
      const updateFields = {
        Id: parseInt(id),
        Name: `${gradeData.grade_c || gradeData.grade || ''} - ${gradeData.semester_c || gradeData.semester || ''} ${gradeData.year_c || gradeData.year || ''}`,
        grade_c: gradeData.grade_c || gradeData.grade,
        points_c: parseFloat(gradeData.points_c || gradeData.points),
        semester_c: gradeData.semester_c || gradeData.semester,
        year_c: parseInt(gradeData.year_c || gradeData.year),
        student_id_c: parseInt(gradeData.student_id_c || gradeData.studentId),
        course_id_c: parseInt(gradeData.course_id_c || gradeData.courseId)
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
          console.error(`Failed to update ${failed.length} grades:`, failed);
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
      console.error(`Error updating grade ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to update grade");
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
          console.error(`Failed to delete ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error(`Error deleting grade ${id}:`, error?.response?.data?.message || error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to delete grade");
    }
  }
};