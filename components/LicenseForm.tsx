"use client";
import { useForm } from "@tanstack/react-form";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LicenseKey, Plan } from "@/types/dashboard.types";
import { generateLicenseId } from "@/lib/utils.library";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";

interface LicenseFormProps {
  license?: LicenseKey | null;
  plans: Plan[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const LicenseForm: React.FC<LicenseFormProps> = ({
  license,
  plans,
  onSubmit,
  onCancel,
}) => {
  const [randomLicense, setRandomLicense] = useState<string>(
    generateLicenseId(),
  );
  const form = useForm({
    defaultValues: {
      licenseKey: license?.licenseKey || randomLicense,
      planId: license?.planId || plans[0]?.planId || 0,
      fingerprint: license?.fingerprint?.join(", ") || "",
      expiresAt: license?.expiresAt
        ? new Date(license.expiresAt).toISOString().split("T")[0]
        : "",
    },
    onSubmit: async ({ value }) => {
      const fingerprintArray = value.fingerprint
        .split(",")
        .map((f: string) => f.trim())
        .filter((f: string) => f);

      onSubmit({
        ...value,
        fingerprint: fingerprintArray,
        planId: parseInt(value.planId.toString(), 10),
      });
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <form.Field
          name="licenseKey"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>License Key</Label>
              <div className="flex">
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  disabled
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                />

                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={() => setRandomLicense(generateLicenseId())}
                >
                  <RefreshCcw />
                </Button>
              </div>
            </>
          )}
        />
      </div>

      <div>
        <form.Field
          name="planId"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Plan</Label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {plans.map((plan) => (
                  <option key={plan.planId} value={plan.planId}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </>
          )}
        />
      </div>

      <div>
        <form.Field
          name="fingerprint"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Fingerprints (comma separated)</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="device1, device2, device3"
              />
            </>
          )}
        />
      </div>

      <div>
        <form.Field
          name="expiresAt"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Expires At</Label>
              <Input
                id={field.name}
                name={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </>
          )}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {license ? "Update" : "Create"} License
        </Button>
      </div>
    </div>
  );
};
