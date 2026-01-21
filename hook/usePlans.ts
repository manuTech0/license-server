import { useState } from "react";
import type { Plan, PlanFormData } from "@/types/dashboard.types";

const initialPlans: Plan[] = [
  { planId: 1, name: "Basic", limit: 5, expires: "30 days" },
  { planId: 2, name: "Pro", limit: 20, expires: "90 days" },
];

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);

  const createPlan = (data: PlanFormData): Plan => {
    const newPlan: Plan = {
      ...data,
      planId: Math.max(...plans.map((p) => p.planId), 0) + 1,
    };
    setPlans([...plans, newPlan]);
    return newPlan;
  };

  const updatePlan = (planId: number, data: PlanFormData): void => {
    setPlans(plans.map((p) => (p.planId === planId ? { ...p, ...data } : p)));
  };

  const deletePlan = (planId: number): void => {
    setPlans(plans.filter((p) => p.planId !== planId));
  };

  return {
    plans,
    createPlan,
    updatePlan,
    deletePlan,
  };
};
