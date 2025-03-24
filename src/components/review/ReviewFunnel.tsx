
import { useState, useEffect } from "react";
import { CheckCircle, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReviewForm, { ReviewFormData } from "./ReviewForm";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface ReviewFunnelProps {
  campaignId: string;
  productName: string;
  productImage: string;
  vendor: string;
}

const amazonDomains: Record<string, string> = {
  us: "https://www.amazon.com",
  ca: "https://www.amazon.ca",
  uk: "https://www.amazon.co.uk",
  de: "https://www.amazon.de",
  fr: "https://www.amazon.fr",
  jp: "https://www.amazon.co.jp",
  au: "https://www.amazon.com.au",
};

const FunnelStep = ({ 
  isActive, 
  children 
}: { 
  isActive: boolean; 
  children: React.ReactNode 
}) => (
  <div 
    className={`transition-all duration-500 transform ${
      isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20 absolute hidden"
    }`}
  >
    {children}
  </div>
);

const ReviewFunnel = ({
  campaignId,
  productName,
  productImage,
  vendor,
}: ReviewFunnelProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ReviewFormData | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Update progress indicator based on current step
    setProgress((step / 3) * 100);
  }, [step]);

  const handleSubmit = (data: ReviewFormData) => {
    setFormData(data);
    
    // Animate the step change
    document.querySelector('.funnel-content')?.classList.add('animate-step-change');
    setTimeout(() => {
      setStep(2);
      document.querySelector('.funnel-content')?.classList.remove('animate-step-change');
    }, 300);
    
    // Simulate API call to submit the review
    setTimeout(() => {
      // For 4-5 star ratings, automatically redirect to Amazon
      if (data.rating >= 4) {
        toast({
          title: "Thank you for your positive review!",
          description: "You'll be redirected to Amazon to share your feedback.",
        });
        
        // Set a short timeout to allow the toast to be seen before redirect
        setIsRedirecting(true);
        setTimeout(() => {
          redirectToAmazon(data);
        }, 2000);
      }
    }, 1000);
  };

  const redirectToAmazon = (data: ReviewFormData) => {
    const domain = amazonDomains[data.country] || amazonDomains.us;
    // In a real implementation, you would use the actual ASIN to create the correct URL
    const redirectUrl = `${domain}/review/create-review`;
    
    // Open Amazon in a new tab
    window.open(redirectUrl, "_blank");
    
    // Redirect back to home page
    navigate("/");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const goToNextStep = () => {
    // Animate the step change
    document.querySelector('.funnel-content')?.classList.add('animate-step-change');
    setTimeout(() => {
      setStep(3);
      document.querySelector('.funnel-content')?.classList.remove('animate-step-change');
    }, 300);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Step {step} of 3</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step content */}
      <div className="relative min-h-[400px] flex flex-col justify-center funnel-content">
        <FunnelStep isActive={step === 1}>
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-2">
              How would you rate your experience?
            </h2>
            <p className="text-muted-foreground">
              Your feedback helps {vendor} improve their products and services.
            </p>
          </div>
          <ReviewForm
            productName={productName}
            productImage={productImage}
            campaignId={campaignId}
            onSubmit={handleSubmit}
          />
        </FunnelStep>

        <FunnelStep isActive={step === 2}>
          <div className="text-center space-y-6 py-8 animate-fade-in">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold">
              {formData && formData.rating >= 4
                ? "Thank you for your positive review!"
                : "Thank you for your feedback!"}
            </h2>
            <p className="text-muted-foreground">
              {formData && formData.rating >= 4
                ? isRedirecting 
                  ? "Redirecting you to Amazon..." 
                  : "We're delighted that you enjoyed our product. You'll be redirected to Amazon to share your experience."
                : "We value your honest feedback and will use it to improve our products and services."}
            </p>
            
            {formData && formData.rating < 4 && (
              <Button onClick={goToNextStep} className="mt-6 bg-[#FF9900] text-[#232F3E] hover:bg-orange-500">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {isRedirecting && (
              <div className="flex justify-center mt-4">
                <div className="w-8 h-8 border-4 border-t-[#FF9900] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </FunnelStep>

        <FunnelStep isActive={step === 3}>
          <div className="text-center space-y-6 py-8 animate-fade-in">
            <h2 className="text-2xl font-semibold">
              We appreciate your feedback!
            </h2>
            <p className="text-muted-foreground">
              {formData && formData.email && 
                `We'll send a follow-up email to ${formData.email} to learn more about your experience.`}
            </p>
            <div className="mt-8">
              <Button onClick={handleGoHome} className="bg-[#FF9900] text-[#232F3E] hover:bg-orange-500">
                Return to Home
              </Button>
            </div>
          </div>
        </FunnelStep>
      </div>
    </div>
  );
};

export default ReviewFunnel;
