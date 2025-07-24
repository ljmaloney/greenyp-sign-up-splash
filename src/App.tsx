
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CategoriesProvider } from "@/components/providers/CategoriesProvider";

// Import existing pages only
import PublicIndex from "@/pages/PublicIndex";
import Categories from "@/pages/Categories";
import CategoryPage from "@/pages/CategoryPage";
import SubscriberIndex from "@/pages/subscribers/Index";
import SubscriberCategories from "@/pages/subscribers/SubscriberCategories";
import SubscriberCategoryPage from "@/pages/subscribers/CategoryPage";
import SignUp from "@/pages/subscribers/SignUp";
import DashboardIndex from "@/pages/dashboard/Index";

// Create a simple query client without unnecessary configuration
const queryClient = new QueryClient();

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
              
              {/* Subscriber routes */}
              <Route path="/subscribers" element={<SubscriberIndex />} />
              <Route path="/subscribers/categories" element={<SubscriberCategories />} />
              <Route path="/subscribers/categories/:categoryId" element={<SubscriberCategoryPage />} />
              <Route path="/subscribers/signup" element={<SignUp />} />
              
              {/* Dashboard routes */}
              <Route path="/dashboard" element={<DashboardIndex />} />
            </Routes>
          </BrowserRouter>
        </CategoriesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
