
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const validateName = (name: string): boolean => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateSubject = (subject: string): boolean => {
    return /^[A-Za-z\s]+$/.test(subject);
  };

  const onSubmit = async (data: ContactFormData) => {
    // Validate fields
    if (!validateName(data.name)) {
      toast.error("Contact name should only contain letters and spaces.");
      return;
    }

    if (!validateEmail(data.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!validateSubject(data.subject)) {
      toast.error("Subject should only contain letters and spaces.");
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        contactName: data.name,
        emailAddress: data.email,
        subject: data.subject,
        message: data.message
      };

      const response = await fetch('http://services.greenyp.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        form.reset();
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about GreenYP? We're here to help you grow your green business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Quick Links - moved to top */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-greenyp-800 text-left">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">For New Businesses</h4>
                    <p className="text-gray-600 text-sm">
                      Ready to get started? <a href="/signup" className="text-greenyp-600 hover:underline">Sign up here</a> or 
                      browse our <a href="/subscribe" className="text-greenyp-600 hover:underline">pricing plans</a>.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Technical Support</h4>
                    <p className="text-gray-600 text-sm">
                      Need help with your listing? Email us at{' '}
                      <a href="mailto:support@greenyp.com" className="text-greenyp-600 hover:underline">
                        support@greenyp.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Premium Services</h4>
                    <p className="text-gray-600 text-sm">
                      Interested in premium features? Contact our sales team at{' '}
                      <a href="mailto:sales@greenyp.com" className="text-greenyp-600 hover:underline">
                        sales@greenyp.com
                      </a>
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Email:</strong> info@greenyp.com | sales@greenyp.com
                    </p>
                    <p className="text-gray-600 text-sm">
                      <strong>Business Hours:</strong><br />
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday: 10:00 AM - 4:00 PM EST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Send us a Message - moved below Quick Links */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-greenyp-800 text-left">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-left block">Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-left block">Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-left block">Subject *</FormLabel>
                            <FormControl>
                              <Input placeholder="What's this about?" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-left block">Message *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us how we can help you..."
                                className="min-h-[120px]"
                                {...field}
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-greenyp-600 hover:bg-greenyp-700 text-white"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
