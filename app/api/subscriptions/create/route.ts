import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has an active subscription
    if (user.subscription && user.subscription.status === "active") {
      const endDate = new Date(user.subscription.endDate);
      if (endDate > new Date()) {
        return NextResponse.json(
          { error: "You already have an active subscription" },
          { status: 400 }
        );
      }
    }

    const { amount, currency } = await req.json();

    // In production, integrate with Razorpay/Stripe here
    // For now, create subscription directly
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Add 1 month

    const subscription = await prisma.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        plan: "organization",
        status: "active",
        amount: amount || 300,
        currency: currency || "INR",
        startDate,
        endDate,
        autoRenew: true,
      },
      update: {
        status: "active",
        amount: amount || 300,
        startDate,
        endDate,
        autoRenew: true,
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
      message: "Subscription activated successfully",
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      subscription: user.subscription,
      hasActiveSubscription:
        user.subscription?.status === "active" &&
        new Date(user.subscription.endDate) > new Date(),
    });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
