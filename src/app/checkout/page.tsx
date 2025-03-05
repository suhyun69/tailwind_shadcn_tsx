import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    title: "Free",
    price: "$0/mo",
    features: ["10 users included", "2 GB of storage", "Email support", "Help center access"],
    button: "Sign up for free",
  },
  {
    title: "Pro",
    price: "$15/mo",
    features: ["20 users included", "10 GB of storage", "Priority email support", "Help center access"],
    button: "Get started",
  },
  {
    title: "Enterprise",
    price: "$29/mo",
    features: ["50 users included", "30 GB of storage", "Phone & email support", "Help center access"],
    button: "Contact us",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing</h2>
        <p className="mt-4 text-gray-600">Choose the plan that works best for you.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plan.price}</div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mr-2" /> {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full">{plan.button}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
