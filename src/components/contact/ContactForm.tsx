
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContactFormSubmission } from "@/hooks/useContactFormSubmission";
import {
  RequestTypeField,
  CompanyNameField,
  NameField,
  EmailField,
  PhoneField,
  SubjectField,
  MessageField
} from "./ContactFormFields";

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

  const { onSubmit, loading } = useContactFormSubmission(form);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-greenyp-800 text-left">Send us a Message</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <RequestTypeField control={form.control} />
            <CompanyNameField control={form.control} />
            <NameField control={form.control} />
            <EmailField control={form.control} />
            <PhoneField control={form.control} />
            <SubjectField control={form.control} />
            <MessageField control={form.control} />

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
