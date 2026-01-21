"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma.library";
import type { LicenseFormData } from "@/types/dashboard.types";

// Validation schemas
const createLicenseSchema = z.object({
  licenseKey: z.string().min(1, "License key is required"),
  planId: z.number().int().positive("Plan ID must be a positive integer"),
  fingerprint: z.array(z.string()).default([]),
  expiresAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

const updateLicenseSchema = z.object({
  licenseKey: z.string().min(1, "License key is required").optional(),
  planId: z
    .number()
    .int()
    .positive("Plan ID must be a positive integer")
    .optional(),
  fingerprint: z.array(z.string()).optional(),
  expiresAt: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  isExpired: z.boolean().optional(),
});

// Create license
export async function createLicense(data: LicenseFormData) {
  try {
    const validatedData = createLicenseSchema.parse(data);

    // Check if plan exists
    const plan = await prisma.plans.findUnique({
      where: { planId: validatedData.planId },
    });

    if (!plan) {
      throw new Error("Plan not found");
    }

    // Check if license key already exists
    const existingLicense = await prisma.licenseKey.findUnique({
      where: { licenseKey: validatedData.licenseKey },
    });

    if (existingLicense) {
      throw new Error("License key already exists");
    }

    const license = await prisma.licenseKey.create({
      data: {
        licenseKey: validatedData.licenseKey,
        fingerprint: validatedData.fingerprint,
        planId: validatedData.planId,
        expiresAt: new Date(validatedData.expiresAt),
      },
      include: {
        limitSetting: true,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: license,
    };
  } catch (error) {
    console.error("Error creating license:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create license",
    };
  }
}

// Get all licenses
export async function getLicenses() {
  try {
    const licenses = await prisma.licenseKey.findMany({
      include: {
        limitSetting: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: licenses,
    };
  } catch (error) {
    console.error("Error fetching licenses:", error);
    return {
      success: false,
      error: "Failed to fetch licenses",
    };
  }
}

// Get license by ID
export async function getLicense(licenseId: string) {
  try {
    const license = await prisma.licenseKey.findUnique({
      where: { licenseId },
      include: {
        limitSetting: true,
      },
    });

    if (!license) {
      return {
        success: false,
        error: "License not found",
      };
    }

    return {
      success: true,
      data: license,
    };
  } catch (error) {
    console.error("Error fetching license:", error);
    return {
      success: false,
      error: "Failed to fetch license",
    };
  }
}

// Update license
export async function updateLicense(
  licenseId: string,
  data: Partial<LicenseFormData & { isExpired?: boolean }>,
) {
  try {
    const validatedData = updateLicenseSchema.parse(data);

    // Check if license exists
    const existingLicense = await prisma.licenseKey.findUnique({
      where: { licenseId },
    });

    if (!existingLicense) {
      return {
        success: false,
        error: "License not found",
      };
    }

    // Check if plan exists if planId is being updated
    if (validatedData.planId) {
      const plan = await prisma.plans.findUnique({
        where: { planId: validatedData.planId },
      });

      if (!plan) {
        throw new Error("Plan not found");
      }
    }

    // Check if license key already exists if being updated
    if (
      validatedData.licenseKey &&
      validatedData.licenseKey !== existingLicense.licenseKey
    ) {
      const duplicateLicense = await prisma.licenseKey.findUnique({
        where: { licenseKey: validatedData.licenseKey },
      });

      if (duplicateLicense) {
        throw new Error("License key already exists");
      }
    }

    const updateData: any = {};

    if (validatedData.licenseKey !== undefined)
      updateData.licenseKey = validatedData.licenseKey;
    if (validatedData.planId !== undefined)
      updateData.planId = validatedData.planId;
    if (validatedData.fingerprint !== undefined)
      updateData.fingerprint = validatedData.fingerprint;
    if (validatedData.expiresAt !== undefined)
      updateData.expiresAt = new Date(validatedData.expiresAt);
    if (validatedData.isExpired !== undefined)
      updateData.isExpired = validatedData.isExpired;

    const license = await prisma.licenseKey.update({
      where: { licenseId },
      data: updateData,
      include: {
        limitSetting: true,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: license,
    };
  } catch (error) {
    console.error("Error updating license:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update license",
    };
  }
}

// Delete license
export async function deleteLicense(licenseId: string) {
  try {
    // Check if license exists
    const existingLicense = await prisma.licenseKey.findUnique({
      where: { licenseId },
    });

    if (!existingLicense) {
      return {
        success: false,
        error: "License not found",
      };
    }

    await prisma.licenseKey.delete({
      where: { licenseId },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting license:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete license",
    };
  }
}
