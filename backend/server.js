const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Library API is working!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running perfectly' 
  });
});

// Books routes (simplified)
app.get('/api/books', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Books endpoint working'
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('🚀 Server started successfully!');
  console.log(`📚 Running on http://localhost:${PORT}`);
  console.log('✅ Basic API is working');
});