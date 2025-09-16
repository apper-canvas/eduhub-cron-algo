import mockDocuments from '@/services/mockData/documents.json';

// Simulate async operations with realistic delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for documents (simulates database)
let documents = [...mockDocuments];
let nextId = Math.max(...documents.map(doc => doc.Id), 0) + 1;

export const documentService = {
  // Get all documents
  async getAll() {
    await delay(300);
    return [...documents];
  },

  // Get document by ID
  async getById(id) {
    await delay(200);
    const document = documents.find(doc => doc.Id === parseInt(id));
    if (!document) {
      throw new Error(`Document with ID ${id} not found`);
    }
    return { ...document };
  },

  // Get documents by student ID
  async getByStudentId(studentId) {
    await delay(300);
    return documents
      .filter(doc => doc.studentId === parseInt(studentId))
      .map(doc => ({ ...doc }));
  },

  // Get documents by category
  async getByCategory(category) {
    await delay(300);
    return documents
      .filter(doc => doc.category === category)
      .map(doc => ({ ...doc }));
  },

  // Create new document
  async create(documentData) {
    await delay(500);
    
    const newDocument = {
      Id: nextId++,
      title: documentData.title,
      description: documentData.description || "",
      category: documentData.category,
      studentId: parseInt(documentData.studentId),
      fileName: documentData.fileName,
      fileSize: documentData.fileSize,
      fileType: documentData.fileType,
      fileUrl: documentData.fileUrl,
      uploadDate: documentData.uploadDate || new Date().toISOString(),
      status: documentData.status || "Active",
      uploadedBy: "System", // In real app, this would be current user
      lastModified: new Date().toISOString()
    };

    documents.unshift(newDocument);
    return { ...newDocument };
  },

  // Update document
  async update(id, updateData) {
    await delay(400);
    
    const index = documents.findIndex(doc => doc.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Document with ID ${id} not found`);
    }

    const updatedDocument = {
      ...documents[index],
      ...updateData,
      Id: parseInt(id), // Ensure ID doesn't change
      studentId: parseInt(updateData.studentId || documents[index].studentId),
      lastModified: new Date().toISOString()
    };

    documents[index] = updatedDocument;
    return { ...updatedDocument };
  },

  // Delete document
  async delete(id) {
    await delay(300);
    
    const index = documents.findIndex(doc => doc.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Document with ID ${id} not found`);
    }

    const deletedDocument = documents[index];
    documents.splice(index, 1);
    return { ...deletedDocument };
  },

  // Update document status
  async updateStatus(id, status) {
    await delay(200);
    
    const document = documents.find(doc => doc.Id === parseInt(id));
    if (!document) {
      throw new Error(`Document with ID ${id} not found`);
    }

    document.status = status;
    document.lastModified = new Date().toISOString();
    return { ...document };
  },

  // Archive document
  async archive(id) {
    return this.updateStatus(id, 'Archived');
  },

  // Search documents
  async search(query, filters = {}) {
    await delay(300);
    
    let results = documents.filter(doc => {
      const searchText = `${doc.title} ${doc.description} ${doc.fileName}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    // Apply filters
    if (filters.category) {
      results = results.filter(doc => doc.category === filters.category);
    }
    
    if (filters.studentId) {
      results = results.filter(doc => doc.studentId === parseInt(filters.studentId));
    }
    
    if (filters.status) {
      results = results.filter(doc => doc.status === filters.status);
    }

    return results.map(doc => ({ ...doc }));
  },

  // Get document statistics
  async getStats() {
    await delay(200);
    
    const total = documents.length;
    const byCategory = documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {});
    
    const byStatus = documents.reduce((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    }, {});

    const totalSize = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);

    return {
      total,
      byCategory,
      byStatus,
      totalSize,
      averageSize: total > 0 ? totalSize / total : 0
    };
  }
};