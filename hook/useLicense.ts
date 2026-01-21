import { useState } from "react";
import type { LicenseKey } from "@/types/dashboard.types";

const initialLicenses: LicenseKey[] = [
  {
    licenseId: "lic_001",
    licenseKey: "XXXX-XXXX-XXXX-XXXX",
    fingerprint: ["device1", "device2"],
    planId: 1,
    isExpired: false,
    expiresAt: new Date("2026-04-19"),
    usedAt: new Date("2026-01-15"),
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-01-15"),
  },
];

export const useLicenses = () => {
  const [licenses, setLicenses] = useState<LicenseKey[]>(initialLicenses);

  const createLicense = (data: any): LicenseKey => {
    const newLicense: LicenseKey = {
      ...data,
      licenseId: `lic_${Date.now()}`,
      isExpired: false,
      expiresAt: new Date(data.expiresAt),
      createdAt: new Date(),
      updatedAt: new Date(),
      usedAt: null,
    };
    setLicenses([...licenses, newLicense]);
    return newLicense;
  };

  const updateLicense = (licenseId: string, data: any): void => {
    setLicenses(
      licenses.map((l) =>
        l.licenseId === licenseId
          ? {
              ...l,
              ...data,
              expiresAt: new Date(data.expiresAt),
              updatedAt: new Date(),
            }
          : l,
      ),
    );
  };

  const deleteLicense = (licenseId: string): void => {
    setLicenses(licenses.filter((l) => l.licenseId !== licenseId));
  };

  return {
    licenses,
    createLicense,
    updateLicense,
    deleteLicense,
  };
};
