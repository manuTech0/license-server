"use client";
import { Key, LogOut, Package, Plus } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { LicenseForm } from "@/components/LicenseForm";
import { LicensesTable } from "@/components/LicenseTable";
import { PlanForm } from "@/components/PlanForm";
import { PlansTable } from "@/components/PlanTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LicenseKey, Plan } from "@/types/dashboard.types";
import { signOut } from "next-auth/react";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "@/app/actions/plan";
import {
  getLicenses,
  createLicense,
  updateLicense,
  deleteLicense,
} from "@/app/actions/license";

interface Message {
  text: string;
  type: "success" | "error";
}

export const Dashboard: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [licenses, setLicenses] = useState<LicenseKey[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingLicense, setEditingLicense] = useState<LicenseKey | null>(null);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isLicenseDialogOpen, setIsLicenseDialogOpen] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansResult, licensesResult] = await Promise.all([
          getPlans(),
          getLicenses(),
        ]);

        if (plansResult.success && plansResult.data) {
          setPlans(plansResult.data);
        }
        if (licensesResult.success && licensesResult.data) {
          setLicenses(licensesResult.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showMessage("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Plan handlers
  const handleCreatePlan = async (data: any) => {
    const result = await createPlan(data);
    if (result.success && result.data) {
      setPlans([...plans, result.data]);
      setIsPlanDialogOpen(false);
      showMessage("Plan created successfully");
    } else {
      showMessage(result.error || "Failed to create plan", "error");
    }
  };

  const handleUpdatePlan = async (data: any) => {
    if (editingPlan) {
      const result = await updatePlan(editingPlan.planId, data);
      if (result.success && result.data) {
        setPlans(
          plans.map((p) => (p.planId === editingPlan.planId ? result.data : p)),
        );
        setEditingPlan(null);
        setIsPlanDialogOpen(false);
        showMessage("Plan updated successfully");
      } else {
        showMessage(result.error || "Failed to update plan", "error");
      }
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      const result = await deletePlan(planId);
      if (result.success) {
        setPlans(plans.filter((p) => p.planId !== planId));
        showMessage("Plan deleted successfully");
      } else {
        showMessage(result.error || "Failed to delete plan", "error");
      }
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setIsPlanDialogOpen(true);
  };

  // License handlers
  const handleCreateLicense = async (data: any) => {
    const result = await createLicense(data);
    if (result.success && result.data) {
      setLicenses([...licenses, result.data]);
      setIsLicenseDialogOpen(false);
      showMessage("License created successfully");
    } else {
      showMessage(result.error || "Failed to create license", "error");
    }
  };

  const handleUpdateLicense = async (data: any) => {
    if (editingLicense) {
      const result = await updateLicense(editingLicense.licenseId, data);
      if (result.success && result.data) {
        setLicenses(
          licenses.map((l) =>
            l.licenseId === editingLicense.licenseId ? result.data : l,
          ),
        );
        setEditingLicense(null);
        setIsLicenseDialogOpen(false);
        showMessage("License updated successfully");
      } else {
        showMessage(result.error || "Failed to update license", "error");
      }
    }
  };

  const handleDeleteLicense = async (licenseId: string) => {
    if (confirm("Are you sure you want to delete this license?")) {
      const result = await deleteLicense(licenseId);
      if (result.success) {
        setLicenses(licenses.filter((l) => l.licenseId !== licenseId));
        showMessage("License deleted successfully");
      } else {
        showMessage(result.error || "Failed to delete license", "error");
      }
    }
  };

  const handleEditLicense = (license: LicenseKey) => {
    setEditingLicense(license);
    setIsLicenseDialogOpen(true);
  };

  const handleClosePlanDialog = () => {
    setEditingPlan(null);
    setIsPlanDialogOpen(false);
  };

  const handleCloseLicenseDialog = () => {
    setEditingLicense(null);
    setIsLicenseDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              License Management
            </h1>
            <p className="text-muted-foreground">
              Manage your plans and license keys
            </p>
          </div>
        </div>

        {message && (
          <Alert
            className={
              message.type === "success" ? "bg-green-50 border-green-200" : ""
            }
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="plans" className="space-y-4">
          <TabsList>
            <TabsTrigger value="plans" className="gap-2">
              <Package className="h-4 w-4" />
              Plans
            </TabsTrigger>
            <TabsTrigger value="licenses" className="gap-2">
              <Key className="h-4 w-4" />
              License Keys
            </TabsTrigger>
            <TabsTrigger
              value="logout"
              className="gap-2"
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                })
              }
            >
              <LogOut size={4} />
              Logout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Plans</CardTitle>
                    <CardDescription>
                      Manage subscription plans and their limits
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isPlanDialogOpen}
                    onOpenChange={setIsPlanDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingPlan(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingPlan ? "Edit Plan" : "Create New Plan"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingPlan
                            ? "Update the plan details below"
                            : "Fill in the details to create a new plan"}
                        </DialogDescription>
                      </DialogHeader>
                      <PlanForm
                        plan={editingPlan}
                        onSubmit={
                          editingPlan ? handleUpdatePlan : handleCreatePlan
                        }
                        onCancel={handleClosePlanDialog}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <PlansTable
                  plans={plans}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="licenses" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>License Keys</CardTitle>
                    <CardDescription>
                      Manage license keys and their assignments
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isLicenseDialogOpen}
                    onOpenChange={setIsLicenseDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingLicense(null)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add License
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingLicense
                            ? "Edit License"
                            : "Create New License"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingLicense
                            ? "Update the license details below"
                            : "Fill in the details to create a new license"}
                        </DialogDescription>
                      </DialogHeader>
                      <LicenseForm
                        license={editingLicense}
                        plans={plans}
                        onSubmit={
                          editingLicense
                            ? handleUpdateLicense
                            : handleCreateLicense
                        }
                        onCancel={handleCloseLicenseDialog}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <LicensesTable
                  licenses={licenses}
                  plans={plans}
                  onEdit={handleEditLicense}
                  onDelete={handleDeleteLicense}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
