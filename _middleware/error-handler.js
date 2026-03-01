module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    // Ensure CORS headers are present even on errors
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    switch (true) {
        case typeof err === 'string':
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        case err.message && err.message.toLowerCase().includes('deactivated'):
            return res.status(403).json({ message: 'deactivated' });
        case err.name === 'UnauthorizedError':
            return res.status(401).json({ message: 'Unauthorized error-handler' });
        default:
            return res.status(500).json({ message: err.message });
    }
}
