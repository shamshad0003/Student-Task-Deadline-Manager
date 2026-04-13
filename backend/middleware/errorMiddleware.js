/**
 * Centralized error handling middleware.
 */
const errorMiddleware = (err, req, res, next) => {
    console.error(`[Error] ${req.method} ${req.url}:`, err.message);

    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    // Standard JSON error response
    res.status(status).json({
        success: false,
        message,
        // Only include stack trace in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        status
    });
};

module.exports = errorMiddleware;
