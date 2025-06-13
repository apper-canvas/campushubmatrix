import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import DataTable from '@/components/molecules/DataTable';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import libraryService from '@/services/api/libraryService';

const Library = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [returns, setReturns] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // add, edit, view
  const [selectedItem, setSelectedItem] = useState(null);

  const tabs = [
    { id: 'books', label: 'Books', icon: 'Book', count: books.length },
    { id: 'issues', label: 'Issues', icon: 'ArrowUpRight', count: issues.filter(i => i.status === 'active').length },
    { id: 'returns', label: 'Returns', icon: 'ArrowDownLeft', count: returns.length },
    { id: 'fines', label: 'Fines', icon: 'AlertCircle', count: fines.filter(f => f.status === 'pending').length }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [booksData, issuesData, returnsData, finesData] = await Promise.all([
        libraryService.getAllBooks(),
        libraryService.getAllIssues(),
        libraryService.getAllReturns(),
        libraryService.getAllFines()
      ]);
      setBooks(booksData);
      setIssues(issuesData);
      setReturns(returnsData);
      setFines(finesData);
    } catch (err) {
      setError('Failed to load library data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalType('edit');
    setShowModal(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setModalType('view');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      switch (activeTab) {
        case 'books':
          await libraryService.deleteBook(id);
          setBooks(prev => prev.filter(book => book.id !== id));
          toast.success('Book deleted successfully');
          break;
        case 'issues':
          await libraryService.deleteIssue(id);
          setIssues(prev => prev.filter(issue => issue.id !== id));
          toast.success('Issue record deleted successfully');
          break;
        case 'returns':
          await libraryService.deleteReturn(id);
          setReturns(prev => prev.filter(ret => ret.id !== id));
          toast.success('Return record deleted successfully');
          break;
        case 'fines':
          await libraryService.deleteFine(id);
          setFines(prev => prev.filter(fine => fine.id !== id));
          toast.success('Fine record deleted successfully');
          break;
      }
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      switch (activeTab) {
        case 'books':
          if (modalType === 'add') {
            const newBook = await libraryService.createBook(formData);
            setBooks(prev => [...prev, newBook]);
            toast.success('Book added successfully');
          } else {
            const updatedBook = await libraryService.updateBook(selectedItem.id, formData);
            setBooks(prev => prev.map(book => book.id === selectedItem.id ? updatedBook : book));
            toast.success('Book updated successfully');
          }
          break;
        case 'issues':
          if (modalType === 'add') {
            const newIssue = await libraryService.createIssue(formData);
            setIssues(prev => [...prev, newIssue]);
            toast.success('Book issued successfully');
          } else {
            const updatedIssue = await libraryService.updateIssue(selectedItem.id, formData);
            setIssues(prev => prev.map(issue => issue.id === selectedItem.id ? updatedIssue : issue));
            toast.success('Issue updated successfully');
          }
          break;
        case 'returns':
          if (modalType === 'add') {
            const newReturn = await libraryService.createReturn(formData);
            setReturns(prev => [...prev, newReturn]);
            toast.success('Return processed successfully');
          }
          break;
        case 'fines':
          if (modalType === 'add') {
            const newFine = await libraryService.createFine(formData);
            setFines(prev => [...prev, newFine]);
            toast.success('Fine added successfully');
          } else {
            const updatedFine = await libraryService.updateFine(selectedItem.id, formData);
            setFines(prev => prev.map(fine => fine.id === selectedItem.id ? updatedFine : fine));
            toast.success('Fine updated successfully');
          }
          break;
      }
      setShowModal(false);
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const getFilteredData = () => {
    let data = [];
    switch (activeTab) {
      case 'books':
        data = books;
        break;
      case 'issues':
        data = issues;
        break;
      case 'returns':
        data = returns;
        break;
      case 'fines':
        data = fines;
        break;
    }

    if (!searchQuery) return data;
    return data.filter(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
)
    );
  };

  const getColumns = () => {
  const getColumns = () => {
    switch (activeTab) {
      case 'books':
        return [
          { key: 'title', header: 'Title' },
          { key: 'author', header: 'Author' },
          { key: 'isbn', header: 'ISBN' },
          { key: 'category', header: 'Category' },
          { key: 'status', header: 'Status', render: (value) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === 'available' ? 'bg-success/10 text-success' :
              value === 'issued' ? 'bg-warning/10 text-warning' :
              'bg-error/10 text-error'
            }`}>
              {value}
            </span>
          )}
        ];
      case 'issues':
        return [
          { key: 'book_title', header: 'Book' },
          { key: 'student_name', header: 'Student' },
          { key: 'issue_date', header: 'Issue Date', render: (value) => {
            if (!value) return 'No date';
            try {
              const date = new Date(value);
              return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'MMM dd, yyyy');
            } catch (error) {
              return 'Invalid date';
            }
          }},
          { key: 'due_date', header: 'Due Date', render: (value) => {
            if (!value) return 'No date';
            try {
              const date = new Date(value);
              return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'MMM dd, yyyy');
            } catch (error) {
              return 'Invalid date';
            }
          }},
          { key: 'status', header: 'Status', render: (value) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === 'active' ? 'bg-success/10 text-success' :
              value === 'overdue' ? 'bg-error/10 text-error' :
              'bg-surface/10 text-surface'
            }`}>
              {value || 'unknown'}
            </span>
          )}
        ];
      case 'returns':
        return [
          { key: 'book_title', header: 'Book' },
          { key: 'student_name', header: 'Student' },
          { key: 'return_date', header: 'Return Date', render: (value) => {
            if (!value) return 'No date';
            try {
              const date = new Date(value);
              return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'MMM dd, yyyy');
            } catch (error) {
              return 'Invalid date';
            }
          }},
          { key: 'days_late', header: 'Days Late' },
          { key: 'fine_amount', header: 'Fine', render: (value) => value > 0 ? `$${value}` : '-' }
        ];
      case 'fines':
        return [
          { key: 'student_name', header: 'Student' },
          { key: 'reason', header: 'Reason' },
          { key: 'amount', header: 'Amount', render: (value) => `$${value || 0}` },
          { key: 'due_date', header: 'Due Date', render: (value) => {
            if (!value) return 'No date';
            try {
              const date = new Date(value);
              return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'MMM dd, yyyy');
            } catch (error) {
              return 'Invalid date';
            }
          }},
          { key: 'status', header: 'Status', render: (value) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === 'paid' ? 'bg-success/10 text-success' :
              value === 'pending' ? 'bg-warning/10 text-warning' :
              'bg-error/10 text-error'
            }`}>
              {value || 'unknown'}
            </span>
          )}
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  const filteredData = getFilteredData();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-surface-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-surface-900">Library Management</h1>
              <p className="text-surface-600 mt-1">Manage books, track issues, process returns, and handle fines</p>
            </div>
            <Button
              onClick={handleAdd}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add {activeTab.slice(0, -1)}
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-surface-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${activeTab}...`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredData.length === 0 ? (
          <EmptyState
            icon={tabs.find(tab => tab.id === activeTab)?.icon || 'Book'}
            title={`No ${activeTab} found`}
            description={searchQuery ? 'Try adjusting your search criteria' : `No ${activeTab} have been added yet`}
            actionLabel={`Add ${activeTab.slice(0, -1)}`}
            onAction={handleAdd}
          />
        ) : (
          <DataTable
            data={filteredData}
            columns={getColumns()}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <LibraryModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            type={activeTab}
            mode={modalType}
            item={selectedItem}
            onSubmit={handleSubmit}
            books={books}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const LibraryModal = ({ isOpen, onClose, type, mode, item, onSubmit, books }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item && mode !== 'add') {
      setFormData(item);
    } else {
      // Initialize form data based on type
      switch (type) {
        case 'books':
          setFormData({ title: '', author: '', isbn: '', category: '', status: 'available', location: '' });
          break;
        case 'issues':
          setFormData({ bookId: '', studentName: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '', status: 'active' });
          break;
        case 'returns':
          setFormData({ bookId: '', studentName: '', returnDate: new Date().toISOString().split('T')[0], condition: 'good' });
          break;
        case 'fines':
          setFormData({ studentName: '', reason: '', amount: 0, dueDate: '', status: 'pending' });
          break;
      }
    }
  }, [item, mode, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderForm = () => {
    switch (type) {
      case 'books':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={mode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={mode === 'view'}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">ISBN</label>
                <input
                  type="text"
                  value={formData.isbn || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={mode === 'view'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">Category</label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={mode === 'view'}
                >
                  <option value="">Select Category</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="academic">Academic</option>
                  <option value="reference">Reference</option>
                </select>
              </div>
            </div>
          </>
        );
      default:
        return <div>Form not implemented for {type}</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-surface-900">
              {mode === 'add' ? 'Add' : mode === 'edit' ? 'Edit' : 'View'} {type.slice(0, -1)}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {renderForm()}
            
            {mode !== 'view' && (
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {mode === 'add' ? 'Add' : 'Update'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Library;