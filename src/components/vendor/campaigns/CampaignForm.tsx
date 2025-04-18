import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, X, QrCode, AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { generateQRCode } from "@/utils/qrCodeGenerator";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products/products.api";
import { getPromotions } from "@/lib/api/promotions/promotions.api";
import {
  createCampaign,
  updateCampaign,
  getCampaign,
} from "@/lib/api/campaigns/campaigns.api";
import { Campaign, CampaignStatus, Product, Promotion } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import GetDomain from "@/lib/GetDomain";

// Marketplace constants
const MARKETPLACE_COUNTRIES = [
  "US",
  "CA",
  "MX",
  "GB",
  "FR",
  "DE",
  "IT",
  "ES",
  "IN",
  "JP",
  "NL",
  "SE",
  "AU",
  "BR",
  "SG",
  "TR",
  "SA",
  "AE",
  "PL",
  "EG",
  "ZA",
];

const MARKETPLACE_COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  MX: "Mexico",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  IT: "Italy",
  ES: "Spain",
  IN: "India",
  JP: "Japan",
  NL: "Netherlands",
  SE: "Sweden",
  AU: "Australia",
  BR: "Brazil",
  SG: "Singapore",
  TR: "Turkey",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
  PL: "Poland",
  EG: "Egypt",
  ZA: "South Africa",
};

// Sample campaign for edit mode
const SAMPLE_CAMPAIGN: Partial<Campaign> = {
  id: "1",
  title: "Summer Kitchen Sale",
  promotionId: "1",
  productIds: ["1", "4"],
  marketplaces: ["US", "CA", "GB"],
  isActive: "YES",
};

// Update the Campaign interface to include qrCode
interface CampaignWithQR extends Campaign {
  qrCode?: string;
}

const CampaignForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();

  // Fetch campaign data in edit mode
  const { data: campaignData } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => (id ? getCampaign(id) : null),
    enabled: isEditMode,
  });

  // Fetch all products for the company
  const { data: productsResponse = { data: [] } } = useQuery<{
    data: Product[];
    totalPages: number;
    totalCount: number;
  }>({
    queryKey: ["products", user?.companyId],
    queryFn: () => getProducts({ companyId: user?.companyId }),
    enabled: !!user?.companyId,
  });

  // Fetch promotions for the company
  const { data: promotionsResponse = { data: [] } } = useQuery<{
    data: Promotion[];
    totalPages: number;
    totalCount: number;
  }>({
    queryKey: ["promotions", user?.companyId],
    queryFn: () => getPromotions({ companyId: user?.companyId }),
    enabled: !!user?.companyId,
  });

  const [formData, setFormData] = useState<Partial<CampaignWithQR>>({
    title: "",
    isActive: "YES",
    promotionId: "",
    productIds: [],
    marketplaces: [],
  });

  const [qrCode, setQrCode] = useState<string>("");
  const [campaignUrl, setCampaignUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when campaign data is loaded
  useEffect(() => {
    if (isEditMode && campaignData) {
      setFormData({
        title: campaignData.title,
        promotionId: campaignData.promotionId,
        productIds: campaignData.productIds,
        marketplaces: campaignData.marketplaces,
        isActive: campaignData.isActive,
      });

      setCampaignUrl(`${GetDomain()}/review/${campaignData.id}`);

      // Generate QR code for the campaign URL
      generateQRCode({
        value: `${GetDomain()}/review/${campaignData.id}`,
        size: 200,
        bgColor: "#FFFFFF",
        fgColor: "#000000",
        level: "H",
        includeMargin: true,
      }).then((qrCodeImageUrl) => {
        setQrCode(qrCodeImageUrl);
      });
    }
  }, [campaignData, isEditMode]);

  // Generate a new QR code when the campaign URL changes
  useEffect(() => {
    if (!campaignUrl && !isEditMode) {
      const url = `${GetDomain()}/review/${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`;
      setCampaignUrl(url);

      generateQRCode({
        value: url,
        size: 200,
        bgColor: "#FFFFFF",
        fgColor: "#000000",
        level: "H",
        includeMargin: true,
      }).then((qrCodeImageUrl) => {
        setQrCode(qrCodeImageUrl);
      });
    }
  }, [campaignUrl, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "claims" ? Number(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (productId: string) => {
    setFormData((prev) => {
      const currentProductIds = prev.productIds || [];
      const productIdNum = Number(productId);

      // Toggle the product selection
      const newProductIds = currentProductIds.includes(productIdNum)
        ? currentProductIds.filter((id) => id !== productIdNum)
        : [...currentProductIds, productIdNum];

      return { ...prev, productIds: newProductIds };
    });
  };

  const handleMarketplaceSelect = (marketplace: string) => {
    setFormData((prev) => ({
      ...prev,
      marketplaces: prev.marketplaces?.includes(marketplace)
        ? prev.marketplaces.filter((m) => m !== marketplace)
        : [...(prev.marketplaces || []), marketplace],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (
        !formData.title ||
        !formData.promotionId ||
        !formData.productIds?.length ||
        !formData.marketplaces?.length
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields",
        });
        return;
      }

      if (!user?.companyId) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "You need to be associated with a company to create a campaign",
        });
        return;
      }

      const campaignData = {
        title: formData.title,
        isActive: formData.isActive || "YES",
        promotionId: formData.promotionId,
        productIds: Array.isArray(formData.productIds)
          ? formData.productIds
          : [formData.productIds],
        marketplaces: Array.isArray(formData.marketplaces)
          ? formData.marketplaces
          : [formData.marketplaces],
      };

      if (isEditMode && id) {
        await updateCampaign(id, campaignData);
        toast({
          title: "Campaign updated",
          description: "Your campaign has been updated successfully",
          variant: "default",
        });
      } else {
        await createCampaign(campaignData);
        toast({
          title: "Campaign created",
          description: "Your campaign has been created successfully",
          variant: "default",
        });
      }

      navigate("/vendor-dashboard/campaigns");
    } catch (error) {
      console.error("Error submitting campaign:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit campaign. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const products = productsResponse.data;
  const promotions = promotionsResponse.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="promotionId">Promotion</Label>
              <Select
                value={formData.promotionId?.toString()}
                onValueChange={(value) =>
                  handleSelectChange("promotionId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a promotion" />
                </SelectTrigger>
                <SelectContent>
                  {promotions.map((promotion) => (
                    <SelectItem
                      key={promotion.id}
                      value={promotion.id.toString()}
                    >
                      {promotion.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Products</Label>
              <div className="grid grid-cols-1 gap-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      id={`product-${product.id}`}
                      checked={formData.productIds?.includes(
                        Number(product.id)
                      )}
                      onChange={() =>
                        handleProductSelect(product.id.toString())
                      }
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor={`product-${product.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{product.title}</span>
                        {product.asin && (
                          <span className="text-sm text-gray-500">
                            ASIN: {product.asin}
                          </span>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {formData.productIds?.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  Please select at least one product
                </p>
              )}
            </div>

            <div>
              <Label>Marketplaces</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {MARKETPLACE_COUNTRIES.map((country) => (
                  <div
                    key={country}
                    className="flex items-center space-x-2 p-2 border rounded-md"
                  >
                    <input
                      type="checkbox"
                      id={`marketplace-${country}`}
                      checked={formData.marketplaces?.includes(country)}
                      onChange={() => {
                        const newMarketplaces = formData.marketplaces?.includes(
                          country
                        )
                          ? formData.marketplaces.filter((m) => m !== country)
                          : [...(formData.marketplaces || []), country];
                        handleSelectChange("marketplaces", newMarketplaces);
                      }}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor={`marketplace-${country}`}
                      className="flex-1 cursor-pointer"
                    >
                      {MARKETPLACE_COUNTRY_NAMES[country]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive === "YES"}
                onCheckedChange={(checked) =>
                  handleSelectChange("isActive", checked ? "YES" : "NO")
                }
              />
              <Label htmlFor="isActive">Active Campaign</Label>
            </div>
          </div>

          {qrCode && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src={qrCode}
                      alt="Campaign QR Code"
                      className="w-48 h-48"
                    />
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        Scan to access campaign
                      </p>
                      <p className="text-xs text-gray-400 break-all">
                        {campaignUrl}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(campaignUrl);
                        toast({
                          title: "URL Copied",
                          description:
                            "Campaign URL has been copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy URL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/vendor-dashboard/campaigns")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : isEditMode
              ? "Update Campaign"
              : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;
