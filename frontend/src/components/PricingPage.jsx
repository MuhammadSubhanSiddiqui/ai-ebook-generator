import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: "Starter",
      desc: "Perfect for hobbyists.",
      monthly: 0,
      yearly: 0,
      features: ["1 eBook Project", "Basic AI Outline", "Standard PDF Export"],
      cta: "Start for Free",
      popular: false,
    },
    {
      name: "Pro Author",
      desc: "For serious writers.",
      monthly: 29,
      yearly: 24,
      features: [
        "Unlimited eBooks",
        "Advanced Gemini AI",
        "PDF, EPUB & Word",
        "Custom Cover Designer",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Agency",
      desc: "For publishing teams.",
      monthly: 99,
      yearly: 79,
      features: [
        "Everything in Pro",
        "Team Collaboration",
        "White-label Export",
        "API Access",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div id="pricing" className="bg-gray-50 py-24 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Choose the plan that fits your writing journey. No hidden fees.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${
                !isYearly ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative h-7 w-14 rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span
                className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  isYearly ? "translate-x-7" : ""
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                isYearly ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Yearly{" "}
              <span className="ml-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-2xl p-8 border transition-all duration-300 ${
                plan.popular
                  ? "border-blue-500 shadow-xl scale-105 z-10"
                  : "border-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500 h-10">{plan.desc}</p>
              </div>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${isYearly ? plan.yearly : plan.monthly}
                </span>
                <span className="text-gray-500">/mo</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <CheckCircle
                      className={`h-5 w-5 shrink-0 ${
                        plan.popular ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                    : "bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-600"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
