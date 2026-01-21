"use client";
import { Edit, Trash2 } from "lucide-react";
import type React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LicenseKey, Plan } from "@/types/dashboard.types";

interface LicensesTableProps {
  licenses: LicenseKey[];
  plans: Plan[];
  onEdit: (license: LicenseKey) => void;
  onDelete: (licenseId: string) => void;
}

export const LicensesTable: React.FC<LicensesTableProps> = ({
  licenses,
  plans,
  onEdit,
  onDelete,
}) => {
  const getPlanName = (planId: number): string => {
    const plan = plans.find((p) => p.planId === planId);
    return plan?.name || "Unknown";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>License Key</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Fingerprints</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expires At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {licenses.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-muted-foreground"
            >
              No licenses found
            </TableCell>
          </TableRow>
        ) : (
          licenses.map((license) => (
            <TableRow key={license.licenseId}>
              <TableCell className="font-mono text-sm">
                {license.licenseKey}
              </TableCell>
              <TableCell>{getPlanName(license.planId)}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {license.fingerprint.length} devices
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={license.isExpired ? "destructive" : "default"}>
                  {license.isExpired ? "Expired" : "Active"}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(license.expiresAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(license)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(license.licenseId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
