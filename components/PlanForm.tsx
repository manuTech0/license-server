"use client";
import { useForm } from "@tanstack/react-form";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Plan, PlanFormData } from "@/types/dashboard.types";

interface PlanFormProps {
  plan?: Plan | null;
  onSubmit: (data: PlanFormData) => void;
  onCancel: () => void;
}

export const PlanForm: React.FC<PlanFormProps> = ({
  plan,
  onSubmit,
  onCancel,
}) => {
  const form = useForm({
    defaultValues: {
      name: plan?.name || "",
      limit: plan?.limit || 0,
      expires: plan?.expires || "",
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <form.Field
          name="name"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Plan Name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter plan name"
              />
            </>
          )}
        />
      </div>

      <div>
        <form.Field
          name="limit"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Device Limit</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(parseInt(e.target.value, 10) || 0)
                }
                placeholder="Enter device limit"
              />
            </>
          )}
        />
      </div>

      <div>
        <form.Field
          name="expires"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Expires</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g., 30 days, 90 days"
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
          {plan ? "Update" : "Create"} Plan
        </Button>
      </div>
    </div>
  );
};
