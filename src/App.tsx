
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
import SearchResultsClassifieds from '@/pages/classifieds/SearchResults';

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
            
            {/* Classifieds routes */}
            <Route path="/classifieds" element={<Classifieds />} />
            <Route path="/classifieds/prototypes" element={<PrototypeAds />} />
            <Route path="/classifieds/create" element={<CreateAd />} />
            <Route path="/classifieds/search" element={<SearchResultsClassifieds />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
