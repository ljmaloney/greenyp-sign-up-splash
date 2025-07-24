
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/contexts/AuthContext';
import PublicIndex from '@/pages/PublicIndex';
import SubscriberSignUp from '@/pages/subscribers/signup/SubscriberSignUp';
import Login from '@/pages/auth/Login';
import AuthCallback from '@/pages/auth/AuthCallback';
import SilentCallback from '@/pages/auth/SilentCallback';
import Unauthorized from '@/pages/auth/Unauthorized';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<PublicIndex />} />
              <Route path="/subscribers/signup" element={<SubscriberSignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/silent-callback" element={<SilentCallback />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
