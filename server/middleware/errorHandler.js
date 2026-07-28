export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';
  const isDev = process.env.NODE_ENV === 'development';

  console.error(`[${new Date().toISOString()}] ERROR ${status}:`, err.message);
  if (!isProd) console.error(err.stack);

  res.status(status).json({
    success: false,
    message: isProd && status >= 500 ? 'An internal server error occurred' : err.message || 'Internal Server Error',
    ...(isDev && { error: { message: err.message, stack: err.stack } }),
  });
};

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);