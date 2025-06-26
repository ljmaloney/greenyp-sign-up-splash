
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Public pages
import PublicIndex from '@/pages/PublicIndex';
import Categories from '@/pages/Categories';
import CategoryPage from '@/pages/CategoryPage';
import SearchResults from '@/pages/SearchResults';
import ProfilePage from '@/pages/ProfilePage';
import Classifieds from '@/pages/Classifieds';

// Auth pages
import Login from '@/pages/auth/Login';
import AuthCallback from '@/pages/auth/AuthCallback';
import SilentCallback from '@/pages/auth/SilentCallback';
import Unauthorized from '@/pages/auth/Unauthorized';

// Dashboard pages
import DashboardIndex from '@/pages/dashboard/Index';
import DashboardLocations from '@/pages/dashboard/Locations';
import DashboardContacts from '@/pages/dashboard/Contacts';
import DashboardProducts from '@/pages/dashboard/Products';
import DashboardServices from '@/pages/dashboard/Services';
import DashboardPhotoGallery from '@/pages/dashboard/PhotoGallery';
import DashboardAuthorizedUsers from '@/pages/dashboard/AuthorizedUsers';
import DashboardAnalytics from '@/pages/dashboard/Analytics';
import DashboardPayment from '@/pages/dashboard/Payment';
import DashboardSubscription from '@/pages/dashboard/Subscription';

// Admin pages
import AdminIndex from '@/pages/admin/Index';
import AdminAnalytics from '@/pages/admin/Analytics';
import AdminSubscribers from '@/pages/admin/Subscribers';
import AdminInvoices from '@/pages/admin/Invoices';
import AdminUsers from '@/pages/admin/Users';
import AdminPermissions from '@/pages/admin/Permissions';
import AdminSettings from '@/pages/admin/Settings';

// Subscribers pages
import SubscribersIndex from '@/pages/subscribers/Index';
import SubscriberCategories from '@/pages/subscribers/SubscriberCategories';
import SubscriberCategoryPage from '@/pages/subscribers/CategoryPage';
import SubscriberContact from '@/pages/subscribers/Contact';
import SubscriberSignUp from '@/pages/subscribers/SignUp';
import SubscriberSignUpConfirmation from '@/pages/subscribers/SignUpConfirmation';
import SubscriberSubscribe from '@/pages/subscribers/Subscribe';
import SubscriberSubscriptionFeatures from '@/pages/subscribers/SubscriptionFeatures';
import SubscriberNotFound from '@/pages/subscribers/NotFound';

// Classifieds pages
import CreateAd from '@/pages/classifieds/CreateAd';
import ClassifiedsSearchResults from './pages/classifieds/SearchResults';
import ClassifiedDetail from '@/pages/classifieds/ClassifiedDetail';
import PrototypeAds from '@/pages/classifieds/PrototypeAds';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<PublicIndex />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:lineOfBusinessId" element={<CategoryPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/profile/:producerId/:producerLocationId" element={<ProfilePage />} />
              <Route path="/classifieds" element={<Classifieds />} />
              <Route path="/classifieds/create" element={<CreateAd />} />
              <Route path="/classifieds/search" element={<ClassifiedsSearchResults />} />
              <Route path="/classifieds/prototypes" element={<PrototypeAds />} />
              <Route path="/classifieds/:id" element={<ClassifiedDetail />} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/silent-callback" element={<SilentCallback />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Dashboard routes - Protected for subscribers */}
              <Route path="/dashboard" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardIndex /></ProtectedRoute>} />
              <Route path="/dashboard/locations" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardLocations /></ProtectedRoute>} />
              <Route path="/dashboard/contacts" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardContacts /></ProtectedRoute>} />
              <Route path="/dashboard/products" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardProducts /></ProtectedRoute>} />
              <Route path="/dashboard/services" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardServices /></ProtectedRoute>} />
              <Route path="/dashboard/gallery" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardPhotoGallery /></ProtectedRoute>} />
              <Route path="/dashboard/photo-gallery" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardPhotoGallery /></ProtectedRoute>} />
              <Route path="/dashboard/users" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardAuthorizedUsers /></ProtectedRoute>} />
              <Route path="/dashboard/authorized-users" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardAuthorizedUsers /></ProtectedRoute>} />
              <Route path="/dashboard/analytics" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardAnalytics /></ProtectedRoute>} />
              <Route path="/dashboard/payment" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardPayment /></ProtectedRoute>} />
              <Route path="/dashboard/subscription" element={<ProtectedRoute requiredRole="Greepages-Subscriber"><DashboardSubscription /></ProtectedRoute>} />

              {/* Admin routes - Protected for admins */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="GreenPages-Admin"><AdminIndex /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute requiredRole="GreenPages-Admin"><AdminAnalytics /></ProtectedRoute>} />
              <Route path="/admin/subscribers" element={<ProtectedRoute requiredRole="GreenPages-Admin"><AdminSubscribers /></ProtectedRoute>} />
              <Route path="/admin/invoices" element={<ProtectedRoute requiredRole="GreenPages-Admin"><AdminInvoices /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requiredRole="GreenPages-Admin"><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/permissions" element={<ProtectedRoute requiredRole="GreenPages-Admin"><AdminPermissions /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requiredRole="GreenPages-Admin"><AdminSettings /></ProtectedRoute>} />

              {/* Subscribers routes */}
              <Route path="/subscribers" element={<SubscribersIndex />} />
              <Route path="/subscribers/categories" element={<SubscriberCategories />} />
              <Route path="/subscribers/categories/:lineOfBusinessId" element={<SubscriberCategoryPage />} />
              <Route path="/subscribers/contact" element={<SubscriberContact />} />
              <Route path="/subscribers/signup" element={<SubscriberSignUp />} />
              <Route path="/subscribers/signup/confirmation" element={<SubscriberSignUpConfirmation />} />
              <Route path="/subscribers/subscribe" element={<SubscriberSubscribe />} />
              <Route path="/subscribers/subscription-features" element={<SubscriberSubscriptionFeatures />} />
              <Route path="/subscribers/*" element={<SubscriberNotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
