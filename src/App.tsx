
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/subscribers/Index";
import Subscribe from "./pages/subscribers/Subscribe";
import SignUp from "./pages/subscribers/SignUp";
import Contact from "./pages/subscribers/Contact";
import Categories from "./pages/subscribers/Categories";
import CategoryPage from "./pages/subscribers/CategoryPage";
import SubscriptionFeatures from "./pages/subscribers/SubscriptionFeatures";
import NotFound from "./pages/subscribers/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/subscriber" element={<Index />} />
          <Route path="/subscriber/subscribe" element={<Subscribe />} />
          <Route path="/subscriber/signup" element={<SignUp />} />
          <Route path="/subscriber/contact" element={<Contact />} />
          <Route path="/subscriber/categories" element={<Categories />} />
          <Route path="/subscriber/subscription-features" element={<SubscriptionFeatures />} />
          <Route path="/subscriber/categories/:slug" element={<CategoryPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
