/**
 * Safely validates and formats a date for MySQL (YYYY-MM-DD HH:MM:SS).
 * @param {string} dateString - The date string from request body.
 * @returns {string|null} - Formatted date string or null if empty.
 * @throws {Error} - If date is invalid.
 */
const formatForMySQL = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        const error = new Error("Invalid date format. Use YYYY-MM-DD or ISO string.");
        error.status = 400;
        throw error;
    }

    // Convert to MySQL DATETIME format: YYYY-MM-DD HH:MM:SS
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

module.exports = { formatForMySQL };
