-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "user_type" TEXT NOT NULL,
    "avatar" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "activation" BOOLEAN NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "airport_code" TEXT NOT NULL,

    CONSTRAINT "airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airline" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "airline_code" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "airline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airplane" (
    "id" SERIAL NOT NULL,
    "airline_id" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "baggage" INTEGER NOT NULL,
    "cabin_baggage" INTEGER NOT NULL,

    CONSTRAINT "airplane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price" (
    "id" SERIAL NOT NULL,
    "flight_id" INTEGER NOT NULL,
    "seat_type" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight" (
    "id" SERIAL NOT NULL,
    "airplane_id" INTEGER NOT NULL,
    "from_airport_id" INTEGER NOT NULL,
    "to_airport_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "departure_time" DATE NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "estimation" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "flight_id" INTEGER NOT NULL,
    "price_id" INTEGER NOT NULL,
    "payment_type_id" INTEGER NOT NULL,
    "booking_code" TEXT NOT NULL,
    "total_passenggers" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "exp" DATE NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passenggers" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "fullname" TEXT NOT NULL,
    "family_name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthday" DATE NOT NULL,
    "nationality" TEXT NOT NULL,
    "no_ktp" TEXT NOT NULL,
    "seat_number" TEXT NOT NULL,

    CONSTRAINT "passenggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "time" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "header" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "isread" BOOLEAN NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "airplane" ADD CONSTRAINT "airplane_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price" ADD CONSTRAINT "price_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_airplane_id_fkey" FOREIGN KEY ("airplane_id") REFERENCES "airplane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_from_airport_id_fkey" FOREIGN KEY ("from_airport_id") REFERENCES "airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_to_airport_id_fkey" FOREIGN KEY ("to_airport_id") REFERENCES "airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_type_id_fkey" FOREIGN KEY ("payment_type_id") REFERENCES "payment_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passenggers" ADD CONSTRAINT "passenggers_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
