import type React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = "" }) => (
  <div className={`w-full overflow-auto ${className}`}>
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <thead className="border-b">{children}</thead>;

export const TableBody: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <tbody className="[&_tr:last-child]:border-0">{children}</tbody>;

export const TableRow: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    {children}
  </tr>
);

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHead: React.FC<TableHeadProps> = ({
  children,
  className = "",
}) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${className}`}
  >
    {children}
  </th>
);

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = "",
  colSpan,
}) => (
  <td className={`p-4 align-middle ${className}`} colSpan={colSpan}>
    {children}
  </td>
);
