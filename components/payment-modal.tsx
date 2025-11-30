"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, Crown, Sparkles, CreditCard, Building2 } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planType: "subscription" | "form";
  formId?: string;
  onSuccess?: () => void;
}

export function PaymentModal({ open, onOpenChange, planType, formId, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);

  const planDetails = {
    subscription: {
      title: "Organization Bundle",
      price: 300,
      description: "Unlimited forms with all premium features",
      icon: Building2,
      features: [
        "Unlimited forms",
        "All premium features",
        "Team collaboration",
        "Priority support",
        "Custom domain",
        "API access",
      ],
    },
    form: {
      title: "Premium Form",
      price: 10,
      description: "One form with exclusive features",
      icon: Sparkles,
      features: [
        "Conditional logic",
        "File uploads (10MB)",
        "Advanced analytics",
        "Custom validation",
        "Export to CSV/Excel",
        "Email notifications",
      ],
    },
  };

  const plan = planDetails[planType];
  const Icon = plan.icon;

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // In production, initialize Razorpay/Stripe here
      const endpoint = planType === "subscription" 
        ? "/api/subscriptions/create"
        : "/api/purchases/create";
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price,
          currency: "INR",
          formId: formId || null,
        }),
      });

      if (response.ok) {
        onSuccess?.();
        onOpenChange(false);
      } else {
        const data = await response.json();
        alert(data.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-6 w-6 text-primary" />
            <DialogTitle className="text-2xl">{plan.title}</DialogTitle>
          </div>
          <DialogDescription>{plan.description}</DialogDescription>
        </DialogHeader>

        <Card className="p-4 border-2 border-primary/20">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold">₹{plan.price}</span>
            <span className="text-muted-foreground">
              {planType === "subscription" ? "/ month" : "one-time"}
            </span>
          </div>

          <div className="space-y-2">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{plan.price}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">GST (18%)</span>
            <span>₹{Math.round(plan.price * 0.18)}</span>
          </div>
          <div className="border-t pt-2 flex items-center justify-between font-bold">
            <span>Total</span>
            <span>₹{plan.price + Math.round(plan.price * 0.18)}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={loading} className="gap-2">
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Pay ₹{plan.price + Math.round(plan.price * 0.18)}
              </>
            )}
          </Button>
        </DialogFooter>

        <p className="text-xs text-center text-muted-foreground">
          {planType === "subscription" 
            ? "Your subscription will auto-renew monthly. Cancel anytime."
            : "One-time payment. Lifetime access to premium features for this form."
          }
        </p>
      </DialogContent>
    </Dialog>
  );
}
