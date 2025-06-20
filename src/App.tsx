
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
import ProfileProductsPage from '@/pages/ProfileProductsPage';
import ProfileServicesPage from '@/pages/ProfileServicesPage';

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
import DashboardUpgrade from '@/pages/dashboard/Upgrade';

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
              <Route path="/category/:lineOfBusinessId" element={<CategoryPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/profile/:producerId" element={<ProfilePage />} />
              <Route path="/profile/:producerId/products" element={<ProfileProductsPage />} />
              <Route path="/profile/:producerId/services" element={<ProfileServicesPage />} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/silent-callback" element={<SilentCallback />} />
              <Route path="/auth/unauthorized" element={<Unauthorized />} />

              {/* Dashboard routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardIndex /></ProtectedRoute>} />
              <Route path="/dashboard/locations" element={<ProtectedRoute><DashboardLocations /></ProtectedRoute>} />
              <Route path="/dashboard/contacts" element={<ProtectedRoute><DashboardContacts /></ProtectedRoute>} />
              <Route path="/dashboard/products" element={<ProtectedRoute><DashboardProducts /></ProtectedRoute>} />
              <Route path="/dashboard/services" element={<ProtectedRoute><DashboardServices /></ProtectedRoute>} />
              <Route path="/dashboard/gallery" element={<ProtectedRoute><DashboardPhotoGallery /></ProtectedRoute>} />
              <Route path="/dashboard/users" element={<ProtectedRoute><DashboardAuthorizedUsers /></ProtectedRoute>} />
              <Route path="/dashboard/analytics" element={<ProtectedRoute><DashboardAnalytics /></ProtectedRoute>} />
              <Route path="/dashboard/payment" element={<ProtectedRoute><DashboardPayment /></ProtectedRoute>} />
              <Route path="/dashboard/subscription" element={<ProtectedRoute><DashboardSubscription /></ProtectedRoute>} />
              <Route path="/dashboard/upgrade" element={<ProtectedRoute><DashboardUpgrade /></ProtectedRoute>} />

              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminIndex /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
              <Route path="/admin/subscribers" element={<ProtectedRoute><AdminSubscribers /></ProtectedRoute>} />
              <Route path="/admin/invoices" element={<ProtectedRoute><AdminInvoices /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/permissions" element={<ProtectedRoute><AdminPermissions /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

              {/* Subscribers routes */}
              <Route path="/subscribers" element={<SubscribersIndex />} />
              <Route path="/subscribers/categories" element={<SubscriberCategories />} />
              <Route path="/subscribers/category/:lineOfBusinessId" element={<SubscriberCategoryPage />} />
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
