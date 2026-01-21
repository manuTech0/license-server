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
import { Button } from "@/components/ui/button";
import type { Plan } from "@/types/dashboard.types";

interface PlansTableProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (planId: number) => void;
}

export const PlansTable: React.FC<PlansTableProps> = ({
  plans,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Device Limit</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground"
            >
              No plans found
            </TableCell>
          </TableRow>
        ) : (
          plans.map((plan) => (
            <TableRow key={plan.planId}>
              <TableCell>{plan.planId}</TableCell>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>{plan.limit}</TableCell>
              <TableCell>{plan.expires}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(plan.planId)}
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
