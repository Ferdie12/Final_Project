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
    "airport_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "airport_pkey" PRIMARY KEY ("airport_code")
);

-- CreateTable
CREATE TABLE "airline" (
    "airline_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "airline_pkey" PRIMARY KEY ("airline_code")
);

-- CreateTable
CREATE TABLE "airplane" (
    "id" SERIAL NOT NULL,
    "airplane_code" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "airline_code_fk" TEXT NOT NULL,
    "seat_layout" TEXT NOT NULL,
    "seat_pitch" TEXT NOT NULL,
    "seat_type" TEXT NOT NULL,

    CONSTRAINT "airplane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight" (
    "id" SERIAL NOT NULL,
    "departure_airport" TEXT NOT NULL,
    "airplane_id" INTEGER NOT NULL,
    "airline_code" TEXT NOT NULL,
    "arrival_airport" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "flight_date" TEXT NOT NULL,
    "departure_time" TEXT NOT NULL,
    "arrival_time" TEXT NOT NULL,
    "flight_duration" TEXT NOT NULL,
    "free_baggage" INTEGER NOT NULL,
    "cabin_baggage" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,

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
    "payment_type_id" INTEGER NOT NULL,
    "booking_code" TEXT NOT NULL,
    "total_passengers" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "exp" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "fullname" TEXT,
    "person" TEXT NOT NULL,
    "gender" TEXT,
    "birthday" TEXT,
    "nationality" TEXT,
    "no_ktp" TEXT,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "time" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isread" BOOLEAN NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "airplane" ADD CONSTRAINT "airplane_airline_code_fk_fkey" FOREIGN KEY ("airline_code_fk") REFERENCES "airline"("airline_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_airplane_id_fkey" FOREIGN KEY ("airplane_id") REFERENCES "airplane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_airline_code_fkey" FOREIGN KEY ("airline_code") REFERENCES "airline"("airline_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_departure_airport_fkey" FOREIGN KEY ("departure_airport") REFERENCES "airport"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_arrival_airport_fkey" FOREIGN KEY ("arrival_airport") REFERENCES "airport"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_type_id_fkey" FOREIGN KEY ("payment_type_id") REFERENCES "payment_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
