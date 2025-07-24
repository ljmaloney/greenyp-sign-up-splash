
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CategoriesProvider } from "@/components/providers/CategoriesProvider";

// Import all pages
import PublicIndex from "@/pages/PublicIndex";
import Categories from "@/pages/Categories";
import CategoryPage from "@/pages/CategoryPage";
import SubscriberIndex from "@/pages/subscribers/Index";
import SubscriberCategories from "@/pages/subscribers/SubscriberCategories";
import SubscriberCategoryPage from "@/pages/subscribers/CategoryPage";
import SignUp from "@/pages/subscribers/SignUp";
import DashboardIndex from "@/pages/dashboard/Index";
import DashboardClassifieds from "@/pages/dashboard/Classifieds";
import ClassifiedsIndex from "@/pages/classifieds/Index";
import ClassifiedDetail from "@/pages/classifieds/ClassifiedDetail";
import ProtectedRoute from "@/components/ProtectedRoute";

// Create a query client with optimized defaults for categories caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global defaults for better caching
      staleTime: 5 * 60 * 1000, // 5 minutes default stale time
      gcTime: 10 * 60 * 1000, // 10 minutes cache time
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
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
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:categoryId" element={<CategoryPage />} />
              <Route path="/classifieds" element={<ClassifiedsIndex />} />
              <Route path="/classifieds/:classifiedId" element={<ClassifiedDetail />} />
              
              {/* Subscriber routes */}
              <Route path="/subscribers" element={<SubscriberIndex />} />
              <Route path="/subscribers/categories" element={<SubscriberCategories />} />
              <Route path="/subscribers/categories/:categoryId" element={<SubscriberCategoryPage />} />
              <Route path="/subscribers/signup" element={<SignUp />} />
              
              {/* Protected dashboard routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardIndex />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/classifieds" 
                element={
                  <ProtectedRoute>
                    <DashboardClassifieds />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </BrowserRouter>
        </CategoriesProvider>
      </AuthProvider>
    </TooltipProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
