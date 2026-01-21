"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma.library";
import type { PlanFormData } from "@/types/dashboard.types";

// Validation schemas
const createPlanSchema = z.object({
  name: z
    .string()
    .min(1, "Plan name is required")
    .max(100, "Plan name must be less than 100 characters"),
  limit: z.number().int().positive("Limit must be a positive integer"),
  expires: z.string().min(1, "Expires is required"),
});

const updatePlanSchema = z.object({
  name: z
    .string()
    .min(1, "Plan name is required")
    .max(100, "Plan name must be less than 100 characters")
    .optional(),
  limit: z
    .number()
    .int()
    .positive("Limit must be a positive integer")
    .optional(),
  expires: z.string().min(1, "Expires is required").optional(),
});

// Create plan
export async function createPlan(data: PlanFormData) {
  try {
    const validatedData = createPlanSchema.parse(data);

    // Check if plan name already exists
    const existingPlan = await prisma.plans.findFirst({
      where: { name: validatedData.name },
    });

    if (existingPlan) {
      throw new Error("Plan name already exists");
    }

    const plan = await prisma.plans.create({
      data: validatedData,
      include: {
        licenseKey: true,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: plan,
    };
  } catch (error) {
    console.error("Error creating plan:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create plan",
    };
  }
}

// Get all plans
export async function getPlans() {
  try {
    const plans = await prisma.plans.findMany({
      include: {
        licenseKey: true,
      },
      orderBy: {
        planId: "asc",
      },
    });

    return {
      success: true,
      data: plans,
    };
  } catch (error) {
    console.error("Error fetching plans:", error);
    return {
      success: false,
      error: "Failed to fetch plans",
    };
  }
}

// Get plan by ID
export async function getPlan(planId: number) {
  try {
    const plan = await prisma.plans.findUnique({
      where: { planId },
      include: {
        licenseKey: true,
      },
    });

    if (!plan) {
      return {
        success: false,
        error: "Plan not found",
      };
    }

    return {
      success: true,
      data: plan,
    };
  } catch (error) {
    console.error("Error fetching plan:", error);
    return {
      success: false,
      error: "Failed to fetch plan",
    };
  }
}

// Update plan
export async function updatePlan(planId: number, data: Partial<PlanFormData>) {
  try {
    const validatedData = updatePlanSchema.parse(data);

    // Check if plan exists
    const existingPlan = await prisma.plans.findUnique({
      where: { planId },
    });

    if (!existingPlan) {
      return {
        success: false,
        error: "Plan not found",
      };
    }

    // Check if plan name already exists if being updated
    if (validatedData.name && validatedData.name !== existingPlan.name) {
      const duplicatePlan = await prisma.plans.findFirst({
        where: { name: validatedData.name },
      });

      if (duplicatePlan) {
        throw new Error("Plan name already exists");
      }
    }

    const plan = await prisma.plans.update({
      where: { planId },
      data: validatedData,
      include: {
        licenseKey: true,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: plan,
    };
  } catch (error) {
    console.error("Error updating plan:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update plan",
    };
  }
}

// Delete plan
export async function deletePlan(planId: number) {
  try {
    // Check if plan exists
    const existingPlan = await prisma.plans.findUnique({
      where: { planId },
      include: {
        licenseKey: true,
      },
    });

    if (!existingPlan) {
      return {
        success: false,
        error: "Plan not found",
      };
    }

    // Check if plan has associated licenses
    if (existingPlan.licenseKey.length > 0) {
      throw new Error("Cannot delete plan that has associated licenses");
    }

    await prisma.plans.delete({
      where: { planId },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting plan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete plan",
    };
  }
}

