"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Crown, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

interface PremiumFeatureProps {
  featureName: string;
  description: string;
  isPremium: boolean;
  children: React.ReactNode;
  formId?: string;
}

export function PremiumFeature({ featureName, description, isPremium, children, formId }: PremiumFeatureProps) {
  const [showModal, setShowModal] = useState(false);

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="relative">
        <div className="opacity-50 pointer-events-none blur-[2px]">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="default"
            className="gap-2"
            onClick={() => setShowModal(true)}
          >
            <Crown className="h-4 w-4" />
            Unlock Premium
          </Button>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <DialogTitle className="text-2xl">Premium Feature</DialogTitle>
            </div>
            <DialogDescription>
              {featureName} is available with premium forms
            </DialogDescription>
          </DialogHeader>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {featureName}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Unlock this form</p>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>
                  <span className="text-2xl font-bold">₹10</span>
                </div>
                <Link href={`/pricing?formId=${formId}`}>
                  <Button className="w-full gap-2">
                    <Crown className="h-4 w-4" />
                    Upgrade This Form
                  </Button>
                </Link>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Organization Bundle</p>
                    <p className="text-sm text-muted-foreground">Unlimited forms</p>
                  </div>
                  <span className="text-2xl font-bold">₹300<span className="text-sm font-normal">/mo</span></span>
                </div>
                <Link href="/pricing">
                  <Button className="w-full gap-2" variant="outline">
                    <Crown className="h-4 w-4" />
                    Get Unlimited Access
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface PremiumBadgeProps {
  className?: string;
}

export function PremiumBadge({ className }: PremiumBadgeProps) {
  return (
    <Badge variant="secondary" className={className}>
      <Crown className="h-3 w-3 mr-1" />
      Premium
    </Badge>
  );
}
