-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "subunidade" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);
