--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+2)
-- Dumped by pg_dump version 16.1

-- Started on 2025-01-09 16:12:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16598)
-- Name: public; Type: SCHEMA; Schema: -; Owner: wnc
--

ALTER SCHEMA public OWNER TO wnc;

--
-- TOC entry 950 (class 1247 OID 17782)
-- Name: customer_status; Type: TYPE; Schema: public; Owner: wnc
--

CREATE TYPE public.customer_status AS ENUM (
    'ACTIVE',
    'DELETED'
);


ALTER TYPE public.customer_status OWNER TO wnc;

--
-- TOC entry 947 (class 1247 OID 17232)
-- Name: debt_status; Type: TYPE; Schema: public; Owner: wnc
--

CREATE TYPE public.debt_status AS ENUM (
    'PENDING',
    'PAID',
    'CANCELED',
    'DECLINED'
);


ALTER TYPE public.debt_status OWNER TO wnc;

--
-- TOC entry 941 (class 1247 OID 17185)
-- Name: employee_status; Type: TYPE; Schema: public; Owner: wnc
--

CREATE TYPE public.employee_status AS ENUM (
    'ACTIVE',
    'DELETED'
);


ALTER TYPE public.employee_status OWNER TO wnc;

--
-- TOC entry 252 (class 1255 OID 17169)
-- Name: validate_deleter(); Type: FUNCTION; Schema: public; Owner: wnc
--

CREATE FUNCTION public.validate_deleter() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Kiểm tra id_deleter có phải là id_creditor hoặc id_debtor không
  IF NOT EXISTS (
    SELECT 1
    FROM debts
    WHERE id = NEW.id_debt
    AND (id_creditor = NEW.id_deleter OR id_debtor = NEW.id_deleter)
  ) THEN
    -- Ném lỗi với mã lỗi tùy chỉnh
    RAISE EXCEPTION 'Invalid deleter ID. Must be either creditor or debtor'
    USING ERRCODE = 'P0001'; -- Mã lỗi tùy chỉnh
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.validate_deleter() OWNER TO wnc;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16599)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO wnc;

--
-- TOC entry 218 (class 1259 OID 16611)
-- Name: accounts; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    account_number character varying(20) NOT NULL,
    account_balance numeric(15,2) NOT NULL,
    id_customer integer NOT NULL
);


ALTER TABLE public.accounts OWNER TO wnc;

--
-- TOC entry 217 (class 1259 OID 16610)
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: wnc
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accounts_id_seq OWNER TO wnc;

--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 217
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- TOC entry 220 (class 1259 OID 16618)
-- Name: admins; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    refresh_token text
);


ALTER TABLE public.admins OWNER TO wnc;

--
-- TOC entry 219 (class 1259 OID 16617)
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: wnc
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO wnc;

--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 219
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- TOC entry 222 (class 1259 OID 16627)
-- Name: banks; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.banks (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    rsa_public_key text,
    logo text,
    secret_key text,
    internal_code text,
    pgp_public_key text,
    external_code text,
    base_url text
);


ALTER TABLE public.banks OWNER TO wnc;

--
-- TOC entry 221 (class 1259 OID 16626)
-- Name: banks_id_seq; Type: SEQUENCE; Schema: public; Owner: wnc
--

CREATE SEQUENCE public.banks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.banks_id_seq OWNER TO wnc;

--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 221
-- Name: banks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.banks_id_seq OWNED BY public.banks.id;


--
-- TOC entry 224 (class 1259 OID 16636)
-- Name: contacts; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    id_customer integer NOT NULL,
    contact_account_number character varying(20) NOT NULL,
    id_bank integer NOT NULL,
    nickname character varying(100),
    contact_fullname text
);


ALTER TABLE public.contacts OWNER TO wnc;

--
-- TOC entry 223 (class 1259 OID 16635)
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: wnc
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_id_seq OWNER TO wnc;

--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 223
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- TOC entry 226 (class 1259 OID 16643)
-- Name: customers; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    fullname character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(15) NOT NULL,
    refresh_token text,
    fcm_token text,
    status public.customer_status DEFAULT 'ACTIVE'::public.customer_status NOT NULL
);


ALTER TABLE public.customers OWNER TO wnc;

--
-- TOC entry 225 (class 1259 OID 16642)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: wnc
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO wnc;

--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 225
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- TOC entry 228 (class 1259 OID 16652)
-- Name: debt_deletions; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.debt_deletions (
    id integer NOT NULL,
    id_debt integer NOT NULL,
    id_deleter integer NOT NULL,
    deletion_message text,
    deletion_time timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.debt_deletions OWNER TO wnc;

--
-- TOC entry 227 (class 1259 OID 16651)
-- Name: debt_deletions_id_seq; Type: SEQUENCE; Schema: public; Owner: wnc
--

CREATE SEQUENCE public.debt_deletions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.debt_deletions_id_seq OWNER TO wnc;

--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 227
-- Name: debt_deletions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.debt_deletions_id_seq OWNED BY public.debt_deletions.id;


--
-- TOC entry 230 (class 1259 OID 16661)
-- Name: debt_payments; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.debt_payments (
    id integer NOT NULL,
    id_debt integer NOT NULL,
    id_transaction uuid
);


ALTER TABLE public.debt_payments OWNER TO wnc;

--
-- TOC entry 229 (class 1259 OID 16660)
-- Name: debt_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: wnc
--

CREATE SEQUENCE public.debt_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.debt_payments_id_seq OWNER TO wnc;

--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 229
-- Name: debt_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.debt_payments_id_seq OWNED BY public.debt_payments.id;


--
-- TOC entry 232 (class 1259 OID 16668)
-- Name: debts; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.debts (
    id integer NOT NULL,
    id_creditor integer NOT NULL,
    id_debtor integer NOT NULL,
    debt_amount numeric(15,2) NOT NULL,
    debt_message text,
    status public.debt_status DEFAULT 'PENDING'::public.debt_status NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.debts OWNER TO wnc;

--
-- TOC entry 231 (class 1259 OID 16667)
-- Name: debts_id_seq; Type: SEQUENCE; Schema: public; Owner: wnc
--

CREATE SEQUENCE public.debts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.debts_id_seq OWNER TO wnc;

--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 231
-- Name: debts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.debts_id_seq OWNED BY public.debts.id;


--
-- TOC entry 234 (class 1259 OID 16677)
-- Name: deposits; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.deposits (
    id integer NOT NULL,
    id_employee integer NOT NULL,
    id_customer integer NOT NULL,
    deposit_amount numeric(15,2) NOT NULL,
    deposit_message text,
    deposit_time timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.deposits OWNER TO wnc;

--
-- TOC entry 233 (class 1259 OID 16676)
-- Name: deposits_id_seq; Type: SEQUENCE; Schema: public; Owner: wnc
--

CREATE SEQUENCE public.deposits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deposits_id_seq OWNER TO wnc;

--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 233
-- Name: deposits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.deposits_id_seq OWNED BY public.deposits.id;


--
-- TOC entry 236 (class 1259 OID 16686)
-- Name: employees; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    fullname character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(15) NOT NULL,
    refresh_token text,
    status public.employee_status DEFAULT 'ACTIVE'::public.employee_status NOT NULL
);


ALTER TABLE public.employees OWNER TO wnc;

--
-- TOC entry 235 (class 1259 OID 16685)
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: wnc
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO wnc;

--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 235
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- TOC entry 238 (class 1259 OID 16695)
-- Name: notifications; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    id_recipient integer NOT NULL,
    recipient_type character varying(10) DEFAULT 'CUSTOMER'::character varying,
    notification_title character varying(100) NOT NULL,
    notification_body text NOT NULL,
    notification_data jsonb,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO wnc;

--
-- TOC entry 237 (class 1259 OID 16694)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: wnc
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO wnc;

--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 237
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 240 (class 1259 OID 17225)
-- Name: otp; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.otp (
    email character varying(255) NOT NULL,
    otp character varying(6) NOT NULL,
    expiration_time timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.otp OWNER TO wnc;

--
-- TOC entry 239 (class 1259 OID 16706)
-- Name: transactions; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.transactions (
    sender_account_number character varying(20) NOT NULL,
    id_sender_bank integer NOT NULL,
    recipient_account_number character varying(20) NOT NULL,
    id_recipient_bank integer NOT NULL,
    transaction_amount numeric(15,2) NOT NULL,
    transaction_message text,
    fee_payment_method character varying(10),
    transaction_time timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sender_signature text,
    recipient_name character varying(100),
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipient_signature text,
    fee_amount numeric(15,2) DEFAULT 1000
);


ALTER TABLE public.transactions OWNER TO wnc;

--
-- TOC entry 3318 (class 2604 OID 16614)
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- TOC entry 3319 (class 2604 OID 16621)
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- TOC entry 3320 (class 2604 OID 16630)
-- Name: banks id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.banks ALTER COLUMN id SET DEFAULT nextval('public.banks_id_seq'::regclass);


--
-- TOC entry 3321 (class 2604 OID 16639)
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- TOC entry 3322 (class 2604 OID 16646)
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- TOC entry 3324 (class 2604 OID 16655)
-- Name: debt_deletions id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_deletions ALTER COLUMN id SET DEFAULT nextval('public.debt_deletions_id_seq'::regclass);


--
-- TOC entry 3326 (class 2604 OID 16664)
-- Name: debt_payments id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_payments ALTER COLUMN id SET DEFAULT nextval('public.debt_payments_id_seq'::regclass);


--
-- TOC entry 3327 (class 2604 OID 16671)
-- Name: debts id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debts ALTER COLUMN id SET DEFAULT nextval('public.debts_id_seq'::regclass);


--
-- TOC entry 3330 (class 2604 OID 16680)
-- Name: deposits id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.deposits ALTER COLUMN id SET DEFAULT nextval('public.deposits_id_seq'::regclass);


--
-- TOC entry 3332 (class 2604 OID 16689)
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- TOC entry 3334 (class 2604 OID 16698)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 3538 (class 0 OID 16599)
-- Dependencies: 216
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('432096d2-435b-43b8-824d-0c24b8a9bb6e', '35619692916a2389c043e696b2502e4cfc5990f14ad77d34e6523d246e62452a', '2024-12-14 08:16:33.317415+00', '20241214081630_add_refresh_token', NULL, NULL, '2024-12-14 08:16:32.058435+00', 1);


--
-- TOC entry 3540 (class 0 OID 16611)
-- Dependencies: 218
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (6, 'ACC100650571', 0.00, 6);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (5, 'ACC100000003', 403087456.00, 5);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (4, 'ACC100000002', 2081134.00, 4);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (2, 'ACC987654321', 500206944.75, 2);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (11, '1001137700', 0.00, 11);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (12, 'ACC100123118', 0.00, 12);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (13, 'ACC100137291', 0.00, 13);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (14, 'ACC100147610', 0.00, 14);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (7, '100722586', 0.00, 7);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (8, '100800473', 0.00, 8);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (9, '100990407', 0.00, 9);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (10, '1001016078', 0.00, 10);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (1, 'ACC123456789', 86661033.00, 1);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (3, 'ACC100000001', 1242655345.00, 3);


--
-- TOC entry 3542 (class 0 OID 16618)
-- Dependencies: 220
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.admins (id, username, password, refresh_token) VALUES (2, 'admin2', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', NULL);
INSERT INTO public.admins (id, username, password, refresh_token) VALUES (1, 'admin1', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', '$2b$10$kxxxeBusf2SFtfTPc4mF/uVDa7GKK6EIQfWmjD3jQERa6ffeaM7Um');


--
-- TOC entry 3544 (class 0 OID 16627)
-- Dependencies: 222
-- Data for Name: banks; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.banks (id, name, rsa_public_key, logo, secret_key, internal_code, pgp_public_key, external_code, base_url) VALUES (5, 'Nhom13Bank', NULL, NULL, NULL, 'B003', NULL, NULL, NULL);
INSERT INTO public.banks (id, name, rsa_public_key, logo, secret_key, internal_code, pgp_public_key, external_code, base_url) VALUES (2, 'TechBank', '-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtHSSUzNDYNJAC6zsz1NUMGFoimRFEWVwuWbBV5yFz2Gmk/Otgtu59hOtNXxKMZk5LgirPhSjMEwOBeD6bjaTrv8pOPmkmQ6GqSJeiqbIzkyegBdOrzTm/RQtzQM8qddo9PvPo6vCMolgBNFjqdt9lgJZNilqiPeWs2Yx3+7LSddm5li5Cu5a/GqimP0o5MEBriK7OM2pLcda0YBTxNOSNhd7wapOhSHnaLEehXEP5AKqQOYC1nD1Z1cARZfp+ro70PRgmuzL5jRTHNgcJb5JHMfvmSf4A1/3GLhs1PDf23mZ8dj8DS1h5IbF5vLO8AaLWROnlro0eHvpo/kMp/zeLW8kW5kAutEgy1xn+4z53xhMzif6Jr2d44ZrbYqkOrEWSMr4iW9G9j6h15jv2CHxALeGyi8y3RVFXfT7DRinFO7XKcqwrcAG6Xmi6JDC0OL1AQa2TlQEVMHMUSMDUe2+wx8C/IRgwB01yGFIx4HFdFFZb6B9lBIzQHp7LEdA5C58QvQOsXTl1RvXG1J2EYIPxd9qNDHaTf9fgPwi80X9wdpo5ahQCCGCTuaWgYqPbxNFGPlIsqiPzsOMMPatZz3JrGgp0VFXOclz5/pC344Db9bJSov/XEZDUGRywihoS/aNAAmPVk43oyvoaAhYq96FLWEghbI1s10EdULnPqycUuUCAwEAAQ==
-----END PUBLIC KEY-----', 'https://inkythuatso.com/uploads/thumbnails/800/2021/09/logo-techcombank-inkythuatso-10-15-17-50.jpg', 'TECHBANK_NOMEOBANK', 'B001', NULL, 'Bank B', 'https://bank-backend-awr6.onrender.com');
INSERT INTO public.banks (id, name, rsa_public_key, logo, secret_key, internal_code, pgp_public_key, external_code, base_url) VALUES (3, 'VietBank', NULL, 'https://www.inlogo.vn/vnt_upload/File/Image/logo_VCB_828891.jpg', 'VIETBANK_NOMEOBANK', 'B002', '-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
=XXBz
-----END PGP PUBLIC KEY BLOCK-----', 'B002', 'http://localhost:4001');
INSERT INTO public.banks (id, name, rsa_public_key, logo, secret_key, internal_code, pgp_public_key, external_code, base_url) VALUES (1, 'NoMeoBank', '-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwmCxKNr8KJ0aiIY4sVRxBHvTqOnyVCTc5Dwqj8RCQHwe9d/G4iI2YkLphBUkezrmEklx0gw/nqeHDZaPep15N4E10aVrbCA2ko7DVTw6eLE35SALqfWU2ffW6MVcfE8DpU6tLJ3RC7dxW2gvOzea3tWdioJYLxqyw8ecm3q9kLjuepxqsX8exJ6P8D4HkPTSqiHd6b5DcFQN/81+BHqiPypy5TE+6v8XjkmryPuilp0dV93ZvZ7MM0Cie5ER5NeXx4Z0tZF3pnfZ8WtWUBxNuKQCqyuWQRxSYr/NeGsODI3vQtkfyA4o1ksXybmV7Blc3dPTGFn0O9i6yH5KAJAuLjlNA5BGKqdN02+uVMxaiKPyoRKi2cYLX3P/U/ugLv31Zm7fQV9Mg9Pv6RsRJVr+ykocUud3cjdYzTO4PoLVaxf/mfDMEbuH99WwNZE2FayDlJc+0H06sh8v78Y+AvQuUVBMZRfZbSeci4FrRZC6Xa/ifAmC7mI7zcgwGaxTM4fLp6FxiNmwYEy/VDsv4z0C7VcnPMsW6xjpIL8Hz3R8jlb48J65gzXzYPvYFf8DfogANlWHRuKUdwZwjDdw+L2Xz/wqCrbAmy8U/Ug3FxX+ZOoa/D9webN/dy4kprO0zP9ZdQEmnSTlI+emXyk6/OV8Kb8rewv9kIaKjuz3qhCQFsECAwEAAQ==
-----END PUBLIC KEY-----', 'https://trumsiaz.com/upload/product/meonangluongmattroitrumsiaz-6135.jpg', NULL, NULL, '-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
=3VkW
-----END PGP PUBLIC KEY BLOCK-----', NULL, NULL);


--
-- TOC entry 3546 (class 0 OID 16636)
-- Dependencies: 224
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.contacts (id, id_customer, contact_account_number, id_bank, nickname, contact_fullname) VALUES (2, 2, 'ACC123456789', 1, 'John Account', 'John Doe');
INSERT INTO public.contacts (id, id_customer, contact_account_number, id_bank, nickname, contact_fullname) VALUES (21, 1, 'ACC100000003', 1, 'Trần cCC', 'Trần Chí C');
INSERT INTO public.contacts (id, id_customer, contact_account_number, id_bank, nickname, contact_fullname) VALUES (19, 1, 'ACC100000002', 1, 'zê Thị B', 'Lê Thị B');
INSERT INTO public.contacts (id, id_customer, contact_account_number, id_bank, nickname, contact_fullname) VALUES (22, 1, 'ACC100000001', 1, 'Nguyễn Văn A', 'Nguyễn Văn A');
INSERT INTO public.contacts (id, id_customer, contact_account_number, id_bank, nickname, contact_fullname) VALUES (24, 1, 'A12345', 2, 'Nguyen 13', 'Nguyen Muoi Ba');
INSERT INTO public.contacts (id, id_customer, contact_account_number, id_bank, nickname, contact_fullname) VALUES (25, 1, 'VIE1234567', 3, 'Phan Mỹ mỹ', 'Phan Mỹ Linh');
INSERT INTO public.contacts (id, id_customer, contact_account_number, id_bank, nickname, contact_fullname) VALUES (26, 2, 'ACC100000001', 1, 'Văn A', 'Nguyễn Văn A');


--
-- TOC entry 3548 (class 0 OID 16643)
-- Dependencies: 226
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (2, 'jane_smith', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', 'Jane Smith', 'jane.smith@example.com', '0987654321', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (7, 'vovanhung', '$2b$10$UnBb1T0oimKLq95T0tGrMeuvY9VNScljqOChj4.S2Gb9dS2PJVbOy', 'Võ Văn Hùng', 'vovanhung@example.com', '0867903252', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (8, 'huynhngoc', '$2b$10$N1rcSgLt4iUaPQIOXH0BwuEEh5LCVaSt/wi4bgHo7Legd0fA8rjEe', 'Huỳnh Bảo Ngọc', 'huynhngoc@example.com', '0867982456', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (9, 'tranngocca', '$2b$10$K.0ePy0TrgtW2kY6vFjblesWP8XuO.sSpjRnyoUAuSBSYc/ktre/.', 'Trần Ngọc Ca', 'ngocca@example.com', '0986453127', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (10, 'voyennhi', '$2b$10$Gpef3PoRDGplkCytSZodluDDvdHEwf.zlBgsCFCzTX62Bh3.kgW6S', 'Võ Yến Nhi', 'vonhi@example.com', '0986452368', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (14, 'trandaigiang', '$2b$10$G52k8tCeG7th8cOBDd/I1eqLO2JabWP.hDEE8VzwgXKhhljATH0JS', 'Trần Đại Giang', 'gianggiang@example.com', '0867654128', NULL, NULL, 'DELETED');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (6, 'luuthiennguyet', '$2b$10$PzCqbgu3R0JCqTpAnNrmnORZZ1DG42z8JxWJ81N5BRTjvCrp2hLpy', 'Luu Thien Nguyet', 'luuthiennguyet@gmail.com', '0987636782', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (11, '21127637', '$2b$10$.3G4I14w5P8ikx9KtvSBk.8cT9YHwjsPBFOR6C8XpSX/.NnOAjeCS', 'Phan Mỹ Linh', 'tunglamtran.work@gmail.com', '0865966367', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (1, 'john_doe', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', 'John Doe', 'myleoovls@gmail.com', '1234567890', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (12, 'levancuong', '$2b$10$QteTaJpXZvpBwly4Za2XruDYEQJDjxdBn/hTZz8NMd1krSMOpG5RK', 'Lê Văn Cường', 'levancuong@example.com', '0869745321', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (13, 'hovanthanh', '$2b$10$sjy2fiXvXLtMSS.oV17JlOX0JZWxp37jsyD7uTd4yEw/Y0aLQ9ilW', 'Hồ Văn Thanh', 'hothanh@example.com', '0869426357', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (4, 'lethibinh', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', 'Lê Thị Bình', 'lethibinh@example.com', '0912345679', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (5, 'tranchicong', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', 'Trần Chí Công', 'tranchicong@example.com', '0912345680', NULL, NULL, 'ACTIVE');
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token, status) VALUES (3, 'lienngo', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', 'Ngô Ngọc Liên', 'nnlien21@clc.fitus.edu.vn', '0912345678', '$2b$10$tHpan.7XpaMdTe1Wh6MlcORTcbJO0HIbsglnduUUkTq3l/M8M2qgO', 'eKMTILl_rLYCJ_wgcH6qPG:APA91bGT77nwqY57pMjlZ-iE63S_7tbFX31tnscGkwQ9nwbXQsgAhBQMd7dALw2GnJLG6fEKgIbc9t3n_v1T3afqHQUeWHnkv9FWa9hhW_VV4te38hGCKxs', 'ACTIVE');


--
-- TOC entry 3550 (class 0 OID 16652)
-- Dependencies: 228
-- Data for Name: debt_deletions; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (35, 5, 1, 'Hủy nhắc nợ', '2024-12-24 17:14:36.831');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (37, 1, 1, 'Hủy nhắc nợ', '2024-12-24 17:17:37.695');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (39, 3, 1, 'Test', '2024-12-25 06:08:50.818');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (40, 4, 1, 'Từ chối nhắc nợ', '2024-12-25 18:07:36.054');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (55, 8, 2, 'Đã trả tiền mặt', '2024-12-25 19:00:22.328');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (58, 10, 1, 'Từ chối nhắc nợ', '2024-12-25 19:02:16.733');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (59, 11, 1, 'Từ chối nhắc nợ', '2024-12-25 19:03:21.049');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (61, 12, 1, 'Từ chối nhắc nợ', '2024-12-25 19:08:01.48');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (62, 13, 1, 'Từ chối nhắc nợ', '2024-12-25 19:08:55.134');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (63, 14, 1, 'Từ chối nhắc nợ', '2024-12-25 19:11:09.723');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (64, 15, 1, 'Từ chối nhắc nợ', '2024-12-25 19:12:16.119');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (36, 2, 2, 'Hủy nhắc nợ', '2024-12-24 17:17:30.086');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (66, 9, 1, 'Hủy nhắc nợ', '2024-12-25 19:15:13.911');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (68, 16, 1, 'Từ chối nhắc nợ', '2024-12-25 19:17:24.029');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (69, 17, 1, 'Hủy nhắc nợ', '2024-12-25 19:17:46.971');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (71, 18, 1, 'Từ chối nhắc nợ', '2024-12-27 11:41:18.335');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (72, 19, 1, 'Hủy nhắc nợ', '2024-12-27 11:42:03.467');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (73, 20, 1, 'Hủy nhắc nợ', '2024-12-27 12:01:44.304');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (74, 21, 1, 'Hủy nhắc nợ', '2024-12-27 12:04:04.461');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (76, 23, 1, 'Hủy nhắc nợ', '2024-12-27 15:47:04.3');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (77, 22, 1, 'Hủy nhắc nợ', '2024-12-27 15:50:43.07');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (78, 24, 1, 'Hủy nhắc nợ', '2024-12-27 15:55:02.65');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (79, 25, 1, 'Hủy nhắc nợ', '2024-12-27 15:58:19.929');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (80, 26, 1, 'Hủy nhắc nợ', '2024-12-27 15:59:10.038');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (81, 31, 1, 'Hủy nhắc nợ', '2024-12-31 18:46:04.559');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (82, 36, 1, 'Đã thanh toán tiền mặt', '2025-01-01 16:55:55.529');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (84, 38, 1, 'Từ chối', '2025-01-01 18:12:14.312');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (85, 39, 1, 'Đã trả tiền mặt', '2025-01-01 18:14:19.328');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (86, 53, 1, 'Test', '2025-01-04 19:54:40.625');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (87, 54, 3, 'Không cần trả', '2025-01-04 20:03:02.809');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (88, 55, 3, 'Hủy ', '2025-01-04 20:08:16.064');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (89, 56, 3, 'Đã trả tiền mặt', '2025-01-04 20:31:43.729');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (90, 57, 1, 'Hủy', '2025-01-04 20:51:04.493');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (91, 58, 1, 'Hủy', '2025-01-04 20:51:51.497');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (92, 59, 1, 'Hủy', '2025-01-04 20:52:03.776');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (93, 62, 3, '', '2025-01-04 20:56:58.939');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (94, 63, 3, '', '2025-01-04 20:57:08.166');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (95, 44, 3, '', '2025-01-04 20:57:26.202');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (96, 64, 3, 'Không cần trả', '2025-01-04 20:58:47.83');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (97, 65, 3, 'Nội dung hủy nhắc nợ', '2025-01-04 21:02:07.017');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (98, 66, 3, 'Hủy', '2025-01-04 21:03:00.358');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (99, 67, 3, '', '2025-01-04 21:04:42.292');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (100, 69, 1, '', '2025-01-05 08:59:28.967');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (101, 40, 1, '', '2025-01-05 09:00:15.611');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (102, 73, 1, '', '2025-01-05 09:09:39.083');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (103, 72, 3, '', '2025-01-05 09:10:38.06');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (104, 74, 3, '', '2025-01-05 09:33:58.931');
INSERT INTO public.debt_deletions (id, id_debt, id_deleter, deletion_message, deletion_time) VALUES (107, 30, 1, 'kiểm tra notify', '2025-01-07 09:32:11.364');


--
-- TOC entry 3552 (class 0 OID 16661)
-- Dependencies: 230
-- Data for Name: debt_payments; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.debt_payments (id, id_debt, id_transaction) VALUES (3, 34, 'c547f2be-19a6-47d1-a234-f8d43b41c49f');
INSERT INTO public.debt_payments (id, id_debt, id_transaction) VALUES (4, 51, '6bb79286-dd44-4895-bc46-f9c8b13f6b9e');
INSERT INTO public.debt_payments (id, id_debt, id_transaction) VALUES (5, 52, 'f384c3e7-9457-425f-bf8b-72351e053dda');
INSERT INTO public.debt_payments (id, id_debt, id_transaction) VALUES (6, 60, '0c1cc27b-3233-4aa4-aafa-4768e73bdfa8');
INSERT INTO public.debt_payments (id, id_debt, id_transaction) VALUES (7, 70, '09dcfc07-2fc5-4f62-85c9-a0cca51a12de');


--
-- TOC entry 3554 (class 0 OID 16668)
-- Dependencies: 232
-- Data for Name: debts; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (31, 1, 2, 256000.00, 'JOHN DOE nhắc trả tiền', 'CANCELED', '2024-12-31 18:45:52.461');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (32, 1, 4, 2563000.00, NULL, 'PENDING', '2024-12-31 18:48:04.352');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (33, 1, 2, 55400.00, 'JOHN DOE nhắc trả tiền', 'PENDING', '2024-12-31 18:53:47.905');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (35, 1, 4, 764000.00, 'JOHN DOE nhắc trả tiền', 'PENDING', '2024-12-31 18:59:32.179');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (3, 1, 2, 30000.00, 'Test', 'CANCELED', '2024-12-14 22:00:00');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (1, 1, 2, 150.00, 'Debt for personal loan', 'PENDING', '2024-12-14 10:00:00');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (4, 2, 1, 15000.00, 'Test', 'DECLINED', '2024-12-14 19:00:00');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (37, 1, 2, 256000.00, 'JOHN DOE nhắc trả tiền', 'PENDING', '2025-01-01 14:50:20.011');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (36, 1, 2, 256.00, 'JOHN DOE nhắc trả tiền', 'CANCELED', '2024-12-31 19:06:31.098');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (67, 3, 1, 120000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'CANCELED', '2025-01-04 21:04:30.429');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (38, 4, 1, 532000.00, 'Học phí tháng 1', 'DECLINED', '2025-01-01 18:11:52.248');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (39, 4, 1, 532000.00, 'Học phí tháng 3', 'DECLINED', '2025-01-01 18:14:02.344');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (5, 1, 2, 30000.00, 'Tiền ăn trưa thứ năm', 'CANCELED', '2024-12-22 16:48:59.163');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (2, 2, 1, 50000.00, 'Debt for services rendered', 'PENDING', '2024-12-12 10:00:00');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (41, 3, 2, 500000.00, 'Tiền ăn tất niên', 'PENDING', '2025-01-04 08:37:19.695');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (42, 3, 5, 999000.00, 'Tiền cọc nhà', 'PENDING', '2025-01-04 08:39:10.865');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (43, 3, 4, 3200000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'PENDING', '2025-01-04 08:46:08.358');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (45, 3, 4, 44030200.00, NULL, 'PENDING', '2025-01-04 08:59:36.125');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (46, 3, 5, 60000.00, NULL, 'PENDING', '2025-01-04 09:00:58.891');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (8, 1, 2, 3000.00, 'Tiền ăn vặt hôm qua', 'DECLINED', '2024-12-25 19:00:00.71');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (47, 3, 2, 25600.00, NULL, 'PENDING', '2025-01-04 09:03:10.908');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (48, 3, 4, 43000.00, NULL, 'PENDING', '2025-01-04 09:05:46.252');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (10, 3, 1, 4000.00, 'Nợ tiền gửi xe', 'DECLINED', '2024-12-25 19:02:05.094');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (11, 4, 1, 2500000.00, 'Tiền giày tết', 'DECLINED', '2024-12-25 19:02:59.599');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (49, 3, 5, 12000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'PENDING', '2025-01-04 09:07:44.53');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (12, 3, 1, 7000.00, 'Nước ngọt', 'DECLINED', '2024-12-25 19:07:49.545');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (13, 3, 1, 7000.00, 'Nước ngọt', 'DECLINED', '2024-12-25 19:08:42.865');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (14, 2, 1, 900000.00, 'Áo thể dục', 'DECLINED', '2024-12-25 19:11:01.317');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (15, 2, 1, 400000.00, 'Quần thể dục', 'DECLINED', '2024-12-25 19:12:03.704');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (50, 1, 4, 532000.00, 'JOHN DOE nhắc nợ', 'PENDING', '2025-01-04 09:31:16.505');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (9, 1, 4, 4000.00, 'Nợ tiền gửi xe', 'CANCELED', '2024-12-25 19:01:15.707');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (34, 1, 3, 6752000.00, 'JOHN DOE nhắc trả tiền', 'PAID', '2024-12-31 18:57:03.082');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (16, 2, 1, 5600000.00, 'Tiền nhà tháng 12', 'DECLINED', '2024-12-25 19:17:12.139');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (17, 1, 2, 5600000.00, 'Tiền nhà tháng 12', 'CANCELED', '2024-12-25 19:17:35.604');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (18, 5, 1, 4500000.00, 'Tiền nhà tháng 1', 'DECLINED', '2024-12-27 11:41:07.879');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (19, 1, 2, 5600000.00, 'Tiền nhà tháng 13', 'CANCELED', '2024-12-27 11:41:50.659');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (20, 1, 2, 5600000.00, 'Tiền nhà tháng 13', 'CANCELED', '2024-12-27 12:01:34.114');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (21, 1, 2, 56000.00, 'Tiền trà sữa', 'CANCELED', '2024-12-27 12:03:45.261');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (23, 1, 2, 56000.00, 'Tiền trà sữa', 'CANCELED', '2024-12-27 12:04:15.428');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (22, 1, 2, 56000.00, 'Tiền trà sữa', 'CANCELED', '2024-12-27 12:03:46.408');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (24, 1, 2, 53000.00, 'Tiền trà trái cây', 'CANCELED', '2024-12-27 14:30:09.266');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (25, 1, 2, 53000.00, 'Tiền trà trái cây', 'CANCELED', '2024-12-27 15:58:00.785');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (26, 1, 2, 53000.00, 'Tiền trà trái cây', 'CANCELED', '2024-12-27 15:58:02.566');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (51, 1, 3, 19000.00, 'JOHN DOE nhắc trả tiền xem phim thứ 5', 'PAID', '2025-01-04 10:30:35.427');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (52, 1, 3, 190000.00, ' nhắc trả tiền', 'PAID', '2025-01-04 10:35:20.496');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (53, 1, 4, 532000.00, 'JOHN DOE nhắc nợ', 'CANCELED', '2025-01-04 19:54:20.273');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (54, 3, 1, 12000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'CANCELED', '2025-01-04 20:02:35.716');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (55, 3, 1, 12000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'CANCELED', '2025-01-04 20:07:41.179');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (56, 3, 1, 5000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'CANCELED', '2025-01-04 20:31:22.019');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (57, 1, 3, 12000.00, ' nhắc trả tiền', 'CANCELED', '2025-01-04 20:50:40.157');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (58, 1, 3, 12000.00, ' nhắc trả tiền', 'CANCELED', '2025-01-04 20:51:28.081');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (59, 1, 3, 13000.00, ' nhắc trả tiền', 'CANCELED', '2025-01-04 20:51:39.652');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (62, 3, 1, 12000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'CANCELED', '2025-01-04 20:56:17.16');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (63, 3, 1, 314000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'CANCELED', '2025-01-04 20:56:42.249');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (44, 3, 1, 2563000.00, NULL, 'CANCELED', '2025-01-04 08:53:43.949');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (64, 3, 1, 12000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'CANCELED', '2025-01-04 20:58:29.463');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (65, 3, 1, 12000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'CANCELED', '2025-01-04 21:01:40.134');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (66, 3, 1, 342900.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'CANCELED', '2025-01-04 21:02:49.359');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (68, 1, 4, 532000.00, 'JOHN DOE nhắc nợ', 'PENDING', '2025-01-05 08:26:17.689');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (60, 1, 3, 12000.00, ' nhắc trả tiền', 'PAID', '2025-01-04 20:53:22.347');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (69, 1, 3, 40000.00, ' nhắc trả tiền', 'CANCELED', '2025-01-05 08:58:18.517');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (40, 3, 1, 5000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'DECLINED', '2025-01-04 08:34:14.411');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (71, 3, 1, 302020.00, ' nhắc trả tiền', 'PENDING', '2025-01-05 09:00:36.321');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (70, 1, 3, 32111.00, ' nhắc trả tiền', 'PAID', '2025-01-05 08:59:49.762');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (73, 3, 1, 3111000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'DECLINED', '2025-01-05 09:09:08.818');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (72, 1, 3, 256000.00, ' nhắc trả tiền', 'DECLINED', '2025-01-05 09:04:18.883');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (74, 3, 1, 256000.00, 'NGÔ NGỌC LIÊN nhắc trả tiền', 'CANCELED', '2025-01-05 09:30:08.42');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (77, 1, 3, 100000.00, 'Nguyễn Văn A nhắc trả tiền nước', 'PENDING', '2025-01-08 20:13:15.739');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (30, 1, 2, 53000.00, 'Tiền trà trái cây', 'CANCELED', '2024-12-31 18:44:17.026');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (75, 1, 1, 100000.00, 'Nguyễn Văn A nhắc trả tiền nước', 'PENDING', '2025-01-08 19:59:09.384');
INSERT INTO public.debts (id, id_creditor, id_debtor, debt_amount, debt_message, status, created_at) VALUES (76, 1, 1, 100000.00, 'Nguyễn Văn A nhắc trả tiền nước', 'PENDING', '2025-01-08 20:09:16.185');


--
-- TOC entry 3556 (class 0 OID 16677)
-- Dependencies: 234
-- Data for Name: deposits; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.deposits (id, id_employee, id_customer, deposit_amount, deposit_message, deposit_time) VALUES (2, 2, 2, 1000.00, 'Loan deposit', '2024-12-14 17:00:00');
INSERT INTO public.deposits (id, id_employee, id_customer, deposit_amount, deposit_message, deposit_time) VALUES (1, 1, 1, 50000000.00, 'Monthly deposit', '2024-12-14 06:00:00');
INSERT INTO public.deposits (id, id_employee, id_customer, deposit_amount, deposit_message, deposit_time) VALUES (3, 1, 1, 40000.00, NULL, '2024-12-30 08:20:32.591');
INSERT INTO public.deposits (id, id_employee, id_customer, deposit_amount, deposit_message, deposit_time) VALUES (10, 1, 1, 44444.00, 'test', '2025-01-04 19:57:56.694');
INSERT INTO public.deposits (id, id_employee, id_customer, deposit_amount, deposit_message, deposit_time) VALUES (11, 1, 1, 44444.00, 'abc', '2025-01-04 20:00:44.08');
INSERT INTO public.deposits (id, id_employee, id_customer, deposit_amount, deposit_message, deposit_time) VALUES (12, 1, 1, 44444.00, 'test', '2025-01-04 20:03:21.337');
INSERT INTO public.deposits (id, id_employee, id_customer, deposit_amount, deposit_message, deposit_time) VALUES (13, 1, 2, 44444.00, 'test', '2025-01-04 20:04:01.751');
INSERT INTO public.deposits (id, id_employee, id_customer, deposit_amount, deposit_message, deposit_time) VALUES (14, 2, 1, 200000.00, 'Nạp tiền', '2025-01-07 19:01:50.022');
INSERT INTO public.deposits (id, id_employee, id_customer, deposit_amount, deposit_message, deposit_time) VALUES (15, 2, 1, 200000.00, 'Nạp tiền', '2025-01-09 05:23:50.272');


--
-- TOC entry 3558 (class 0 OID 16686)
-- Dependencies: 236
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.employees (id, username, password, fullname, email, phone, refresh_token, status) VALUES (4, 'employee4', '$2b$10$Cxv9/Awcyi9moJjyQnn.0OYRxd2X/oc1tOHKcIYu8pyu48PdyuWu2', 'Employee Four', 'employee4@bank.com', '0987636702', NULL, 'DELETED');
INSERT INTO public.employees (id, username, password, fullname, email, phone, refresh_token, status) VALUES (7, 'employee20', '$2b$10$ldOxNENcC2BsKKvC8Pl12u2bubXcP6N1ZP1jCmBfCBrt8AJ/kPbcu', 'Phạm Minh Châu', 'chaupm@example.com', '0901231234', NULL, 'ACTIVE');
INSERT INTO public.employees (id, username, password, fullname, email, phone, refresh_token, status) VALUES (1, 'ttkim', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', 'Trần Thị Kim', 'employee1@bank.com', '0901231236', '$2b$10$HDBF/ltkpNwicYNO5xg/CO5sq7vgxt0k22DVbfY4ZbyH9KabyZrlW', 'ACTIVE');
INSERT INTO public.employees (id, username, password, fullname, email, phone, refresh_token, status) VALUES (5, 'employee5', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', 'Employee Five', 'employee5@bank.com', '5557654322', NULL, 'DELETED');
INSERT INTO public.employees (id, username, password, fullname, email, phone, refresh_token, status) VALUES (2, 'employee2', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', 'Employee Two', 'employee2@bank.com', '5557654321', NULL, 'ACTIVE');
INSERT INTO public.employees (id, username, password, fullname, email, phone, refresh_token, status) VALUES (3, 'employee3', '$2b$10$2Usmn2WOxdXEQQkmhlITzeiNtL9JHA2IJn9v4t2TUEXMmQ7hHTqYa', 'Employee Three', 'employee3@bank.com', '0987636782', NULL, 'ACTIVE');
INSERT INTO public.employees (id, username, password, fullname, email, phone, refresh_token, status) VALUES (6, 'employee6', '$2b$10$C8YXeruK9Cy9.RB9R37NGeAFuMJw2CUjAEK/cixo1DI3FQlkSOAFu', 'Employee Six', 'employee6@bank.com', '0896463825', '$2b$10$SW8Ni4LsfaUKXmhAeNuFqu3IO1Ng5ICPFT7BAUAeTUe9bgL1SyTEG', 'ACTIVE');


--
-- TOC entry 3560 (class 0 OID 16695)
-- Dependencies: 238
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.notifications (id, id_recipient, recipient_type, notification_title, notification_body, notification_data, is_read, created_at) VALUES (1, 1, 'CUSTOMER', 'Payment Received', 'You have received a payment of $200 from Jane Smith.', '{"transaction_id": 1}', false, '2024-12-14 12:00:00');
INSERT INTO public.notifications (id, id_recipient, recipient_type, notification_title, notification_body, notification_data, is_read, created_at) VALUES (2, 2, 'CUSTOMER', 'Payment Sent', 'You have sent a payment of $50 to John Doe.', '{"transaction_id": 2}', false, '2024-12-14 13:00:00');


--
-- TOC entry 3562 (class 0 OID 17225)
-- Dependencies: 240
-- Data for Name: otp; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.otp (email, otp, expiration_time, created_at) VALUES ('myleoovls@gmail.com', '111525', '2025-01-08 18:38:15.73', '2024-12-21 14:05:52.726');
INSERT INTO public.otp (email, otp, expiration_time, created_at) VALUES ('nnlien21@clc.fitus.edu.vn', '728432', '2025-01-08 21:05:27.678', '2025-01-04 09:09:20.719');
INSERT INTO public.otp (email, otp, expiration_time, created_at) VALUES ('nnlien21@clc.fitus.edu.com', '795061', '2025-01-06 18:13:34.645', '2025-01-06 17:53:34.662');


--
-- TOC entry 3561 (class 0 OID 16706)
-- Dependencies: 239
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000001', 1, 49000.00, 'ăn tối', 'RECIPIENT', '2024-12-22 08:28:21.735', NULL, 'Nguyễn Văn A', '9a39f4e4-107e-4578-b158-7aba268c25c3', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TCB000000001', 2, 'ACC123456789', 1, 10000.00, 'awn truwaaa', 'SENDER', '2024-12-22 08:47:10.34093', NULL, 'John Doe', '306e569a-1e02-44d5-9c1f-94ac6be5b7b7', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000001', 1, 31000.00, 'ăn cơm', 'SENDER', '2024-12-22 08:04:14.298', NULL, 'Nguyễn Văn A', '62a06b01-4044-4780-80ef-b46a0c76863a', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000001', 1, 9999000.00, 'lạp xưởng nướng đá', 'RECIPIENT', '2024-12-22 09:41:23.768', NULL, 'Nguyễn Văn A', '7f9d22ce-15d7-4e39-822c-41acb7377c54', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000001', 1, 11000.00, 'â', 'SENDER', '2024-12-22 09:56:02.952', NULL, 'Nguyễn Văn A', 'f6f796ac-452e-480a-9ca4-b4363b3c514b', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000001', 1, 12000.00, 'ăn tối', 'SENDER', '2024-12-23 08:39:02.036', NULL, 'Nguyễn Văn A', '9d228bed-68e4-4cd0-ae5d-d6c1ed0add05', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000003', 1, 6000.00, 'ăn tối', 'SENDER', '2024-12-23 12:02:50.559', NULL, 'Trần Chí C', '4c060d1c-68d4-4ff9-af53-fcb599edd80e', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000003', 1, 8000.00, 'awn toi', 'SENDER', '2024-12-23 12:05:32.93', NULL, 'Trần Chí C', 'f5ef4cfd-3626-4933-8434-e7a08663ef28', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000001', 1, 6000.00, '', 'SENDER', '2024-12-23 12:07:28.642', NULL, 'Nguyễn Văn A', 'a38e5be5-9469-4258-97d7-ecaa8f4fbe37', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC987654321', 1, 6000.00, '', 'SENDER', '2024-12-23 12:12:39.538', NULL, 'Jane Smith', '6f55c06a-f673-4e1e-94b4-e3dfd127f73b', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000002', 1, 6000.00, '', 'SENDER', '2024-12-23 12:24:25.022', NULL, 'Lê Thị B', '16b3bf7a-3d4f-4fbc-93ef-c04e0aeebaa6', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000002', 1, 6000.00, '', 'SENDER', '2024-12-23 13:44:08.976', NULL, 'Lê Thị B', 'c3a949cc-310b-4599-8d54-a2e3b088d31b', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000003', 1, 6000.00, '', 'SENDER', '2024-12-23 13:52:44.21', NULL, 'Trần Chí C', '7e364b31-7099-4c31-91b8-5720951ad875', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-04 14:48:25.89', 'oyANdRNoIp0vOlgtYE4jqUPyZhXQMR4O7XYsklAqI00jyYorv2L42LyyUpqkOCrTtGhLhJuuniGZZK8aYOsIgxFXkC6wp/m8Uxb7DQQi5/47um22SEBRL7J/9OB52ByKtlRXH+8VZs/wzJwcAK9DxzP8NrZ8WVSaXpte2NjiJiAwDzsWN1Xkc27K3t8ooHLfDtUjNBX9sZ/dCsSEpbmKuj1L8uzhsR7HliqLVxavbJgD613WwSGcBqG9sg+t/FagXW04ssCPKFtpxW0o3OoqwYQqPFLDi6Me8MzFD8HIe3PwfVWeN3ayWncRVm2eowkc1f+ONvamTSgFZ2eXUTaNOBYA7hKBP7s9Fl9/cMjsO436Y7+2F5aDfkNvH79DBQBpYshc/XARNTSUe0FFGgLDCqrbg6Gh4qSFnMpi6nkgJ5vLVOKFpC3gULdHtysZr+lIr8cPVGiDlzRrTPYFEEgXtJ159Q/u1rGGpBorVa55TWGQowLM2sOT8D+ZfzehCWEd9mEA0j0ZftJ8QDBUJrjI9dEmIxLSiFb7tIWrbQobDQFOD8N9Lf/3ttgJO/+IyWbV8wXcl8J+XOdX22vNBH8cuE0W9yjXePZgstuNGfgXNrots9Sco7s6lRYdLMzSRuuswpw3z4+chxmzU6iE+UtArw2eV074S7NPJ6lkwpyEj/8=', 'John Doe', '601381ce-11fd-444c-8ebb-b5b1118f8a0d', 'sZSTPTMYAI2adSbFkmLdgE6B2je7Rz17Ka7H0kILdyCA82YoXaRRGiAuxLjzHmV0R7b4FtM3XvyfkPSxvwIecEmvpqC55n5sVLG14CXvhWub/fQzOAPsqj1CJM0Z3YyAQHv0Mpp0/mtUkn6MJCaoVxuiQ1zSIjwXWe+K8ne8DqH6U77kt0LTuJyBda3sQELqwXUCiddGYcjVgoWLZ7aR8sO66BE11BF6VDB/kXR8o7oJ5ONaEKlar3ZrU0GNEeG6QDoOQ6FIN5QBR4j9uoVjUPu5MXbu0l5bBXhXL8ku4emiGST2vL8YcTt550gB8CIcQFXHfBcxO44hWFOgr0ihjIJLZe1X3OiLsxHVUH21U3NFjjI0gcsTyspdWied/dLqtv6NjfBy82Hk/2OWi4M43lrUG2W/cFmu2T+jEw4/zYdFQjOntIisFXXOC0SkKaYJTa0fm9fYF2fYy2ZQFUiJDSdMOA6hZD+KfsK0wSY7LwFl1KVeuyLTrpewooy/8Ng7ltAWIPpRu1dNOf5lfBtd+JEUgDFbWcQ5MS4Ahyt8kFolx5c7rolB2u/LvSY7WkBdzplp+dTGuFjQnHYBOrh1GdU8cfsk4ACvEGV0jVid0vSh3Y1X9e2jd4N1Hc+QuSxAolsX/ux4HawkIeMMU5pv00eCKHdWZsvuvZ0R0P0vk64=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-03 19:35:35.932', NULL, 'John Doe', 'ca024942-1e7b-4900-af95-6b9cf3b8480b', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-03 19:38:39.103', NULL, 'John Doe', '50a6046a-357d-4b69-aa5d-ec2de2d5b823', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-03 19:43:09.497', 'KACUfoyN3K6g6BanScSh+XKe+ZDv0ypSQK5fgJPgUiYaLisllksxQV/B4Ut6Mkotr1GqVWCkGPRq8KhmId7v1rrmWCRpQMJtuXF4qv7Q/vwo8Qth0ifi9Wx8/GcKU0tAITTJXG3YQk3+hxxGhpIXTG5fx+jvjSmP1gyBOudPOEyRJdfTeyNZG4PqVTpTnVkheivMHvPnP3HShg25yhFxJIl0HFka1QwRoC7P2Exybb7PxDBRdq+f60qlXy1T3MgrLYiwRDwZdKgSw5gy6wWgYWCUYZnSbQCEJzWLvWWwdZJf61k0Hi8bTKp85HLBDtDbo+2/Fb0Sri7Mts5ybJ/zrTOMIL6FmYEpx7DSlBVU+/3jMEObpIHCVUdlXDmXTO/wU7qux0to2hTS97tOW5aJk1hjh6LToKRYa4QWaSwNJyKAkc95BtLBry5CIKb1p+Muft5AGjxYrra6mjsP9YE8RY3CvTyyRZ7rmcLnRBFggl7YBXiPRwDY2TchRuokYlO3TR5FbmqTXwvqpKZvoHxd7TxACmYQyBTijmU2qqZy3KRz+py7pFLyLzPZBYNtywqBpSvV4DoxJYbyOZhyzAwX95lUeoBKExCU47R5hoPBSOTauWfo8nCp59QKgtKtxzWnPwhIO9iVtl7XFtmaa9tW/DAs1Eobiondn+qvErNjpp0=', 'John Doe', '134809fb-a113-4864-932d-a0edfaa11e0a', 'OdjI21OienV/ZMjrf+bxiUlaCgU2wT5LnebzKAPYC1YkkkwTjim0Lp3Dkj5vsHtexS/IYHs/cRV/qvhZnbVFtK2HqteivHD4vqzv7mE8qjyAY1PLfAINy62fv/fquSYVjTlGKgIYdX4us6u97sEFyQf1u+zufgOI/7zJjNCc3IGSCfYs18Fai1l/h+MNgeJEc0fixg4d94SiXmCLvXgfLIKmU/rwSOI8nC9pK/HG/ci0tN6d95J2dDBnzYNNiAnKRZpb3m+O2GS2eHSQYwSM0l2kYixqUew0FagDlg1JYzT1QgB274mDkkNy2Gz4VEW7Qmd0lTJrObwFJ7+b0wf76HN/WeYGayoQCQO6O6TqrAV1C8V+o2ZNRQpiIJMbeUOR+zCAhDXHaPUlSxJudHszgnSJnoKTCa+W8BO8B3zT/39H8HlcGNTO9JWvtvs+0xTKLIbWli0c/PCny2bjr0PpxNeZfOq4lMpMN4Q6TJKX2yewLdG26f/netSFUr6YLrlkCiJDvX5XC6F9YQ9XT3F+wrHLb+cHGu8KJV0BUWk9h4AdVb2o3hDG9LhRBo8kEY9Ek+l3so0U9HvVW0cQll6yWSPolTRNM4Lwx8IicW5C3ddD4WQW4iOE41FUTyxiLD70YenX8oDbfFKvw/0+VfK1eBBVaoAamQlNyI7Zm1VtGwc=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC987654321', 1, 51000.00, 'JOHN DOE thanh toan no', 'SENDER', '2025-01-03 20:17:33.295', NULL, 'Jane Smith', 'fbe12b21-a055-4560-911b-bcc88367371d', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC987654321', 1, 51000.00, 'JOHN DOE thanh toan no', 'SENDER', '2025-01-03 20:21:33.379', NULL, 'Jane Smith', 'c9d5f202-7aba-4eab-9141-8c9ec6cf9d6c', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC987654321', 1, 51000.00, 'JOHN DOE thanh toan no', 'SENDER', '2025-01-03 20:25:43.395', NULL, 'Jane Smith', 'bcbcd312-fbaa-45c0-bc4c-a35409c40d2a', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 6753000.00, 'NGÔ NGỌC LIÊN thanh toan no', 'SENDER', '2025-01-04 09:11:13.943', NULL, 'John Doe', '3397f1cd-335a-4866-8548-a5536b5f66e1', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 6753000.00, 'NGÔ NGỌC LIÊN thanh toan no', 'SENDER', '2025-01-04 09:11:16.288', NULL, 'John Doe', '45c8ad90-ec23-4abc-872c-2352095f8a2e', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 6753000.00, 'NGÔ NGỌC LIÊN thanh toán nợ', 'SENDER', '2025-01-04 09:18:11.845', NULL, 'John Doe', '443779a8-1883-482f-a8c6-ddfe7ff9d51b', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 6753000.00, 'NGÔ NGỌC LIÊN chuyen tien', 'SENDER', '2025-01-04 09:23:10.592', NULL, 'John Doe', 'c83ccc22-541b-4f36-b8ad-d78e1e5456af', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 6753000.00, 'NGÔ NGỌC LIÊN chuyen tien', 'SENDER', '2025-01-04 09:23:13.601', NULL, 'John Doe', 'f6b62e42-8992-4418-93b9-6c361e596b8b', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 6753000.00, 'NGÔ NGỌC LIÊN thanh toan no', 'SENDER', '2025-01-04 09:26:02.164', NULL, 'John Doe', '99e8ae9c-7682-45a1-abd5-a1afd7c0e176', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 6753000.00, 'NGÔ NGỌC LIÊN thanh toan no', 'SENDER', '2025-01-04 10:27:08.066', NULL, 'John Doe', 'c547f2be-19a6-47d1-a234-f8d43b41c49f', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 20000.00, 'NGÔ NGỌC LIÊN thanh toan no', 'SENDER', '2025-01-04 10:36:29.986', NULL, 'John Doe', '6bb79286-dd44-4895-bc46-f9c8b13f6b9e', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 191000.00, 'NGÔ NGỌC LIÊN thanh toán tiền nợ', 'SENDER', '2025-01-04 10:40:02.488', NULL, 'John Doe', 'f384c3e7-9457-425f-bf8b-72351e053dda', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-04 15:09:31.991', 'oyANdRNoIp0vOlgtYE4jqUPyZhXQMR4O7XYsklAqI00jyYorv2L42LyyUpqkOCrTtGhLhJuuniGZZK8aYOsIgxFXkC6wp/m8Uxb7DQQi5/47um22SEBRL7J/9OB52ByKtlRXH+8VZs/wzJwcAK9DxzP8NrZ8WVSaXpte2NjiJiAwDzsWN1Xkc27K3t8ooHLfDtUjNBX9sZ/dCsSEpbmKuj1L8uzhsR7HliqLVxavbJgD613WwSGcBqG9sg+t/FagXW04ssCPKFtpxW0o3OoqwYQqPFLDi6Me8MzFD8HIe3PwfVWeN3ayWncRVm2eowkc1f+ONvamTSgFZ2eXUTaNOBYA7hKBP7s9Fl9/cMjsO436Y7+2F5aDfkNvH79DBQBpYshc/XARNTSUe0FFGgLDCqrbg6Gh4qSFnMpi6nkgJ5vLVOKFpC3gULdHtysZr+lIr8cPVGiDlzRrTPYFEEgXtJ159Q/u1rGGpBorVa55TWGQowLM2sOT8D+ZfzehCWEd9mEA0j0ZftJ8QDBUJrjI9dEmIxLSiFb7tIWrbQobDQFOD8N9Lf/3ttgJO/+IyWbV8wXcl8J+XOdX22vNBH8cuE0W9yjXePZgstuNGfgXNrots9Sco7s6lRYdLMzSRuuswpw3z4+chxmzU6iE+UtArw2eV074S7NPJ6lkwpyEj/8=', 'John Doe', '2fb3f2dc-5603-4b82-8ab1-e4078a5bdbb7', 'OrURduZeQH6HG9y9vrJfKrjIm0r5TDJCwiz6Xq8dw40j/NJrBphHNPqeU0YlCUPHZM3yYtDSbQUSBc6J29xMO+G9AFoV4qvATKvVdINFEuXFmKp4AGp+v8TVln8tvYd+yKDtpWFdSoJs1OsP15gRR1HPANYgUnJsd3KsG43ETFi6oYFIE0Q3sKrirTNHCLUgoqVubkFiotshr0/NGKEjhIdiqQzal3FUU9ZQ5GbWucwilSQZZTCgMqKxqBPorKTgc5Ckq9UVl5b0cUjDJp9z01XHH+SbTRwU29WNs5SROxMuRDL4bJjhZhRA/bynZRKYNREZw0YAYSG9hS8NTe4mxxyCat2esP5jeH5OLxJhftMvl621QJca0QybmanA3q2APruhV+RRf59Gjf8QZpou4rHJq7pjsBBAnw69kDII3kFgbzHlXn3eyT4i3LqV17tqgHal98Z38ayKAxmibc5xV696BNM78UgY2oWp4a3CVM6hDkR9okNKC71eycrOCyrJjpjd6k9oYl0SQvB5WdvRUh6B2Qer37YncFwy/gYNf89tAkkoNDBR9aHrI5F+yIjKoyq08Fdijpx3tAXEXWDHxG9TGL7wzP2cio16DV9HxlazTsMg1Ra5fJjDw4jZSW9p7TlJMUjr/Pv9eEp7TS8pWaHf/m3qrjqS0xppsgwe/2E=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-04 15:15:26.484', 'oyANdRNoIp0vOlgtYE4jqUPyZhXQMR4O7XYsklAqI00jyYorv2L42LyyUpqkOCrTtGhLhJuuniGZZK8aYOsIgxFXkC6wp/m8Uxb7DQQi5/47um22SEBRL7J/9OB52ByKtlRXH+8VZs/wzJwcAK9DxzP8NrZ8WVSaXpte2NjiJiAwDzsWN1Xkc27K3t8ooHLfDtUjNBX9sZ/dCsSEpbmKuj1L8uzhsR7HliqLVxavbJgD613WwSGcBqG9sg+t/FagXW04ssCPKFtpxW0o3OoqwYQqPFLDi6Me8MzFD8HIe3PwfVWeN3ayWncRVm2eowkc1f+ONvamTSgFZ2eXUTaNOBYA7hKBP7s9Fl9/cMjsO436Y7+2F5aDfkNvH79DBQBpYshc/XARNTSUe0FFGgLDCqrbg6Gh4qSFnMpi6nkgJ5vLVOKFpC3gULdHtysZr+lIr8cPVGiDlzRrTPYFEEgXtJ159Q/u1rGGpBorVa55TWGQowLM2sOT8D+ZfzehCWEd9mEA0j0ZftJ8QDBUJrjI9dEmIxLSiFb7tIWrbQobDQFOD8N9Lf/3ttgJO/+IyWbV8wXcl8J+XOdX22vNBH8cuE0W9yjXePZgstuNGfgXNrots9Sco7s6lRYdLMzSRuuswpw3z4+chxmzU6iE+UtArw2eV074S7NPJ6lkwpyEj/8=', 'John Doe', '40dd368b-4bea-4995-8b22-ace004366a26', 'XIMjyESWlHrMrqQGGalMpWeTjTwFVGzbM12RKMUJAkRC4PZvXydVRumw+fylJyMUoqp9lQlMY9Kgo0666FDPfLDV5tc1gqfTOn+ezzYJ8JAZgZaneWS+LDNU6titHtCMQtwnKZWA1CMq/WxUMQjlBMLppN2o5IjmhkPztnd891GZ1m9ile2/vy933i6jg9DZbirZQQaGSQAYclDcFL9lfjYqtN+0dg5q9/m5FO6EMzeiezDuNBIsJFy4DkHrYpQ5y1xMcz+oV5HS8fexHRbbPsrIxZ4+k9Rq0EMrGxMHZtIfbiggD6yM+1jQFo/zPueI8BMQwyu7sGvCIBE3jzShv7khn4Shb8832glnoBED06KuIQYcbKGPckag1Y3IMNP3Fzf3tCmB2n/UlnEYn5WZcsvMkNssDUDv9qyHDN157tjXhi+Y25XoaVsUQ6RZZ3ozV3qqI7G35hOiuwc+ZiHNPL0qsbpfJopr/PR69y07P06RGiADc4ejlc2MoCry0d9UiGYzHHN3QZIQdXkNR3GpBOFCUwSjN7q2vfWnrORFFOkbUeZJOEK4NUnusQuiruPqOZwPmttOCcUVQu9uy4CVMZvWPZEUN0t2BlW/hMOWL03a82hrCkPMVqokioeEw1PUXkYMJOJQ0tIzkvOY0O1cCNcoWCh8SBrAAJKtoes761Y=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-04 16:21:59.571', 'EvkXjiQbPiO1hk4HuMoJXYL5ehkZ7h5Yx1jiHUwhUI2xAC21AVH9JJRIoxdelG47aUAvDPVZy6PrhBicrO9hsGyb0XJafQYyvO5K+cWprxejqDqUG2s3pA/AXKC8gCytvcKM4tUzYkXMRl2z3HE7eO0isz0Tbc2+roKULv6HkcjLfRFC9IqT62lszs87Q0J5NlCybXvcF0ysPPK+XgQ9/PaXskM1OP5HmXUO/xAdZsZu3BF8/+stsSAYzJ3+toVPNZYCrUM7hOygca+lnd1yXBxYkn9fWcHJB/KNvj1N5rjgVkQq+NIHdthz2sSU7eb3QxgQfBGalN4jBlHJOk0NFPgh0vKkw6NRYIlk8hV5mbE+5m59WI1xe8OP/f5Gx3qBXuwZ+gUw/yLkDdiWeJquXO27eGrf6JLpHCAou5ZWU+9E8pW0gv5+BU+Rv83FJkEZ7Rsqy3wTx2sU6//q27Tg3tTj5il6T+NScTHZpfS3et1hm5FOeabdsuJqj6cPGLX5y2G2SKNRNkTu31LaM/nA7eAZtnbsAhZYxYqgg9Ybx4vobowiaASWV/hqyt7bJxQkMqKHEaBeoc1HLRYqYCKCseN2dutvACqw3G+STjjaWyDeVZQBSAadyS4PeAZdVY8a6mAjtYIhFxtMTXdETA8wU8XVts1YjpkBSEsQmnVJvxs=', 'John Doe', '531ccc02-4f2f-4cba-a5a5-b4c3656feb92', 'FEoJ3tlY2XERHPCRDcOLQUIwFhkZJwC4NinuUC9s+WsiA4iKUB/BAQIESi0qPPBuGTj/UvIFedOTx2LquKK6G3H5OlKTP2LdXXT4ftJirH4dVUzo0qAuMUzEVZ83ld51JBjw0hB5gDxnTs1B4Z5MNEeLhSBgnAWH2vqALzE4SvZRtNjknuzAYG9XFlkutEMpAeR/2SjmSkDixvouqzvW5KnnLUR7aCai7NnkUbEKafg/bS0HqDfeJ6cm6moMNI64oMmER4k4qdakjID7q/d2VJU9hf+nW2WDuW4pq07EKywKErBo18GMJ4BGYkvSHaGY/wy4HziBClc1ZLuhprq37DkUVCRWrzfGQTxtxm+4QtqXmhN6NaacDs14EXh2RDIDsXV2mD7LWoTMlyjMihWQci4cRzEJ8n7jfUp8vjvUkL+1e65tRpkjlQu7ept5Sx8GfVQdUqj+7bYT6GLagnfOUglmeC33zUsKrhBNIVustHJE4lriO+zfotTt98L9UVud5IdAJ3Q7L02U3aAaUrykGq4QORrzFi0fOiuqV74YfoCPLLwqfYofXkIx3T4yIpteYeZSG4GWRfYx60lH4zHcvFhgYIwmNSTZuoHoA1VB3b1lEalpkx0noLjA1cM8Glk4gx8g5O2aLqB6vf8BJ1DOr6V/xGD5cxxcdg20PcXRnf0=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-04 16:36:42.727', 'EvkXjiQbPiO1hk4HuMoJXYL5ehkZ7h5Yx1jiHUwhUI2xAC21AVH9JJRIoxdelG47aUAvDPVZy6PrhBicrO9hsGyb0XJafQYyvO5K+cWprxejqDqUG2s3pA/AXKC8gCytvcKM4tUzYkXMRl2z3HE7eO0isz0Tbc2+roKULv6HkcjLfRFC9IqT62lszs87Q0J5NlCybXvcF0ysPPK+XgQ9/PaXskM1OP5HmXUO/xAdZsZu3BF8/+stsSAYzJ3+toVPNZYCrUM7hOygca+lnd1yXBxYkn9fWcHJB/KNvj1N5rjgVkQq+NIHdthz2sSU7eb3QxgQfBGalN4jBlHJOk0NFPgh0vKkw6NRYIlk8hV5mbE+5m59WI1xe8OP/f5Gx3qBXuwZ+gUw/yLkDdiWeJquXO27eGrf6JLpHCAou5ZWU+9E8pW0gv5+BU+Rv83FJkEZ7Rsqy3wTx2sU6//q27Tg3tTj5il6T+NScTHZpfS3et1hm5FOeabdsuJqj6cPGLX5y2G2SKNRNkTu31LaM/nA7eAZtnbsAhZYxYqgg9Ybx4vobowiaASWV/hqyt7bJxQkMqKHEaBeoc1HLRYqYCKCseN2dutvACqw3G+STjjaWyDeVZQBSAadyS4PeAZdVY8a6mAjtYIhFxtMTXdETA8wU8XVts1YjpkBSEsQmnVJvxs=', 'John Doe', 'dc2589a1-5a10-454c-820e-a7c8a8447ce7', 'rDoDUwsxpXpFA6eAjrtxiO3a+e334/A0VMsMCYs5nFjy79Sfks46IT/PwA1wIek9zEwLkNOH8flVNuTZE+b7PK6IjS7kjHPrJzV+j/C3g7i+nRuiqcCmlXRgtV5SQLOr/eL1hoNtkuYgn/rO6AT9vINvl6TxHV3i3XD6/NUqignivltFKuPGXoG6WhdZI1MTvQT5O2f13o/KCy2y0HDdiVr6f1hhg3+hEwcw9c4NYysrhhYyfDFKSbWxkXw2lJVISmyO/kzYW/dw4oziRM+Lrfpd15LvJwAnmLDfLidsLhoO1zZlCPtCqhsQ0T+xHZwBqlbr+cQJS9G9FAjYvMhKVkV0JLwYOoKzZpYGu7tDdkmFQv/3+jUiyC3olcCnDlYiBejLz2VMKnq6bdYBYddMpyY3gj08ikvex+00uvE54Y3q4r/eNUnXip4FQnG6LRCbxTOeqoAxCjRVHymqjxvriy8kvpsN0069IqAbRWJayTfcGV+7pmapHTLvncS73JYB0vLXGXePVz2a8c9eBZtqplCSmxoZPWLEGPWpTIDXrgodmy6eHslCgD4RKhpGZE4jzPA5WkuZjyoTy23DCWhRAqOva61eKn8u0KUcXEXCyjMphHQ+tvY4DA6ETnF7Q5tHxmSYti8FR2G1XvyH4eYXMYpNc35YEKol2OXEu63n2JU=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 13000.00, 'NGÔ NGỌC LIÊN thanh toan no', 'SENDER', '2025-01-05 08:42:11.039', NULL, 'John Doe', '0c1cc27b-3233-4aa4-aafa-4768e73bdfa8', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 51000.00, 'NGÔ NGỌC LIÊN chuyen tien', 'SENDER', '2025-01-05 08:43:41.907', NULL, 'John Doe', 'e76ef4de-ab45-4ade-a6b1-c9242e4ab09c', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC100000001', 1, 'ACC123456789', 1, 33111.00, 'NGÔ NGỌC LIÊN thanh toan no', 'SENDER', '2025-01-05 09:02:09.142', NULL, 'John Doe', '09dcfc07-2fc5-4f62-85c9-a0cca51a12de', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-06 21:30:08.789', NULL, 'John Doe', '1eadc02b-0966-4250-9367-a38b3f0d0c7e', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'VIE1234567', 3, 22453.00, 'JOHN DOE chuyen tien', 'RECIPIENT', '2025-01-08 18:18:42.541', '-----BEGIN PGP SIGNATURE-----

wsG4BAEBCgBtBYJnfsF+CZAmrwu7a9hxI0UUAAAAAAAcACBzYWx0QG5vdGF0
aW9ucy5vcGVucGdwanMub3JnpvHPomoZa7Qq3ZZ+lSB7UrkC0x0XRJYO9ul3
FWzmsV4WIQSfbaumUTxGoooeP+omrwu7a9hxIwAAeEsP+PxOTbllb+iAPz11
UWvrOYIXj57J9uUxXfqIlN/gHSBzuDRz0iF3l0oTDOcWIjWWjSWWZrTbhR3p
kl1ArPMQp1ZsP9+V1QGvbKgip7EStx0wIujv47VLkJQCgYqwGiw/r+Q7POD7
q7bPwaCjLNK1vOOAZM9YSfCtLAFHbhbIDaw/HDAWLVQyoFED3z6QNz+21cIf
NGmb4FjhuLxXNW/fOsFnfVSpZX8Si+/RFCMMyxFvz2DOnt3Po+uC0tr76TE0
BFxzLZihpD/C4z1qreEEMzoIihn2q8oP8Obtc//Q4VxwK1a0Ybc6wL/Ff2PS
RvgbMbXNc5TWnS0H3JVQ8jA7W90bZCrX+GI0OBFZd1cD1n/a0MLbdlQybChd
MD5zD/p437r/JbNBUkOtwo7mtKE0d+eOpRSyXdlUkWMnl9HMCIfwOyXj+a0F
axDypy9eiur0EhcnPo/FU4/cj9UCzXll3BoKcK1M+6UBjubkkPGmi/BWBBOh
GiTPnR2mtPP5MeiW/JL4H3kJjKz4MFqy4u/rsrFi7afA1V+S/dNZjZtbco1j
nf51RLz6Xo+Av37XS19W6YEwy6cSC4lAwHx+q9uccU7SIFOITcEoK7+HkEC0
luTR7057HBuuTGZ6Xp7eRwgiFl+1tnHkwac6D6pTkjuahyEW0Vj3eaAL8g12
mt76Lp0=
=LG6f
-----END PGP SIGNATURE-----
', 'Phan Mỹ Linh', '496c06e5-f43b-4634-b8d5-a4eec3f8a0a1', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-06 21:32:21.388', 'EvkXjiQbPiO1hk4HuMoJXYL5ehkZ7h5Yx1jiHUwhUI2xAC21AVH9JJRIoxdelG47aUAvDPVZy6PrhBicrO9hsGyb0XJafQYyvO5K+cWprxejqDqUG2s3pA/AXKC8gCytvcKM4tUzYkXMRl2z3HE7eO0isz0Tbc2+roKULv6HkcjLfRFC9IqT62lszs87Q0J5NlCybXvcF0ysPPK+XgQ9/PaXskM1OP5HmXUO/xAdZsZu3BF8/+stsSAYzJ3+toVPNZYCrUM7hOygca+lnd1yXBxYkn9fWcHJB/KNvj1N5rjgVkQq+NIHdthz2sSU7eb3QxgQfBGalN4jBlHJOk0NFPgh0vKkw6NRYIlk8hV5mbE+5m59WI1xe8OP/f5Gx3qBXuwZ+gUw/yLkDdiWeJquXO27eGrf6JLpHCAou5ZWU+9E8pW0gv5+BU+Rv83FJkEZ7Rsqy3wTx2sU6//q27Tg3tTj5il6T+NScTHZpfS3et1hm5FOeabdsuJqj6cPGLX5y2G2SKNRNkTu31LaM/nA7eAZtnbsAhZYxYqgg9Ybx4vobowiaASWV/hqyt7bJxQkMqKHEaBeoc1HLRYqYCKCseN2dutvACqw3G+STjjaWyDeVZQBSAadyS4PeAZdVY8a6mAjtYIhFxtMTXdETA8wU8XVts1YjpkBSEsQmnVJvxs=', 'John Doe', '8722176e-342e-4056-be11-cfd129ba0ecf', 'vCuNqlnBA9tGWt5wTikOQLrLGUUWVYnPpI50p0G3eRQTjef10qyHzyMAXRYgWWh9xkbfptejHgjsHBTHqICOwBb280DEsBff/N2mA1XL3rJUOofYZ1Af8lZyZWoJkplIvYWXy24tgJqcjti0d6H9Xf3x8mIHNyn0vX3Qsvc0bqzlL+To/stcB16JvwILzuBIJ/w5RcxR8DQ2axSbxz27iC9C3erVJwBXovHFiXuA5xdixZV4wAQ5jH6EQRXisPGYRtJ4YpSQf28LyIXf2t23EPSDaFY/IhavkNSMSC2eGZe7JjQuBj0OXOM8/Ax2drWFBBaHVe4BNkk+X32YgGPDuaHGXdjmj05psr5wTUonehVoSeg2d+4welCt9BnBVvtbEfX+9Vbf7qUdsGa/8jWRx9y1KBHiySdaK8QvY8TNHUCBiQjBdm+EI2i3p7yWrXI4UAC9ZuQa8H09VTci+OARpi/DZVX58Sln2MA+W2vH10UaZ9izqQGsAbhgnnC+6w2DGhJ1yqCZdjJhVyOxQCl7/5YIdEdJKs7F556DpU7F7QfRlO16+U3sB5gFWdfe1fHI1Mc1OkiFUvOKuOq3h1JCuHrmpv6OP5JJ5FRXNVfyFO4YyG0A+Y6WFN8kB8q94mmc0eZkofiNs4IyPOzkJ8LgpAoBIxge0wrUDedA40D9zmk=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-06 22:04:52.74', 'EvkXjiQbPiO1hk4HuMoJXYL5ehkZ7h5Yx1jiHUwhUI2xAC21AVH9JJRIoxdelG47aUAvDPVZy6PrhBicrO9hsGyb0XJafQYyvO5K+cWprxejqDqUG2s3pA/AXKC8gCytvcKM4tUzYkXMRl2z3HE7eO0isz0Tbc2+roKULv6HkcjLfRFC9IqT62lszs87Q0J5NlCybXvcF0ysPPK+XgQ9/PaXskM1OP5HmXUO/xAdZsZu3BF8/+stsSAYzJ3+toVPNZYCrUM7hOygca+lnd1yXBxYkn9fWcHJB/KNvj1N5rjgVkQq+NIHdthz2sSU7eb3QxgQfBGalN4jBlHJOk0NFPgh0vKkw6NRYIlk8hV5mbE+5m59WI1xe8OP/f5Gx3qBXuwZ+gUw/yLkDdiWeJquXO27eGrf6JLpHCAou5ZWU+9E8pW0gv5+BU+Rv83FJkEZ7Rsqy3wTx2sU6//q27Tg3tTj5il6T+NScTHZpfS3et1hm5FOeabdsuJqj6cPGLX5y2G2SKNRNkTu31LaM/nA7eAZtnbsAhZYxYqgg9Ybx4vobowiaASWV/hqyt7bJxQkMqKHEaBeoc1HLRYqYCKCseN2dutvACqw3G+STjjaWyDeVZQBSAadyS4PeAZdVY8a6mAjtYIhFxtMTXdETA8wU8XVts1YjpkBSEsQmnVJvxs=', 'John Doe', '25bfc037-13a6-4913-a8c7-6dd17ecf9a6c', 'J8UmeSSkOyUJt8JjOVz31PPSStzJkHjtu0rKEtZo6dN+g9Tse8JLLj2aSPLq3Z8c1FNudDW3ltwMSI5g44EC6mbivYyuGwNDeEVaeObrE+tyMX+aAuih1tIEut2sRs2TfJI6uk5vfkGZS+8KpSaWhTscgM77F5wEZdrJ1+z0pBkWpfHNIH7uYPe9H1qF7ZjjTYwfFOcwWsOnRG9Wp1tasmrD1OOryDbLdeLtf9+DOGeZnECQSh0VOB0vkuIFiMT5AecrNEydPAIvNhumlZKGzgz3/d9mLfSO/GuD8Dlkt3R39vfYiWo0nejahYw1WReLLksfm6PY/KP1qftZLzO05d0+TC/gzqlRBMkHbBSOdoRr8XmqaKAFlPDGeYSXsT1uWoM42jbGj+jvKHm4mELtuJ9LnHDTWdtoD+IKvwm7eb2u5GmJrz+QdgTiH3RV5+a7t7ErjwIxaaLaNWL8Bmwg6k6gGhu7dnfUxNZmnRTHGNBAI2igfkaQ2CyHH0EuHcWW4k4MeW/h79oJATSMf25eZSncAqMYEJi9fvBnMbfkc4drWQjsGAq+QYy2aLqKMfYl0/Y6AhSk4JiHzf3ihvnY+EuFqxU4zJj8KF30dBhQsAfxqlJjefYiaQKuadwyPg2Frml5KK2cJ3NhmwVVNPvpvJxNldOoMR8XtEyDRynpoyk=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-06 22:13:58.98', 'EvkXjiQbPiO1hk4HuMoJXYL5ehkZ7h5Yx1jiHUwhUI2xAC21AVH9JJRIoxdelG47aUAvDPVZy6PrhBicrO9hsGyb0XJafQYyvO5K+cWprxejqDqUG2s3pA/AXKC8gCytvcKM4tUzYkXMRl2z3HE7eO0isz0Tbc2+roKULv6HkcjLfRFC9IqT62lszs87Q0J5NlCybXvcF0ysPPK+XgQ9/PaXskM1OP5HmXUO/xAdZsZu3BF8/+stsSAYzJ3+toVPNZYCrUM7hOygca+lnd1yXBxYkn9fWcHJB/KNvj1N5rjgVkQq+NIHdthz2sSU7eb3QxgQfBGalN4jBlHJOk0NFPgh0vKkw6NRYIlk8hV5mbE+5m59WI1xe8OP/f5Gx3qBXuwZ+gUw/yLkDdiWeJquXO27eGrf6JLpHCAou5ZWU+9E8pW0gv5+BU+Rv83FJkEZ7Rsqy3wTx2sU6//q27Tg3tTj5il6T+NScTHZpfS3et1hm5FOeabdsuJqj6cPGLX5y2G2SKNRNkTu31LaM/nA7eAZtnbsAhZYxYqgg9Ybx4vobowiaASWV/hqyt7bJxQkMqKHEaBeoc1HLRYqYCKCseN2dutvACqw3G+STjjaWyDeVZQBSAadyS4PeAZdVY8a6mAjtYIhFxtMTXdETA8wU8XVts1YjpkBSEsQmnVJvxs=', 'John Doe', '0f069dc1-409d-441c-89eb-c2e525de5b59', 'E8bWgjN9Rsnzno570PzuP6QLn7D4gazRyv7t7/tN87PIoIWUI1hJN4u0ql0jBdrv7AP8H94gcKSOpH3TC2D/09JPgxEGiURc7KfsC6jc4zEzM5RTxix+k6RlRhIYesFFbP8TZFu+JeY30I/E5TUVZgvbp+81S4OuZxinCnrHz3IfrK+AyrR0cTSYFUimWsPCPpAhcd+wBusvep12TK46GLcSjxEn/5/Lu2Vp3zZ3SsemBX8j4BPonjMEvixiQPT5ah2H+esc494Kv5OhJQTFlGx642aydli8ngtlCK5oxYCAxFTzsWUBAmX5+XjhNFL/v2HYm6JGB/QOXyPG0co7dcKeWlDHG0hzsBz9uPW/U4yzWYhgn5VmfrNpkYNcLkezoNPs25eYvlU4VJYht12mx2dZQTKfCzgWAbFimMp6yGsA2YOrqNJktcoAEge8zRsEoYtk8iDD/n/LuOoHkhta0fEL0ru7bIkwS210+krEprQ1akPqMQdtDouKvuSDKQ/FiY7FBnPgDdDE3eq749XmBsv78r4lzT9kybSA7rgtIa13plrjdzz80buoroHBszvuHEvYLTBohJni2uA+v2Z4HVQQzJeBEUySI5vLARLep0O+rfXflwvD1xAYfKb+HlZwgKI+IUZVjHwDaV90CvoPO7YAvrpktkb8bKX9m7RE1jw=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-07 05:24:11.469', 'EvkXjiQbPiO1hk4HuMoJXYL5ehkZ7h5Yx1jiHUwhUI2xAC21AVH9JJRIoxdelG47aUAvDPVZy6PrhBicrO9hsGyb0XJafQYyvO5K+cWprxejqDqUG2s3pA/AXKC8gCytvcKM4tUzYkXMRl2z3HE7eO0isz0Tbc2+roKULv6HkcjLfRFC9IqT62lszs87Q0J5NlCybXvcF0ysPPK+XgQ9/PaXskM1OP5HmXUO/xAdZsZu3BF8/+stsSAYzJ3+toVPNZYCrUM7hOygca+lnd1yXBxYkn9fWcHJB/KNvj1N5rjgVkQq+NIHdthz2sSU7eb3QxgQfBGalN4jBlHJOk0NFPgh0vKkw6NRYIlk8hV5mbE+5m59WI1xe8OP/f5Gx3qBXuwZ+gUw/yLkDdiWeJquXO27eGrf6JLpHCAou5ZWU+9E8pW0gv5+BU+Rv83FJkEZ7Rsqy3wTx2sU6//q27Tg3tTj5il6T+NScTHZpfS3et1hm5FOeabdsuJqj6cPGLX5y2G2SKNRNkTu31LaM/nA7eAZtnbsAhZYxYqgg9Ybx4vobowiaASWV/hqyt7bJxQkMqKHEaBeoc1HLRYqYCKCseN2dutvACqw3G+STjjaWyDeVZQBSAadyS4PeAZdVY8a6mAjtYIhFxtMTXdETA8wU8XVts1YjpkBSEsQmnVJvxs=', 'John Doe', 'f2b60b87-3dd9-4e69-9ae8-467eed871c2a', 'F1PetsS+OazGevz+gOIbi15LH/H8apmBC3eYCKJeP/t7OtINtJyw9908MCTc+ackN0NJB6JcHh3vmTB9PmBLcVHC6jQaVpqtIbeJ3X2sXwMpyINd9zPkpTEo7K/eNdqUuTQq+51c2dB3zByV1qry13fF39FonCc7BWsEaXQvOLR1dQOvGLHRy6UmwxG1bnyGxp4k7Ff0sWos7LQ24o/wWbYwS+bgdbF/U/BuX1yOZgPXcgtUV7/CculsjEws7smV8dEwALT/YozU6SRKz+xaBJxzCiOqsxABQhorTLj7TOxedZlWWMIsotcQHnN1fGIFoXliZTphVLi7d+GiiQKYBWOQjjEZl2Y7dC/beIHjJ2PyTcSu5p27Y0Gw19L4zxqmJ1OOT8Qpk5pZ0aVwaXRdt01iUeA/qJnwGsbsrFOshjj7NlT24boQ3Kup4+2rUD86OX3+DlgMTzAUEdbl+5VmOah++Jxyeq5qKLGuaShm1Vy2HjwcwKu4ClcPL5zWyTM2TS7li5b5Kbx6efZH8pC8RPYHBwVgu5gm4RrgmFj2KEIjo5q5T+ZcI3oqinDJDL7GHJebiFEe6Q4A5Rzm1Obf1QuJ9Qi20HtmV4EgifqnTVmpWoF0CYOtmj+cRMM/0uOAtN4bQ6UxnEN/CXvlkaL5kgPI1OkK6KkWe4nZ9KF/5U0=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('TEC1234567', 2, 'ACC123456789', 1, 20000.00, 'test rsa', 'SENDER', '2025-01-07 05:31:02.611', 'EvkXjiQbPiO1hk4HuMoJXYL5ehkZ7h5Yx1jiHUwhUI2xAC21AVH9JJRIoxdelG47aUAvDPVZy6PrhBicrO9hsGyb0XJafQYyvO5K+cWprxejqDqUG2s3pA/AXKC8gCytvcKM4tUzYkXMRl2z3HE7eO0isz0Tbc2+roKULv6HkcjLfRFC9IqT62lszs87Q0J5NlCybXvcF0ysPPK+XgQ9/PaXskM1OP5HmXUO/xAdZsZu3BF8/+stsSAYzJ3+toVPNZYCrUM7hOygca+lnd1yXBxYkn9fWcHJB/KNvj1N5rjgVkQq+NIHdthz2sSU7eb3QxgQfBGalN4jBlHJOk0NFPgh0vKkw6NRYIlk8hV5mbE+5m59WI1xe8OP/f5Gx3qBXuwZ+gUw/yLkDdiWeJquXO27eGrf6JLpHCAou5ZWU+9E8pW0gv5+BU+Rv83FJkEZ7Rsqy3wTx2sU6//q27Tg3tTj5il6T+NScTHZpfS3et1hm5FOeabdsuJqj6cPGLX5y2G2SKNRNkTu31LaM/nA7eAZtnbsAhZYxYqgg9Ybx4vobowiaASWV/hqyt7bJxQkMqKHEaBeoc1HLRYqYCKCseN2dutvACqw3G+STjjaWyDeVZQBSAadyS4PeAZdVY8a6mAjtYIhFxtMTXdETA8wU8XVts1YjpkBSEsQmnVJvxs=', 'John Doe', '4fd8c864-1ec8-4878-8adc-d968370f51e3', 'rKceTNRwHtqdoGvySA6rOPPs1kfExca/ag2zn34mqlbpi7TwN+MuOHMS0KL9hXpOayEQGPjLuSXYvhJO/bxXas5tvGHyG6rRggP9OArW9/37RFfgf7b9F69ftCQcnhAHfaDT8uSnMYfG5K7EGkNF5NhlzrBrOOoCg/g04zzwAOmGTb0/6FvVIYiSwQNbeCW42d7SLFUr452HEUZ7RJrTxcVsJUeHqGN4OOJdf2ixyqzS+QV1HmII4LO9AjvZQSp7yirVUcQQR0OHBrewOvTAUWDYH3cOG+IxCWF03tsGM4rdm1BqIRiHoBYfTYqiOwhyv9GBevgme8RJvPFcwj5eS3rkC0vGNHfMxSQFtNOIepENNT7g26WatvJ7gYS2Jh0SNK/spDiUg1jwmm5h5l2KQiRL8vJ9LBCtzf94Wr5gMgycDvFoCJ8Ewb4AvT/UHjDzVx9A1U51MZvrZz/Hdoe/kvLBhzKZGQgGxdmvOI+OAx3Km4QHvptbIOGNjuxrViBH1py9LuKRy/vQldQdxslPlZg09cj2PRBIZIchV0fLwRVnSSc8dvaD9pFP0YHKQLDRRpgUXYK8G8XhcUYAIcPZzfcCUvhjqKawld0wDqC937wtOcr9IkzN5GQwzB+XiM+T8u9vEV1anMIXxcD5U8vgntji7HduTOKUSeWVyzIryI4=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 06:01:12.319', 'SPV0hKszgCwQFmei+WqXSUAbnjZl2ze+w4a8SFA8bWShwanFrVOi5I7k4ZIDtVXvmcGSq3MaCJGl0A6238RYPYVM02vslarUIqvhC71IzCPWsRbAdgGwhE12+A16Y9g2V7Y7vzAYTDGGzzSP1846nsjS4bDBpmVmmXAt81Qu74Vrjjc0FLZ/HBHZy35QuT7TbgdpbxMOrEdbWaXnOHg99bq3BpYJGpAuuTVfDAVBMBPs+Ab4Ds1D8Vv+p4aiRrzBBcz2dD0XQ+oTju+C4XDFju1u18xW931GCoDk6DdSQ1USzzwnQ6PJKtdi5YLPt0gGrYJ5ShHJTegFILn70jh5jDd2fVhutIPRW5bYVc65ysua2lubES74LAcGbwlogsmiH5wLwWtG0G3z87pclKl1+JkHJc3dXRCTp1dGRsPYzMTSUX7ktze/NCxpNKAJq8QGg9A73HcmmZBELhA7ymQ0/7wiv/1s+q5JU3L3qniFCfEwdyMjA8fXuBLeN/5+gRzt3RQ4V2Yu3spF11rPIuDPpUrS78XViA+byQDGCIm3VEf6CtvuTC7MgSs+WgmGtZMeD1BO211xY6fnl7HDYFyfe9kEFV/zqsD+0xCvW7YeXeS/wTd5JQucVsB4IDb6ncyVDZszc2YIRR1vCMddXftXV8r3Yw4CcqPycgvTi3e75qY=', 'John Doe', 'b8104079-dad3-4ab8-bc65-77c06f3274f3', 'rRUrXaYQ5Jmtbnfv0DSbZMQ9mDAlWrKvxiy6AnWxj9O55RIarj1yTj2CXlkzf9+d3bRosRFf2ybz6b4OpB3ikpsQcDWx0WXFe1w1riA3Dg5qh0W3354gkC1I6po64QBLalvG1wv1CWLaQBB1TqC5mG8dfS9ZOwCfPAhvwL05CPZtZTMAg+hWqLcBcB2Voj84r86v+FPRT4VhtowNR5xl3xNayWLV8109gIII2FruI/FxlRCNHjio0DnKLNEoqNqspgUA1Tb6O9vB9rAOddERQDITuDqOWFfiT+x5cMdXX4vqxwX6aTc84aoDviAtLFXHtibJ6wHWQIgQ4xVjc1W9t5F/lkUMvM1FRiCbx2IytZIEWdaozdny9LuZzmPKpqh91laBzEQjMhewRLX9w0mHFnj6rZv3DqZxjfO21ifUUzrERvgJ7pYS+B7tQmArdHmfMExnNcwnFKHrJXg2H+DgPzSBDo34YWfYS9PCqvuLhwO9aKa5L+2eB21n0pRkEfl5CKx7jE3Jn8x+62v3rO2pe29OFMkMlZQj1ouHv//2mRg8N2RQ3bQmK6w0D+QD5jUfV/wiMviOIPnmSdZiPCYJuZcwVPZFMLdEctmpIv2Tcjqyd7/XJoLmCZ5RUzDMDeotJRUJ2AFUQH8PXk6x2zMJ1swSmSakmpnLnLUuU+G/smg=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 06:49:24.859', 'i/oGZslKeMhlKLLud5aMBgEqfj4moN4ZMilielvHdXzk6ClNnlz9wDoDMD/oHFRjjsxExm8kDOrWaz/Avi2/RiG7c4kPZ9npYM7JLVnRq+82ybifwCUM5fI2GHSe0wMr1GRqNeZSirPCORTtrBzFcc7hbOKBEtRMZbantADQ2yXzFGvrqX/tozV+wWTvIfw/hfG6AHl+6J8ibsNq9yfdIIn3+KhwLbkNpTpRKQ3ivNOzPqAbA9HAPF11ixQcP+5aMHpx7/KNKETDIlGTbiMhWX7FPNcsW2VYcZXg6qK4JGgXN/oleDu0QTMfQy/jbdl3ergB4Cxr5inDVhNH5BTq3GywhVmDw+5tOjWtsYzkjRcT6fsspzp2kUPomrxfCnO4YBf2ZVX7sY8e0+Fj64yUAZq+X9ioWU8Abw/valtYPnqbMpDld4zvNzPK4N85Dje9mxFYAA0OxB3DvgnyEdD9P2mq2KHycBaEprbOCwgEstFbAmXqvxDl3HO92irh+67IUaJ2fD+Lr9wZ6VEc4I2MG1uig5EvHLa9fam2vJQo4kkJZYdd0zHrQGM63EyhqdP5AnqqqZBqBwhkP+e2Va89ruLC+isJ3HX+gO8rAQ1GSLXxF6HW9noQVWcttEDNBRuKNgFtayLV3tcV99nnDhrwUO7ZDlLIoAAa8Z+Fr9buY3E=', 'John Doe', '174f0245-d439-4c9d-af26-bb60c8b6504f', 'jWZ/CwmVPd7gMABPho225qGY2VEzxo2+KhsHqpua2ukHl/kMl8Nihk7BMAVc5VffV+w4iw9Xd3DaUT5xzSa7ci8aSp6GECbB4f3rEHs3aOl2R5WaNGSc4BWwYF7Dxn9SS/qZ7MxHrpvT17SqN9hAmtC9TTUkQRRISenrnQ7xZVRMv2PK9dDdmuwLjJXaKgOQUJ6VQ8zbx+/5024XSNHV5d8ypc7i1FkaGZSj+y3IsvnrdFU55FG9kKO3gyLkf0a/v6eEzRcrWuzJIOBYWT0bCd8CDBcE+pCq4Utz6MaKbnFz7gQTih8aklyq/AoB12l7S+Rc/HkEAimS63WUbz//eITjMncbiVsGSiOAglGgZr56wH95ayqpteOh5/tfE+qsz7o8oOru7u8v7I2yWWD5lqATjQaNPq6zb3iYx1uwv6tBuBEcbRW/Su5muT09h+YID8ftQCaBgkMKCTRA+CVHNyZtS3rTNzANTxpz40Jba9OCcj/jef5ZbsaAz1iASKC3mrKNEcH9fdAvXg4prYf0tjY6tvfMftJfPgzvS7spJaSTmQ/AK9pOf9EdV7X9q1Z64l+fLK29vPxa2StTNMi3LWCP5ntDEYl+ENLahvTcQ4/1X0BlhnMvUlbED//ZzR6i7pBx9lfFIeFlcvdGbUWw81RdV2tbGaqdFIrA2aBr6iE=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 07:15:25.811', 'B7fHY0SRJQee1lUoz90p3e22ydtJb2EIaJ7Ql0ypCeeH5kN6uZL+weHueuS2nMx/zcynPk3DObbEaN5QaQ1bZ0VS/N0QNTKwCHiCnWb+gS/3mwCACu9JZti1BD7RAxG8noo+kBujV86a7A6Y15z4sdVT9RDYz1Shj6ulGxs+EmhbZMDymApMb226jVYvP62Pn7PjmmW6raMHHsZF2sKV3Fsgfoc5TRTh8LTdQP2oOuSrZGBupfm9ZViEVAZrB1nJYH3042X6aF4stBepyn9zulERJs+Zf5iFBeMHzNPVbtTYD4YVAnjSkLJSJTBazoiARx2oxbetQfpug0LRPxa6eAM+sL0X5dSSlxIRFEmKX2EFKozGtaLj2Aa59be/exhmVTM/i38O+mIuQbPU+89YG+aldmBfus1lraO9C18k6U1dsJ6CM9SmNayz8ksynrwnIpoap3yi8uDYAEFSkWEs5FckiWoh89ylMfnIyVwzkaL3c72OIQk6rav9UtXpeNIyEuQt4yENdkFLxOHKayHq7+1W7HIhOdsbDdiH0MtVoBMai4TpkcCpQwQOkRMmziY4eu0mwrkNISun7FRPuGXmEUMMKuxFCIll2Dfmi9i78ySrBeN+weHKgkWDLwu7SMEIyQbj1zTcfXDWpou+doU2yxZVXfg1jRlwyjfDIKp0V4s=', 'John Doe', '26264b57-c799-4cf3-b54e-40f785e55d59', 'Vs9VtAq7epArHyqSPUX3D82okGXIcgkEkxbyLipAxuDC0/pbUUxqtUTGot7EV6HVxXmDqDBKs0IzXTYLp1XPb6H9GuS00u/mXn4kNbDV5u1SYMrTSsgMWewtywSS1JJXDTbwG86bTTWc2Ml47kCZmG5p5oTWOMVKZT/i22IMqxtpkRZlc4fqiYk8V/01FkLxHQS8Y4DbLnl8D1iOp5kC7Of/3Bza+ahFHmU/nUrFP+FKluWCMnj5K0bdtmb6tYOKaj9irphqlelV2B6TGA12jdbV7rKOizdjaDSUIaJIxnbIRbPDQv7Tw6ApYU9q92prGOCc+qVhBKYpZjdrkwA3+5UesxEm4eiRHvqZ1+6mIlXWH36s9Ae9Gahy1cAM1huoQM35pkcODpAQFSlOZZlUoIu/IgDC1Uki0QYU3evWY+CmFUBHQD/tCCHldebWYh1VCi3/h+1tbwdqRIXnfofcloq7H4PTuRSu9cM2VlNexKPGPHilPqsMHlL6RK6tlsQtkbDs9Vl468L2x92o3FCGUdOaeTrH+OuCxkXn+ZxovFl5hvJHkibpOJBFKdDTafaVJVOHO/vsXWErccez0aVZWDzHwoajZFgmjX1VTmzMXRR0mee1N6HbvcRnQK1P32oW4hwab96HDmbbjvfOQWUXAOw6LWBJ5uVh7N7NYKnGxDo=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 07:18:15.68', 'S9KMlVb2randLcwgzAB5F2y11C57kZdRq447dKf0iDpPeIfMMnafFeF2nb0pZtnw6mJUAewrbxXZJ9Dc7TlUI425sFnI4rE6ZKRMp1y6qx/lx3CYD2PXbLOXIEhtx7+LubvWCOKM3XCPus6jFRTtUBic43FAr8KSToJt74Z6QpdoNyG20Q5/aDKxz8LGDX8FJkG+TTpGdgdWZgYM9aNrrbeYY0olmtN863MkaxAG9zaS9gtudRNL/ppvnbFf4XJGY0HZLyaSgADl18lxOM5qK+OOvUJnABhqbeX7m7ItcWMHfEHbKQ3ekAl8ps4l8uLgyAKrDAIqFTqcOJdYiX3xj48tnXmBsGspBegb+eGmfqwd0EgTw1tXtOxxbhDnKZUpTegmNst28k7IzUXuA9e5q7aAsoDRWeCunc2XkC3GG367DAOCv3/XhugYXlRPwhHl6K+khgcFSydn5p+K4QQAahwHxXKLi11xxWYaYiBFZ5xq8dKjm/Uu/bFaR/w3qpGcd+Z0qHLo2gx0ZmObT07309bYbGyQp+A899tYYZQnEI3AwoT9ELbOnqeJIPv0qtiZvrfQFooNwQv0OkmsQwR0GvU55Ivs7e9J5fLhQWUY75reTeEJrjQvci5bBP/g2GtBSgcIddHyLxyQgVwycDDyshCOx0eYambbpLDCmlLhGXs=', 'John Doe', '5ad45838-db0a-4ab1-ad01-420706dc545a', 'Q1v0ySw7Ml63joKS9H1r0/6DcwRi2XLt6B2o7cxGCzbFqmgsq1mY7HochrDWxg3Lt5Sbpg8m1aRX69+SuVKRt07BKlP6vjykh/Oremtz6XmEWnT0NNa5qbc7rzJ5wyuimLojHD+Svx8aueIG1e8MFtVdXi39yILWnPnglOR3N50fgtsceDuBtnUv4Wf2/uv5K8zQiNuIU0qtJ7Lfm5YWqYsLB0Omxo3JqFnpNl88KNerJWcnWJD2/c2X8UHY6D3S8xdlYiMuqWBO+og0SrR8CddGVQEc1kRWuWf2CAcTf3V1y/P+sqUb3p5OjWRlZ491mZqxpuTjy3YzXrZZ+tGX3VqdUDEg4+Ng0CTWXNQxjUb/kMNuN8e1yeQJDH++x+PKFCphFSPrD9/fb+1ekgistPdjhobJiO8vwYe/yUCVD9fhSvHaVPAFfYYZpNgYem22IfkmD3EvBMUTAz+q6fBmPdFjT870tDOBt5Z7t5666jpmK1SVzIuVI9eIOq40EtmnCMKmV8EGK6/Wn0Qr4LhhgMSjKuGJMyM0nCcRc/S+wgVyz9+Btoa99S03EQtmWNbq5+3RwspARSm1syqphV888wK6RmV+XpSWeCEb6xeAa0bl9Lb67vufc+xAfnU6oy3ntsJpsB8h9WQCrl/Kt0HZG6pVvXN3kPy+1fQTVvX+OkY=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 07:18:45.577', 'sSZnKZ2mJGF5ttf8DOnhqqU3FOutq3ieWH+xwF/uHXyoHTdYPwmoXTZ68sdIgAeT+Ox+Iqox/9QgEiSo+k2uuhW8lQZuygx6K3E+SXeGPLt3+xCTe99Xj+cEb2WpmUEzDPf5ShM+8oflDeY/HHkQ9jc5XxD7SuUEPdTOjnTjWc7LLUfl7EeRqCmnFdFSEy2j5huxfUdVOOqf/bK/JPRAFn2mAQOKdEd1bXTEAx3JNM84Ns0lV6JswgrqKBmOAkWuvbwWy1XQG8UFI6T3o2+ze/WNPYSe7LBfOk8626NFptwLryjLXaXp4Xa53IDH08DBNq7FVI7oeQ1AubuiNIoI9mK7e7KzAkysYRFBY55fNsduOU9tYgozmZ3NPH9RRPOF3tgKe4bvB75eKnlq5NX1LpGVNF73K2NbHM+0+4szHZxMIxSL7LZgvFWbjvpHe/fZ2xUsQBJYLUSGzEvJ7j1nOQKhjd+RrjnxnLU0lXLgnjLpARxpGUoQFKu6yxkTxs/bWkm+He12pnNkl9Yu4zzm6AwroarB28XFpV906YxlSbZer7h33KG6co/tXV6PPKzVcw6RV9T10KbYWESzzlTc/SjvX71x1hW5r9tDFZivdyQwKhTn4LfaM9BkLN6nsGSK4bWHuRK80qx2OwSXuG2KUSEG48h5s82X32ZXpwjC+RY=', 'John Doe', 'df1c0bc2-c754-4027-9e7e-5ca65aa1395c', 'SRFcL+g3CsH7tw2glw04lxXt1ZM12TXSx7HcaUGSC4vFa/JjLAKawbirAkTSuABJwrzLU+Xl3/019WY3KCrqL3JSQdvTRjkuHxeVJ/A3HLfHROXP80JtkITn3wMYD7slCLGA5TgczPO/zTRt4kt8x0qGETohuuPzzt63v/hpoWfKPP6bRLIqk1B96UxvYwG8V6QyHrurskxFPL0rm6GS2pAYppp8m0Wen160xOwRsk3eFK8M39X2vDkPV6B134SfazCPweQnRcHPnvwNTd4nkJw3+PI6PJkNYKgPTT7k8QXJlQ0s4VhLq/cYKAO73jxPr9ndTe3PH+yCwryOnU7kVKwXeG1BBY76eoyYAj8eV1pgEVl2HT9QqZZ6qjWUc1fVtsY+cngKpWDBgfBadKQ3cbDWycKrh1z92+qYhLfnt5sSfm3hsGzzVFY62S6sQKvElZh0ucuW5sDvK/BML+AjYc3IK4rwexEM+aTGMVcO8fD9chFTeOHsZsoFB/5J7K91g5a5JoHAegB9dEtHStE+Zv+WIxVBr13z9kt7u64GDmCtxliR6WKarCUDJKBiyW0KrKE3xBC0sTAW2ohVXKrsp9kYy5BYVXeAncwWMgCJx0LboocK04PVmge0pgYR/nhu5qKGvOzo7skOpXTEpBXvxh1s2drM2Fn5drtJGcfp3fQ=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 07:19:14.749', 'C8iFRql2FSZjjh8zJumVoGzc4m45fVw4jy6JRNe9cuJBQDSCNbrqCzAsGYBcfrgQ64E93y60QMTwe6q8XJo+IcXguKLf4yddyBAgUmiQyWHM6teUMipN7bMzXNe+ZICvky7731ExvgyCDtOTkgIwXcBBa0+5fMP7jZmbdFiJt0b8581BTgS/2wiToOMuSuejDtIP/GUoP/Jqu7Zj4yAvqKmrlS1TgadxvHvAyMGftGYZ0tQ/SQ0FCOrBvjyi4qk+4ZfpQK3WwAepL/uQjL73wk3mcKsdcjN6XD7FU5be9tpDlE7236yPIResTUWclz9YfRBZx+k9DeTPSh5t4m8cLnUWRkB2O1zERSE7QQizGU5JCKLKbj6Cr0EaY0JfQua6RSKP0H44t+9RVyREMeEXHReQ7EWHll7fiNI1RugQqY27AAS1rLGJfP70D5P/CQ+dJD+cbvC/lCGW4vSKdnluECtt58TdgAhpDJ1F/bYIwFzJAfX+sEuVy3aPxOAIAcWlwqUpWhyfIm2qAK3v9no650oajrGt+AbN0JTNIgPSOORlJERaO9KixxK5uaV1CzM9pRZUbavxodSK3Y7HMUrQHjOGuhDPglP6L5AV3Y18V1CLpIWGt3Pt/0mxy7xO0itYOsTFV1w07939a1QIfXoGeZq9JS7bV8pqAblNWJUonh0=', 'John Doe', '2906171a-023b-4c7d-8b91-cda4a08a8b17', 'tc2sPyv8Z/8cKUp0il6BPHQCwvBqSSMl3t3DFAxV035JQ4Qz3N63CDn2wzp4HAd8Cv6GdZ8Qmz5IEF7P+im1fySzCUBMrIcbLmSeGMF2BoUY2MUIvAS5gN47XsTBpg/p/pR1VtwSiQ6FwkTvmznfFNNGnpOQA3rniNuZ58sPzPhaRNEDip7V0jEERUsXo4QErVpBoLDgbNKTG4QlRoqhCGaLLhJ8TJ3BZhBmA65xFbvgqEfcpmZ2TQd7khSU4VAAa10+nPK5i5fZA/tL+a16me92E9Hlcs6BSiE/WIWxrkZdycxOv+CzsM7XkR2sS8HhSrLrfZn1a1A26ylc+/h8IE+dbwH+lCgfFzy8McLlMOKKZ2MePf58qxwSVRaVq5Usm6MTbNiLhee5fSPbSyVZgOGSDcZTqb17pJcX+ace44aGqjrY6bF6RygFAGrcXUuPbP021iPb/I3IGGHLK6UFE0LQf+PnMeHi+ERMHhJJdoCtPdkx0COxOTcZ0W7abJc8lTRdk6riq1MnNcI8vsMmA3JeMqg/Bsd9/5hYIzmbnYymYPCpWOp5ekW7zqzd0zJcpiATY9SvAgQJ82j3RPXOqVBT5AEi9lwFX4nIk+h5RT9JPyNCneHhWmCG3+Nw/nB54HrJxll9HNgSaFTPzfs3/GgTTBvyCmnjvdzpAt7jOmk=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 07:19:33.693', 'XtLavZqJturyOK3VDPOXqWTNQ2Jvvr/qhS+qOPPUrVX5CWxEZ/qS19UmGtLySIS+tAbndhPWPOowMrEQ2vHlMHNc2DpsmqwUvO0vvxeKP44vvHO5Mi4h3uSyh4bDrqz79vJ+YIxr2wDcvDHEg20e7bHdMLJPYmSv2n2CdZw58dHbOlrMtGpH45WxYzR0y2UL1U8CvsDbfN+4b7FUMCMb+T3K8zpaJTkNMcqgOfjDYs2msh0Zwbvsw2OlP9lbSr4NIiIVeLrfcrrhWXFu+RJYg9rjuY2fQ4LD85/FgV3aX1EjEHBk4LiR9Aup8l0t3gmbng6nlJjTSI5OJTdIZyWdJgIPLR+3EBc08KhxzQu65annkdhDmVGNwSo9cprMNfGTWak8ptYM2czxYqUoh+rCYmFR0wv577elwVHOngnEQPnqXWUHC76/nnGnXKf2Ye9uEC/2NOlpIIPZdHXYu+Plbigycex5EaCUBwj+8g/JxLKOaWR5vkwKFYOAAOuRQSEjbGkTygiQP5OEtlQ4Asig2U059iXiCdyt914pilx3/6mqWLLJcOTCprWuDWQL7wuXBx2NhFgSqiXdvGx/tqH+rh8o0/od9rinUlPIHitYpn746cCJlPQLsdDqCw49ZoRKKaObmfMTd9CAKnsg2c0MOUcYhelVVgnGkQvPNgWr4vE=', 'John Doe', 'a09006fc-5edb-465a-bcd2-eeafb0c0f2d9', 'c73WYakz3xzAx5fe6bQt7xPWK9A7yFu0LqpNpvvKJHg30aopbzD/LrlV11eraiVOhOBVS20PdjbWzkuGzSaKRjAZl4uPq1tmudR5msTyvbG0btW88URFl5haZvgvX7+EobazvyoxmhTEoorBcCtUepJFw9W8MiTo0Y3hDFeT7M4IyERkMCnbG0ahsBnX48b84DVObtGiOzsHjY50i1o9giaDV7FVSUGBMaqns2nvkSJywMgxQaayAkLP0c40BFMsrEytcGArXbYThKNgGNirwc/shpR0L8BYvBE3JHEGnHC1ryHCbazM3n9C5zI1osaUqbQl/dQrPe4aB0/5wSepVWbGA+yDKd8/5/kOoLqZL+ucByA+GInV9krxHsJq4vEGO1nJvNusZLIUMoSCinpLLskULhDIEVyoJhKizBau6L4ZiLuSMd8LZdMHwzEIP5+s49sxERrwYt7FjL0PXUvNdTfDu/aJeVPI1lxtj2wZsdjr7OyfkmQcX5pCEeY4UhRqxPmVPyBAWqN4ri3oKFH+3DQqp6Wy/nB06AhJm7hDJ4OMuQ0p5r4aYfgIPIcuspDiOhrw2FXKaQaoxlO8l4HHI8DP47T7ca9MnqyzxTMogUANSe1N3I2z1dR60taQJTihkiD4CVz4LyQkMyq6NXCVYGYRzGwpF/Izb8dD2ceTaWg=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 07:20:24.534', 'mP/jHI8RkqOT+28bG/sW907ZKQlqVi9twn5ElGXM0Fg5zIQgbWVJ4J8Cg4OjuzsVw3a6olyhZGbtip9rn27PAE7/RpGDrONLq7oskTORnXU8ISbhI6xR3e8qapVlOQkYQLWQXELtahi/95wl9HjeM6vZhpu/3ghJV4qkh21Uu4LUksWud9IsvHAroDssO3T4Tkl9iyVY7vA49Ac2VY+Ih+QEM2wDdAaYIPpSBOMq4DOwp1cA9gy5PPkoFV7hNrD7M6ZntRFczFxzB+3xyKXKkXtmSZqG2/Wa76skuJdtWTEf+lzbFWbyWw2SfBziqnssj4hldYSQ4h0SKX7BgTfc8oR/ZUW3Vlz4ImxOKM5uyWf5rN1I/cPscpEIJwXjvkWfQx1Vzjwp66h0q0qJ3s/ZD7+8AGNV3EYL/gKmRtwkAvKb0+9UzBg71fMcqwJfrQUZcdiUVhxfzj6FWMMcErx9cLqMY6VutzS73I3nZUaZfXu8pCFdBfSBTYs+JD8qSVs74aE35G3srW6daAv/TblSAO+Xw4b4ZJDwgxgNTt311bcxB1LM+8ayZzI0BUcgT/BEhePdrL2m35+jx9AUAgkqzl2X7v4V4Ctwtr94JHz4FVtuCO4VRXYqXNKRTdxbYXpSGoCTwURJVsB0CBdsJwsWQUYGtZGHzteAmHG7zzqejfk=', 'John Doe', '9428a881-94ae-42be-bfff-1bbc91760878', 'Tl24Q5KhybXjDYA1McaKpjWooLu3gRN9B2H1jDsGYaSFwgZJpTHWB+6zrTSe+hCINtwdbw4fAplVN+c+a3hooP2oWwSG3UU5X4r1zOHKJyWe1Rckwon/7bva0AA7L+xK75xsOOFgEQZO6J+zLfbuz0yRv6AMChEsbtdH/pEvB7MONzv5lZl+EtlPgOV5AHCFW+GkstcXR4fos27+FzkA5cl6Rnkm42xV4z8hKJxrXOtlCmFOPDmMZ30/NQJ0Qq95llPcfl6LAiN2HGXV9pljBmuPdegoCeMMQ9xSzwvcYh/3c96oiGzS6LtoGFi6zNoxj8mTNZcR2mZemdTLnfx/QKbjMropQ4HvDMdYnWWw0f3zPaGMy6hCQvDLQUeyBAUn+8nfqvxgCilSEmzpcvoiQ4VLISBdNGPEq1UWp6e09BFFcawWc3VJ40DyUxVz3QumScaI3z63m6itj7RQrhSQgYyzuODiPMZgG/klef1JkMrVZwrGFoo5j5JDR6DUfXlAJAQJHTum1vvTIa4ROW3GdA95NOlC5aZwNXHVfk8v8B71dedL6pw0bn2W2qByqcqwxpkqS7H4O4sD4jbzkd/BCWp+X/r21G090laeDaoj8CwDNS6fNUBmhqFgwEiVXwXlxwAiu+NiA6ZjQZKykuyy7yxp5ybfQB+AdJ67/wCDr0k=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 07:20:50.342', 'lPgvdd/Ix91nbja5Bh6e7RO6bpCbqZ/1S8oWiSKMj1Dj64evRpYtLOJnxcMHPtceNFu7ld8Ae78FRaaEzyfokJHn0Ja/+8Nvd81kSoJL7Bz9lmtMdMS8ku5PYyjZrgxTcp5IejNx2IpAkDOw/zm1qbYrVzUCm7tsta51+dFVwB3EptXB0lVzi6iDXqzhpHOmuFV5NJt2HS/ztCfR/NFA8M/WPERwHVIxKe8+91IjdUOth5NJ/HS90CIyEqbdNOveRT5sLocH3DlHwdLVIo68GdmVKxr8enxpAA5zKkvxY/ks5XHO56BqMNj1wjJ6G2aU1QrymicB68VLZzwOxhoq5XefGbgTo9b4AKLoM/7BkbyZI2TYalPjeMLbxiMGsXtLXU95gZxdZc3ks5HzA5pg4QG39hLN0bAynGjJE7/Iv79lsAQVLyZYBW4TdTq4QHpivjpV6rYjA74JipQTJyLrrBj5RPQhGjQop4vr7TgCfi6vUjXGsPOZR5uHdVJ7RZVloWpfCfONvKQAkONtr4LXK8Mo14RDtyVW47tnSMsnMZcEA+MLNnoAqhkDJNE4Rsoc0XcxZ/EFgYr3z5NIbyVhMjg1vKGk6yCec72/A8psCZwpKFwMQ/8JLFWYr2fzrTnFqGuDKfoGANOWlnDkyCyles5zZmDBsLjNYk1zQ90z7dE=', 'John Doe', 'c39d7e4b-a417-4a74-b4b3-889ed148b869', 'qvr0MCnZgLaGyisxK9cWV/09A3epfvcbkXSgvpN7HDgiizZ8LPZjob9ehKmjo3U5E2fTaG7E47yiMuyCvD/mO2hE2TbPZXMbRe5PcDdGX19BW751MnQuGjYRxZaaxo5BR7z9YiD0a6x13iP1QEdfmGA+8ByyvMlCN3vd1sH1UeWc7/J8YvlN9NQvrgx1JGxKZBs9/NpCnA7r1EJEewqyuHm7sfg/jKhrpm526jBp/wpd3/QkmjhRk+3zHxn77FUbEfX4Q1jhmEVwMQDcagIkaPDNqGptVTQROo3FXnevqB8xxV1NL3eXMKsDRJFyNvNoCH7IFPZw9meX/OggyJf9GLc5cqzeGjPbYn9YL+74jzOT+7GyA/PRsLfPlpYoLN9ojWPUmjBhRpi0JyLC6sFcmjFRl8qh1TlXk3MOXa01VfKw1/p9Le5qdO6ptSIiOtnA4gqgZauxuI1s8d/rSBDZPUTqw+KGYdfqwJIOXR+c/0VUqJzSKzQoQhadzRXLCCEtBIuECm7bnY7LofNglO00mrlyEPPLTmBUHzLP0shuctIRLcRzy1w6VEw2tzmS5tIbB6xmtgdUnpnI+OqSndVWRg/SnJ+vK/oMgLiw3lxIe0WQXso869cn6aeWx87JnnftL+//9w4M5UFRBNzBgdJv4CS2LUGvQ4sHh4XentG2wa8=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 07:22:55.706', 'mcF1ZoStAdSCj1/36a74+wWOx6a3SQ6bA54tCQGdffkjlZsYs9KN6qdEfY/BJ/QQKYDNM0I2DRXnxcEbrLpHAvHDcmFlALb/jaEyfnKMr4cZON2P043DbURpO+UUX0+r7p9ByAkKnlUUdeINjAKB8J0uMjbpEvaYKJ7xEhJ5Lk2/joz63j756bIlNPYEsS6ffN7/5SU8bpLeqK6IK4JSpPVQRXI4pYQYm6/Yw6dzckNHXXOsj9KlPlbJRaD7i+DaMWBiLS4yqDe+41Y57jo3TbuFRNSwQwbVsEq5VKXQFYOgmBGeSV0snr9MiBG4crf47oqDXqLz/yrBOzDk/2FDFFNgQzemDWahnhSDPNMca8iBTh7+squEUiq7Z9eQir14DknnvpBlGc73+46h5My+QmQ0vdHnUUJ7bcVXn43jY8h6ED9qY8eyDcyb5GiEg31WC/i6kGgAnLLXohi791f9MRr0ZYXgnUUPCisQdldjON/7snpygRqgsqMR3ZkoI0SB0DSk+6r3JcYjgylECVnxuE8JB1Uf7Wq9r8WyXR1Eg4+WcO0Cgw+lvsCXn0NcjcxTbm+aiMMwi/+yO+wdT6RvAQHucprq9fBrHQUn/bS4u/V1Jfz/8Y9EcXQNn4sj+AQ3xdWLQqX6QLLTlyS3Rqq3hy54N7vPBjhOdktsltCKCNE=', 'John Doe', 'cfed70a9-9331-4229-81c4-f32fb2dbcad8', 'sb9CE7XVxH+ZNxlxUR+O6hMCvFOvlhjSMueKPXuE6T829E92uOlFt7ae0gh/tmsQ/JQGwqlJKLZ5kQndypA/RSahygEfajrNDVPPMXt/HGKg1cOEXG7q66LEGRC0Y5QJHQr8sPLvvWS0GVjB1ru6u3Ircm15Vt7pMPC22PpmMyTCU74FUgVXxF9NAAtrH0cu5Wk3cbl/9WDTxERwAVnED3UFdBfVWCAqVsKEQoRidkud8jjowa4Qu+OhHvXueVrdo9xujPPzhdx9RyVGdFpFfcztbhvUbnCaFj+YNkvvEfe8aqeDHXt8zxeeLbqfTXGjIckGdlvX443I7FmoYVBiT130fMW3FioKKrUnLzlwuqvqUfdJDhMYsW4nj6vxt/OGtnPy2sGxbzw1YpGSIo3UPnw04jilbV/zqIeHQZ7veAFne3iAPUE7bnGU11qjp9ZX+eoaKcsQcAws0xg4ZN+p/ic5lIPW1XftB1nrhz6HFo4BT4AN74ZAN0jGZssn4bHKteR5Gv0sFhkzSYIaw/2BMg7rBae3bmuH9wphX5ZqBLEcEbmm5ByoHW16CwIPPFlrVe3IfQIqZE+GgpZWSXsq3DnfiY+zQjkxc2Mauqo8nCOBb/77zaHymRzVQ3SOMQ2ml/DEWLCu1I+98F+JYQCxfp5/V2Pab90DSna76eCSI7c=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 07:25:38.757', 'POyHBOEwNTZYpVqHtWR0PUGlS/YohL0eHS9CQ6+GBma+D4Yii1v/V0y7GPQqFg5HB+Um7zd1ju3RZqykwIvG2G2ID/UaUyK6J5ayXGsm8ccOc/ZsuBb0jddGMYuaQhgi85lzexiv6/bKBFfK4Y8e+Wbm2Q9/kb1Qjv3vSPIZbbNMJgVghZ0aSUWh6sjXPRFJftxzQ6oGb2uIldhK8UVAmcZEYvgomThyeFRkjngpoZ6yokVbuMzRbXOOj56oWSHQseGiUt1yMP4eYPb6mMkyz4T/yeEmyhCzpNyq6hLu9EO14RwMNbfmi3ZhzT/PpqM4Zr6xM7J7q8GMBewPwyCL6f5kyTurQmlBILjS4D9YA6BdsvfrdluBuuf7yqxdEywUCy0CIG5w7NyeZE569CVkfxUzvkfVF5VNjLmYnMMMaI6l+HdkhUDhc6EGcjPfWFhqKsORot0VErrhrtOmD0llBK6AY1BZOvGC/BOnPZeQ3c9x21281z/OBc4xcbaPzFscCSJKJ6Yd1AQdIzhPNiSKGqYZaT9THCBnNlP7QBiQwtmIHKHm0gZXkBmKvqwJJFYtB3E4m3DJO5q1ar6kSwYWDZXNH7fuRGeZGLoqIBBp2diPSW0uvZYg0RRLnAlHSUhQFYyNgb2R9dYW3G9QcGNapQTSSdmI3+ZM0kaHy2gTN9k=', 'John Doe', '86db1822-8870-423e-bc87-7a16195d4086', 'oiM3qK3BMFo5gtgIYpCHK/ybADYYtyBiSo+50eq6puK6i1Ro46CLhNtZQE4/oYps/pz2BtErhGbo1DQP9UadRLIWRvuAk8JUmqNf5KQbXE6fiAc4D0Mvmkd0JMqVsE3+g4ICIIsp5e8qH4krxfVKddpOXLoVJXeCiFc0Vxt2tefZYnQcpsi1TOHIiHEhbWDA9qNoQYAZDciGqHCZ8dcXH5Ovh+N7xTs4MH3VXihwSE4MxMfGZE2JeymshgfUz1zCLyHvEBqwzE27Fep1H7I9Kzfo+lIpGuw0X621VT/rewp64puCOP7ssmio0wjVMV96sZxz5kGURaSkIe43M4Ft7RhhNBCgA/Ez7GA9o4zBhbeYoF22iZSHOBFVcPXuoB1Vaq5l5D4b1XfflY89WUCCBQzrZ+V9/d6T2RHJBQYtnYmzR8rbfvDT0Vo+n1QsY7vBZXF8Uv5LioPYE1AUlb8+P7o4R1z32BIHlwc02BfzFHATIZaBHw5/o0bOtmqUoK+ViqEKd2RaBdkX/GH+suzjAKQjL4HFdDoGakso5CKQT6KumdFx+swSVSFIh/BYgXW1886rf3sBfSsIGBsCwysSc57f2+3RKzqi/T+x0J/bpCQiEsXQ9Hm+UaVAlgAQseo41MX6pZDIs9S2aJ8RlX2p7dfuqV25wKWzlR7ZQ4Hdlh0=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 07:27:08.93', 'XI/m9Vf96KSfipLNY4SzVyb0qhvSl4nMekWIhE9Ec/q+YWt0uQRIxKI2Lq5VdN2TDNAMNEFjZ1bzxLdXAfKXgd4lxeJ8NpHAb21FYnvHkwK6HbhxmHalk5QqtJ756jg7Z2kWH8JbEiN4w8wsb7heIIMMPinBabzKgw5aDyYgL1B+RtIqi09Ueg1OTwbFyaSWaUzylVPF6Fc0UyScDpysLimBGDfN7+EK3uqE8UfbMeGawZl1xHcMVWJqJwSI48VXnJzzXNKvvVeUMbndOzXFHEXnGem20ofgZvW+bnl3Q2cnIJ1sDJP726KIc0VYpoumJVAk/a3aAd86Xh1gRfzaE/NjT46Kp9oyWcm38KOJqPAzR+fIkkrKmM3Oe/lWSkzZHawwoiGJHlyDhehkYTZqGVKGx1aiPpohXWdSM/M/aWLaKdV7yKQ9qzNYaWx1FurvydkvPXW38oxjyA4EBbyDxA4HgEzY5gZvcIyRC8NxzAHQGmcidKrf6KNh082t9Rvkd7owBhn0AoJcBoaX36MbYC/Vt3p29lCH1D7nBZqVjjix9pAxCNBM+Z06MF9SLk9PX2lj/laLnsdyzuSFafmO7J7fne6t/CArU4tWFfQlUg2C/fulo5QyaUqh5PaS7DGuFknn0n+/pYfW7nDgm6d/GHGMxBVSqvyMdbxyNR+7GRI=', 'John Doe', 'd5129a05-e1d6-43b9-a9dd-dd77b808b3a9', 'YftKAo6bUwQcg0sGfFFVirFirbpfutJ0AD++JQoGYl55LPTMC1sFF0LYqkJFHkFWPANoLiXwRwy6gTtZ8RqGYEG+sdXnSTQXL1JmT7UF/eb2WONfSLWV7eepq428pZ+fbX4k5kLtDv2CfIGXUZKPOQ/NaAKv/+XiiOSXFzAu9P8mz3lqWnntYndIffUZyUdURfW3JWYBy9OHJaZ/abeiRD17+Hjy9WdEm6WzSP29vN3croemNn4XBTI7Lot7Ia0NOmJZP2+f15vfsjkQpzB1ePKkNUBU5cbNxs0vE2CCSF+uuPpPwq38MiC4IlTDY805c73hfLOKr0VGmTwfvWzBE6vQeV0ee8Md8REHkDAayMJ7FnNTuwZRDNLkletTokWSFnvUn+K7SS7iPP3fZ0gb15gT1h1qQnbgNCkBL5+QBZtk0K/GcWnm4ftCdaR7ebKHjjjj6sgp8j7JPUfPR7UdfTR2NXUSyACP1RcuLug4ThMICJQqc4Mi2fvS96unEaFzeUvDQdEJyySpcG1sDR39V1SNp7leHcyPJtUzbpo1xaJQSzKieG3SJiTmfxJonzfCwxaSGLfqVZgprFd+CyuKfuMZpzMFkzIwtpmq/HiKn3TSzCw4QyAcdApTQeQ8yxj7lOyxrQMLwSDtkibG0A35yRk8u5VEpOl/xIdncxFMEU8=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-07 07:28:54.78', 'YhuR2IYfA7LeTE7AWf5EgfHjncbuBQ6KyDyfg8zJ9SEv3xwGE2dawBIpc2+Xe89HsHLMZvArwW/95TmNs6JbmevnU3PayiczaZDrnewCp77/BeR3r5oUV+JkNAFGegrOmU4LebjvszDVwepy4znUNRVJAtlGMX0SxCjDYksFmLRPcSE/fzj+f6TVNro2Vgv46rbwkGAty54mROjVAMgM2B7eQBEuyzBzu+QqSy7Dkib2e6GsO57LZ7vgPLThKpAXdyU3DRRe0+rL3qd8cAfcNQLaLH6eOwG0vVHD+Y1VJdFeUiWijM0M/t3wnKY5p+P0Gyj+mZqw88yXAMnRQ0QZPGNVONOXTHCEw0H1uJ/hxYihrlixz+C/Qnmod8bThP3ZUnne+oLbFSlrGWhC+qraeNh5zixwV3wKc/D25WBRzftYMi4WC2kS30AtlukAwlKRGwrhGNpdQRCMERtdBXV13FrVUpH9OfeM+4K4ZN4I3OcnkIXnDk0WT0IkH3VWS5fjqGWjn459jlRXoI9jR+bscRGzDk54KRl9Rcdaj6Pn9SXxsJG3ItJCU+KFYxqAGtOTJcreXGMGoRGVDNXNSkFSbYQT0acFWRM5Ih8roxYMtd+fPuIUU5b7hflmynzIT4rygb3t78Ra7p9mV3hFjVVCnH/4pj6qw5BnBzGvkYRmktM=', 'John Doe', 'c80a747d-c37e-4fab-9b43-12c86baf6cbc', 'eWjrf+i+QKTNZvITa+LbVtMlE74TANOjw4JO/oKxCEU9q+pnqgyxlQknMmxNajzHTlK56oMmIYRUxbTkQYoqLr5pljglw0eovfseQ0AHJuuZRLqFzv/KCO/uXwNXq2XTO+v6LNsL1dljkHM1JMJBYeyZuE0f6sAYH0qHnQZkm/kZQhXuQ8HxcfazA8zzq4qxBx7uVR26Gaf/lpm0/Sc0kDAG0ztti9Up9gIXtx4JCy+bvGbO41OeLv3s03ZRBFzUTcM/8JK8yFPOc/eqCWmli6gcKs60kJtLhC6L1bHjKFlH2ppEnubSFXp+4DXbiHyl79yVFD34oiwX3Ae3RDn693BOU+vM2zIP6xVEBFQNUQU+6p1b3wf5q8NjSgOIHs0eCXwzGEznaG1B9Zrk0rCeAk/wx1c6femejbNuPyEsKEqlwMoCwId2A3Hd/oLXUnxUvMYO3DRfhQJtzzlYypadYT6v9JApBNUt+KVxTy0Kn53g6j7nVFp+FyuhAObgJ6B0Q1WCz2tnZf/RS9BnkzP/LrNQFN8Bj1J08Fk21qdnr985lypHbhNU3KEC8X04OvolUUJc6WvfNETy3bZzulswb1sqJDnBUwSlzQw9L+Mw0mjTGtHFm1jZJgyUuWcl5OPZf6VBw8sXJpkQlZ8GrYqKiwltMffD7ljUTXtSjrbRSe4=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'A12345', 2, 100000.00, 'Tiền thanh toán hóa đơn điện tháng 12', 'SENDER', '2025-01-08 05:51:11.423', 'fEsB5oF4A3sNKxSyJbIJ0AQtmy9D0GSIqmXK9cmOF1oVC/Qt9mDs+JO2ZwVpZvz/AarB9BBTlAxTR5Phd6W0npfXdznU6CrEt++GGGiy51O2DTcIVmwuZZTP6hOCeQY48cS7B35Cv+3N46nRLooS63vlHY8soKGJzwmcps3rfjbEZuRypqCsXleetLVc1m/vT5M7FhTQzANcEwD3wc48GNKweiBK4+2X1P2Qr0Kz+DROk9qgwGe3BEgVmlMPqz/9ASJtwfmfldmxhIGvRqQYKj5/j7LsgChzwcjqH95tf+vW/7a2u6vomIUVB/yPOginKwYMTGBtjnMUsgd/LT12agyCo3ndqYRgEVTSjxuWDZhz8NAPl2ep9Y98dLAejs6kEbrJNFmUeSWbJI9k6G7Js1c4RDF58VSFG5ekySL9zLwbijOT4AnjUPPcGBUJX19RJPRcUXan0g9DRML0t+TAuro9mUcJxT7LKACvBArUbBUu4oA4n11K/fNq1lnFjdJ6JsclpRjDPjto88Z8E+h7cyT1xHcx/tirhgmLGAIIgR/wH2TCVVCkmyv2UaFzJHvA6/QHh8Lsh5b32vTTjQpu5rTOyRU6RX8V74aWbXkMQgGDERf0VRQK3Wq6nxv/1yBo7Mf+nIcSUEWd0Jpj00LGlMJmc9/NUxugaGPHLe05Tdg=', 'Nguyen Muoi BaA', 'f5e9bee5-4d53-4942-a35a-72695129cc2a', 'RX5z3ORWjufS5fKSZRTqgf7wKkSY9v4RZmahd9R+tLiJEENFah2XB1GJEpuxABPFKALklxX/orpXiqmAgVH7wqMhbWwL2bgj4m+QSZ2JP2wDElSeeCfl3WB5dXDpfZmlyrsYhfKuDabKJiRJWhlzv+lf2zMTcOpVP7O4DEQ6BEIQzCaG/MUMEkDia0RPa7MC6wuX+XMoZY4uU5hhYcl5Ln8HIZCXQQXO7i5EZ+w7JGRZnxgt60XL27d2LqE4u7bTr1C/5B7GEOLlh/wJWPV7+Ngddb9ohb1jflP+Cu2h44haowV8t3BljY2uKL+O1yA4H8b7+X3ZsiY8L/1Zg9E5mCVX8qJaUNJGqXF4Vc91FPljRLUFb5VVU8vHQcTl0y61HMzJcmwOOwwtKtP5PfuCv1LCW72sWe+RH3IzyPvYDUSSCCrQQdSvFwnXZK38G3Skx/1E/RBllHfG2LCxM1fp9uI5zwkpEL3D4Iu2743tMPs9KCJHsrKux6VFpB3dPiU2dS3OyYSCuDGmE+RSqVZ8IzvjHlFTuirzlZW4oMBWgUOSdeT6wHlLQjaEVWiVDQ6L80Zqw09n1ffQNBjA1mnKZ+/ThvidM3X71oo+a4an+NlUh9wBBvszNlTHdLemPkme8UEJaOpfJT3K+r+wqhH85oKhlY6Eyhm+6JVmE3kUy54=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'A12345', 2, 300000.00, 'Tiền tháng 8', 'SENDER', '2025-01-08 05:55:19.173', 'R2LvkSexrEBvYOlOsSxpN7NIab21wh0Y7qjFZ+jgHbh8wpuSbfQlUXfrDZql3fjYcVVB/i+n8FUSVR8K2KSJB67GcntgDHDR6j1JGhfTdV/zEXOvtrknIfjaHK0Aq0ElAznRBwlRHUaPcLxd3vK4r1AMScJkLzdBF5eBjEaltRhgIsomfs03hxP92df2fYPRdMTjSyEy+/RUI+sSMCnywQL98WtzogK7pLiGMvKIXJksy0KKFPAqubQ4Dfj1DqMWgmFUZkI9Rq43jxXwQB1dyRyjUr90ZM9lUCyNo27skj909M5K+St1SijvG278EEM9q9xtlQ1a//txxSfiuddQlYW9X67Myf5KrEqaQkD4owNoUlmRX7fP15KoRaZkz03jJMvszWJd6iXpUyasGULzWBGVsjJhRb9yDv+F4TJDzYTYeICeetWWOf+MkBUzeIW6SnzOPhhFt3lWtaq1Yp31EEjjyyYmx1muvjLejWWpYoYWc/IunnG5H+YihHKB/C9sutXx+EuciBd7LsbGXlVShKyFNWv/FYy++3omGCbuVTZ+cP08G1Kq17pS4nhiM0B/Tp831W1FPe3igVaDybBbseRdpS31k6kcPA6M1Ql7PdvT997iGPW5GFehGlsfThdB50aCEQ9RzbTKPg9gQ3tHzNIa/eOQ1BEeYzqid0ot2DE=', 'Nguyen Muoi Ba', '051c214c-2018-4d99-b45e-4dbc845b1ec2', 'RX5z3ORWjufS5fKSZRTqgf7wKkSY9v4RZmahd9R+tLiJEENFah2XB1GJEpuxABPFKALklxX/orpXiqmAgVH7wqMhbWwL2bgj4m+QSZ2JP2wDElSeeCfl3WB5dXDpfZmlyrsYhfKuDabKJiRJWhlzv+lf2zMTcOpVP7O4DEQ6BEIQzCaG/MUMEkDia0RPa7MC6wuX+XMoZY4uU5hhYcl5Ln8HIZCXQQXO7i5EZ+w7JGRZnxgt60XL27d2LqE4u7bTr1C/5B7GEOLlh/wJWPV7+Ngddb9ohb1jflP+Cu2h44haowV8t3BljY2uKL+O1yA4H8b7+X3ZsiY8L/1Zg9E5mCVX8qJaUNJGqXF4Vc91FPljRLUFb5VVU8vHQcTl0y61HMzJcmwOOwwtKtP5PfuCv1LCW72sWe+RH3IzyPvYDUSSCCrQQdSvFwnXZK38G3Skx/1E/RBllHfG2LCxM1fp9uI5zwkpEL3D4Iu2743tMPs9KCJHsrKux6VFpB3dPiU2dS3OyYSCuDGmE+RSqVZ8IzvjHlFTuirzlZW4oMBWgUOSdeT6wHlLQjaEVWiVDQ6L80Zqw09n1ffQNBjA1mnKZ+/ThvidM3X71oo+a4an+NlUh9wBBvszNlTHdLemPkme8UEJaOpfJT3K+r+wqhH85oKhlY6Eyhm+6JVmE3kUy54=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-08 07:13:37.602', 'QySYz5MJKGJ3eQVD9omIkU/ZHcn3n79j/24qLkNw8F0R97S/eFq1ebHpMqcyhFjlRMqaiRy1tpPPooBJdMXzgkrnh0Ma7YPFTUkhbqdVFEtCUonQMc/BpN8z1BZCfktPJmXLd+xmsi3now4kQjbLheIcN3ZHDAMmU2K8Od58EZ6UxqZlRG4Nv2Go7d2ZJWDZvpRIc74wnpkXmLRf6mZW67SMUCglmQ1rB7MKsAhAAkoLzMybavDzSzbvlLOUh1EK5L7//xBm0Y1Ws6TXuxNF1HwERnvsTaM19E5Pxjl99oLjnM72NKIfLJfsSFWdsDJ9Mj0gFodldx7DAJkPsCpuujqrXNr8q40EIDI9M9vNfWk2azumDQmLvT5rxvhrUojd9bWNtvZr3qjbtHK9sKOB5ax+J7gJsxuUu36c9Y/Nv3kgms/FRsRQPiwH9MNusbVlG0D1rtkz0/r8LFTIkvH6crpOHqs+/kJ9dj4Dn6KC91C52kEn6i3Vv3BO1bjI9/Rvdxtdw641Zb+ZyOHOLSaD3TUIoy+lmNBCkL/2dS2bq9qNrE5LE92hhg43S7jba9KFvwyKn9+5fwiH/ZPPY3DARhE4o3oetEO7pPBzhFk+PwVldcsgwOfTZvKRbPoQBCs3YdxQPhxjHD1uGfCRi+qeacnbX6MMGVJfXHAkw54j20U=', 'John Doe', '9ca70dea-d26e-47ef-9318-45c8c10aca62', 'qOLBMC+b2Gj1HKVVXio/5xRjSGbzzEKOLag6TTxJSqrYVluVSE+eDRXfaXeQnHRx6JZ/h3O0qFW6tlnL92g80auWLXn4sEaH72dwhMl5WReCfSrNNr06Ij+Tr788222dofQfMFUpCpWhEDCUDa9KZ4LJMBb1WUKLOQl6E5RVKunaz+bojbIXy1rX5AZrJUkL7eehvklPutvnLC7EqQ8O2qc4cjVcVJAWZmSfCKKH1kZmFv3jwBj6/wl7YNisBp/m50exEhSjFtwXLFErKiYfkJD5ZERLNYSvzr8k0EPOvecGvDOI6xCsW3oxuVrM1gcvGsfBOstLnXaF+SK9H6HafcErB+ABB0pU1F4hGbZx4hvtMujbbEVrrxqAg87khaaWUOmNzS/RUxcITxCykpXxvROOCPzr005A+mHpXoNwzYHyH6xAKC8j3t0nWYvYeYLVfYmo0fzLAExps8E+2KMNMiGYeY5iT30R1Eg2AvHbC+cz+N8SB45Bd06Xl8lHo09U3xw9IJn7lhdsMu9aEGBl4yteoKU/nZbo/H0gqmSpgo7pAYwH10hND1LIlUO7yO8pBrQgXR8Ju3tjgmXs2lYwTKuNTDTO0kJoPt7uFdNiGf8nXntVRInx7/TDGjmeTtoGns1zWkKiapLSf6WzOtvYKmAgdXPSg+8zZVcBxucrmuw=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('85414', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-08 07:14:15.021', 'TXdIgjvIPGw+6ZqwSJY4kGNfcMOuRrrYjvtdrMwar7F/IlLmG3ew9uOIrwgJC0GOE3qfiwYGwKffCpqCNmc1iVWA9il1lNV3czpEpjBlVZI0766fNNxdf6YOrNSBfhnU0zGEOu4Hdd/ueJ/J1T1h+ZLzHS9oG0lyGjiztMoT8VufUOLkPRd8MlcdLGMjRYaT89nt/Nf6lBQRvbD6OAGSzgct2b9OyoskIcVnhRfjovgASHpujSAWbE2IpcbhlJxP4PpPfKKsOwJYjG+AGaSnz3eACaoqQdZKeDqGYsVNLkTfc2nOKfFwmQ2KuS1nFKoXoRX993dY1g2ZdCdq6jPrh5Rj0oaSaEWnNkunva0uFEnQdd0LeS+p6RN/nI0ODG9+TvGVdJutkBC9BE6zM6f39k8rf9FC/3z0lxv0/XWb5gNY6IrLc4j2sbObT/uz6Ku4EKLif9cJihNMd3tpm8z/QVl6PwgzXP/Ql+4j+1A07qIO4PgmlE1J9zve1GQks/CzYWavcMF/Qx7EjAaaYdEVGCZFFsUHIpICxgrGVYpduJa0jQ8Ln9DdNxEeK+3qe4VqHNhWJRr2/EPRR1juZ7/CNlfmpR+BWzXSIsFXubPXpiBXlHvmGu4CQYDBMvVNBPDv6sobDELQikRszla36fDQO9ktqu+XLwcKnHcr+FSFHHg=', 'John Doe', '4fe804d9-64ec-4f48-bf65-75955fc00e76', 'sxPjK5IVIx3yB9F0rTXDsOXas+Vpe5F1f3ebWuwjonrB3vVYD/S3jLZTa/mBweA4dCAVpx5g6hQcL7yliNOEKkQR69UXlpPcbpD5M7ypU/aOn3z6440M7GHGNIhRMhx8bTRgEH9+ROF8RwM3LnbRqcmYh4QNa+EJLW705rR1JvEe0sNtUpFoq2HPD09OudigFLBGUL1eAuj6Fd+SW/1C198zw+i9yyZPv2Dvx2K7IkdOIzU8E4Tvpco4jj7eXktUk+0ANt0yGTGyYSAV94k/Lnn9adLFRXJNtzCfLpRmxog0i/lQmF3+JVqRlIzQOxRjMOwsObSC7YV7RP/CSkeZXEADOVfUFWfGO6sgB73ZQflcPBJCfGbVfCZEzV/M+L6GA/yVfaFDpZK5fYCVMAltyNKG/+rsZd0L2dlT9w6lAAFi+ydfDl/915nUaXfL3fgCwYBmgXh40zSm9eLzVHQa0FaY+z3uIPUFgBfulK8EGTBc5eBKfMQ/Thx79aJrMwGNdqTqT6/D5BiucaXI9EQv9cJW5K+O1HYtHGrn9CC0YFClSarQyOgp6q0LaAwDJlzWkkbbwmrC7PmQqh+aRwnG48dT9qn67XZT4iOy9Upfga8IOqATzfKKikR+bdNmojaok4y7zIJ+2olNMDlJHTddrDQx2yP3+AubqexRqma/nW8=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('85414', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-08 07:21:24.837', 'h6cFZGqYrWRcV7o4/XDUbmUlEMmZWZewKSXmSObGncq4kEU0tYOKtdU1cje1Qwnn+4MiqZYOIlt3xpJrW68jr0Elrk6BK0xSWF0IggacUUpIcGY/hvRKj/5zTrZ6XOv0ZpD9MmD2Dkz+T6jquqDxVsRjzfRpGnn7Lm6PeZwNFZxjYJzHZW5bWSVUMt/F7zjv/qNvH81OtaUVcXtF/hxaAO+JQyJZKGcO8ObqJYJrMAERcAponhbdz+RtLY7HStsxP1Vu4a8lhy3txYTiM+PKuMKIbL2RcGmhOyJsVq5PIOGshyaBOsCZz1h2wiYWeK7I7yC6GG8hT6g+9WLVh6zXr8S5Ys5hrkrzrjFjDzbhUfa1sb3ocCxcyuxguM5bjT0r5AP4KlomoXI5QOaz2lHGmwrO1UTPuzmfQP8p62SLd6LL0yfTc4dHHjRPe6t+5Tf92c8abDLF62vTKvUC4vwdOkwPDCQ513sK1KOOBZaUY2/9XURPUN3SpP/PgBGGcvz8KmFkrVdQmGJMTv/ZSY9BF9JyXlMd+aozE98meqoi6/4F3GrFDTluBAiRDI/YCFW67V7kxnTYgDOwIh1eQvvKIyPexJYMrwYp9AHoqi5Nvx2Y//2ZgPs8FZG05ieaB/GvOYE+4FSy40iwivoKIHBNzLvd/1hCYVFGcfcSrMGn8Dg=', 'John Doe', '419301f5-2e51-476c-ace6-53f58eeb5ec3', 'tPQb91x3hjekJawmEhfX4vc5hkHUh+cfbWiqrI+8cqAwx2AT5mFR+Pn95rDAFffO5nNeD1ok8FZ+QRI3DcejoRe0Ui24fsxDIuuFVmwEcdW5YpTJELp4kdNuZj9tWYcdIx52nNIyb0L5wFSY5iXa0xKM/OPkOWzYGxxqy68wQinuI5A7Mjw80s9RgBhBi6SKmyjYCWpAfT3iIVtEP1L9tDb+C7ioEfhJX6TpqFb5c/RflomEf6JgEhCpk0wvNF5tNPOC/QXVhEEelv3lH8A/8AYv9MhXLjZCBUx/xREHxdi+3Nmb6blAT4imZtuxawUK67yW52RNJQ0CfbQ8lmHBJWvLAGSgh3FBw1nrREXO6MQTDXMWi3dpsNOJPrC/Z9ObLp5Fg/Pc0R7V9YMi2ixYOD2eIyGQOtDnpOER8/RgzxlJFQrLfzvYQxksfiVX20Nm+qfBdxuoeP3BKgC3+O5ycEOm+OB6zQqIZb/mUHwdiEIllhSoJayQk5dIyaYWW/kmt23qxNeJTIdW7rgEAaxt7MfVdoPNMksrEPPybxYTgcd0ZQPq0q2JEm5UGvBIa6egQpixs4yyaE90Rc8B8C+9a1ZbsNojmK6FeDMD6jKyttVECUbpEP7dL8uMEumTR8zSJkVLJFyri0R5cj22cOfr7v4RF2uE1IzPiCQs3xqsbuc=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000003', 1, 66456.00, 'JOHN DOE chuyen tien', 'SENDER', '2025-01-08 11:06:38.106', NULL, 'Trần Chí C', 'd26e9cba-c362-44af-936f-a6ccf2bacadb', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000002', 1, 57789.00, 'JOHN DOE chuyen tien', 'SENDER', '2025-01-08 11:24:27.948', NULL, 'Lê Thị B', 'f89fd90c-d1c4-4850-882e-68ddf5e6018f', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000001', 1, 24456.00, 'JOHN DOE chuyen tien', 'SENDER', '2025-01-08 11:28:46.814', NULL, 'Nguyễn Văn A', 'cf0d385b-74b6-4397-b522-42dd3d87346c', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'A12345', 2, 300000.00, 'Tiền tháng 8', 'SENDER', '2025-01-08 11:35:21.685', 'TbQ34ya7FYii+nYtsTYV6HkgpSrjyJIkhyVJ3xm/61OYwh6pt0sLT9OQCqROlpz3SFcX2/cB0duEyHGmMTHUHF0eUDGQ5yy2Yv/xcfazDOFZF6czZ4G9EZAjosXlXkV0WTeTUqP+IxnI7gb5lje+x80iIigAWwhdi9QsKRW225sNjTC4eG2cfXZtd4pL8RcaRkOBkCgJ9EfjsbIZkd0XO5WwmhgqfZjdFs9lfmDa5ZukLwJ1O/SUODAuaoFN9bOOuZ7yrUbbYjaosZBHLSA5NTQxeAuOr+tgTSWfNM5H7Hn2uF7flAZp3suNtj4fQg6hmVS8mTAG6aQkjHip+oUALnj74mUN4LjKN+nfeAdAXF1pS1K1ysKsg0NLkv2Q48dOyyyajd9jbRhOyRwBGdstIAUTm1djTe5S9homav30BUDZu8FVzxRaIEmU7CZ51vdDE9odk9JQ6NM+kCRJiwsyzteWVFsfrCLPGBGOeJcfqjPyRdof5kW0Eq+EIEjy9pdAnG9YFeeLXgQJrqyO3z+N3XIzwg2pWReRsTn4uTecml6PwkuAAgDkWiIJG34DLgUjWX4fuIFRWp0xqxG4wcX2EbRQafKGbZ2nOikpJ5CqBoDFzl/mXGsw0qt2QSdIkxaJkL2vBzHg9HT8O+/59AyK0iGMe1+bIyv9t3QrSoA6efQ=', 'Nguyen Muoi Ba', '6270b243-0568-4d1f-b0ef-c3ea61270070', 'RX5z3ORWjufS5fKSZRTqgf7wKkSY9v4RZmahd9R+tLiJEENFah2XB1GJEpuxABPFKALklxX/orpXiqmAgVH7wqMhbWwL2bgj4m+QSZ2JP2wDElSeeCfl3WB5dXDpfZmlyrsYhfKuDabKJiRJWhlzv+lf2zMTcOpVP7O4DEQ6BEIQzCaG/MUMEkDia0RPa7MC6wuX+XMoZY4uU5hhYcl5Ln8HIZCXQQXO7i5EZ+w7JGRZnxgt60XL27d2LqE4u7bTr1C/5B7GEOLlh/wJWPV7+Ngddb9ohb1jflP+Cu2h44haowV8t3BljY2uKL+O1yA4H8b7+X3ZsiY8L/1Zg9E5mCVX8qJaUNJGqXF4Vc91FPljRLUFb5VVU8vHQcTl0y61HMzJcmwOOwwtKtP5PfuCv1LCW72sWe+RH3IzyPvYDUSSCCrQQdSvFwnXZK38G3Skx/1E/RBllHfG2LCxM1fp9uI5zwkpEL3D4Iu2743tMPs9KCJHsrKux6VFpB3dPiU2dS3OyYSCuDGmE+RSqVZ8IzvjHlFTuirzlZW4oMBWgUOSdeT6wHlLQjaEVWiVDQ6L80Zqw09n1ffQNBjA1mnKZ+/ThvidM3X71oo+a4an+NlUh9wBBvszNlTHdLemPkme8UEJaOpfJT3K+r+wqhH85oKhlY6Eyhm+6JVmE3kUy54=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'A12345', 2, 24455.00, 'JOHN DOE chuyen tien', 'SENDER', '2025-01-08 11:43:13.645', 'Uk3KPvzVP6EGKGMm7VWk2JlG7jgNhY6jSE127sfH3mJZ/ZHu3LLvNGn+ejYilmaEJ0zL6lmVvoziAy/8dHRhO4fdVCACuJxTJFU5yiicpODoXDq4gaDzlkrUiCXDkuxHUmwIlfYxRxnqdl+hbmHuS9bn0xKTcacifA1hIhRmJlqPAhgTldxj2fvdni8OLhsRfhbVvIQXC/6YYUolgKtAmpVDkP+gnuwhaIgn28jgGHdknbPqR7Dz3cQMOnZ+XDtW1ICeUus12CUwG5sVNR3tqmyY8dvlrH59YO2ME6eEHryzEWBlhGHVoIqpsM+WvMMWPbl6oLFqgjdTxyIm9U7W0//TjwtPevJrmA2N8Upkvx2VAeSpd9IK8+vGHksfGStLekos91F0lYR/K6P+LKIJAVq1HIdq3LQuYRCYeF/cB+R9uf28YIZGmafMAZldvfTApwNvij9y0T1SlTpY9kbViu7x+CbDQmgTVLy4MGtcpJbaQQbIg9lRVt0+7kKlLpjz5gQPZo/wv/WfugPqo49WyI25MfkbMQo9IUfUW5VuV+NLbYjMzL/7+0OYy23xpW04UHIKzrkqV4/qpXhNjqjScKWYGlwzqwEPA5BqxV+PZM50Z8j8zz+nYaMbd6Prd4rQPfpGfRYM67yEgZcSlaRFXWb8FVXe9yGfM6euhX2JNHI=', 'Nguyen Muoi Ba', 'f4032c49-19b1-4798-8ee1-dccae218c2d2', 'RX5z3ORWjufS5fKSZRTqgf7wKkSY9v4RZmahd9R+tLiJEENFah2XB1GJEpuxABPFKALklxX/orpXiqmAgVH7wqMhbWwL2bgj4m+QSZ2JP2wDElSeeCfl3WB5dXDpfZmlyrsYhfKuDabKJiRJWhlzv+lf2zMTcOpVP7O4DEQ6BEIQzCaG/MUMEkDia0RPa7MC6wuX+XMoZY4uU5hhYcl5Ln8HIZCXQQXO7i5EZ+w7JGRZnxgt60XL27d2LqE4u7bTr1C/5B7GEOLlh/wJWPV7+Ngddb9ohb1jflP+Cu2h44haowV8t3BljY2uKL+O1yA4H8b7+X3ZsiY8L/1Zg9E5mCVX8qJaUNJGqXF4Vc91FPljRLUFb5VVU8vHQcTl0y61HMzJcmwOOwwtKtP5PfuCv1LCW72sWe+RH3IzyPvYDUSSCCrQQdSvFwnXZK38G3Skx/1E/RBllHfG2LCxM1fp9uI5zwkpEL3D4Iu2743tMPs9KCJHsrKux6VFpB3dPiU2dS3OyYSCuDGmE+RSqVZ8IzvjHlFTuirzlZW4oMBWgUOSdeT6wHlLQjaEVWiVDQ6L80Zqw09n1ffQNBjA1mnKZ+/ThvidM3X71oo+a4an+NlUh9wBBvszNlTHdLemPkme8UEJaOpfJT3K+r+wqhH85oKhlY6Eyhm+6JVmE3kUy54=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-08 11:49:45.831', 'Fra4bXsIdT8V/KnZYQFvZEssNzDNE+8vNMAWmloBHbYLGAiD9N/uqRsYNfJ1eA3Vd3S4heUHkMlNNQjOcjm58mKOE7QiU5bprf9a/sTGVPpfRyRgcJj3ULPEzX5AfTOMoV0qROCUVXku2fqaCSMkY24cJ1r5cgyAEk2KnC5uuoW/apMC3JkpBA62pDHuHg5QcRQNRDaTjnx41TdzsBGuZNLgX+KDWs4N2CAKvGJHaiOkj+lslsK3akQ66OrYfmC2GcSxT3YoipxAc/kn0uJt9p/xviSxoUjnuW39vNPqawYVOEDgHxqsXV9RZygyEwfGnoaJf38LK/mSvjYcH/kJkQNYSUuUVFmA56BgS8r4YpppMAunfXKEefTPlEISmptw6vLXDl5ZDmVpng3SBqlXFOzBoPdApt41HBvkpZoEHxdqsB4cp3Qa4eCW/VlbhC4VXYlRJaqOpdVeYFhZs7KEptSi9WHEUvwnKGrHd5wg+O4/sZM/1a7BmcdACf61b9A/vlp/aSHCS5TlZKpfYMzw/4UCkV/jytNooZ71krKCFFyHO222ztzx849PKbCTROg/RIIvvFZZPrQTQ6ORbuS3mXCyrofj3JI72YAZFgzdzK1oudoXwMFFOI9n1W4XUm3PtszivhBrhIu3Je4pkm9fMGRPJ2GdzDJJpSg41Z6FflA=', 'John Doe', 'b5b0036d-00a4-4a83-9a75-148e24c1ca25', 'aD2srUE1qi2l9E61mQ7RIyYwzNrrUD3Rk7Hz3MDIKYDJuubhHbBhvDtnMwpQmnvovaho6FZSRgV24AUo1TtqrRfB0zIyeBcIj7/V/C7vD1j76jTvXnjSLvnEFupWjUsZDqsFrASlBB82A09pqHsDoNGcLDmNjpMDG0ZmQstRQGh5sRw6mkMJqbFhu7spX7o8dxQ4gttLTa2bAiI4ZQQiyF196KNQx1reLDYpB5qHCQyJA7OyrEja36Qttr5rRh3/gd2ekHLmKqQX90fZVwUYRtNrr0cOUpc3wV5ckt5OfP9k5R7er6qNWgeFyPasAjyinzyOfPSbENVnb9oj+gT2uO/fFbsUlpKKMNIP83GckpWhLjfuoI12GAbV53k9YT887VQad6vMbak6CICiLIWaaSF8a9flIMwS01Hh0NSkhzptFdSDIbf4qE6PGNUY5JoRNGF0PfgV7gYJrnewfDIwRlnv/JB9H+1sSg5ltn88jIbKOMyaTns6A2tTrOzHifRMtPZMTwokHI6NzvHux9+82OEqO6l80gtLxFoJuKAgkRjUJ31JGKsyBaHd7pZhdRa3ll/x7We/38d8f6owFzTyQKbEOScvU83ZPhzNOAhjuNW6OgkdR/GHesguw20HKLkOG2xBBI67XTwQooY7FbdnP/wxjRRzkDjma6j2wJuNTZk=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000002', 1, 11345.00, 'JOHN DOE chuyen tien', 'RECIPIENT', '2025-01-08 11:55:48.19', NULL, 'Lê Thị B', 'c3a2a295-ad97-4269-9fd6-ce7d03b6231a', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'A12345', 2, 22456.00, 'JOHN DOE chuyen tien', 'RECIPIENT', '2025-01-08 11:57:56.196', 'aJoaNlUtcRKEAC4lEuxw0OBtdaEEm1oadiDh2s2/TuNC7KHSjKWehkdnLV+u45q66WRawhgzCsuofIKlGJp6BmemgiQHJMvGutK9zf/3pmtZZEW4Qev1Jt2VBTyMRmfpYoMb1Gkz/M/DmAX6rlEu0mZnVJD/pzUNrJyDL2kAIujqexJeHwqaYTxeLem725uf/amBMJREJaKx1Lx0UC8bdzGIVua+TCIcBcWl4wC1x3zSLkf8mW5xXXHWRZk7Gl+aRvD0V54SEu8l5dFVh90P0Gj53ye7mXNy1LC8hsBP0WBr6lc/tunEjpRqdAyMEutlAqtNU7Ckqf7TeIrOH8Q236g9XQAGq9ilhI+41BVgRAmJiJh+r5s/N7ARVcYNzyHtjBW34UT9zreM8MeXWsfPRfsS27fQtO97m954/j9avMJjs1rFpH4boirD/+pn8xoCNGB6uEbtSvXRjJN2TvxeLDMkhivMMJoxRZjlIPMeQ7Z0nxp7dbX5H9f1MkQzN3nTAqELfA5hZhCE1G56cN8YXPRExsoGjF8lCTDFsFPqlmytApFF1HBS5jOKKXjsfCU7u/JOlG+M+tE8ZqBXQa671p9S2xThgfbKcoq7bZCPHmJrJbbbCL9e6BxIiVi/VBmsy7EWbm8JRMIMqPaJfR2JV7dCck4fVrtXtQd9ZzJjnY4=', 'Nguyen Muoi Ba', '4539cdc4-e154-4a48-acf5-82825b23c3e7', 'RX5z3ORWjufS5fKSZRTqgf7wKkSY9v4RZmahd9R+tLiJEENFah2XB1GJEpuxABPFKALklxX/orpXiqmAgVH7wqMhbWwL2bgj4m+QSZ2JP2wDElSeeCfl3WB5dXDpfZmlyrsYhfKuDabKJiRJWhlzv+lf2zMTcOpVP7O4DEQ6BEIQzCaG/MUMEkDia0RPa7MC6wuX+XMoZY4uU5hhYcl5Ln8HIZCXQQXO7i5EZ+w7JGRZnxgt60XL27d2LqE4u7bTr1C/5B7GEOLlh/wJWPV7+Ngddb9ohb1jflP+Cu2h44haowV8t3BljY2uKL+O1yA4H8b7+X3ZsiY8L/1Zg9E5mCVX8qJaUNJGqXF4Vc91FPljRLUFb5VVU8vHQcTl0y61HMzJcmwOOwwtKtP5PfuCv1LCW72sWe+RH3IzyPvYDUSSCCrQQdSvFwnXZK38G3Skx/1E/RBllHfG2LCxM1fp9uI5zwkpEL3D4Iu2743tMPs9KCJHsrKux6VFpB3dPiU2dS3OyYSCuDGmE+RSqVZ8IzvjHlFTuirzlZW4oMBWgUOSdeT6wHlLQjaEVWiVDQ6L80Zqw09n1ffQNBjA1mnKZ+/ThvidM3X71oo+a4an+NlUh9wBBvszNlTHdLemPkme8UEJaOpfJT3K+r+wqhH85oKhlY6Eyhm+6JVmE3kUy54=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('44212', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-08 14:55:43.86', 'HGsV5EtWcmltBog20xdBvzM7uSgh+GOL2sWNNh+Bf57txb7Kw0s2Sedje5mvbYyp38VrSM+i42D5chdCzQ2opamn2YRc0OkMRSFHQlUAbQEHgW7t6KVBnekmcN2ZZiobG+VBxQljienGSp4kVpB0Z4Eho321Zyr8djqI/p+LJsP9l1rS3tAM0dTVhFb6vZeex4+se2tWPiM7BqvFbcLXl2YLKygTeKuYRBlt30zADnyCLHza+HSKZJ/DyRGnwPe5/hYQeyAjRTGKgEMSUrhzl4lIC494thCFGuj7ccB3rs1nE+YG34vx3j7mY1c3EYVDFP3Ub/zUL6Ey0iLTgFrC9DyZN0+Hmd4FhR1ebW6zBbTpsNre2ifSWcjaaCdeD+2KsUf+iXj+B8A1bV27m1W0HUSvTZGIBdTUO4Pil36Cfr9dID77K86q7ZfPyGAzIhg6PLopVjDuSd8qFS7bk4QBNBW4bkGudIOX8VLshleRGVqFfd15pOA4YqCCxFH1oxoDP09nXhKtosuzeIeN+ZCpMmNeV+Y1KVknKKx38W0TEotNi1T0cXrOhFwy92YQFFSn6ojhBLX2fCvJr8m4q+i8VkqHYyFBvWkg+9tnb2AiGXpqNkbG4CW9MPjIXKbEysUglrwralB3uIqZBToJOTYLVOdMn0O6Psc765pr8SAyJMg=', 'John Doe', 'a0c85cc0-7968-4752-8d69-21eda69472f5', 'HUHzuIo3XmhrCUgYWen2V7X+83Bc/w1GU/9icFcU3HfUEZ1+XBB4rBE+SCKlKvYmREzZ7u/zWfOTNkEMXVASDfmQM+x0sR4HObaAHzAGd8XbNS1tolWKdwy3Eg6hGNhl1hNB3i1SURHtRG8hrhz+KF+f3WJ+Yj70W3V+qfYPLqJ2mfXwS7uFXwZTbJGS1onUvmPj509b52GJ/mD6c10dK7XJAKJHnRFXnVhXqM53M7PqtRQ458jIzYW5wvwRSjrAWVD0BjWqHcgKoKOgaH2yIPfopcavmO/+C/aIkQEUQ10+qkXmnNzfrc1uPiYrASgtBhwvoML8b9rsJJa41xGRzUdkJaCo5q7ujYmRLRgrw9KSGlXiYHJkLJuNtF4DZUwDMeoYV+pF6IPzt+Da4pnuV/8tGrS2+jO/N1mAMxS48iH5YeDYKnHC8ZnxpPpetxNHZ7yklqKrZJKM/g9tgDZOtz0HU7UY+Nsh3YnxXZJnT0Yjio9aOY3So8lto7QyiMKjsJvofrOaSUiOPqY/A4VrtjR2qg+1PjrIbzarj5+pnz2RUHGaH9oACy7jFOR/CJY3Rv5p8HCdrg+uPust9j1n6FY/7VxttjNnpcOVWNHY5X6TlwToNtrR8haF9ePfMS+Z/aPs1Y7czVr/rcQz94HfSyXbAwQQiJjmpbZopb/kDvQ=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('44212', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-08 15:02:14.321', 'RBvpiwSP0aQ29amajX9KoKxMWLR2FNZWhXLZ+lde3WhL50F2tnIkjEyNmVTylXdXKjb+ZHi4hlmUZ/aw1cmmAiZpVYyJms1YQw3AeavADe5bMyi7gyNEW5BG8SxxHbUb15eg2gdCILOddnWdzmoIa2/SMrYED+iPQJjG4qn3qq+zUU6xe0DFf0UOAzZHjYpIdn0/FUHpe9gotgAUeyzOJR/VPaczJ9FOFmr/BHFXsg+k+5B1sdJz5eyf9SJsFFr5yW1cdksxkPCBYF8S07EijjxsaQ7wQcja4GX7Em17/7Tqw4FtVSimWLVkJ0X9IHq2vqy2SCOvRr5bov0+JDMw1No5XEtc+GnjHUk18FEw3v985Wl/pi7TSCFUN2wZ3kzyo5HSMKO2D1cFeqn30ZVQlghmoSYWVxjQMmMSgZv5Mrq6qDxZHksFgrZiOEZR0NC+IZIoJAYDv0uN5ZkuByq2zLIo9YmBJqAAlExB7CY4WRCyUYaKRyrw5EUBjPCOuVbrFDWJaow05oZgVVaJ1huTDLrvX4mcThppFEZEn//LBqtbnKEhK/j2ARDNhpRQHtuY1794wwXFpghKl35gYtMSqOEd+1i8GSxVw6ib6AFbWEXqqkRLpXUEt89KGeKrj81vVA9JIgI8P7ld4VJs1yu7t8eJEwM6lGw8nEBKbxmdQmM=', 'John Doe', 'b4a1ca82-205b-40c5-8227-be1fe7f7e491', 'O4feApKloKttdlie298YIuIMfw7VeSeCsaOvNpHL9B5DnYdxL+DOdqIubRHN48yclZojeVzI++Ut+91rl+IacbipstbY96avVXtL6wPqyULphTs6GuVIFQmw15KeTYOEjG20+ke/20CiluLcBrMWpuIpg//k/8YEkxBBXTj7InABsvKySDC5uVfqntwLjchGQjxHA1DaYoZ2b5c8qEgfCrU2gOa0LlOYAsMowcMt/G+/OrAZeps5Xm9NOjsxk98C6vvwsPmgahf6S5ti+YaLNXsYPjMwxTnKfeK9CSelgKcDJt4YAZSUgLDm337vZ7VjOB5BZEPfolDycvdg4jzGFJHLWSCCyaHjXofWdlJ3veQa4NWFg94kvu6xw0PV/vKwqAUpzxPgbxifmZiynELAOnezEg9gnT8GgkatswjK1nhF9Bx5VeEEDAxl8fEoAkx3igW1Fic203bvg5zfyY2hejAaydoWXu/Gt7XCQ4PVSqbAPuMGGptw7jLoz27s8X+4uUpMfgsXIM2ACNiMxmCYdN1yY4KtLZ0A1bxuS7QKtxGE/FhZWxSkoSm79a1PjU+mhTp5NInZ0r2pfaK28eO5CQbapzUawFQZp+zauPlbnDWSSj5FIgH3Tf61K2WamDmqd028KEn63n6rPZujXz6UZAVSDJLbDGnrNL1Q3dQfioI=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('44212', 2, 'ACC123456789', 1, 100000.00, 'test', 'SENDER', '2025-01-08 15:50:38.357', 'HqEyODOj7kh+07WYu6uUQaiaUo5gmtXA5cncIG2ErneKBSGsRbzo2V3OKtsBKyj3DRV9uXGHjrV5MDsorpMuotjq9OeBFeeNe86taAqOkdA8gZytc0BlkidmIA2QYmis5dSYPuP8Jlol9nUNjGr+qU1OtWKbuEDE4Us+fvMnL7Yv//Xv9Ysp0QtF1I6i84kPvt2u4Q6ZugNa5YljmibJtaNOAWMvJ8jvY4blk0SJlZeHJHAg6vZKMjNhPCqG00TFyLX/xlg8Y6Tae39+1aUaWoOc62PSuFfoRgjZvZc59K3KyYriG6OBek+QIhNedipK26DmkpNfSD5Sb/7HsNG6LzVr94aduOT2C5bihl2hCwd3vPpU14o2e/wL4wErTrCczhBk1yKncb23JWeLOf4YUIt8dN4MLf1QMGFouxpF5OQ8miVZuu8LH5bYZD6Xkvk73I83zzyv4r7jrJ9L9b8y5uDF1/T+epNlDqVzpZw9uVa/7PiX6fLpq0vtdA4FwNX3JsprDdtOQ3j++5sWmkIhSGBxjOE+vMWzBZ6JlSCVccJ9Jy++kEGRTfrL/J4TYFdPSU6NzPX22eqqh42vr3amy4wetr/PdY1mQdZ1nUvsWTNKqWI2vY6VFlA3rPJGvuCbzp+MfCO5NCTAh2EavBNpN93tHnMyNmOjXJMqJPYgZNw=', 'John Doe', '7cb0357a-7d0b-465e-8077-5c0b5193b709', 'HAyk916WyXZveC6I9YItRQpLkC1MmuZUaeJQBUj0IHH1TLuDOt59v9MQmccnQ8P+/K1uM6vlD9V9ZGLShC80O16t+oigp0JU9hV+HjkHRGhOrFc9GaL+RKg75233U1JlYQf1NvO70AouTHQlI450cwrPxIZfZI2pDNKLPvAoBatm26HR4TXGegqmmoY+raD3+ptWM5bcUXVqyk6DbsCsivotFt8zDoFCYwOZ1hnBqlnUmj+TAfi4TeByg1XFuqefaIGkiZrBu5B4EhNWt2lDOuQ1eZ7cPUAlZ15Ymp0NkQK+FoYWYzLyPAzB+YuS8EZZBH1TnBwmiVxFL3cDWB4ErpuVDV3uk01XLh9SKozFLJpMqXx1/lQ+xqcOYKa6Sm/5YFiuvL2kilNsBllugBO6dv45FtyntWSdv53wQ5IlexcAEaotWKsrZMSceYEEXXo/8K+Jd1Tc1olEMW4TUo8nB1jy6BLzDH9TFmdffX0AToC2HSFPCn232YnFX5RLXq/5SsoXMaUfVzUhxK4l9I57FIH4CcxOulgzywROz4s8pe2qJnSBBPJ6w2Pja+RZKhgA62OO3UzfY/V6qx6vkBy90HExoYa0VjXxEuNEh2tlAbK7WXLTOZsHfptGMBOUY6GpPnlQgikA0tK2WwbXfaYGN4uJkMifRP9QHIlJcM2GDM8=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('A12345', 2, 'ACC123456789', 1, 100.00, 'Test transaction', 'SENDER', '2025-01-08 16:12:08.591', 'k+nHo0m/+kk39EF6WZMWN1cid7zPoLnA/jECh5JNzvuRtZt+z65nnGT0dC5VG9iUHEjb1tVHNvy18JWDk/ZkoTR4Sa0V0FwL0CFiLk0gxXlIJyogru0xEwv8n3bvEOuPrYwh+KdpU0vFLYe41Jds111EO0awiJB8RFMUWPAevGTNQffxRrRjU5eOzJQc3YjEi1g9mnUs3LZZO+yURoSF7f5o4w+dSLhnQ70p+kgDs302vRT5efME50GNt6EjtD/ktWRHaihKtA+xgMKUXRBnbW9ujbnIs8kMg7FoIQoAq6sbmWH91hJ28a2uqC/3dVkmmjO+u2hPM59Xlo/8ryDj+DQvF/F0eQah5539IIr3A6FUCvpj84o3b6oZfiKXRZiCj2rpbNqksZf2MDwcK0mLqePXEjccHJzMoYPgQ0wIPPjhhb+DmqR8PteyR9ErCgyLIiOWqts8wfE7jfpbvbAEKKXp3n4lBd0YfFmc2dl77RmM7chFJ0V34C7FbbxijzXkRhyyIASLIRj7TOjD0kJS+0zMAirNMxOkTWZSc0m2ngJCmAXfGoaTbDk6oFnVTCHtqkopydTh5lvliEQp5Ogm6jK450hgNDVsN1MsUQmUXjad6DYSFbFXX4TvnnSxc/CkaLsb7odaMMPu5TLZ07lCprj8y0lVVi4pcv65x545saA=', 'John Doe', 'c6f1fff0-b651-44cb-9911-315061bfb46a', 'DuHF1+ajLua3zFYGqvZGRV3re6v8BXlGnzIzolDrO1ea2GkmAWxaUxplSbz4e5V8D2oW+O/+yaJ2d/fgRb5u07rg9J5Ef8FlrbZhYBn8vmEOm9vCSj2Ml07feU+JwIaul97+CUdRDWfzpeBUQXADXOS2FZ4rhyY9tq5Gy2u4IuNvgtGxo6gd6hbQZWpSP6HFhoqXTn2S6YX7NmaPSgUuu3XUy/8k1n4y2ZmOq7alWY3Lk0KpNzg/i/j65qpgbGHDR+Lv5YPsm6HSAjZsTiMy68z9NCbmBnABxpLVaPMwZ+R9ZEs5sepuSX76W/nnhiP/w/WxbVLS6yVR02Cykho0zpIqC3TV0jAU6YlRTy5XZKvazJ+02dsXzZW/ynCiEWneBJb68c3Q7MNQRMlFuD5reeZqE5H1enlAKoGfNX9yRWTtaCZjrS0nl3HoB3f0bnOc9DYe5XlpwG0OOkRaT1AZsXnKXjzRB/vl2crV8Gawv86mWGJhS/GU1GtpTLrNOUi3Blj6fquh7P3VFsJs1zll+OazitB28yPVmTXmFMRd6+myVCVG4aVuqIIfkCi11z+nwR89el9EAzJFpBBViZmn1ehzyEQu2MWyPI9q+xcyhk5jqDalGcNJgYMnZvsrIKIHjnxA7rz4PIix/pGkwCSsukAjagnw7aH43PaIlYguVME=', 10.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'VIE1234567', 3, 101000.00, 'Tiền thanh toán hóa đơn điện tháng 12', 'SENDER', '2025-01-08 17:13:20.733', '-----BEGIN PGP SIGNATURE-----

wsG5BAEBCgBtBYJnfrItCZAmrwu7a9hxI0UUAAAAAAAcACBzYWx0QG5vdGF0
aW9ucy5vcGVucGdwanMub3JnrBeptzIumP79fbTFxDVXdYdNLoUoGxAf4k19
zj0rh4EWIQSfbaumUTxGoooeP+omrwu7a9hxIwAAjtMP/jmtAHMakH+YUjij
rrZ0R+lIGZi6msUT6HOl79S1EN1wLLLDcWmitQVoUqwRzXAI0hKKV1Snslr6
H7HqDWdCdLnDndLtvMGlh+vhANMeWhcu+t1sQp7KlBLhLoVA59wZVqKe8Rtp
HCFlf90QjmIvavebrzniBlFXVaDXG033ObqAedGwp5EPjDgpv6ilZtBWpE5S
/e55TLPfdZQsuDg+pGYDqEXGGQs7yYCGGatunzf9A5hpkUqM3SkebFxc3kTf
OhZwG2BC8+0Jg/g+ApYx1vfPOBeY9BjrrfAQi7/D7snxT/fDHGuG5a4stAIW
vVER9OtVWOW5uAcEqOw3+2VuSk0k+MD2XmRj87or8zZ9rZ4qylrPNVPAN5Yy
hJnIzkVfcLf9oudSqs29GhsSXZnNAfKe+7FKvdvZGRVfWdvPZ+1sAMP+5vtt
OFkrKfbssjBkBIKfN61WvhFkEWXsn+cxx4Fccs5ZPp2j3BP/fhp+3841c6F1
kl/WpQlkvWfgxgbmxb4F5Ane0HPkPKmTXVhN2+etgbyuvou0EH/TaIiS6oi3
z/ndbCUuZbb0sxa9KAr8IouAzwkB+OUoj97eYLlxnSa7OXXWj4qZ5x1tnL8l
hRfYSN4hyzeiK7uKZePjZRZWfY+EGM+2YfZzb2FR8zVZ5lHr6ZAQQ3YnH72l
gj9ha++T
=Zie8
-----END PGP SIGNATURE-----
', 'Phan Mỹ Linh', 'a58042e7-d9e1-459d-a597-05f5101caa74', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'VIE1234567', 3, 101000.00, 'Tiền thanh toán hóa đơn điện tháng 12', 'SENDER', '2025-01-08 18:15:13.281', '-----BEGIN PGP SIGNATURE-----

wsG5BAEBCgBtBYJnfsCrCZAmrwu7a9hxI0UUAAAAAAAcACBzYWx0QG5vdGF0
aW9ucy5vcGVucGdwanMub3JnMqwawtlW6T11MnEGGJ+btHR9+4vtKx6vmaSo
85j4mNUWIQSfbaumUTxGoooeP+omrwu7a9hxIwAAlMkP/0i+U5XbU0mnFcbL
s8xt8CrUpmqOeveMN2viW0F6DB6zGSUoVkoOEO/bsxNEoKrlejfp7iavqbYw
NWq95GOvWm+RxXx6guAfVxZgPcKqSRSQSmR8/xPp/jHDMTQ7B2HX2v+mn7vu
CzuvUQ7/ip/RBAN1N/K95rb5WBOdLc9vkmOXj82wb/nnwHZ5hfGPIC7enLf1
OU2XmchmsJ4PJcmPKOx9ZhmbrmzZaf52ZVdFcSIGOdn6zTBjUKX4z90c3r6D
gMFERWBAB6ax0NBZ9iNksQoamqffbENZkYO1c+frohbPEASDlOvLALqN6sGM
OhDpzdC4pVMv78ekEbF86ItSfoIJfSOAGRcbBjei+wX71qkgYTTTvElfL6ct
PX2WxfVhX0G8yrCmQcQPzjP8l9qIJtNiuEmSTNL0/TynoEFRDW04grHFeMY0
fmBsXeU74kSGhdEYSc0ZXhdlH1H7MjYjYQHyiHECX+9w6j2uNOTs2JGFCZ2z
pAwF4FUl3E7APDoVwdFyS5lQYu7fRn6QEYzJ9rdd8LJi+SitY9imDLX5NU2r
R2D7/9sJg6bqz0Sd8d//OqrWgX0SjMDdnNR+iCtdHj8ByxRsZQKP+29VkSmQ
zs+QrFraduHSGBFpbrApCuM9GPT3PhiDDDGATDe6VirDUpT5/9YXrmZSoyrW
Rr6wMlL/
=7+9W
-----END PGP SIGNATURE-----
', 'Phan Mỹ Linh', '0ce57a5f-7f3c-4069-b305-688f6178ef0b', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'A12345', 2, 101000.00, 'Tiền thanh toán hóa đơn điện tháng 12', 'SENDER', '2025-01-08 18:16:40.391', 'q7tEmy0DCumA25hTYXTSnRQPEh1AydryZb/I1XU9I3Pm6TOIFC1dM7+N5qQhsHrMjftBlAYCs+TN/0G9T/3HZAPjSrTVuuandH9p9eYLUjD80eTTc0phV1ZhIaD1Ac/EeUuTe0Tp0IQOduSMKfdKD8i9XpjxvfZJk9aml1eWenD2JbAFnL6Z3pWZf9fEDmvu/Ug30qPUdUvGPtKjXv8xNZQSXeyJVdTQquMclTnPwB6RAYCkYihFw6sgdxPiqid5vakvkzv//DjkaalI0oVEx1wHve6VcfCe+lqvCtgzfNhSPQi0q/EBO9hWxvnXg+8YXgQZk1YI6mhnCxeC9hl6yDzROkn+RjjZC1M00S2AYFoIzI3D4t87fGRlcdyp8a1kxBEBw2IkleRZMoHNxiNVO3enPfuqGmcL7ny10U1l42eSEqpYgqx2N5frd7ffU9IBmVWtDOH4JFFz9wDKUMXQ5189qqZT0NwbPnSRgrOllDCLdmFXfcWzExv9AUfyfpOmwxmuSl+O36MOXMYkYtUmqehf/ZqKLAlEHuRxRzOhlvEGXd/NxgvZ9jiJFdONjDQVPxOKoXh0AuqZVMbnv78ukIcwZyUVFGghNMvtQ6XZAzUzp0TtpAOeXQxxRG5T3MuVjV/rxVtgioDrlQ2Y7D/8T84HECk69pshD4OxfNd/xXQ=', 'Phan Mỹ Linh', '55664976-ea33-4bfc-ae3f-3a92e444efc8', 'RX5z3ORWjufS5fKSZRTqgf7wKkSY9v4RZmahd9R+tLiJEENFah2XB1GJEpuxABPFKALklxX/orpXiqmAgVH7wqMhbWwL2bgj4m+QSZ2JP2wDElSeeCfl3WB5dXDpfZmlyrsYhfKuDabKJiRJWhlzv+lf2zMTcOpVP7O4DEQ6BEIQzCaG/MUMEkDia0RPa7MC6wuX+XMoZY4uU5hhYcl5Ln8HIZCXQQXO7i5EZ+w7JGRZnxgt60XL27d2LqE4u7bTr1C/5B7GEOLlh/wJWPV7+Ngddb9ohb1jflP+Cu2h44haowV8t3BljY2uKL+O1yA4H8b7+X3ZsiY8L/1Zg9E5mCVX8qJaUNJGqXF4Vc91FPljRLUFb5VVU8vHQcTl0y61HMzJcmwOOwwtKtP5PfuCv1LCW72sWe+RH3IzyPvYDUSSCCrQQdSvFwnXZK38G3Skx/1E/RBllHfG2LCxM1fp9uI5zwkpEL3D4Iu2743tMPs9KCJHsrKux6VFpB3dPiU2dS3OyYSCuDGmE+RSqVZ8IzvjHlFTuirzlZW4oMBWgUOSdeT6wHlLQjaEVWiVDQ6L80Zqw09n1ffQNBjA1mnKZ+/ThvidM3X71oo+a4an+NlUh9wBBvszNlTHdLemPkme8UEJaOpfJT3K+r+wqhH85oKhlY6Eyhm+6JVmE3kUy54=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'VIE1234567', 3, 101000.00, 'Tiền thanh toán hóa đơn điện tháng 12', 'SENDER', '2025-01-08 18:17:02.996', '-----BEGIN PGP SIGNATURE-----

wsG5BAEBCgBtBYJnfsEcCZAmrwu7a9hxI0UUAAAAAAAcACBzYWx0QG5vdGF0
aW9ucy5vcGVucGdwanMub3Jnh8cv0iGWnSIdtne3bYBrz8zM0BRt/9JSGu6H
aSiYuYsWIQSfbaumUTxGoooeP+omrwu7a9hxIwAARQgP/2CLTfJQuwgtGNNL
RgxfIRzIq6I461xSnngfqjsjIM2KlAKbNuVtOhLroUCuIWU035M0GFi8yuqU
hz9gqC40sWqThVAFLcOb6Xew1DTbptMOxIi77QQUyqwCvj3XU53lodL7EOzZ
P4oplRDkXpWYUDuokHayZTiJsmKXHMVjksEqHeAG9fu4dHaIQ7Pv0CXJUJ3p
z2WDvbltwZz+wnT5oBFYiUlyIzHtoHtsWFRdYajiASxqGzn782RyQZWbyBTC
y14Wtgjd/fuPUQdSXeZBH2AfBr6Tx13K13D6rcAFzHZQv1nxYPMPddzQ+lVv
KssMdAKcEma6pbelZx4qDVrPAbO1ciCu1omqIvN2VQ5sSA/UbTUmGMHy3TZ7
NRKUFC+SarAmSR45h6GfpKFhufOI9fOgknWvv1Zsz4v468xnGGolO4bX7C3+
on1pFibXSD5TdjSedRPXOgLSVdxHfik6+VLUaCQfuZ3zx0FivC5j6LEhpEG9
YsoAd4+gdQ+/nvbTy9xn5NZl3B/za4W53y+2zpW5KpAa3OhxbKhiI1PgAiZi
KBdlGWMmtv2KYquDd8yU1poLVpsswsxTSzVhLusU+qFyIjkOaV0wqYC/xMV2
LRSMXogtYp/fl2NUjQKGKpghVydqV6GWMLtPm4jjZH/0yJ5OB0bSZPXQdi7x
tYpPDDrl
=nLr+
-----END PGP SIGNATURE-----
', 'Phan Mỹ Linh', '95f6372f-0c67-4528-8a25-31b42f2bbaa6', NULL, 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'A12345', 2, 101000.00, 'Tiền thanh toán hóa đơn điện tháng 1', 'SENDER', '2025-01-09 05:34:41.162', 'cWXlqYBZl1Urk+2CbcK5uIbfjHmpd0VXZjYKfJgFuAo+ef2gzBCFuQYdLa3HQQ6eq02gZpP2L69uUDbKfk5OHSEwsXsmPzPeLkaoxksLfLoKudTwtFr+KkLp3sGEd6EDaymnfTWFGq/seFYvCrW7NN76ezutiA8HNa3r5ZUDZ9N+jL9CvbpeRebd+flGjA8bHgSWdrsVPXHYQ5U9m92qn391A636FYJmE5UdUjnV1fLfw6vzhwO/Fw/QWOXqLS1cO95ENKPhVO9J8hFewiW4yqcjyWGdW7lXcp9UP2m6283LyNj8fwqiGrCg0X3Yos73kjBNE+ioLwGellaspjdfzU7fyiqLgSlsss7C0Rff8lyIaj6OqcLHci26fYgXOD2ENSuJu82zpZcyzba3M1ov7M3uo8aapDwvd7fmb2n8P8XEhqpRdyFPPZKgDVja2L2jh6F8PSdEuOMSS+HeAhO5adgC/jdZfccgpyUJr47wokAzDxAQ2Cc/ekbkmTz7ZiokmE1BQk+j5lEFMA0B/A8at0NbvX3EL77XMr5b1q46iuLQJL8hhdPf0b9OJEDyOcxa329lQPO98NCubBBQ4gQ+/0xxTWg9FRQzZ29pFiVT+Hzlmr0ONlCjgk1/J34U3y2YDAlt47qHFJH/+seP+Fm6tCF6nE2J9e+emMTpRsk4JyM=', 'Nguyen Muoi Ba', 'eeeecb3a-f232-410e-a0a3-94882e201c93', 'RX5z3ORWjufS5fKSZRTqgf7wKkSY9v4RZmahd9R+tLiJEENFah2XB1GJEpuxABPFKALklxX/orpXiqmAgVH7wqMhbWwL2bgj4m+QSZ2JP2wDElSeeCfl3WB5dXDpfZmlyrsYhfKuDabKJiRJWhlzv+lf2zMTcOpVP7O4DEQ6BEIQzCaG/MUMEkDia0RPa7MC6wuX+XMoZY4uU5hhYcl5Ln8HIZCXQQXO7i5EZ+w7JGRZnxgt60XL27d2LqE4u7bTr1C/5B7GEOLlh/wJWPV7+Ngddb9ohb1jflP+Cu2h44haowV8t3BljY2uKL+O1yA4H8b7+X3ZsiY8L/1Zg9E5mCVX8qJaUNJGqXF4Vc91FPljRLUFb5VVU8vHQcTl0y61HMzJcmwOOwwtKtP5PfuCv1LCW72sWe+RH3IzyPvYDUSSCCrQQdSvFwnXZK38G3Skx/1E/RBllHfG2LCxM1fp9uI5zwkpEL3D4Iu2743tMPs9KCJHsrKux6VFpB3dPiU2dS3OyYSCuDGmE+RSqVZ8IzvjHlFTuirzlZW4oMBWgUOSdeT6wHlLQjaEVWiVDQ6L80Zqw09n1ffQNBjA1mnKZ+/ThvidM3X71oo+a4an+NlUh9wBBvszNlTHdLemPkme8UEJaOpfJT3K+r+wqhH85oKhlY6Eyhm+6JVmE3kUy54=', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, sender_signature, recipient_name, id, recipient_signature, fee_amount) VALUES ('ACC123456789', 1, 'ACC100000001', 1, 100000.00, 'Tiền thanh toán hóa đơn điện tháng 12', 'SENDER', '2025-01-09 05:37:29.719', NULL, '1000', 'a61bed03-300c-45d2-8647-989e437882e8', NULL, 1000.00);


--
-- TOC entry 3580 (class 0 OID 0)
-- Dependencies: 217
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.accounts_id_seq', 14, true);


--
-- TOC entry 3581 (class 0 OID 0)
-- Dependencies: 219
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.admins_id_seq', 2, true);


--
-- TOC entry 3582 (class 0 OID 0)
-- Dependencies: 221
-- Name: banks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.banks_id_seq', 5, true);


--
-- TOC entry 3583 (class 0 OID 0)
-- Dependencies: 223
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.contacts_id_seq', 26, true);


--
-- TOC entry 3584 (class 0 OID 0)
-- Dependencies: 225
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.customers_id_seq', 14, true);


--
-- TOC entry 3585 (class 0 OID 0)
-- Dependencies: 227
-- Name: debt_deletions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.debt_deletions_id_seq', 108, true);


--
-- TOC entry 3586 (class 0 OID 0)
-- Dependencies: 229
-- Name: debt_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.debt_payments_id_seq', 7, true);


--
-- TOC entry 3587 (class 0 OID 0)
-- Dependencies: 231
-- Name: debts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.debts_id_seq', 77, true);


--
-- TOC entry 3588 (class 0 OID 0)
-- Dependencies: 233
-- Name: deposits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.deposits_id_seq', 15, true);


--
-- TOC entry 3589 (class 0 OID 0)
-- Dependencies: 235
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.employees_id_seq', 7, true);


--
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 237
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.notifications_id_seq', 2, true);


--
-- TOC entry 3343 (class 2606 OID 16607)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3346 (class 2606 OID 16616)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 3348 (class 2606 OID 16625)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 3351 (class 2606 OID 16634)
-- Name: banks banks_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_pkey PRIMARY KEY (id);


--
-- TOC entry 3353 (class 2606 OID 16641)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 3357 (class 2606 OID 16650)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 3360 (class 2606 OID 17168)
-- Name: debt_deletions debt_deletions_id_debt_key; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_deletions
    ADD CONSTRAINT debt_deletions_id_debt_key UNIQUE (id_debt);


--
-- TOC entry 3362 (class 2606 OID 16659)
-- Name: debt_deletions debt_deletions_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_deletions
    ADD CONSTRAINT debt_deletions_pkey PRIMARY KEY (id);


--
-- TOC entry 3364 (class 2606 OID 16666)
-- Name: debt_payments debt_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_payments
    ADD CONSTRAINT debt_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3366 (class 2606 OID 16675)
-- Name: debts debts_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debts
    ADD CONSTRAINT debts_pkey PRIMARY KEY (id);


--
-- TOC entry 3368 (class 2606 OID 16684)
-- Name: deposits deposits_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.deposits
    ADD CONSTRAINT deposits_pkey PRIMARY KEY (id);


--
-- TOC entry 3372 (class 2606 OID 16693)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- TOC entry 3375 (class 2606 OID 16704)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3379 (class 2606 OID 17230)
-- Name: otp otp_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_pkey PRIMARY KEY (email);


--
-- TOC entry 3377 (class 2606 OID 17296)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 3344 (class 1259 OID 16714)
-- Name: accounts_account_number_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX accounts_account_number_key ON public.accounts USING btree (account_number);


--
-- TOC entry 3349 (class 1259 OID 16715)
-- Name: admins_username_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX admins_username_key ON public.admins USING btree (username);


--
-- TOC entry 3354 (class 1259 OID 16717)
-- Name: customers_email_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX customers_email_key ON public.customers USING btree (email);


--
-- TOC entry 3355 (class 1259 OID 16718)
-- Name: customers_phone_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX customers_phone_key ON public.customers USING btree (phone);


--
-- TOC entry 3358 (class 1259 OID 16716)
-- Name: customers_username_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX customers_username_key ON public.customers USING btree (username);


--
-- TOC entry 3369 (class 1259 OID 16720)
-- Name: employees_email_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX employees_email_key ON public.employees USING btree (email);


--
-- TOC entry 3370 (class 1259 OID 16721)
-- Name: employees_phone_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX employees_phone_key ON public.employees USING btree (phone);


--
-- TOC entry 3373 (class 1259 OID 16719)
-- Name: employees_username_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX employees_username_key ON public.employees USING btree (username);


--
-- TOC entry 3394 (class 2620 OID 17170)
-- Name: debt_deletions check_deleter; Type: TRIGGER; Schema: public; Owner: wnc
--

CREATE TRIGGER check_deleter BEFORE INSERT ON public.debt_deletions FOR EACH ROW EXECUTE FUNCTION public.validate_deleter();


--
-- TOC entry 3380 (class 2606 OID 16722)
-- Name: accounts accounts_id_customer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_id_customer_fkey FOREIGN KEY (id_customer) REFERENCES public.customers(id);


--
-- TOC entry 3381 (class 2606 OID 16727)
-- Name: contacts contacts_id_bank_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_id_bank_fkey FOREIGN KEY (id_bank) REFERENCES public.banks(id);


--
-- TOC entry 3382 (class 2606 OID 16732)
-- Name: contacts contacts_id_customer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_id_customer_fkey FOREIGN KEY (id_customer) REFERENCES public.customers(id);


--
-- TOC entry 3383 (class 2606 OID 16737)
-- Name: debt_deletions debt_deletions_id_debt_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_deletions
    ADD CONSTRAINT debt_deletions_id_debt_fkey FOREIGN KEY (id_debt) REFERENCES public.debts(id);


--
-- TOC entry 3384 (class 2606 OID 16742)
-- Name: debt_deletions debt_deletions_id_deleter_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_deletions
    ADD CONSTRAINT debt_deletions_id_deleter_fkey FOREIGN KEY (id_deleter) REFERENCES public.customers(id);


--
-- TOC entry 3385 (class 2606 OID 16747)
-- Name: debt_payments debt_payments_id_debt_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_payments
    ADD CONSTRAINT debt_payments_id_debt_fkey FOREIGN KEY (id_debt) REFERENCES public.debts(id);


--
-- TOC entry 3386 (class 2606 OID 17297)
-- Name: debt_payments debt_payments_id_transaction_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_payments
    ADD CONSTRAINT debt_payments_id_transaction_fkey FOREIGN KEY (id_transaction) REFERENCES public.transactions(id) NOT VALID;


--
-- TOC entry 3387 (class 2606 OID 16757)
-- Name: debts debts_id_creditor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debts
    ADD CONSTRAINT debts_id_creditor_fkey FOREIGN KEY (id_creditor) REFERENCES public.customers(id);


--
-- TOC entry 3388 (class 2606 OID 16762)
-- Name: debts debts_id_debtor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debts
    ADD CONSTRAINT debts_id_debtor_fkey FOREIGN KEY (id_debtor) REFERENCES public.customers(id);


--
-- TOC entry 3389 (class 2606 OID 16767)
-- Name: deposits deposits_id_customer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.deposits
    ADD CONSTRAINT deposits_id_customer_fkey FOREIGN KEY (id_customer) REFERENCES public.customers(id);


--
-- TOC entry 3390 (class 2606 OID 16772)
-- Name: deposits deposits_id_employee_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.deposits
    ADD CONSTRAINT deposits_id_employee_fkey FOREIGN KEY (id_employee) REFERENCES public.employees(id);


--
-- TOC entry 3391 (class 2606 OID 16777)
-- Name: notifications notifications_id_recipient_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_id_recipient_fkey FOREIGN KEY (id_recipient) REFERENCES public.customers(id);


--
-- TOC entry 3392 (class 2606 OID 16782)
-- Name: transactions transactions_id_recipient_bank_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_id_recipient_bank_fkey FOREIGN KEY (id_recipient_bank) REFERENCES public.banks(id);


--
-- TOC entry 3393 (class 2606 OID 16787)
-- Name: transactions transactions_id_sender_bank_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_id_sender_bank_fkey FOREIGN KEY (id_sender_bank) REFERENCES public.banks(id);


--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: wnc
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-01-09 16:12:34

--
-- PostgreSQL database dump complete
--

