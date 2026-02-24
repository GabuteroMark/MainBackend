// server.js (fixed)
require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandler = require('_middleware/error-handler');

// ================= MIDDLEWARE =================
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= STATIC FILES =================
app.use('/download', express.static(path.join(__dirname, 'generated')));

// ================= ROUTES =================
// Mount all API routes at /api
app.use('/api/grade-levels', require('./grade-levels/grade-level.controller'));
app.use('/api', require('./subjects/subject.controller')); 
app.use('/api', require('./questions/question.controller'));
app.use('/api', require('./accounts/account.controller'));
// app.use('/api', require('./upload/upload.controller'));

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= SERVER =================
const port = process.env.NODE_ENV === 'production'
    ? (process.env.PORT || 80)
    : 4000;

app.listen(port, () => console.log('Server listening on port ' + port));