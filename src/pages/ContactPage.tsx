
import React from 'react';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">Get in touch with our team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader className="text-center">
                <Mail className="h-12 w-12 text-greenyp-600 mx-auto mb-4" />
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">contact@greenyp.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Phone className="h-12 w-12 text-greenyp-600 mx-auto mb-4" />
                <CardTitle>Phone</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">(555) 123-4567</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 text-greenyp-600 mx-auto mb-4" />
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">123 Green Street<br />Garden City, GC 12345</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
