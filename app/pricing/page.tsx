"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Building2, FileText, Zap, Crown, Lock, Palette, GitBranch, Upload, BarChart, Shield } from "lucide-react";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (planType: "subscription" | "form") => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/pricing");
      return;
    }

    setLoading(planType);
    
    // In production, integrate with payment gateway (Razorpay, Stripe, etc.)
    try {
      const endpoint = planType === "subscription" 
        ? "/api/subscriptions/create"
        : "/api/purchases/create";
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: planType === "subscription" ? 300 : 10,
          currency: "INR",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to payment gateway or dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">FormBuilder</span>
            </Link>
            <div className="flex items-center gap-4">
              {session ? (
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signin">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4" variant="secondary">
          <Sparkles className="h-3 w-3 mr-1" />
          Simple, Transparent Pricing
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Choose the Perfect Plan for Your Needs
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Whether you need one form or unlimited forms for your organization, we've got you covered with powerful features.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Per-Form Plan */}
          <Card className="relative border-2 hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl">Per-Form Purchase</CardTitle>
              </div>
              <CardDescription>
                Perfect for individual forms with exclusive features
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹10</span>
                <span className="text-muted-foreground ml-2">per form</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">One-time payment per form</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">All basic form features</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Organization branding (logo, colors)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Conditional logic branching</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Custom validation rules</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">File upload questions (up to 10MB)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Advanced analytics & charts</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Export responses (CSV, Excel)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Custom thank you page</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Email notifications</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => handlePurchase("form")}
                disabled={loading !== null}
              >
                {loading === "form" ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Purchase Form
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Organization Bundle */}
          <Card className="relative border-2 border-primary shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                <Crown className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl">Organization Bundle</CardTitle>
              </div>
              <CardDescription>
                Unlimited forms with all premium features for your organization
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹300</span>
                <span className="text-muted-foreground ml-2">per month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Unlimited forms</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">All features from Per-Form plan</span>
                </div>
                <div className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Team collaboration</span>
                </div>
                <div className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Priority support</span>
                </div>
                <div className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Custom domain integration</span>
                </div>
                <div className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Advanced security & compliance</span>
                </div>
                <div className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Webhook integrations</span>
                </div>
                <div className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">API access</span>
                </div>
                <div className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">White-label options</span>
                </div>
                <div className="flex items-start gap-2">
                  <Crown className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Usage analytics dashboard</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => handlePurchase("subscription")}
                disabled={loading !== null}
              >
                {loading === "subscription" ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-4 w-4" />
                    Subscribe Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Feature Comparison */}
        <div className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Exclusive Premium Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <GitBranch className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Conditional Logic</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Show or hide questions based on previous answers. Create dynamic forms that adapt to user responses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Upload className="h-10 w-10 text-primary mb-2" />
                <CardTitle>File Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Allow users to upload documents, images, and files directly in your forms with secure storage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get detailed insights with charts, graphs, and data visualization for better decision making.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Palette className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Custom Branding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add your logo, custom colors, and branding to make forms truly yours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Advanced Validation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Set custom validation rules, regex patterns, and complex data validation for accuracy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security, GDPR compliance, and data encryption for peace of mind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I try before I buy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes! You can create basic forms for free. Premium features are unlocked when you purchase a form or subscribe to the organization bundle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We accept UPI, cards, net banking, and wallets through Razorpay for secure payments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens to my forms if I don't renew?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your forms and data remain safe. Premium features will be disabled, but you can re-enable them by renewing your subscription or purchasing individual forms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 FormBuilder. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
              <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
              <Link href="/support" className="hover:text-foreground">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
