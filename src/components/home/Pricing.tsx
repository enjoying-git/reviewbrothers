import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FloatingStar from "../ui/floatingStar";
const RandomStars = ({ count = 8 }) => {
  const stars = Array.from({ length: count }, (_, i) => {
    const size = Math.floor(Math.random() * 10) + 12; // 12 to 22 px
    const top = Math.random() * 90 + "%";
    const left = Math.random() * 90 + "%";
    const delay = Math.random() * 5; // 0 to 5s delay

    return (
      <FloatingStar key={i} size={size} delay={delay} style={{ top, left }} />
    );
  });

  return <>{stars}</>;
};

const PricingTier = ({
  title,
  AnnuallyPrice,
  MonthlyPrice,
  description,
  features,
  cta,
  isPopular,
  color,
  buttonColor,
  isAnnual,
}) => {
  return (
    <div
      id="pricing"
      className={
        isPopular
          ? "transform lg:scale-110 flex justify-center"
          : "flex justify-center"
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 150 }}
        whileInView={{ opacity: 1, y: 100 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-[500px] lg:w-[320px] xl:w-[400px] relative flex flex-col p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl border-2 bg-[url('/images/landing/pricing-background.png')]  bg-cover mb-20`}
      >
        <RandomStars count={33} />
        {isPopular && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute -top-3 xl:left-[115px] transform -translate-x-1/2 left-[155px] lg:left-[75px] "
          >
            <div className="relative bg-[#2e3a48] text-white text-xl font-medium px-4 py-1 uppercase shadow-md rounded-t-md">
              Most Popular
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#2e3a48] rotate-45"></div>
            </div>
          </motion.div>
        )}
        <h3 className="text-5xl font-semibold mt-4 mb-2 text-center text-white">
          {title}
        </h3>
        <div className="text-center mt-16 mb-12 text-white text-3xl font-bold">
          <div className="mb-2">
            <span className="text-6xl text-[#3d64f2]">${AnnuallyPrice}</span>
            <span className="text-3lg text-white"> /mo</span>
          </div>
          <div className="text-lg text-green-500 font-semibold">
            (billed annually — save 20%)
          </div>
          <div className="mt-2 text-lg text-white opacity-70">
            or <span className="font-medium">${MonthlyPrice}/mo</span> billed
            monthly
          </div>
          {/* </div> */}
        </div>
        <ul className="space-y-3 mb-8 flex-grow ml-7">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              className="flex items-start text-white text-xl"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {feature.included ? (
                <Check className="w-6 h-6 flex-shrink-0 mt-0.5 text-green-500" />
              ) : (
                <X className="w-6 h-6 flex-shrink-0 mt-0.5 text-red-500" />
              )}
              <span className="ml-3 text-lg">{feature.name}</span>
            </motion.li>
          ))}
        </ul>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="mb-10 mt-10"
        >
          <Button
            className={` w-full bg-[#fc880a] hover:bg-[#f97316] inline text-white px-10 py-5 xl:text-2xl text-2xl lg:text-xl`}
            asChild
          >
            <Link to="/auth/signup">Get Started for Free</Link>
          </Button>
        </motion.div>
        <span className="text-white">* No credit card required</span>
      </motion.div>
    </div>
  );
};

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const toggleBilling = () => setIsAnnual(!isAnnual);

  const tiers = [
    {
      title: "Silver",
      AnnuallyPrice: "49",
      MonthlyPrice: "59",
      description: "Great for small vendors starting out",
      features: [
        { name: "Unlimited Reviews", included: true },
        { name: "Unlimited Leads", included: true },
        { name: "1 Campaign", included: true },
        { name: "1 Promotion", included: true },
        { name: "1 Product", included: true },
        { name: "1 Marketplace", included: true },
        { name: "Collect Seller Feedback", included: false },
        { name: "Meta Pixel Support", included: false },
        { name: "Business Features", included: false },
      ],
      cta: "Start with Silver",
      color: "bg-gray-200 border-gray-400",
      buttonColor: "bg-gray-400 hover:bg-gray-600",
      isPopular: false,
    },
    {
      title: "Gold",
      AnnuallyPrice: "79",
      MonthlyPrice: "99",
      description: "For growing businesses expanding their reach",
      features: [
        { name: "Unlimited Reviews", included: true },
        { name: "Unlimited Leads", included: true },
        { name: "Unlimited Campaigns", included: true },
        { name: "10 Promotions", included: true },
        { name: "30 Products", included: true },
        { name: "All Marketplaces", included: true },
        { name: "Collect Seller Feedback", included: true },
        { name: "Personalized Branding", included: true },
        { name: "Meta Pixel Support", included: true },
      ],
      cta: "Start with Gold",
      isPopular: true,
      color: "bg-yellow-200 border-yellow-500",
      buttonColor: "bg-yellow-400 hover:bg-yellow-600",
    },
    {
      title: "Platinum",
      AnnuallyPrice: "179",
      MonthlyPrice: "199",
      description: "For established businesses scaling at full speed",
      features: [
        { name: "Unlimited Reviews", included: true },
        { name: "Unlimited Leads", included: true },
        { name: "Unlimited Campaigns", included: true },
        { name: "Unlimited Promotions", included: true },
        { name: "Unlimited Products", included: true },
        { name: "All Marketplaces", included: true },
        { name: "Collect Seller Feedback", included: true },
        { name: "Personalized Branding", included: true },
        { name: "Meta Pixel Support", included: true },
        { name: "Multiple Sub-Accounts", included: true },
      ],
      cta: "Start with Platinum",
      color: "bg-blue-200 border-blue-500",
      buttonColor: "bg-blue-400 hover:bg-blue-600",
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-muted/50  max-w-screen">
      <div className="container mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-lg text-muted-foreground mb-6"
        >
          <h2 className="text-[35px] font-semibold mt-2 mb-4 text-center flex items-center justify-center font-[700] text-black">
            Plans Made for &nbsp;
            <img src="images/amazon-logo.png" className="h-16 mt-2" />
            &nbsp; <b>Sellers</b> – Simple, Scalable, Transparent
          </h2>
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-auto">
          {tiers.map((tier, index) => (
            <PricingTier key={index} {...tier} isAnnual={isAnnual} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
