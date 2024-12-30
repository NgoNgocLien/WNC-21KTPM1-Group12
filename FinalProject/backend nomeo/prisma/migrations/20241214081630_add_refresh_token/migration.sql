-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "account_number" VARCHAR(20) NOT NULL,
    "account_balance" DECIMAL(15,2) NOT NULL,
    "id_customer" INTEGER NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "refresh_token" TEXT,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "public_key" TEXT NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "id_customer" INTEGER NOT NULL,
    "contact_account_number" VARCHAR(20) NOT NULL,
    "id_bank" INTEGER NOT NULL,
    "nickname" VARCHAR(100),

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "refresh_token" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debt_deletions" (
    "id" SERIAL NOT NULL,
    "id_debt" INTEGER NOT NULL,
    "id_deleter" INTEGER NOT NULL,
    "delete_message" TEXT,
    "deletion_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "debt_deletions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debt_payments" (
    "id" SERIAL NOT NULL,
    "id_debt" INTEGER NOT NULL,
    "id_transaction" INTEGER NOT NULL,

    CONSTRAINT "debt_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debts" (
    "id" SERIAL NOT NULL,
    "id_creditor" INTEGER NOT NULL,
    "id_debtor" INTEGER NOT NULL,
    "debt_amount" DECIMAL(15,2) NOT NULL,
    "debt_message" TEXT,
    "status" VARCHAR(10),

    CONSTRAINT "debts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" SERIAL NOT NULL,
    "id_employee" INTEGER NOT NULL,
    "id_customer" INTEGER NOT NULL,
    "deposit_amount" DECIMAL(15,2) NOT NULL,
    "deposit_message" TEXT,
    "deposit_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "refresh_token" TEXT,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "id_recipient" INTEGER NOT NULL,
    "recipient_type" VARCHAR(10),
    "notification_title" VARCHAR(100) NOT NULL,
    "notification_body" TEXT NOT NULL,
    "notification_data" JSONB,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "sender_account_number" VARCHAR(20) NOT NULL,
    "id_sender_bank" INTEGER NOT NULL,
    "recipient_account_number" VARCHAR(20) NOT NULL,
    "id_recipient_bank" INTEGER NOT NULL,
    "transaction_amount" DECIMAL(15,2) NOT NULL,
    "transaction_message" TEXT,
    "fee_payment_method" VARCHAR(10),
    "transaction_time" TIMESTAMP(6) NOT NULL,
    "digital_signature" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_account_number_key" ON "accounts"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "customers_username_key" ON "customers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "employees_username_key" ON "employees"("username");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_phone_key" ON "employees"("phone");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_id_bank_fkey" FOREIGN KEY ("id_bank") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "debt_deletions" ADD CONSTRAINT "debt_deletions_id_debt_fkey" FOREIGN KEY ("id_debt") REFERENCES "debts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "debt_deletions" ADD CONSTRAINT "debt_deletions_id_deleter_fkey" FOREIGN KEY ("id_deleter") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "debt_payments" ADD CONSTRAINT "debt_payments_id_debt_fkey" FOREIGN KEY ("id_debt") REFERENCES "debts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "debt_payments" ADD CONSTRAINT "debt_payments_id_transaction_fkey" FOREIGN KEY ("id_transaction") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "debts" ADD CONSTRAINT "debts_id_creditor_fkey" FOREIGN KEY ("id_creditor") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "debts" ADD CONSTRAINT "debts_id_debtor_fkey" FOREIGN KEY ("id_debtor") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_id_recipient_fkey" FOREIGN KEY ("id_recipient") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_recipient_bank_fkey" FOREIGN KEY ("id_recipient_bank") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_id_sender_bank_fkey" FOREIGN KEY ("id_sender_bank") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
