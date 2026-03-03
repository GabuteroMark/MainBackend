require('dotenv').config();
require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandler = require('_middleware/error-handler');

// ================= MIDDLEWARE =================
app.use(cors({
    origin: function (origin, callback) {
        // Allow local and Vercel origins
        if (!origin ||
            origin.includes('localhost') ||
            origin.includes('127.0.0.1') ||
            origin.endsWith('.vercel.app') ||
            origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            console.log(`CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Add a simple health check route (Before API routes)
app.get('/health', (req, res) => res.send('OK'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= STATIC FILES =================
app.use('/download', express.static(path.join(__dirname, 'generated')));

// ================= ROUTES =================
app.use('/api/grade-levels', require('./grade-levels/grade-level.controller'));
app.use('/api', require('./sections/section.controller'));
app.use('/api', require('./subjects/subject.controller'));
app.use('/api', require('./questions/question.controller'));
app.use('/api/accounts', require('./accounts/account.controller'));
// app.use('/api', require('./upload/upload.controller'));

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= SERVER =================
const port = process.env.NODE_ENV === 'production'
    ? (process.env.PORT || 80)
    : 4000;

app.listen(port, () => console.log('Server listening on port ' + port));