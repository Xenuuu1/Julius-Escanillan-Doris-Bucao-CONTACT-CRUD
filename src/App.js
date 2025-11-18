import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', genre: '', year: '', isbn: '', description: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [genreFilter, setGenreFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({ total: 0, genres: 0, latestYear: '' });

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
    setBooks(storedBooks);
    calculateStats(storedBooks);
  }, []);

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
    calculateStats(books);
  }, [books]);

  const calculateStats = (bookList) => {
    const genres = new Set(bookList.map(book => book.genre).filter(Boolean));
    const years = bookList.map(book => book.year).filter(Boolean);
    const latestYear = years.length > 0 ? Math.max(...years) : '';
    
    setStats({
      total: bookList.length,
      genres: genres.size,
      latestYear: latestYear
    });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedBooks = [...books];
      updatedBooks[editIndex] = form;
      setBooks(updatedBooks);
      setEditIndex(null);
    } else {
      setBooks([...books, { ...form, id: Date.now() }]);
    }
    setForm({ title: '', author: '', genre: '', year: '', isbn: '', description: '' });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setForm(books[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter((_, i) => i !== index));
    }
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setForm({ title: '', author: '', genre: '', year: '', isbn: '', description: '' });
    setShowForm(false);
  };

  const sortBooks = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedBooks = [...books].sort((a, b) => {
      const aVal = a[key] || '';
      const bVal = b[key] || '';
      
      if (key === 'year') {
        return direction === 'asc' ? (aVal - bVal) : (bVal - aVal);
      }
      
      if (aVal.toLowerCase() < bVal.toLowerCase()) return direction === 'asc' ? -1 : 1;
      if (aVal.toLowerCase() > bVal.toLowerCase()) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setBooks(sortedBooks);
  };

  const uniqueGenres = ['All', ...new Set(books.map((book) => book.genre).filter(Boolean))];

  const filteredBooks = books
    .filter(
      (book) =>
        (book.title?.toLowerCase().includes(search.toLowerCase()) ||
          book.author?.toLowerCase().includes(search.toLowerCase()) ||
          book.isbn?.includes(search)) &&
        (genreFilter === 'All' || book.genre === genreFilter)
    );

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="library-app">
      {/* Header */}
      <header className="app-header bg-primary text-white shadow">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="mb-0">
                <i className="fas fa-book me-2"></i>
                Library Management System
              </h1>
              <p className="mb-0 opacity-75">Manage your book collection efficiently</p>
            </div>
            <div className="col-md-6 text-md-end">
              <button 
                className={`btn ${showForm ? 'btn-light' : 'btn-warning'}`}
                onClick={() => setShowForm(!showForm)}
              >
                <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} me-2`}></i>
                {showForm ? 'Cancel' : 'Add New Book'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="stats-section py-4 bg-light">
        <div className="container">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="stat-card text-center p-3 bg-white rounded shadow-sm">
                <h3 className="text-primary mb-1">{stats.total}</h3>
                <p className="mb-0 text-muted">Total Books</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card text-center p-3 bg-white rounded shadow-sm">
                <h3 className="text-success mb-1">{stats.genres}</h3>
                <p className="mb-0 text-muted">Genres</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card text-center p-3 bg-white rounded shadow-sm">
                <h3 className="text-info mb-1">{stats.latestYear || 'N/A'}</h3>
                <p className="mb-0 text-muted">Latest Year</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mt-4">
        {/* Add/Edit Book Form */}
        {showForm && (
          <div className="form-section mb-4">
            <div className="card shadow">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">
                  <i className="fas fa-book me-2"></i>
                  {editIndex !== null ? 'Edit Book' : 'Add New Book'}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Title *</label>
                      <input
                        name="title"
                        placeholder="Enter book title"
                        value={form.title}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Author *</label>
                      <input
                        name="author"
                        placeholder="Enter author name"
                        value={form.author}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Genre</label>
                      <input
                        name="genre"
                        placeholder="e.g., Fiction, Science"
                        value={form.genre}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Publication Year</label>
                      <input
                        name="year"
                        placeholder="YYYY"
                        value={form.year}
                        onChange={handleChange}
                        className="form-control"
                        type="number"
                        min="1000"
                        max="2024"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">ISBN</label>
                      <input
                        name="isbn"
                        placeholder="International Standard Book Number"
                        value={form.isbn}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        placeholder="Brief description of the book..."
                        value={form.description}
                        onChange={handleChange}
                        className="form-control"
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="btn btn-success me-2">
                      <i className="fas fa-save me-2"></i>
                      {editIndex !== null ? 'Update Book' : 'Add Book'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                      <i className="fas fa-times me-2"></i>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="search-section mb-4">
          <div className="card shadow">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-6">
                  <label className="form-label">Search Books</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search by title, author, or ISBN..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Filter by Genre</label>
                  <select
                    className="form-select"
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                  >
                    {uniqueGenres.map((genre, index) => (
                      <option key={index} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <div className="d-grid">
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={() => {
                        setSearch('');
                        setGenreFilter('All');
                      }}
                    >
                      <i className="fas fa-refresh me-2"></i>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Books Table */}
        <div className="books-section">
          <div className="card shadow">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Book Catalog ({filteredBooks.length} books)
              </h5>
              {filteredBooks.length > 0 && (
                <small>
                  Showing {filteredBooks.length} of {books.length} books
                </small>
              )}
            </div>
            <div className="card-body p-0">
              {filteredBooks.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No books found</h5>
                  <p className="text-muted">
                    {books.length === 0 
                      ? "Your library is empty. Add your first book!" 
                      : "Try adjusting your search or filter criteria."}
                  </p>
                  {books.length === 0 && (
                    <button 
                      className="btn btn-primary mt-2"
                      onClick={() => setShowForm(true)}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Add First Book
                    </button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th onClick={() => sortBooks('title')} className="sortable-header">
                          Title {getSortIcon('title')}
                        </th>
                        <th onClick={() => sortBooks('author')} className="sortable-header">
                          Author {getSortIcon('author')}
                        </th>
                        <th onClick={() => sortBooks('genre')} className="sortable-header">
                          Genre {getSortIcon('genre')}
                        </th>
                        <th onClick={() => sortBooks('year')} className="sortable-header">
                          Year {getSortIcon('year')}
                        </th>
                        <th>ISBN</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map((book, index) => (
                        <tr key={index} className="book-row">
                          <td>
                            <strong>{book.title}</strong>
                            {book.description && (
                              <small className="d-block text-muted text-truncate" style={{maxWidth: '200px'}}>
                                {book.description}
                              </small>
                            )}
                          </td>
                          <td>{book.author}</td>
                          <td>
                            {book.genre && (
                              <span className="badge bg-primary">{book.genre}</span>
                            )}
                          </td>
                          <td>
                            {book.year && (
                              <span className="text-muted">{book.year}</span>
                            )}
                          </td>
                          <td>
                            {book.isbn && (
                              <small className="font-monospace">{book.isbn}</small>
                            )}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleEdit(index)}
                                title="Edit book"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(index)}
                                title="Delete book"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer mt-5 py-3 bg-dark text-white text-center">
        <div className="container">
          <p className="mb-0">
            <i className="fas fa-library me-2"></i>
            Library Management System &copy; 2024
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;