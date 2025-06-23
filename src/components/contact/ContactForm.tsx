
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

interface ContactFormData {
  requestType: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ContactFormData>({
    defaultValues: {
      requestType: '',
      companyName: '',
      name: '',
      email: '',
      phone: '',
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

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return true; // Optional field
    return /^(?:\+1)?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone);
  };

  const validateCompanyName = (companyName: string): boolean => {
    return /^[A-Za-z\s]+$/.test(companyName);
  };

  const onSubmit = async (data: ContactFormData) => {
    // Validate fields
    if (!data.requestType) {
      toast.error("Please select a request type.");
      return;
    }

    if (!validateCompanyName(data.companyName)) {
      toast.error("Company name should only contain letters and spaces.");
      return;
    }

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

    if (!validatePhone(data.phone)) {
      toast.error("Please enter a valid phone number format.");
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        requestType: data.requestType,
        leadContactRequest: null,
        companyName: data.companyName,
        emailAddress: data.email,
        name: data.name,
        phoneNumber: data.phone || null,
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
              name="requestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left block">Request Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SUBSCRIBER_INFO_TYPE">Request more information</SelectItem>
                      <SelectItem value="SUBSCRIBER_SUPPORT_TYPE">Request technical support</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left block">Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left block">Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter your phone number (optional)" {...field} />
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
