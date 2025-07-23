
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Classifieds from '@/pages/classifieds/Classifieds';
import ClassifiedDetail from '@/pages/classifieds/ClassifiedDetail';
import CreateAd from '@/pages/classifieds/CreateAd';
import Payment from '@/pages/classifieds/Payment';
import { Toaster } from '@/components/ui/toaster';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/classifieds" element={<Classifieds />} />
              <Route path="/classified/:id" element={<ClassifiedDetail />} />
              <Route path="/classifieds/create" element={<CreateAd />} />
              <Route path="/classified/payment/:classifiedId" element={<Payment />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
