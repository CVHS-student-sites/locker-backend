// Middleware to get errors from any route and handle the response
export const errorHandler = (err, req, res, next) => {
    console.error(err); // TODO remove later - Log the error for debugging purposes

    if (err.isCustomError) {
        // If it's a custom error, send it with the prefix "Application:"
        res.status(400).json({error: err.message});
    } else {
        // Log the error for debugging purposes
        console.error(err);

        // For other errors, send a generic error message
        res.status(500).json({error: 'Internal server error'});
    }
};

// Function that is called from controllers to throw custom error
export const throwApplicationError = (message) => {
    const error = new Error(message);
    error.isCustomError = true;
    throw error;
};