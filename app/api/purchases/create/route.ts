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
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { amount, currency, formId } = await req.json();

    // In production, integrate with Razorpay/Stripe here
    // For now, create purchase directly
    const purchase = await prisma.formPurchase.create({
      data: {
        userId: user.id,
        amount: amount || 10,
        currency: currency || "INR",
        status: "completed",
        formId: formId || null,
        features: {
          conditionalLogic: true,
          fileUpload: true,
          advancedAnalytics: true,
          customValidation: true,
          exportData: true,
          emailNotifications: true,
          customThankYou: true,
        },
      },
    });

    // If formId is provided, update the form to mark it as paid
    if (formId) {
      await prisma.form.update({
        where: { id: formId },
        data: {
          isPaid: true,
          purchaseId: purchase.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      purchase,
      message: "Form purchased successfully",
    });
  } catch (error) {
    console.error("Purchase creation error:", error);
    return NextResponse.json(
      { error: "Failed to create purchase" },
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
      include: {
        purchases: {
          include: {
            form: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      purchases: user.purchases,
      totalPurchases: user.purchases.length,
    });
  } catch (error) {
    console.error("Purchase fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
