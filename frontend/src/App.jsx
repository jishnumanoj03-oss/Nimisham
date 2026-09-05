import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';

// Layouts
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Phase 2A Pages
import ArtworkUploadPage from './pages/creator/ArtworkUploadPage';
import CreativeProcessPage from './pages/creator/CreativeProcessPage';
import PortfolioManagementPage from './pages/creator/PortfolioManagementPage';
import PortfolioEditorPage from './pages/creator/PortfolioEditorPage';
import ArtworkDetailsPage from './pages/portfolio/ArtworkDetailsPage';
import PublicPortfolioPage from './pages/portfolio/PublicPortfolioPage';

// Phase 2B Pages
import TutorialsListPage from './pages/tutorials/TutorialsListPage';
import TutorialDetailPage from './pages/tutorials/TutorialDetailPage';
import TutorialEditorPage from './pages/tutorials/TutorialEditorPage';
import ResourcesListPage from './pages/resources/ResourcesListPage';
import ResourceDetailPage from './pages/resources/ResourceDetailPage';
import ResourceUploadPage from './pages/resources/ResourceUploadPage';
import PromptsExplorerPage from './pages/prompts/PromptsExplorerPage';
import PromptCollectionDetailPage from './pages/prompts/PromptCollectionDetailPage';

// Phase 3 Pages
import SearchPage from './pages/search/SearchPage';

// Phase 4 Pages
import SellerDashboard from './pages/marketplace/SellerDashboard';
import ProductDetailsPage from './pages/marketplace/ProductDetailsPage';
import CartPage from './pages/marketplace/CartPage';
import MyPurchasesPage from './pages/dashboard/MyPurchasesPage';
import OrderHistoryPage from './pages/dashboard/OrderHistoryPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
          <Routes>
            {/* Public Landing */}
            <Route path="/" element={<HomePage />} />

            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password/:token" element={<ResetPasswordPage />} />
              <Route index element={<Navigate to="/auth/login" replace />} />
            </Route>

            {/* Protected App Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/artwork/upload" element={<ArtworkUploadPage />} />
              <Route path="/creative-process/:artworkId" element={<CreativeProcessPage />} />
              <Route path="/portfolios" element={<PortfolioManagementPage />} />
              <Route path="/portfolio/new" element={<PortfolioEditorPage />} />
              <Route path="/portfolio/edit/:id" element={<PortfolioEditorPage />} />
              
              {/* Phase 2B Protected Routes */}
              <Route path="/tutorials/editor" element={<TutorialEditorPage />} />
              <Route path="/resources/upload" element={<ResourceUploadPage />} />
              
              {/* Phase 4 Protected Routes */}
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/dashboard/purchases" element={<MyPurchasesPage />} />
              <Route path="/dashboard/orders" element={<OrderHistoryPage />} />
            </Route>

            {/* Public Profiles and Artworks (with AppLayout but accessible without auth) */}
            <Route element={<AppLayout />}>
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/portfolio/:id" element={<PublicPortfolioPage />} />
              <Route path="/artwork/:id" element={<ArtworkDetailsPage />} />
              
              {/* Phase 2B Public Routes */}
              <Route path="/tutorials" element={<TutorialsListPage />} />
              <Route path="/tutorials/:id" element={<TutorialDetailPage />} />
              <Route path="/resources" element={<ResourcesListPage />} />
              <Route path="/resources/:id" element={<ResourceDetailPage />} />
              <Route path="/prompts" element={<PromptsExplorerPage />} />
              <Route path="/prompt-collections/:id" element={<PromptCollectionDetailPage />} />
              
              {/* Phase 3 Public Routes */}
              <Route path="/search" element={<SearchPage />} />
              
              {/* Phase 4 Public Routes */}
              <Route path="/product/:id" element={<ProductDetailsPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        </CartProvider>

        {/* Global Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            },
            success: {
              iconTheme: {
                primary: 'var(--success)',
                secondary: 'var(--bg-elevated)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--error)',
                secondary: 'var(--bg-elevated)',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
