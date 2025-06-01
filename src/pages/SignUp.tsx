
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCategories } from '@/hooks/useCategories';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface SignUpFormData {
  businessName: string;
  lineOfBusinessId: string;
  subscriptionId: string;
  websiteUrl: string;
  narrative: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cellPhoneNumber: string;
  emailAddress: string;
  locationName: string;
  locationDisplayType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan') || '';
  
  const { data: categories } = useCategories();
  const { data: subscriptions } = useSubscriptions();
  
  const form = useForm<SignUpFormData>({
    defaultValues: {
      businessName: '',
      lineOfBusinessId: '',
      subscriptionId: selectedPlan,
      websiteUrl: '',
      narrative: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      cellPhoneNumber: '',
      emailAddress: '',
      locationName: '',
      locationDisplayType: 'CITY_STATE_ZIP',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      userName: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        producerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        producerRequest: {
          producerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          businessName: data.businessName,
          lineOfBusinessId: data.lineOfBusinessId,
          subscriptionId: data.subscriptionId,
          subscriptionType: "ADMIN",
          invoiceCycleType: "MONTHLY",
          websiteUrl: data.websiteUrl,
          narrative: data.narrative
        },
        primaryContact: {
          contactId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          producerLocationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          producerContactType: "PRIMARY",
          displayContactType: "NO_DISPLAY",
          genericContactName: `${data.firstName} ${data.lastName}`,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          cellPhoneNumber: data.cellPhoneNumber,
          emailAddress: data.emailAddress
        },
        primaryLocation: {
          locationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          locationName: data.locationName,
          locationType: "HOME_OFFICE_PRIMARY",
          locationDisplayType: data.locationDisplayType,
          active: true,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          addressLine3: "",
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          latitude: "",
          longitude: "",
          websiteUrl: data.websiteUrl
        },
        masterUserCredentials: {
          producerContactId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          firstName: data.firstName,
          lastName: data.lastName,
          businessPhone: data.phoneNumber,
          cellPhone: data.cellPhoneNumber,
          emailAddress: data.emailAddress,
          userName: data.userName,
          credentials: data.password
        }
      };

      console.log('Submitting sign-up data:', payload);

      const response = await fetch('http://services.greenyp.com/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("Account created successfully! Welcome to GreenYP!");
        navigate('/');
      } else {
        const errorData = await response.text();
        console.error('Sign-up error:', errorData);
        toast.error("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Create Your GreenYP Account
              </h1>
              <p className="text-lg text-gray-600">
                Join thousands of green industry professionals growing their business
              </p>
              {selectedPlan && (
                <div className="mt-4 p-3 bg-greenyp-100 rounded-lg">
                  <p className="text-greenyp-800 font-medium">
                    Selected Plan: {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                  </p>
                </div>
              )}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Business Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-greenyp-800">Business Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your business name" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lineOfBusinessId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Line of Business *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your business type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories?.map((category) => (
                                  <SelectItem key={category.lineOfBusinessId} value={category.lineOfBusinessId}>
                                    {category.lineOfBusinessName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subscriptionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subscription Plan *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subscription plan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subscriptions?.filter(sub => !sub.comingSoon).map((subscription) => (
                                  <SelectItem key={subscription.subscriptionId} value={subscription.subscriptionId}>
                                    {subscription.displayName} - {subscription.formattedMonthlyPrice}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="websiteUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.yourbusiness.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="narrative"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your business, services, and what makes you unique..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-greenyp-800">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your first name" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your last name" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emailAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Phone *</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cellPhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cell Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Location Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-greenyp-800">Business Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="locationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Main Office, Headquarters, etc." {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="locationDisplayType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location Display Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select display type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CITY_STATE_ZIP">
                                  Display only the city, state, and zip code in search results
                                </SelectItem>
                                <SelectItem value="FULL_ADDRESS">
                                  Display the full address in the search results
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 1 *</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                              <Input placeholder="Suite, unit, building, floor, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter state" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter postal code" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Account Credentials */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-greenyp-800">Account Credentials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username *</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div></div>

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password *</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter password" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password *</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm password" {...field} required />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center pt-6">
                  <Button 
                    type="submit" 
                    className="bg-greenyp-600 hover:bg-greenyp-700 text-white px-8 py-3 text-lg"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  By creating an account, you agree to our{' '}
                  <a href="/terms" className="underline hover:text-greenyp-600">Terms of Service</a>{' '}
                  and{' '}
                  <a href="/privacy" className="underline hover:text-greenyp-600">Privacy Policy</a>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
