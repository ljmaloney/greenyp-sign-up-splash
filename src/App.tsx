
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicIndex from './pages/PublicIndex';
import Contact from './pages/subscribers/Contact';
import SearchResults from './pages/SearchResults';
import CategoryPage from './pages/CategoryPage';
import Categories from './pages/Categories';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/auth/Login';
import AuthCallback from './pages/auth/AuthCallback';
import SilentCallback from './pages/auth/SilentCallback';
import Unauthorized from './pages/auth/Unauthorized';
import Classifieds from '@/pages/Classifieds';
import PrototypeAds from '@/pages/classifieds/PrototypeAds';
import CreateAd from '@/pages/classifieds/CreateAd';
import UploadImages from '@/pages/classifieds/UploadImages';
import Payment from '@/pages/classifieds/Payment';
import SearchResultsClassifieds from '@/pages/classifieds/SearchResults';
import ClassifiedDetail from '@/pages/classifieds/ClassifiedDetail';
import CategoryDescriptions from '@/pages/classifieds/CategoryDescriptions';

// Import subscriber pages
import SubscribersIndex from '@/pages/subscribers/Index';
import SubscribersSignUp from '@/pages/subscribers/SignUp';
import SubscribersSubscribe from '@/pages/subscribers/Subscribe';
import SubscriptionFeatures from '@/pages/subscribers/SubscriptionFeatures';
import SubscriberCategories from '@/pages/subscribers/SubscriberCategories';
import SubscriberCategoryPage from '@/pages/subscribers/CategoryPage';

// Import dashboard page
import DashboardIndex from '@/pages/dashboard/Index';

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<SubscribersIndex />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:lineOfBusinessId" element={<CategoryPage />} />
              <Route path="/category/:lineOfBusinessId" element={<CategoryPage />} />
              <Route path="/business/:businessId" element={<ProfilePage />} />
              <Route path="/login" element={<Login />} />

              {/* Authentication Routes */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/silent-callback" element={<SilentCallback />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Dashboard Route */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardIndex />
                </ProtectedRoute>
              } />

              {/* Subscriber Routes */}
              <Route path="/subscribers" element={<SubscribersIndex />} />
              <Route path="/subscribers/signup" element={<SubscribersSignUp />} />
              <Route path="/subscribers/subscribe" element={<SubscribersSubscribe />} />
              <Route path="/subscribers/subscription-features" element={<SubscriptionFeatures />} />
              <Route path="/subscribers/contact" element={<Contact />} />
              <Route path="/subscribers/categories" element={<SubscriberCategories />} />
              <Route path="/subscribers/categories/:lineOfBusinessId" element={<SubscriberCategoryPage />} />

              {/* Classifieds routes */}
              <Route path="/classifieds" element={<Classifieds />} />
              <Route path="/classifieds/prototypes" element={<PrototypeAds />} />
              <Route path="/classifieds/create" element={<CreateAd />} />
              <Route path="/classifieds/uploadimages/:classifiedId" element={<UploadImages />} />
              <Route path="/classifieds/payment/:classifiedId" element={<Payment />} />
              <Route path="/classifieds/search" element={<SearchResultsClassifieds />} />
              <Route path="/classifieds/categories" element={<CategoryDescriptions />} />
              <Route path="/classifieds/:id" element={<ClassifiedDetail />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
  );
}

export default App;