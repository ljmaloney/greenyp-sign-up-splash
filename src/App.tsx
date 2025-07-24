
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CategoriesProvider } from "@/components/providers/CategoriesProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "@/pages/Index";
import PublicIndex from "@/pages/PublicIndex";
import Categories from "@/pages/Categories";
import CategoryPage from "@/pages/CategoryPage";
import SearchResults from "@/pages/SearchResults";
import ProfilePage from "@/pages/ProfilePage";
import ProductsPage from "@/pages/ProductsPage";
import ServicesPage from "@/pages/ServicesPage";

// Classifieds pages
import Classifieds from "@/pages/Classifieds";
import CreateAd from "@/pages/classifieds/CreateAd";

// Auth pages
import Login from "@/pages/auth/Login";
import AuthCallback from "@/pages/auth/AuthCallback";
import Unauthorized from "@/pages/auth/Unauthorized";
import SilentCallback from "@/pages/auth/SilentCallback";

// Subscriber pages
import SubscriberIndex from "@/pages/subscribers/Index";
import SubscriberCategories from "@/pages/subscribers/SubscriberCategories";
import SubscriberCategoryPage from "@/pages/subscribers/CategoryPage";

// Dashboard pages
import DashboardIndex from "@/pages/dashboard/Index";

// Admin pages
import AdminUsers from "@/pages/admin/Users";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminClassifieds from "@/pages/admin/Classifieds";
import AdminInvoices from "@/pages/admin/Invoices";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CategoriesProvider prefetchOnMount={true}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<PublicIndex />} />
              <Route path="/index" element={<Index />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:categoryId" element={<CategoryPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/profile/:businessId" element={<ProfilePage />} />
              <Route path="/profile/:producerId/:producerLocationId" element={<ProfilePage />} />
              <Route path="/products/:producerId/:producerLocationId" element={<ProductsPage />} />
              <Route path="/services/:producerId/:producerLocationId" element={<ServicesPage />} />
              
              {/* Classifieds routes */}
              <Route path="/classifieds" element={<Classifieds />} />
              <Route path="/classifieds/create" element={<CreateAd />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/auth/silent-callback" element={<SilentCallback />} />
              
              {/* Subscriber routes */}
              <Route path="/subscribers" element={<SubscriberIndex />} />
              <Route path="/subscribers/categories" element={<SubscriberCategories />} />
              <Route path="/subscribers/categories/:categoryId" element={<SubscriberCategoryPage />} />
              
              {/* Protected dashboard routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="Dashboard-Access">
                    <DashboardIndex />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected admin routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="GreenPages-Admin">
                    <AdminAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute requiredRole="GreenPages-Admin">
                    <AdminAnalytics />
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
                path="/admin/invoices" 
                element={
                  <ProtectedRoute requiredRole="GreenPages-Admin">
                    <AdminInvoices />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </BrowserRouter>
        </CategoriesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
