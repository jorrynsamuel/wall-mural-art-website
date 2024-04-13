const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/website1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define schema for your data
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
});

const Contact = mongoose.model('Contact', ContactSchema);

// Route to handle form submission
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  console.log('Received data:', req.body); // Log the received data

  const newContact = new Contact({
    name,
    email,
    subject,
    message
  });

  newContact.save()
    .then(() => {
      // Redirect to index.html after successfully saving data
      res.redirect('/');
    })
    .catch(err => {
      console.error('Error saving data:', err); // Log any errors during save
      res.status(400).json({ message: 'Failed to send message' });
    });
});

// Route to load index.html for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
