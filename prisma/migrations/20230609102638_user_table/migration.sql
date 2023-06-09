-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "user_type" TEXT NOT NULL,
    "avatar" TEXT,
    "phone" BIGINT,
    "role" TEXT NOT NULL,
    "activation" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
