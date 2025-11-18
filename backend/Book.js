const db = require('../config/db');

class Book {
  // Get all books with filtering
  static async findAll({ search = '', genre = '' } = {}) {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (title LIKE ? OR author LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (genre && genre !== 'All') {
      whereClause += ' AND genre = ?';
      params.push(genre);
    }

    const query = `
      SELECT * FROM books 
      ${whereClause}
      ORDER BY title ASC
    `;

    try {
      const [books] = await db.execute(query, params);
      return books;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Find book by ID
  static async findById(id) {
    const query = 'SELECT * FROM books WHERE id = ?';
    try {
      const [books] = await db.execute(query, [id]);
      return books[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Create new book
  static async create(bookData) {
    const { title, author, genre, year, isbn, description } = bookData;

    const query = `
      INSERT INTO books (title, author, genre, year, isbn, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [title, author, genre, year, isbn, description];

    try {
      const [result] = await db.execute(query, params);
      return { id: result.insertId, ...bookData };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Update book
  static async update(id, bookData) {
    const fields = [];
    const params = [];

    Object.keys(bookData).forEach(key => {
      if (bookData[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(bookData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    params.push(id);

    const query = `UPDATE books SET ${fields.join(', ')} WHERE id = ?`;

    try {
      const [result] = await db.execute(query, params);
      if (result.affectedRows === 0) {
        throw new Error('Book not found');
      }
      return this.findById(id);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Delete book
  static async delete(id) {
    const query = 'DELETE FROM books WHERE id = ?';
    try {
      const [result] = await db.execute(query, [id]);
      if (result.affectedRows === 0) {
        throw new Error('Book not found');
      }
      return true;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Get statistics
  static async getStats() {
    try {
      const [totalBooks] = await db.execute('SELECT COUNT(*) as count FROM books');
      const [genres] = await db.execute('SELECT COUNT(DISTINCT genre) as count FROM books WHERE genre IS NOT NULL AND genre != ""');
      const [latestYear] = await db.execute('SELECT MAX(year) as latest FROM books WHERE year IS NOT NULL');

      return {
        totalBooks: totalBooks[0].count,
        totalGenres: genres[0].count,
        latestYear: latestYear[0].latest
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Get all genres
  static async getGenres() {
    const query = 'SELECT DISTINCT genre FROM books WHERE genre IS NOT NULL AND genre != "" ORDER BY genre';
    try {
      const [genres] = await db.execute(query);
      return genres.map(row => row.genre);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

module.exports = Book;