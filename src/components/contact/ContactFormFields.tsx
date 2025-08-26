
import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContactFormData {
  requestType: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactFormFieldsProps {
  control: Control<ContactFormData>;
}

export const RequestTypeField = ({ control }: ContactFormFieldsProps) => (
  <FormField
    control={control}
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
);

export const CompanyNameField = ({ control }: ContactFormFieldsProps) => (
  <FormField
    control={control}
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
);

export const NameField = ({ control }: ContactFormFieldsProps) => (
  <FormField
    control={control}
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
);

export const EmailField = ({ control }: ContactFormFieldsProps) => (
  <FormField
    control={control}
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
);

export const PhoneField = ({ control }: ContactFormFieldsProps) => (
  <FormField
    control={control}
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
);

export const SubjectField = ({ control }: ContactFormFieldsProps) => (
  <FormField
    control={control}
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
);

export const MessageField = ({ control }: ContactFormFieldsProps) => (
  <FormField
    control={control}
    name="message"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-left block">Message *</FormLabel>
        <FormControl>
          <MDEditor
            value={field.value}
            onChange={(val) => field.onChange(val || '')}
            data-color-mode="light"
            height={120}
            preview="edit"
            hideToolbar={false}
            visibleDragbar={false}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
