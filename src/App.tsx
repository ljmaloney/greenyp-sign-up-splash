
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicIndex from './pages/PublicIndex';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
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
import Samples from '@/pages/classifieds/Samples.tsx';
import CreateAd from '@/pages/classifieds/CreateAd';
import UploadImages from '@/pages/classifieds/UploadImages';
import ClassifiedDetail from '@/pages/classifieds/ClassifiedDetail';
import CategoryDescriptions from '@/pages/classifieds/CategoryDescriptions';
import ClassifiedCategoryPage from '@/pages/classifieds/ClassifiedCategoryPage';
import OGImageGeneratorPage from '@/pages/OGImageGenerator';

// Import subscriber pages
import SubscribersIndex from '@/pages/subscribers/Index';
import SubscribersSignUp from '@/pages/subscribers/SignUp';
import SubscribersSubscribe from '@/pages/subscribers/Subscribe';
import SubscriptionFeatures from '@/pages/subscribers/SubscriptionFeatures';
import SubscriberCategories from '@/pages/subscribers/SubscriberCategories';
import SubscriberCategoryPage from '@/pages/subscribers/CategoryPage';
import SignUpConfirmation from '@/pages/subscribers/SignUpConfirmation';
import SignUpPayment from '@/pages/subscribers/SignUpPayment';
import SubscribersPricing from '@/pages/subscribers/Pricing';

// Import dashboard pages
import DashboardIndex from '@/pages/dashboard/Index';
import DashboardContacts from '@/pages/dashboard/Contacts';
import DashboardLocations from '@/pages/dashboard/Locations';
import DashboardProducts from '@/pages/dashboard/Products';
import DashboardServices from '@/pages/dashboard/Services';
import DashboardAuthorizedUsers from '@/pages/dashboard/AuthorizedUsers';
import DashboardPhotoGallery from '@/pages/dashboard/PhotoGallery';
import DashboardAnalytics from '@/pages/dashboard/Analytics';
import DashboardSubscription from '@/pages/dashboard/Subscription';
import DashboardPayment from '@/pages/dashboard/Payment';
import DashboardInvoices from '@/pages/dashboard/Invoices';

// Import admin pages
import AdminIndex from '@/pages/admin/Index';
import AdminUsers from '@/pages/admin/Users';
import AdminSubscribers from '@/pages/admin/Subscribers';
import AdminClassifieds from '@/pages/admin/Classifieds';
import AdminInvoices from '@/pages/admin/Invoices';
import AdminPermissions from '@/pages/admin/Permissions';
import AdminSettings from '@/pages/admin/Settings';
import ClassifiedPayment from "@/pages/classifieds/ClassifiedPayment.tsx";
import ClassifiedPaymentConfirmation from "@/pages/classifieds/ClassifiedPaymentConfirmation.tsx";

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicIndex />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:urlLob" element={<CategoryPage />} />
              <Route path="/category/:lineOfBusinessId" element={<CategoryPage />} />
              <Route path="/business/:businessId" element={<ProfilePage />} />
              <Route path="/profile/:producerId/:producerLocationId" element={<ProfilePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/og-generator" element={<OGImageGeneratorPage />} />

              {/* Authentication Routes */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/silent-callback" element={<SilentCallback />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Dashboard Routes - Protected */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardIndex />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/contacts" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardContacts />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/locations" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardLocations />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/products" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardProducts />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/services" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardServices />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/authorized-users" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardAuthorizedUsers />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/photo-gallery" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardPhotoGallery />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/analytics" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/subscription" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardSubscription />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/payment" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardPayment />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/invoices" element={
                <ProtectedRoute requiredRole="Dashboard-Access">
                  <DashboardInvoices />
                </ProtectedRoute>
              } />

              {/* Admin Routes - Protected */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="GreenPages-Admin">
                  <AdminIndex />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="GreenPages-Admin">
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/subscribers" element={
                <ProtectedRoute requiredRole="GreenPages-Admin">
                  <AdminSubscribers />
                </ProtectedRoute>
              } />
              <Route path="/admin/classifieds" element={
                <ProtectedRoute requiredRole="GreenPages-Admin">
                  <AdminClassifieds />
                </ProtectedRoute>
              } />
              <Route path="/admin/invoices" element={
                <ProtectedRoute requiredRole="GreenPages-Admin">
                  <AdminInvoices />
                </ProtectedRoute>
              } />
              <Route path="/admin/permissions" element={
                <ProtectedRoute requiredRole="GreenPages-Admin">
                  <AdminPermissions />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requiredRole="GreenPages-Admin">
                  <AdminSettings />
                </ProtectedRoute>
              } />

              {/* Subscriber Routes - Updated to use consistent plural routing */}
              <Route path="/subscribers" element={<SubscribersIndex />} />
              <Route path="/subscribers/signup" element={<SubscribersSignUp />} />
              <Route path="/subscribers/signup/confirmation" element={<SignUpConfirmation />} />
              <Route path="/subscribers/signup/payment" element={<SignUpPayment />} />
              <Route path="/subscribers/subscribe" element={<SubscribersSubscribe />} />
              <Route path="/subscribers/subscription-features" element={<SubscriptionFeatures />} />
              <Route path="/subscribers/pricing" element={<SubscribersPricing />} />
              <Route path="/subscribers/contact" element={<Contact />} />
              <Route path="/subscribers/categories" element={<SubscriberCategories />} />
              <Route path="/subscribers/categories/:urlLob" element={<SubscriberCategoryPage />} />

              {/* Classifieds routes */}
              <Route path="/classifieds" element={<Classifieds />} />
              <Route path="/classifieds/samples" element={<Samples />} />
              <Route path="/classifieds/:urlName" element={<ClassifiedCategoryPage />} />
              <Route path="/classifieds/create" element={<CreateAd />} />
              <Route path="/classifieds/uploadimages/:classifiedId" element={<UploadImages />} />
              <Route path="/classifieds/payment/:classifiedId" element={<ClassifiedPayment />} />
              <Route path="/classifieds/payment/confirmation/:classifiedId" element={<ClassifiedPaymentConfirmation />} />
              <Route path="/classifieds/categories" element={<CategoryDescriptions />} />
              <Route path="/classifieds/detail/:id" element={<ClassifiedDetail />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
  );
}

export default App;
