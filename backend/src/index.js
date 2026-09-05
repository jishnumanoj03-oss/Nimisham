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
import artworkRoutes from './routes/artwork.routes.js';
import processRoutes from './routes/process.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import tutorialRoutes from './routes/tutorial.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import promptRoutes from './routes/prompt.routes.js';
import interactionRoutes from './routes/interaction.routes.js';
import searchRoutes from './routes/search.routes.js';
import marketplaceRoutes from './routes/marketplace.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import orderRoutes from './routes/order.routes.js';
import { stripeWebhook } from './controllers/payment.controller.js';

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

// ── Stripe Webhook (Must be before express.json) ──
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

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
app.use('/api/artworks', artworkRoutes);
app.use('/api/creative-process', processRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/orders', orderRoutes);

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
