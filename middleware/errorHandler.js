// Middleware to get errors from any route and handle the response
export const errorHandler = (err, req, res, next) => {

    // Check if error was thrown from throwApplicationError function below
    if (err.isCustomError) {
        // If it's a custom error, send it with the message given
        res.status(400).json({error: err.message});
    } else {
        // Log the system error for debugging purposes
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