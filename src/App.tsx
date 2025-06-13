import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicIndex from "./pages/PublicIndex";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults";
import ProfilePage from "./pages/ProfilePage";
import Index from "./pages/subscribers/Index";
import Subscribe from "./pages/subscribers/Subscribe";
import SignUp from "./pages/subscribers/SignUp";
import SignUpConfirmation from "./pages/subscribers/SignUpConfirmation";
import Contact from "./pages/subscribers/Contact";
import SubscriberCategories from "./pages/subscribers/SubscriberCategories";
import SubscriberCategoryPage from "./pages/subscribers/CategoryPage";
import SubscriptionFeatures from "./pages/subscribers/SubscriptionFeatures";
import NotFound from "./pages/subscribers/NotFound";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";
import DashboardIndex from "./pages/dashboard/Index";
import DashboardLocations from "./pages/dashboard/Locations";
import DashboardContacts from "./pages/dashboard/Contacts";
import DashboardProducts from "./pages/dashboard/Products";
import DashboardServices from "./pages/dashboard/Services";
import DashboardUpgrade from "./pages/dashboard/Upgrade";
import DashboardSubscription from "./pages/dashboard/Subscription";
import DashboardPayment from "./pages/dashboard/Payment";
import AuthorizedUsers from "./pages/dashboard/AuthorizedUsers";
import DashboardAnalytics from "./pages/dashboard/Analytics";
import AdminIndex from "./pages/admin/Index";
import AdminUsers from "./pages/admin/Users";
import AdminSubscribers from "./pages/admin/Subscribers";
import AdminInvoices from "./pages/admin/Invoices";
import AdminPermissions from "./pages/admin/Permissions";
import AdminSettings from "./pages/admin/Settings";
import AuthCallback from "./pages/auth/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicIndex />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/profile/:producerId" element={<ProfilePage />} />
            <Route path="/subscriber" element={<Index />} />
            <Route path="/subscriber/subscribe" element={<Subscribe />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/subscriber/signup" element={<SignUp />} />
            <Route path="/subscriber/signup/confirmation" element={<SignUpConfirmation />} />
            <Route path="/subscriber/contact" element={<Contact />} />
            <Route path="/subscriber/categories" element={<SubscriberCategories />} />
            <Route path="/subscriber/subscription-features" element={<SubscriptionFeatures />} />
            <Route path="/subscriber/categories/:slug" element={<SubscriberCategoryPage />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected dashboard routes - require Greepages-Subscriber or Greepages-SubscriberAdmin */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="Greepages-Subscriber">
                <DashboardIndex />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/locations" element={
              <ProtectedRoute requiredRole="Greepages-Subscriber">
                <DashboardLocations />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/contacts" element={
              <ProtectedRoute requiredRole="Greepages-Subscriber">
                <DashboardContacts />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/authorized-users" element={
              <ProtectedRoute requiredRole="Greepages-Subscriber">
                <AuthorizedUsers />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/products" element={
              <ProtectedRoute requiredRole="Greepages-Subscriber">
                <DashboardProducts />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/services" element={
              <ProtectedRoute requiredRole="Greepages-Subscriber">
                <DashboardServices />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/upgrade" element={
              <ProtectedRoute requiredRole="Greepages-Subscriber">
                <DashboardUpgrade />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/subscription" element={
              <ProtectedRoute requiredRole="Greepages-Subscriber">
                <DashboardSubscription />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/payment" element={
              <ProtectedRoute requiredRole="Greepages-Subscriber">
                <DashboardPayment />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/analytics" element={
              <ProtectedRoute requiredRole="Greepages-Subscriber">
                <DashboardAnalytics />
              </ProtectedRoute>
            } />
            
            {/* Protected admin routes - require GreenPages-Admin or SysAdmin */}
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
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
