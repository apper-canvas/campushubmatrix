const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const libraryService = {
  // Books management
  async getAllBooks() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        "Fields": ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'author', 'isbn', 'category', 'status', 'location', 'published_year', 'edition', 'pages', 'language']
      };

      const response = await apperClient.fetchRecords('book', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  async getBookById(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'author', 'isbn', 'category', 'status', 'location', 'published_year', 'edition', 'pages', 'language']
      };

      const response = await apperClient.getRecordById('book', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching book with ID ${id}:`, error);
      throw error;
    }
  },

  async createBook(bookData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: bookData.title || bookData.Name,
          title: bookData.title,
          author: bookData.author,
          isbn: bookData.isbn,
          category: bookData.category,
          status: bookData.status || 'available',
          location: bookData.location,
          published_year: bookData.published_year || bookData.publishedYear,
          edition: bookData.edition,
          pages: bookData.pages,
          language: bookData.language || 'English'
        }]
      };

      const response = await apperClient.createRecord('book', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  },

  async updateBook(id, bookData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          Name: bookData.title || bookData.Name,
          title: bookData.title,
          author: bookData.author,
          isbn: bookData.isbn,
          category: bookData.category,
          status: bookData.status,
          location: bookData.location,
          published_year: bookData.published_year || bookData.publishedYear,
          edition: bookData.edition,
          pages: bookData.pages,
          language: bookData.language
        }]
      };

      const response = await apperClient.updateRecord('book', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  },

  async deleteBook(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('book', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  },

  // Issues management
  async getAllIssues() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        "Fields": ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'book_title', 'student_name', 'issue_date', 'due_date', 'status', 'renewal_count', 'max_renewals', 'notes', 'book_id']
      };

      const response = await apperClient.fetchRecords('issue', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching issues:", error);
      throw error;
    }
  },

  async getIssueById(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'book_title', 'student_name', 'issue_date', 'due_date', 'status', 'renewal_count', 'max_renewals', 'notes', 'book_id']
      };

      const response = await apperClient.getRecordById('issue', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching issue with ID ${id}:`, error);
      throw error;
    }
  },

  async createIssue(issueData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: issueData.book_title || issueData.bookTitle || issueData.Name,
          book_title: issueData.book_title || issueData.bookTitle,
          student_name: issueData.student_name || issueData.studentName,
          issue_date: issueData.issue_date || issueData.issueDate,
          due_date: issueData.due_date || issueData.dueDate,
          status: issueData.status || 'active',
          renewal_count: issueData.renewal_count || issueData.renewalCount || 0,
          max_renewals: issueData.max_renewals || issueData.maxRenewals || 2,
          notes: issueData.notes,
          book_id: parseInt(issueData.book_id || issueData.bookId)
        }]
      };

      const response = await apperClient.createRecord('issue', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating issue:", error);
      throw error;
    }
  },

  async updateIssue(id, issueData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          Name: issueData.book_title || issueData.bookTitle || issueData.Name,
          book_title: issueData.book_title || issueData.bookTitle,
          student_name: issueData.student_name || issueData.studentName,
          issue_date: issueData.issue_date || issueData.issueDate,
          due_date: issueData.due_date || issueData.dueDate,
          status: issueData.status,
          renewal_count: issueData.renewal_count || issueData.renewalCount,
          max_renewals: issueData.max_renewals || issueData.maxRenewals,
          notes: issueData.notes,
          book_id: parseInt(issueData.book_id || issueData.bookId)
        }]
      };

      const response = await apperClient.updateRecord('issue', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating issue:", error);
      throw error;
    }
  },

  async deleteIssue(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('issue', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting issue:", error);
      throw error;
    }
  },

  // Returns management
  async getAllReturns() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        "Fields": ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'issue_id', 'book_title', 'student_name', 'return_date', 'due_date', 'days_late', 'condition', 'fine_amount', 'librarian', 'notes', 'book_id']
      };

      const response = await apperClient.fetchRecords('return', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching returns:", error);
      throw error;
    }
  },

  async getReturnById(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'issue_id', 'book_title', 'student_name', 'return_date', 'due_date', 'days_late', 'condition', 'fine_amount', 'librarian', 'notes', 'book_id']
      };

      const response = await apperClient.getRecordById('return', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching return with ID ${id}:`, error);
      throw error;
    }
  },

  async createReturn(returnData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: returnData.book_title || returnData.bookTitle || returnData.Name,
          issue_id: returnData.issue_id || returnData.issueId,
          book_title: returnData.book_title || returnData.bookTitle,
          student_name: returnData.student_name || returnData.studentName,
          return_date: returnData.return_date || returnData.returnDate,
          due_date: returnData.due_date || returnData.dueDate,
          days_late: returnData.days_late || returnData.daysLate || 0,
          condition: returnData.condition || 'good',
          fine_amount: returnData.fine_amount || returnData.fineAmount || 0,
          librarian: returnData.librarian || 'Library Staff',
          notes: returnData.notes,
          book_id: parseInt(returnData.book_id || returnData.bookId)
        }]
      };

      const response = await apperClient.createRecord('return', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating return:", error);
      throw error;
    }
  },

  async deleteReturn(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('return', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting return:", error);
      throw error;
    }
  },

  // Fines management
  async getAllFines() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        "Fields": ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'student_id', 'student_name', 'book_id', 'book_title', 'reason', 'amount', 'due_date', 'status', 'issued_date', 'payment_date', 'payment_method', 'notes']
      };

      const response = await apperClient.fetchRecords('fine', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching fines:", error);
      throw error;
    }
  },

  async getFineById(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'student_id', 'student_name', 'book_id', 'book_title', 'reason', 'amount', 'due_date', 'status', 'issued_date', 'payment_date', 'payment_method', 'notes']
      };

      const response = await apperClient.getRecordById('fine', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching fine with ID ${id}:`, error);
      throw error;
    }
  },

  async createFine(fineData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: fineData.student_name || fineData.studentName || fineData.Name,
          student_id: parseInt(fineData.student_id || fineData.studentId),
          student_name: fineData.student_name || fineData.studentName,
          book_id: parseInt(fineData.book_id || fineData.bookId),
          book_title: fineData.book_title || fineData.bookTitle,
          reason: fineData.reason,
          amount: fineData.amount,
          due_date: fineData.due_date || fineData.dueDate,
          status: fineData.status || 'pending',
          issued_date: fineData.issued_date || fineData.issuedDate,
          payment_date: fineData.payment_date || fineData.paymentDate,
          payment_method: fineData.payment_method || fineData.paymentMethod,
          notes: fineData.notes
        }]
      };

      const response = await apperClient.createRecord('fine', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating fine:", error);
      throw error;
    }
  },

  async updateFine(id, fineData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          Name: fineData.student_name || fineData.studentName || fineData.Name,
          student_id: parseInt(fineData.student_id || fineData.studentId),
          student_name: fineData.student_name || fineData.studentName,
          book_id: parseInt(fineData.book_id || fineData.bookId),
          book_title: fineData.book_title || fineData.bookTitle,
          reason: fineData.reason,
          amount: fineData.amount,
          due_date: fineData.due_date || fineData.dueDate,
          status: fineData.status,
          issued_date: fineData.issued_date || fineData.issuedDate,
          payment_date: fineData.payment_date || fineData.paymentDate,
          payment_method: fineData.payment_method || fineData.paymentMethod,
          notes: fineData.notes
        }]
      };

      const response = await apperClient.updateRecord('fine', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating fine:", error);
      throw error;
    }
  },

  async deleteFine(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('fine', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting fine:", error);
      throw error;
    }
  }
};

export default libraryService;