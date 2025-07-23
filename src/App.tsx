
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

// Public Pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';

// Auth Pages
import Login from '@/pages/auth/Login';
import AuthCallback from '@/pages/auth/AuthCallback';
import Unauthorized from '@/pages/auth/Unauthorized';

// Dashboard Pages (Protected)
import DashboardIndex from '@/pages/dashboard/Index';
import Profile from '@/pages/dashboard/Profile';
import Settings from '@/pages/dashboard/Settings';
import Products from '@/pages/dashboard/Products';
import Services from '@/pages/dashboard/Services';
import Contacts from '@/pages/dashboard/Contacts';
import Locations from '@/pages/dashboard/Locations';
import AuthorizedUsers from '@/pages/dashboard/AuthorizedUsers';
import PhotoGallery from '@/pages/dashboard/PhotoGallery';
import Analytics from '@/pages/dashboard/Analytics';
import Subscription from '@/pages/dashboard/Subscription';
import Upgrade from '@/pages/dashboard/Upgrade';

// Admin Pages (Protected)
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminClassifieds from '@/pages/admin/AdminClassifieds';
import AdminSettings from '@/pages/admin/AdminSettings';

// Subscriber Pages
import SubscriberDirectory from '@/pages/subscribers/SubscriberDirectory';
import SubscriberDetail from '@/pages/subscribers/SubscriberDetail';

// Classifieds Pages
import Classifieds from '@/pages/classifieds/Classifieds';
import ClassifiedDetail from '@/pages/classifieds/ClassifiedDetail';
import CreateAd from '@/pages/classifieds/CreateAd';
import Payment from '@/pages/classifieds/Payment';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Dashboard Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <DashboardIndex />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/profile" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/settings" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/products" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <Products />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/services" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <Services />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/contacts" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <Contacts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/locations" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <Locations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/users" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <AuthorizedUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/gallery" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <PhotoGallery />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/analytics" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/subscription" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <Subscription />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/upgrade" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <Upgrade />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="GreenPages-Admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requiredRole="GreenPages-Admin">
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/classifieds" 
                element={
                  <ProtectedRoute requiredRole="GreenPages-Admin">
                    <AdminClassifieds />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requiredRole="GreenPages-Admin">
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />

              {/* Subscriber Routes */}
              <Route path="/subscribers" element={<SubscriberDirectory />} />
              <Route path="/subscriber/:id" element={<SubscriberDetail />} />

              {/* Classifieds Routes */}
              <Route path="/classifieds" element={<Classifieds />} />
              <Route path="/classified/:id" element={<ClassifiedDetail />} />
              <Route path="/classifieds/create" element={<CreateAd />} />
              <Route path="/classified/payment/:classifiedId" element={<Payment />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
