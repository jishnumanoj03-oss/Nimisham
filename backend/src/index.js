import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './config/env.js';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// ── Security Middleware ──
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (env.NODE_ENV === 'development' && /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    if (origin === env.FRONTEND_URL) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ── Parsing Middleware ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ──
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Nimisham API is running', environment: env.NODE_ENV });
});

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ── Global Error Handler ──
app.use(errorHandler);

// ── Start Server ──
const startServer = async () => {
  await connectDB();

  const PORT = env.PORT;
  const server = app.listen(PORT, () => {
    console.log(`\n✓ Nimisham API running on port ${PORT}`);
    console.log(`  Environment: ${env.NODE_ENV}`);
    console.log(`  Frontend URL: ${env.FRONTEND_URL}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`✗ Port ${PORT} is already in use. Please close the process using port ${PORT} or restart dev server.`);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully');
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
