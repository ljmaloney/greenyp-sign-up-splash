import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import SearchResults from './pages/SearchResults';
import CategoryPage from './pages/CategoryPage';
import BusinessDetailsPage from './pages/BusinessDetailsPage';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Profile from './pages/dashboard/Profile';
import Business from './pages/dashboard/Business';
import RequireAuth from './components/auth/RequireAuth';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Classifieds from '@/pages/Classifieds';
import PrototypeAds from '@/pages/classifieds/PrototypeAds';
import CreateAd from '@/pages/classifieds/CreateAd';
import SearchResultsClassifieds from '@/pages/classifieds/SearchResults';
import ClassifiedDetail from '@/components/classifieds/ClassifiedDetail';
import CategoryDescriptions from '@/pages/classifieds/CategoryDescriptions';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="category/:lineOfBusinessId" element={<CategoryPage />} />
              <Route path="business/:businessId" element={<BusinessDetailsPage />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
            </Route>

            {/* Dashboard Routes - Requires Authentication */}
            <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="business" element={<Business />} />
            </Route>
            
            {/* Classifieds routes */}
            <Route path="/classifieds" element={<Classifieds />} />
            <Route path="/classifieds/categories" element={<CategoryDescriptions />} />
            <Route path="/classifieds/prototypes" element={<PrototypeAds />} />
            <Route path="/classifieds/create" element={<CreateAd />} />
            <Route path="/classifieds/search" element={<SearchResultsClassifieds />} />
            <Route path="/classifieds/:id" element={<ClassifiedDetail />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
