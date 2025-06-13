import booksData from '../mockData/books.json';
import issuesData from '../mockData/issues.json';
import returnsData from '../mockData/returns.json';
import finesData from '../mockData/fines.json';

let books = [...booksData];
let issues = [...issuesData];
let returns = [...returnsData];
let fines = [...finesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const libraryService = {
  // Books management
  async getAllBooks() {
    await delay(300);
    return [...books];
  },

  async getBookById(id) {
    await delay(300);
    const book = books.find(b => b.id === id);
    return book ? { ...book } : null;
  },

  async createBook(bookData) {
    await delay(300);
    const newBook = {
      id: Date.now(),
      ...bookData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    books.push(newBook);
    return { ...newBook };
  },

  async updateBook(id, bookData) {
    await delay(300);
    const index = books.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Book not found');
    
    books[index] = {
      ...books[index],
      ...bookData,
      updatedAt: new Date().toISOString()
    };
    return { ...books[index] };
  },

  async deleteBook(id) {
    await delay(300);
    const index = books.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Book not found');
    
    books.splice(index, 1);
    return true;
  },

  // Issues management
  async getAllIssues() {
    await delay(300);
    return [...issues];
  },

  async getIssueById(id) {
    await delay(300);
    const issue = issues.find(i => i.id === id);
    return issue ? { ...issue } : null;
  },

  async createIssue(issueData) {
    await delay(300);
    const newIssue = {
      id: Date.now(),
      ...issueData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    issues.push(newIssue);
    
    // Update book status to issued
    const bookIndex = books.findIndex(b => b.id === issueData.bookId);
    if (bookIndex !== -1) {
      books[bookIndex].status = 'issued';
    }
    
    return { ...newIssue };
  },

  async updateIssue(id, issueData) {
    await delay(300);
    const index = issues.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Issue not found');
    
    issues[index] = {
      ...issues[index],
      ...issueData,
      updatedAt: new Date().toISOString()
    };
    return { ...issues[index] };
  },

  async deleteIssue(id) {
    await delay(300);
    const index = issues.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Issue not found');
    
    issues.splice(index, 1);
    return true;
  },

  // Returns management
  async getAllReturns() {
    await delay(300);
    return [...returns];
  },

  async getReturnById(id) {
    await delay(300);
    const returnRecord = returns.find(r => r.id === id);
    return returnRecord ? { ...returnRecord } : null;
  },

  async createReturn(returnData) {
    await delay(300);
    const newReturn = {
      id: Date.now(),
      ...returnData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    returns.push(newReturn);
    
    // Update book status back to available
    const bookIndex = books.findIndex(b => b.id === returnData.bookId);
    if (bookIndex !== -1) {
      books[bookIndex].status = 'available';
    }
    
    // Mark issue as returned
    const issueIndex = issues.findIndex(i => i.bookId === returnData.bookId && i.status === 'active');
    if (issueIndex !== -1) {
      issues[issueIndex].status = 'returned';
    }
    
    return { ...newReturn };
  },

  async deleteReturn(id) {
    await delay(300);
    const index = returns.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Return record not found');
    
    returns.splice(index, 1);
    return true;
  },

  // Fines management
  async getAllFines() {
    await delay(300);
    return [...fines];
  },

  async getFineById(id) {
    await delay(300);
    const fine = fines.find(f => f.id === id);
    return fine ? { ...fine } : null;
  },

  async createFine(fineData) {
    await delay(300);
    const newFine = {
      id: Date.now(),
      ...fineData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    fines.push(newFine);
    return { ...newFine };
  },

  async updateFine(id, fineData) {
    await delay(300);
    const index = fines.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Fine not found');
    
    fines[index] = {
      ...fines[index],
      ...fineData,
      updatedAt: new Date().toISOString()
    };
    return { ...fines[index] };
  },

  async deleteFine(id) {
    await delay(300);
    const index = fines.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Fine not found');
    
    fines.splice(index, 1);
    return true;
  }
};

export default libraryService;