-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "LicenseKey" (
    "licenseId" TEXT NOT NULL,
    "licenseKey" TEXT NOT NULL,
    "fingerprint" TEXT[],
    "limit" INTEGER NOT NULL,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LicenseKey_pkey" PRIMARY KEY ("licenseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_password_idx" ON "User"("username", "password");

-- CreateIndex
CREATE INDEX "User_email_password_idx" ON "User"("email", "password");

-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_licenseKey_key" ON "LicenseKey"("licenseKey");

-- CreateIndex
CREATE INDEX "LicenseKey_licenseKey_isExpired_idx" ON "LicenseKey"("licenseKey", "isExpired");
