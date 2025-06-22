
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
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
  );
};

export default ContactForm;
