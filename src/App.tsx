import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Public pages
import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import DisclaimerPage from '@/pages/DisclaimerPage';
import PrivacyPage from '@/pages/PrivacyPage';
import SearchResults from '@/pages/SearchResults';
import CategoryPage from '@/pages/CategoryPage';
import BusinessProfile from '@/pages/BusinessProfile';

// Dashboard pages
import DashboardIndex from '@/pages/dashboard/Index';
import BusinessProfilePage from '@/pages/dashboard/BusinessProfilePage';
import LocationsPage from '@/pages/dashboard/LocationsPage';
import NewLocationPage from '@/pages/dashboard/NewLocationPage';
import EditLocationPage from '@/pages/dashboard/EditLocationPage';
import ContactsPage from '@/pages/dashboard/ContactsPage';
import NewContactPage from '@/pages/dashboard/NewContactPage';
import EditContactPage from '@/pages/dashboard/EditContactPage';
import SubscriptionPage from '@/pages/dashboard/SubscriptionPage';
import ClassifiedPage from '@/pages/dashboard/ClassifiedPage';
import AccountInfoPage from '@/pages/dashboard/AccountInfoPage';

// Subscriber pages
import SubscriberIndex from "@/pages/subscribers/Index";
import SubscriberCategories from "@/pages/subscribers/SubscriberCategories";
import SubscriberCategoryPage from "@/pages/subscribers/CategoryPage";
import SubscriberSignUp from "@/pages/subscribers/signup/SubscriberSignUp";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/business/:producerId" element={<BusinessProfile />} />
            
            {/* Subscriber/Professional routes */}
            <Route path="/subscribers" element={<SubscriberIndex />} />
            <Route path="/subscribers/categories" element={<SubscriberCategories />} />
            <Route path="/subscribers/categories/:categoryId" element={<SubscriberCategoryPage />} />
            <Route path="/subscribers/signup" element={<SubscriberSignUp />} />
              
            {/* Protected dashboard routes */}
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route index element={<DashboardIndex />} />
                    <Route path="profile" element={<BusinessProfilePage />} />
                    <Route path="locations" element={<LocationsPage />} />
                    <Route path="locations/new" element={<NewLocationPage />} />
                    <Route path="locations/:locationId/edit" element={<EditLocationPage />} />
                    <Route path="contacts" element={<ContactsPage />} />
                    <Route path="contacts/new" element={<NewContactPage />} />
                    <Route path="contacts/:contactId/edit" element={<EditContactPage />} />
                    <Route path="subscription" element={<SubscriptionPage />} />
                    <Route path="classified" element={<ClassifiedPage />} />
                    <Route path="account" element={<AccountInfoPage />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
