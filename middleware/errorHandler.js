// Middleware to get errors from any route and handle the response
export const errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error for debugging purposes

    if (err.message) {
        // If the error has a message, send it as the response
        res.status(400).json({ error: err.message });
    } else {
        // Otherwise, send a generic error message
        res.status(500).json({ error: 'Internal server error' });
    }
};