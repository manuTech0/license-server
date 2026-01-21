export interface Plan {
  planId: number;
  name: string;
  limit: number;
  expires: string;
}

export interface LicenseKey {
  licenseId: string;
  licenseKey: string;
  fingerprint: string[];
  planId: number;
  isExpired: boolean;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanFormData {
  name: string;
  limit: number;
  expires: string;
}

export interface LicenseFormData {
  licenseKey: string;
  planId: number;
  fingerprint: string[];
  expiresAt: string;
}
