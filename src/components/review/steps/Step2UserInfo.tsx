
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ReviewFormData } from "../ReviewFunnel";

interface Step2UserInfoProps {
  formData: ReviewFormData;
  updateFormData: (data: Partial<ReviewFormData>) => void;
  onNextStep: () => void;
}

const Step2UserInfo = ({
  formData,
  updateFormData,
  onNextStep,
}: Step2UserInfoProps) => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Partial<Record<keyof ReviewFormData, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    if (errors[name as keyof ReviewFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ReviewFormData, string>> = {};

    // Email validation
    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Name is required
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    // Phone number validation (optional)
    if (formData.phoneNumber && !/^\+?[\d\s-()]{7,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onNextStep();
    } else {
      toast({
        title: "Please check the form",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold text-center">Your Information</h2>
      <p className="text-center text-muted-foreground">
        Please provide your contact information
      </p>

      <div className="space-y-3">
        <Label htmlFor="name">
          Your Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleInputChange}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-3">
        <Label htmlFor="email">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleInputChange}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        <p className="text-xs text-muted-foreground">
          We'll send your gift to this email address. Your email won't be shared with third parties.
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="phoneNumber">
          Phone Number <span className="text-gray-400">(optional)</span>
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className={errors.phoneNumber ? "border-destructive" : ""}
        />
        {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#FF9900] hover:bg-orange-500 text-[#232F3E] font-medium mt-6"
      >
        Next Step
        <ChevronRight className="ml-2 w-4 h-4" />
      </Button>
    </form>
  );
};

export default Step2UserInfo;
