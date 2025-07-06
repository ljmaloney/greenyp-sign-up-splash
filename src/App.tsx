
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import PublicIndex from './pages/PublicIndex';
import Contact from './pages/subscribers/Contact';
import SearchResults from './pages/SearchResults';
import CategoryPage from './pages/CategoryPage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/auth/Login';
import Classifieds from '@/pages/Classifieds';
import PrototypeAds from '@/pages/classifieds/PrototypeAds';
import CreateAd from '@/pages/classifieds/CreateAd';
import UploadImages from '@/pages/classifieds/UploadImages';
import Payment from '@/pages/classifieds/Payment';
import SearchResultsClassifieds from '@/pages/classifieds/SearchResults';
import ClassifiedDetail from '@/pages/classifieds/ClassifiedDetail';

// Import subscriber pages
import SubscribersIndex from '@/pages/subscribers/Index';
import SubscribersSignUp from '@/pages/subscribers/SignUp';
import SubscribersSubscribe from '@/pages/subscribers/Subscribe';
import SubscriptionFeatures from '@/pages/subscribers/SubscriptionFeatures';
import SubscriberCategories from '@/pages/subscribers/SubscriberCategories';

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
            <Route path="/" element={<PublicIndex />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/category/:lineOfBusinessId" element={<CategoryPage />} />
            <Route path="/business/:businessId" element={<ProfilePage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard Route */}
            <Route path="/dashboard" element={<DashboardIndex />} />
            
            {/* Subscriber Routes */}
            <Route path="/subscribers" element={<SubscribersIndex />} />
            <Route path="/subscribers/signup" element={<SubscribersSignUp />} />
            <Route path="/subscribers/subscribe" element={<SubscribersSubscribe />} />
            <Route path="/subscribers/subscription-features" element={<SubscriptionFeatures />} />
            <Route path="/subscribers/contact" element={<Contact />} />
            <Route path="/subscribers/categories/:lineOfBusinessId" element={<SubscriberCategories />} />
            
            {/* Classifieds routes */}
            <Route path="/classifieds" element={<Classifieds />} />
            <Route path="/classifieds/prototypes" element={<PrototypeAds />} />
            <Route path="/classifieds/create" element={<CreateAd />} />
            <Route path="/classifieds/uploadimages/:classifiedId" element={<UploadImages />} />
            <Route path="/classifieds/payment/:classifiedId" element={<Payment />} />
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
