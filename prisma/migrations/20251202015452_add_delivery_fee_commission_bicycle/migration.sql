/*
  Warnings:

  - Made the column `vehicle` on table `Driver` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `deliveryAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "vehicleType" TEXT NOT NULL DEFAULT 'bicycle',
ALTER COLUMN "vehicle" SET NOT NULL,
ALTER COLUMN "vehicle" SET DEFAULT 'bicycle';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryAddress" TEXT NOT NULL,
ADD COLUMN     "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 25,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'Kagiso';
