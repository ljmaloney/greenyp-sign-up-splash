import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import PaymentInformationCard from './PaymentInformationCard';
import Confirmation from './Confirmation';
import { useSearchParams } from 'react-router-dom';

interface FormData {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
}

const PaymentLayout = () => {
  const [searchParams] = useSearchParams();
  const emailValidationToken = searchParams.get('token');
  const isEmailValidated = searchParams.get('isValid') === 'true';
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("payment");
  const [formData, setFormData] = useState<FormData>({
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
  });
  const [progress, setProgress] = useState(50);
  const { toast } = useToast()

  const handleBillingInfoChange = (newBillingInfo: any) => {
    setFormData(prevData => ({ ...prevData, ...newBillingInfo }));
  };

  const handleSubmit = useCallback(() => {
    // Here you would typically send the form data to your server
    console.log("Form Data Submitted:", formData);

    // Show a success toast
    toast({
      title: "Success!",
      description: "Your payment information has been successfully submitted.",
    })

    // Navigate to the confirmation page
    navigate('/classifieds/confirmation', { state: { formData } });
  }, [navigate, formData, toast]);

  return (
    <div className="container mx-auto max-w-4xl mt-8">
      <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>Enter your card details to complete your purchase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm font-medium">Progress</p>
            <Progress value={progress} />
          </div>

          <PaymentInformationCard
            onBillingInfoChange={handleBillingInfoChange}
            emailValidationToken={emailValidationToken}
            isEmailValidated={isEmailValidated}
          />

          <Button className="w-full mt-4" onClick={handleSubmit}>Submit Payment</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentLayout;
