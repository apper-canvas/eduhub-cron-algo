import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import TableHeader from "@/components/molecules/TableHeader";
import Pagination from "@/components/molecules/Pagination";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { documentService } from "@/services/api/documentService";
import { studentService } from "@/services/api/studentService";
import DocumentModal from "@/components/organisms/DocumentModal";

const Documents = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStudentId = queryParams.get('studentId');

  const [documents, setDocuments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const itemsPerPage = 10;

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [documentsData, studentsData] = await Promise.all([
        documentService.getAll(),
        studentService.getAll()
      ]);
      
      setDocuments(documentsData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : `Student ID: ${studentId}`;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddDocument = () => {
    setSelectedDocument(null);
    setIsModalOpen(true);
  };

  const handleEditDocument = (document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleDeleteDocument = async (documentId) => {
    if (confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      try {
        await documentService.delete(documentId);
        setDocuments(prev => prev.filter(doc => doc.Id !== documentId));
        toast.success("Document deleted successfully");
      } catch (err) {
        toast.error(err.message || "Failed to delete document");
      }
    }
  };

  const handleDownload = (document) => {
    // Simulate document download
    const link = document.createElement('a');
    link.href = document.fileUrl;
    link.download = document.fileName;
    link.click();
    toast.success("Document download started");
  };

  const handleModalSave = async (documentData) => {
    try {
      if (selectedDocument) {
        const updatedDocument = await documentService.update(selectedDocument.Id, documentData);
        setDocuments(prev => prev.map(doc => 
          doc.Id === selectedDocument.Id ? updatedDocument : doc
        ));
        toast.success("Document updated successfully");
      } else {
        const newDocument = await documentService.create(documentData);
        setDocuments(prev => [newDocument, ...prev]);
        toast.success("Document uploaded successfully");
      }
      setIsModalOpen(false);
      setSelectedDocument(null);
    } catch (err) {
      toast.error(err.message || "Failed to save document");
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = 
      document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getStudentName(document.studentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || document.category === selectedCategory;
    const matchesStudent = !selectedStudentId || document.studentId.toString() === selectedStudentId;
    
    return matchesSearch && matchesCategory && matchesStudent;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);

  const getCategoryBadgeVariant = (category) => {
    switch (category) {
      case 'Transcript': return 'primary';
      case 'Certificate': return 'success';
      case 'Report Card': return 'info';
      case 'Diploma': return 'warning';
      case 'Letter': return 'default';
      default: return 'default';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Archived': return 'warning';
      case 'Pending': return 'info';
      default: return 'default';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-lg card-shadow">
        <TableHeader
          title="Document Management"
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          onAdd={handleAddDocument}
          addLabel="Upload Document"
        >
          <Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="min-w-[150px]"
          >
            <option value="">All Categories</option>
            <option value="Transcript">Transcripts</option>
            <option value="Certificate">Certificates</option>
            <option value="Report Card">Report Cards</option>
            <option value="Diploma">Diplomas</option>
            <option value="Letter">Letters</option>
            <option value="Other">Other</option>
          </Select>
          
          <Select
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              setCurrentPage(1);
            }}
            className="min-w-[200px]"
          >
            <option value="">All Students</option>
            {students.map(student => (
              <option key={student.Id} value={student.Id}>
                {student.firstName} {student.lastName} - {student.studentId}
              </option>
            ))}
          </Select>
        </TableHeader>

        {/* Content */}
        {filteredDocuments.length === 0 ? (
          <Empty 
            message="No documents found"
            description="Upload your first document to get started"
            actionLabel="Upload Document"
            onAction={handleAddDocument}
          />
        ) : (
          <>
            {/* Documents Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
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
                  {paginatedDocuments.map((document, index) => (
                    <motion.tr
                      key={document.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                              <ApperIcon name="FileText" className="w-5 h-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {document.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {document.fileName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getStudentName(document.studentId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getCategoryBadgeVariant(document.category)}>
                          {document.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{document.fileType.toUpperCase()}</div>
                        <div>{formatFileSize(document.fileSize)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(document.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(document.status)}>
                          {document.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownload(document)}
                            title="Download"
                          >
                            <ApperIcon name="Download" className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(document.fileUrl, '_blank')}
                            title="View"
                          >
                            <ApperIcon name="Eye" className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditDocument(document)}
                            title="Edit"
                          >
                            <ApperIcon name="Edit" className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteDocument(document.Id)}
                            title="Delete"
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

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredDocuments.length}
            />
          </>
        )}
      </div>

      {/* Document Modal */}
      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        document={selectedDocument}
        students={students}
        defaultStudentId={initialStudentId}
      />
    </motion.div>
  );
};

export default Documents;