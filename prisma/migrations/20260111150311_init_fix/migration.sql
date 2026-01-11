-- CreateTable
CREATE TABLE "Emission" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_karbon" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Emission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmissionDetail" (
    "id" TEXT NOT NULL,
    "emission_id" TEXT NOT NULL,
    "produk" TEXT NOT NULL,
    "emisi" DOUBLE PRECISION NOT NULL,
    "kategori" TEXT NOT NULL,

    CONSTRAINT "EmissionDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmissionDetail" ADD CONSTRAINT "EmissionDetail_emission_id_fkey" FOREIGN KEY ("emission_id") REFERENCES "Emission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
