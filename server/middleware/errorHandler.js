export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Log the full error server-side for debugging
  console.error(`[${new Date().toISOString()}] ERROR ${status}:`, err.message);
  if (!isProduction) {
    console.error(err.stack);
  }
  
  // Never expose internal error details to the client in production
  const clientMessage = isProduction && status >= 500
    ? 'An internal server error occurred'
    : err.message || 'Internal Server Error';
  
  res.status(status).json({
    success: false,
    message: clientMessage,
    // Only include error details in development
    ...(process.env.NODE_ENV === 'development' && {
      error: { message: err.message, stack: err.stack }
    })
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
