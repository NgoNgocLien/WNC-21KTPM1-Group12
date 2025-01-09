--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+2)
-- Dumped by pg_dump version 16.1

-- Started on 2025-01-09 16:22:35

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 866 (class 1247 OID 17310)
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
-- TOC entry 863 (class 1247 OID 17305)
-- Name: employee_status; Type: TYPE; Schema: public; Owner: wnc
--

CREATE TYPE public.employee_status AS ENUM (
    'ACTIVE',
    'DELETED'
);


ALTER TYPE public.employee_status OWNER TO wnc;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 17320)
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
-- TOC entry 215 (class 1259 OID 17319)
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
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 215
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- TOC entry 218 (class 1259 OID 17327)
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
-- TOC entry 217 (class 1259 OID 17326)
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
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 217
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- TOC entry 220 (class 1259 OID 17336)
-- Name: banks; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.banks (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    rsa_public_key text,
    logo text,
    secret_key text,
    pgp_public_key text,
    base_url text,
    internal_code text,
    external_code text
);


ALTER TABLE public.banks OWNER TO wnc;

--
-- TOC entry 219 (class 1259 OID 17335)
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
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 219
-- Name: banks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.banks_id_seq OWNED BY public.banks.id;


--
-- TOC entry 222 (class 1259 OID 17345)
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
-- TOC entry 221 (class 1259 OID 17344)
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
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 221
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- TOC entry 224 (class 1259 OID 17354)
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
    fcm_token text
);


ALTER TABLE public.customers OWNER TO wnc;

--
-- TOC entry 223 (class 1259 OID 17353)
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
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 223
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- TOC entry 226 (class 1259 OID 17363)
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
-- TOC entry 225 (class 1259 OID 17362)
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
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 225
-- Name: debt_deletions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.debt_deletions_id_seq OWNED BY public.debt_deletions.id;


--
-- TOC entry 228 (class 1259 OID 17373)
-- Name: debt_payments; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.debt_payments (
    id integer NOT NULL,
    id_debt integer NOT NULL,
    id_transaction uuid
);


ALTER TABLE public.debt_payments OWNER TO wnc;

--
-- TOC entry 227 (class 1259 OID 17372)
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
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 227
-- Name: debt_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.debt_payments_id_seq OWNED BY public.debt_payments.id;


--
-- TOC entry 230 (class 1259 OID 17380)
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
-- TOC entry 229 (class 1259 OID 17379)
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
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 229
-- Name: debts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.debts_id_seq OWNED BY public.debts.id;


--
-- TOC entry 232 (class 1259 OID 17391)
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
-- TOC entry 231 (class 1259 OID 17390)
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
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 231
-- Name: deposits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.deposits_id_seq OWNED BY public.deposits.id;


--
-- TOC entry 234 (class 1259 OID 17401)
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
-- TOC entry 233 (class 1259 OID 17400)
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
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 233
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- TOC entry 236 (class 1259 OID 17411)
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
-- TOC entry 235 (class 1259 OID 17410)
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
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 235
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wnc
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 238 (class 1259 OID 17430)
-- Name: otp; Type: TABLE; Schema: public; Owner: wnc
--

CREATE TABLE public.otp (
    email character varying(255) NOT NULL,
    otp character varying(6) NOT NULL,
    expiration_time timestamp(6) without time zone NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.otp OWNER TO wnc;

--
-- TOC entry 237 (class 1259 OID 17421)
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
    recipient_signature text,
    recipient_name character varying(100),
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_signature text,
    fee_amount numeric(15,2) DEFAULT 1000
);


ALTER TABLE public.transactions OWNER TO wnc;

--
-- TOC entry 3267 (class 2604 OID 17323)
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- TOC entry 3268 (class 2604 OID 17330)
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- TOC entry 3269 (class 2604 OID 17339)
-- Name: banks id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.banks ALTER COLUMN id SET DEFAULT nextval('public.banks_id_seq'::regclass);


--
-- TOC entry 3270 (class 2604 OID 17348)
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- TOC entry 3271 (class 2604 OID 17357)
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- TOC entry 3272 (class 2604 OID 17366)
-- Name: debt_deletions id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_deletions ALTER COLUMN id SET DEFAULT nextval('public.debt_deletions_id_seq'::regclass);


--
-- TOC entry 3274 (class 2604 OID 17376)
-- Name: debt_payments id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_payments ALTER COLUMN id SET DEFAULT nextval('public.debt_payments_id_seq'::regclass);


--
-- TOC entry 3275 (class 2604 OID 17383)
-- Name: debts id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debts ALTER COLUMN id SET DEFAULT nextval('public.debts_id_seq'::regclass);


--
-- TOC entry 3278 (class 2604 OID 17394)
-- Name: deposits id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.deposits ALTER COLUMN id SET DEFAULT nextval('public.deposits_id_seq'::regclass);


--
-- TOC entry 3280 (class 2604 OID 17404)
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- TOC entry 3282 (class 2604 OID 17414)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 3483 (class 0 OID 17320)
-- Dependencies: 216
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (2, 'VIE2345678', 0.00, 2);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (3, 'VIET8790987', 0.00, 3);
INSERT INTO public.accounts (id, account_number, account_balance, id_customer) VALUES (1, 'VIE1234567', 426453.00, 1);


--
-- TOC entry 3485 (class 0 OID 17327)
-- Dependencies: 218
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: wnc
--



--
-- TOC entry 3487 (class 0 OID 17336)
-- Dependencies: 220
-- Data for Name: banks; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.banks (id, name, rsa_public_key, logo, secret_key, pgp_public_key, base_url, internal_code, external_code) VALUES (1, 'VietBank', NULL, 'https://inkythuatso.com/uploads/thumbnails/800/2021/09/logo-techcombank-inkythuatso-10-15-17-50.jpg', NULL, '-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
=XXBz
-----END PGP PUBLIC KEY BLOCK-----', NULL, NULL, NULL);
INSERT INTO public.banks (id, name, rsa_public_key, logo, secret_key, pgp_public_key, base_url, internal_code, external_code) VALUES (2, 'NoMeoBank', NULL, 'https://trumsiaz.com/upload/product/meonangluongmattroitrumsiaz-6135.jpg', 'VIETBANK_NOMEOBANK', '-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
=3VkW
-----END PGP PUBLIC KEY BLOCK-----', 'https://nomeobank.onrender.com', 'B002', 'B002');


--
-- TOC entry 3489 (class 0 OID 17345)
-- Dependencies: 222
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: wnc
--



--
-- TOC entry 3491 (class 0 OID 17354)
-- Dependencies: 224
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token) VALUES (1, 'pmlinh', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', 'Phan Mỹ Linh', 'pmlinh@gmail.com', '123456789', NULL, NULL);
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token) VALUES (2, 'nnlien', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', 'Ngô Ngọc Liên', 'nnlien@gmail.com', '123456787', NULL, NULL);
INSERT INTO public.customers (id, username, password, fullname, email, phone, refresh_token, fcm_token) VALUES (3, 'nthphuc', '$2b$10$fsW9WYvtyKVNHmXv3YzuVuMI2h1fdGmt5P1hsHa74RzOnwNozQcGC', 'Nguyễn Trần Hồng Phúc', 'nthphuc@gmail.com', '123456788', NULL, NULL);


--
-- TOC entry 3493 (class 0 OID 17363)
-- Dependencies: 226
-- Data for Name: debt_deletions; Type: TABLE DATA; Schema: public; Owner: wnc
--



--
-- TOC entry 3495 (class 0 OID 17373)
-- Dependencies: 228
-- Data for Name: debt_payments; Type: TABLE DATA; Schema: public; Owner: wnc
--



--
-- TOC entry 3497 (class 0 OID 17380)
-- Dependencies: 230
-- Data for Name: debts; Type: TABLE DATA; Schema: public; Owner: wnc
--



--
-- TOC entry 3499 (class 0 OID 17391)
-- Dependencies: 232
-- Data for Name: deposits; Type: TABLE DATA; Schema: public; Owner: wnc
--



--
-- TOC entry 3501 (class 0 OID 17401)
-- Dependencies: 234
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: wnc
--



--
-- TOC entry 3503 (class 0 OID 17411)
-- Dependencies: 236
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: wnc
--



--
-- TOC entry 3505 (class 0 OID 17430)
-- Dependencies: 238
-- Data for Name: otp; Type: TABLE DATA; Schema: public; Owner: wnc
--



--
-- TOC entry 3504 (class 0 OID 17421)
-- Dependencies: 237
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: wnc
--

INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, recipient_signature, recipient_name, id, sender_signature, fee_amount) VALUES ('ACC123456789', 2, 'VIE1234567', 1, 101000.00, 'Tiền thanh toán hóa đơn điện tháng 12', 'SENDER', '2025-01-08 17:11:41.351', '-----BEGIN PGP MESSAGE-----

xA0DAQoBZReUiWDT298By8K/dQBnfrHOLS0tLS1CRUdJTiBQR1AgTUVTU0FH
RS0tLS0tDQoNCndjRk1BeWF2Qzd0cjJIRWpBUkFBa081cnRMUXB0bllPRTNt
NjJDanVjRk5aS0gxY0g3cWppWDFmQ1AzMA0KUmtqVVRqcjFkbWcvNDZ4ejlB
cW9rYkdPaEtyeWRzSFQvVHl4VkdLWnRNaWttcitmWC92NUdBakpMS3JHDQpE
dmp1VklEelIrazRDZFVCSGxQZnRYSFJoTFdjU0VXb3N1SWZncE4zeHdyRlVw
R3p4c09uYUtWY2NManQNCjBuVVNqZ0tIV1hBRTZWRHFhVUxBYVpsdU5Bdnhx
RlBYRW95Ym42anFCRlVENFp0QjVCOUVFM1BvaE82Zg0KMm5wcDhLWHFsMi9O
bW5zbDRpZTBid0dRc0JEa0o5QnpaZEZUMW1yTVZmMUVvZzRkVERKUXN1Szll
NUxoDQpQRHRsN29VT0s1Q0ZWNEJRTEtUR1RPSzJvZ0tIemdOMEgrZGF2eldK
Q28zY2ZIeHRQdlRaVlBuY1dMTDgNCitFVEVYRFR0STVYdWx5YUhlWHFLYy8y
ZUVBbUdENE1FVDBrUTlxU1BtZ1lSM0dKSS9hbG5MRGJ6NFJMZg0KOVFPYk9l
Tlloc2YwSDEvZWdVajdtUVdDWHp0anpCWUgyZjdCV0RSVkJmZ08vdXJRZXo4
d3loZHFwRTUwDQpYWk9kakVzUU05MlE1bFFGekZyM0xKdHNCdGFHbnpnU3hU
NVJlYkVuUFFWQVJIUVhVZGdTM3hjMVlaOXENCnphUWFXcjJMSUpZY1Z3OHRj
Tm1NYXZEd1EyeldPcmFlV3J1QSs3WFhYSnVuNTR5SG5McTZaRXZBRG1sTw0K
OGdEMWE1N1RaekRGbFVvMUNFL0c5bGpMOUo1NldKdTBzQzJLUDBXZGwrVnJo
M1hkc1ZFTWRTdlZkZkxWDQpkaTdsbFA3YjRLditpV1QrbmdlZFBSa0VQNDJw
b2ZtVlcwQUh1amphTzV2U1F3R3g2TGdpODFrQ2tvNisNCk4wS3pCanIzRzRM
Y2drM1UydmRaTTQ1UmcrNXJxS2dyc0xLMkxVTUFteHFSSlRTTHlUaEVKdHJF
ZTNzcQ0KR1h1ZURNYUlCZStkaU8wPQ0KPUd4aXYNCi0tLS0tRU5EIFBHUCBN
RVNTQUdFLS0tLS0NCsLBuQQBAQoAbQWCZ36xzgmQZReUiWDT299FFAAAAAAA
HAAgc2FsdEBub3RhdGlvbnMub3BlbnBncGpzLm9yZybA4cs4TqQUvfgsD5WI
Ai3JR2D/IkSOi9OAW3GXKwxvFiEE8InV8/3dzQfdIr70ZReUiWDT298AANox
D/9qqC7zssm+KbuJ9raPifmUzROK+c/33pL8/fyogIUr/YxMpUJJ8pd0XRSE
VhrWp24Xlh7/js8LUox2z70Akigu87mk4wMJSEFxvzA2Dgdb7BOcNHf3sgFe
J9/UPJ+q4QI5RHZ0rN42aIBdFGjo8cozmOeP42IxcA+WkobmC+gOYVvA2tKX
FsKZogqwO3HwDv7D7uTGyENUZQr4b9CYzZpY10FcwRQ7Cn88yWjeJFfdG089
KufAYAleTbKu7ayq0x7P/wfYqogOtZALcpu0geILfl1L/5CJWFaXTdUdNJ7R
OkgSYH+iSVI02n72FXcP+hZD74Bbm5TvXgNkqsPWGV/BMbvQBNZFmqJdOcJo
lioc2rWZ4krYq40fDfVzYnX5s5STuM7YWCu2S4C0FVC77rJZK96S4KZwfhXf
IthCyN4ixgLc9fHOhGDmK0DhD6RhhYy9B1HGGVTTVuYtQffdV+Pt2tYO8kls
Q6W83EMs6+43vQuy4ByBTIWZMJpkvnmEyi/WR6defg3pVhEom112+UBaPcFK
RiASZX3HdPQnQmf6IuWXXfMGA9aecR4BLjl2+3i9MGKnYjg9aMgVw9V841uC
lLm2CTGEpLmdckPXdhLLAJ2iNNLaKIDOIxDF7XtVNlR5LjI7FoxVvIpWltQr
ImeCA/pUWdF8jkmR76VbAwxpqA==
=6mGW
-----END PGP MESSAGE-----
', 'Phan Mỹ Linh', '171b5ca9-ec8c-45a2-b816-677ac32aa375', '-----BEGIN PGP SIGNATURE-----

wsG5BAEBCgBtBYJnfrHHCZAmrwu7a9hxI0UUAAAAAAAcACBzYWx0QG5vdGF0
aW9ucy5vcGVucGdwanMub3JnBKd0nxy2mzGHxMzv1JNJdd/H0ncS61PocAzv
18Ourz8WIQSfbaumUTxGoooeP+omrwu7a9hxIwAAlzYP/2OdaIYbZHkWv+fM
wegUK+XxgBJHBvYxYmIhVwl+LSNjfDxcr9ZnsKzM8onh/kKltLlhmutq48bU
kmFowsijJOWpjjXi4XR6uDpol8e4KkAVzMHTsZrPLQpoyPk90DuZhfgzDCAY
URRLCMFL3vqXAjjCAnVULtrM990IklkXiN3vWTrkLt8JZ+8OXf5J27jaioFV
6oUZsul4SuaUzbYco70LACx30+z+ZF7SbBmdj+OJBmwHSBo6p0tETMrmPQkY
wBXi1q/A9houyiD0EyqRrDpi7Vi6cjq2zU3ZkIQPntg9NrJIdqNDzhnQGp72
qVJDcjYKumnOYoOeCOLE+snZcj7jF//YgM1+Os+pXHPnaDoTwOffPzjFkQg7
Mv+A15tOV02lv9A/3N2lWB1IHSestvBbSDM87kvZYU4wLvKnaZhy3ZMRr16t
s0GKsYj9P/+YWXt0Sl9FcJ9xZIFL7F1y330BRaP8R0CBUHHZVj0iY5zeUiyy
Wq06u5Z7YmHaECVNl9VM27RYqaPU1gRrlnhmyDvKuhVHeokqUHZS59Bjk9IY
QGateJvEpxIILPBqu4eAGv4sQNnUregwRQy2MkzdS9NvsRVRWKyp2PODMtYD
pCGWSRVOUMBxCqmCdYaI/Pyimo3if+zly5ubPVtokh6wTHojaljoUoq6U/f6
Fd4CXmch
=4Aon
-----END PGP SIGNATURE-----
', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, recipient_signature, recipient_name, id, sender_signature, fee_amount) VALUES ('ACC123456789', 2, 'VIE1234567', 1, 101000.00, 'Tiền thanh toán hóa đơn điện tháng 12', 'SENDER', '2025-01-08 17:13:19.911', '-----BEGIN PGP MESSAGE-----

xA0DAQoBZReUiWDT298By8K/dQBnfrIwLS0tLS1CRUdJTiBQR1AgTUVTU0FH
RS0tLS0tDQoNCndjRk1BeWF2Qzd0cjJIRWpBUS84RE84U1FWd1p0RTVZRW4x
THV1ZTY0SjZQWWdMQUhabTFRa0xyQndmUw0KaUwrUUFuV0c1ZkpmNHpTR3VO
ZnFSSUtrOU9kdTVKZ3pHZHVVM3I3S0xYa0hEOXptNmE5ZHBjcU5ISjhXDQpZ
SWRPK3ZzWXI4eS9YbC9RTXZwZE1DcEJRcEVSRmlTdE82NnV1NnBuc3J4UWpi
bTk4eFBzVk5vT2Zlb1YNCmxHOWxQbk02Y0xQUnVLdlhKV1ZGQjM0NjhmR1Iw
Nnd6ZGlLMTFpZkkyVDFvWURRTVJZL1p5OWFSRlI4WQ0KL2laZlVCZ0VzVVZW
ZEx6UStkRzFhY0RvQzArcitBOURQaDdJSkZKb0Rsd0FvTTgwWlBySVhDUUdM
YUppDQp3MEFwRmZhUEl4Mk4rVk5zZnJ2SGxWZWVxc2NXRWl6Z1F5bnlYenp2
WDA1OUtYYzJiajdKNjRxcDRobVANCklkK0dQRE1GSWZSUmRtNXVGUFRLUnJn
eHBCQ0hCcjVpcW1QR2lLQ2pYRHpZNWVCUzZZMW05YlJwd1gyWA0KMzdBQkJB
Nml3VU9EK0Nyem55NnhNUTUyOXorSHhPZlYwV0xiZDh1SEQxSndZYVhBNWhT
M2NrLzIxNG9IDQpzYWtvbElsL3ZjSmNMTFRrZVpFV2JTTDVmS2c3U0l5cUZs
WlZHdDZobTlTVmxpL2htY0JzSHVRYlpvYTINCnpRZ3hqdjJKcFVmT3gwTHRR
MGVYQk1IRlVQa2NQUTlzUzBKSWJiUUZSS2dBSkNxem5udFNSUC9lQ0JkSw0K
dWZ4ZXViWEFWdHBDWVFSMXBvbHh6MGFGcXJ3aFJnc1Q4M2pGcTdNcVdFL3Ny
OUlnQytlZjMwbGltaUtQDQovdVdNSGt5bHV2MlFmVk5WTnZ6N1FyZUJCU1NK
ZGJBdkNMMTZaWkFkWmtyU1F3RzlmVGp0OXF1U2krWGYNCjNGRk5PT0U4V0J4
QjVBeWxyR2d3VjF3cjA3VVo0NUM3bWZ4RDd6VjFmM3RTUnF5Vm9uTnprSnlS
ZnRxag0KQWdhYjA5Wk0wczJLNUkwPQ0KPWFmOTkNCi0tLS0tRU5EIFBHUCBN
RVNTQUdFLS0tLS0NCsLBuQQBAQoAbQWCZ36yMAmQZReUiWDT299FFAAAAAAA
HAAgc2FsdEBub3RhdGlvbnMub3BlbnBncGpzLm9yZwq6hmK+0YJN1ubIgOnL
/25u47VwJrZpUz9+1CsMfCpvFiEE8InV8/3dzQfdIr70ZReUiWDT298AAFv4
EACZLT2r1d/A4FnJBQF7LXTUaxTa4o58HaJa0R3pWXAMtDaRIrll+XNY8SdF
OSLGhbM01kZMBGbr0/SqPMqlb5CbaEfgf4a1w3csOvZPKmqn4Wo83gRNdFc5
oCCOovbPw6n50HxujqTAVtKHlrTKFQ4vsfkpCcHexwkURcnKsLmN04ASumsZ
3r1Rfaevqwwlqvhuk5Jm0Dwv8/RzblWCFTpFyUYmJ04J/ToCDLMhVWFst5Vx
P+zHemnF5xJa/6Fl5S9QCIR/qxWA8TU4bl/QuITmgqqL66SKXIa7emJfXnaU
BT6qELF2Eccin+D9uQrzd3wT6S0oq4D+VisEeD0tzlESTod0DpH9ReIH4u1w
lRKxv4mkU92Rs5damgNqmzBH88XFfGc3M6lLoQjtwmtuEm3jqqsWFyHpVWdK
JycRyujSyhZTSQXYmlthEnSKTgm/24MUXb2KcG5H+/hEWhYWxIrheXAFuOax
wv1POt9/1zlm5Qjz/ituxDb4tECha/VWiiByBnck0Vc8R+OdQ8PO4O/nJG/o
EtTQ+vVVOpOUw1o1+BOixfWb46E/w/xPqmhYpv2SalUeF+/h2ks+43J1lZPl
Iryrm6/UoFBcx8p820qHxohum2TBZdjSm/v5hG/pwDWO51uHbW85X1KS35IG
psLZrHFjAlTeBTaoMfH9m9+t3w==
=w8Vg
-----END PGP MESSAGE-----
', 'Phan Mỹ Linh', 'c896c697-2bb1-4f00-9d04-0211b1557fef', '-----BEGIN PGP SIGNATURE-----

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
', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, recipient_signature, recipient_name, id, sender_signature, fee_amount) VALUES ('ACC123456789', 2, 'VIE1234567', 1, 101000.00, 'Tiền thanh toán hóa đơn điện tháng 12', 'SENDER', '2025-01-08 18:15:11.729', '-----BEGIN PGP MESSAGE-----

xA0DAQoBZReUiWDT298By8K/dQBnfsCwLS0tLS1CRUdJTiBQR1AgTUVTU0FH
RS0tLS0tDQoNCndjRk1BeWF2Qzd0cjJIRWpBUS8rSjZ6OEdGcSt0MmFiaUJY
cVVQUFNMMVVTT3lFM0U5dnM4Um1Senc2VA0KbUFUY25VMEluSDdTcWV2U0h0
K1pGdVhMbHpMTk45QmI3dE56UXZHZnNFOUdoQkNEVWNJNjBkdkR4RjdmDQpj
WnVQNmdNYUw4c0hpYTJZVDgzditBb3ArYVNnZ2FleEdKWHk2VlNacWs4N2c0
SEUyR2w0VkhQRzBlQmwNCjJ3Uzd1aUR2azhocGVmMUNGUjFuR3RodS9Ick9m
bDZZVzZtd1lKMmRPdjlqNjZUT2Q1RHRiL2dNM2U2Tg0KRUI5ek1lSWl1dGxn
TXR2aDE0Zi9yY1RxcWpyeW40a0syRStTQ1ZKUTZ3ZWVDSEQzd3l6NFp3QW5j
d3lIDQpiYWxSZkVjUGc2RTlINmNXbGMyZzM2NEEzMFd1NEZhckl1V3Y0VGtK
aTNiTzdrNldCRTVlT0Z2bUtWNmINCkFBM3FhYkM4VXJMME9zS2VIcEwwNUE2
cG5VVHB6MmN0ODNwZUNEL0ZXcVlWNnVERFNRS0NSYXhZS3hFSw0KQ3l3N3F6
U1FicldURTZrcGd2TElxOWxaNDRGV3BxVlQxK3Rua0tZUUlXemhvZW82M3cr
VlVXNWl3dE9JDQpDVVFybWswaGhWTktYYlR4MVIwSm1NRTRYQm9BOUluYnBQ
c1pzU1A0M2hRSTIrazU1L29NcG5rZFpXYU8NCjhySHI3QnYvVTlDY3lEV1J0
bkk4SjRPelhKcWpTV1l0bFhxQTVLd0ZuQVBIWnNacTFHU2NkS0JjQUEyLw0K
bTF5MXc3SWQ3YzFnN2hMR25qNUFRdTNxNm1oSUxOV05VR2o3endTcUhsWFFt
ekpsSXVXRmp4U05malllDQpsQVYvb0JLZHNuZHRsNGUrTisyVjlrL3RtaDdt
ZWNmaG5XU3N3bUZDb29iU1F3SGhHRzBxSEwrRE9KaHINCjZxVTJtUUd5WUQr
UlFhT1FwUXlsUDYyWDBVUEF3U0dpN21JU29UMTdXY1RyQm1GaHJ6UFBUSm9v
dVVzdA0KaW1kTHcvMnc5Nm1ha0NZPQ0KPWhNNVkNCi0tLS0tRU5EIFBHUCBN
RVNTQUdFLS0tLS0NCsLBuQQBAQoAbQWCZ37AsAmQZReUiWDT299FFAAAAAAA
HAAgc2FsdEBub3RhdGlvbnMub3BlbnBncGpzLm9yZ1Any50qoclj+fYYPZhd
F7dXqtmoyEG+A8u9UZyp4t/IFiEE8InV8/3dzQfdIr70ZReUiWDT298AAAA1
D/9m4Z+c2Q1PonS1TZDsTLkjOUHuO7ujoFfwoVyHBMQXAy1DmZXfQaJHcCuk
/Zy18iH2FnMXe/qMXOVhgajpESyWtbdSn8pccH96ob6C+qPF63oWpyqNl9jd
GW0RySUom6cYdRjeF+SEJ08yuEVKA2ScCpFH9ACVBrEfZunOs0Jht/1oJvGK
vOOU8jHyOF7Arluf90Wn29FOYHhbpgkM3fo19PU83PIauDoU8nJDbeYJKxFh
AOZkD6XtQv3OEMKZ86DLOyv3TATtwY8EkC3s9HDQXDnHzI2XXqFx1GhxOlc2
xeqDL3QmtRVHt5RH2TS0t4vuXR2CIdm0ns6gqk6Es7YcaqdHMURig5nhx3mm
bneCddcy2kX5WSfXl6kLscTm2VLeTjjtmGJhFPskBThmHuyfCZYk4wBifaoC
X/2R34QecVtjOBOpOieUbAMd+AeGEzORUvQ3QRPxSfyMPCmXFKxTLu39nY4i
pv4Qfj9EGYhNINlG9VPId7tXuVadRSEGnVpzbGqgDe1kTJSEbdTbTRbYGKXc
7EmV+QUQhqmyD8GefVCkM0PIxfgzI4V7QtYhAqQJB3+ycTIQhjUHPLP/tgwA
fH5OxoaFQ+HrsFB4XDx4U7ZdqGi3svhHs6W+r8ht0QIvMSrVtqZmE//tX+j6
1jillz65ERqq/HyqJ5XfC3ZTsA==
=dWv0
-----END PGP MESSAGE-----
', 'Phan Mỹ Linh', 'f735756a-9422-49c2-a6cc-a49786e7599d', '-----BEGIN PGP SIGNATURE-----

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
', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, recipient_signature, recipient_name, id, sender_signature, fee_amount) VALUES ('ACC123456789', 2, 'VIE1234567', 1, 101000.00, 'Tiền thanh toán hóa đơn điện tháng 12', 'SENDER', '2025-01-08 18:17:02.155', '-----BEGIN PGP MESSAGE-----

xA0DAQoBZReUiWDT298By8K/dQBnfsEeLS0tLS1CRUdJTiBQR1AgTUVTU0FH
RS0tLS0tDQoNCndjRk1BeWF2Qzd0cjJIRWpBUS8vVHFVUW1tMmtobXA3VDcy
U1FrWWtOZVRMZVJpM0VGaVJZSi9mVHl0Kw0KcmdCODcvbHVla1BCaDNpSnZ0
dGZJOWlKWDlrc1pjZlA3Y3JTWm1QOFpDWlJnUHI2dG9idTErY3ZjOHFrDQpM
N204ZEJpRS9zdE1ndjJlWFVhZ3M2aFJ1UmxpYk1NT2pTVUlkOFVxQVlteHNM
aFpzWlUvMVFnNitXNFINCk5pdWdZSCs5ZTFPbFVlMWp5Zi96RmlVQWVlVXZr
OFJmeUJpYnNNbktWNVVvWS90SGVBc3dTZHQwREFmbg0KMFdMcTg0SmZrY2Qy
djFYQ3AxY1JlT2dYV0dzNnZ2N1BBVWwxS1l1Rm00R3NDcmZ5ZU5xYk9MNTVr
NjdLDQpUNnhkdmtrNXNIQ3p5LzZuNTBJeFpEQjlrOC9YbnMzbXJSbUcrY1ha
ZG9MaUFMRmphMkJZL2xlU2Roa24NCmpUb0tHQW8xeXVpN0d0RnhxR1NPejhZ
OGtxSE0yUlZoWm5wZjRYRGxXTUFUNnZFUER3ZS9IbDBTT3ZMZQ0KcnQvMHpu
SFV5OGQvQXFERVoxd0VSU0ExTUxmWDBhdzkzNVN5d2xsQlpBZGFVdjJjQm8w
aC9WMmVmWlYrDQplbnVUcEJnd1Yzd0NwY0VJTVQzWW5vM1NFbXg0VGo2S1lK
cjU3WTYwQ1Y4S1NEVzJHOG5GSzdFbFNhbTgNCjRpbjYzWkk4WXhEb0xTeWdm
TU92eGdJSk12aVNHbmFXQTBhM3UxTUFtRE9YTTJaMGo5QTB6QXJiYXpTYg0K
VVNvblN2bW42SUx4dGYxb2g1ZWNTRWl4V0hsNzY3RGV4VDRaK0JMak5qN3JT
WXM3aDhUWk54YTl6ZmNEDQpza1Joam5HWTVZeS96aVZuclhLSEYxR1NsMzJ1
NU9CeWVtdFAxVmw1TXE3U1F3R2piOWdxZGFreForNE4NCkFDdDc5MG1hOFp0
OGgxd1lCeDhrUkJjejZheEJ6QS9DRDBzbzRuY0JBdHlhR1JuV25CRWswU2xw
cjdHSg0KbWhDSGdPckdreEN2NEtJPQ0KPVBOUU4NCi0tLS0tRU5EIFBHUCBN
RVNTQUdFLS0tLS0NCsLBuQQBAQoAbQWCZ37BHgmQZReUiWDT299FFAAAAAAA
HAAgc2FsdEBub3RhdGlvbnMub3BlbnBncGpzLm9yZ3ZdjPT0vb3GDQABxY9E
nBwIE7Bk+FSEwO6m81aSnR5JFiEE8InV8/3dzQfdIr70ZReUiWDT298AAHK7
D/4/LTz7cJfBsTOTNihhku5OkC2Rnj1f2oXvr98X3rBPy2lJ6SUxg8SX7hD2
MG4lI670aU3sWmTnuXGzLpevpFQ1Rc0fRwaWc7iE5rmN6NwmJpZOaj98qOK1
i2Z+voJwwuiyc0EmjC5VpMQZzliuT5ERntqMx4PSDKoyLQNmi5Syf5I6JOkE
u358zsJ+7xNaV3EihsCUdAeSCSV3gI6pSOSKTSGfQUO8GI1snfWPakC/fxJP
VN2M28FPtqO1RkrjO2Rdt4Zcd+waTbZZuEH/N9evgnUqnmvyPpddZSJCYmL1
kNuyAZ5An5MOjL8OQa8cdQGja2qDCBr9EHlL7hpsAyrNsVKXbREQ1zuuQjj3
HsYgYLVb4kUjSIPePz+WSO8g0KvOi/QFGCGW5+5dNCj8x/Z59RqaxzQKfyj/
OcoVuoIylWg1zNHj/8wNVEscmG2upczAUjS/fTVeh8vnNZjWLERdBHf9AaXt
4MberbskWMIdi+W44fZbB2L6xu6TtvlJBuvge++CYqAx3qamRM6RuaknbpeX
xJ6evmEn979wH2DEVYxyNFli3NwIP/WuqL6pcpC2l8a7f2a0oKOlqm0VgHSm
IDfewDvrF68lxvJJQzp6o2qx4lk9c0slH6GyxnykYnwVvY+oUlTri3E6kqAD
7+0ceqf24HgWr8KMtoFMqjkgxw==
=W2Og
-----END PGP MESSAGE-----
', 'Phan Mỹ Linh', 'd340f590-8dfb-4f1d-a57a-738a3674c48f', '-----BEGIN PGP SIGNATURE-----

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
', 1000.00);
INSERT INTO public.transactions (sender_account_number, id_sender_bank, recipient_account_number, id_recipient_bank, transaction_amount, transaction_message, fee_payment_method, transaction_time, recipient_signature, recipient_name, id, sender_signature, fee_amount) VALUES ('ACC123456789', 2, 'VIE1234567', 1, 22453.00, 'JOHN DOE chuyen tien', 'RECIPIENT', '2025-01-08 18:18:41.661', '-----BEGIN PGP MESSAGE-----

xA0DAQoBZReUiWDT298By8K/dQBnfsGCLS0tLS1CRUdJTiBQR1AgTUVTU0FH
RS0tLS0tDQoNCndjRk1BeWF2Qzd0cjJIRWpBUS8vVmcrSVgwOUdjNHZkbjB2
OE8xSXM4dzZqekZwNVBma2NYc1BvT2NRRg0Kb3BYL256N2pNUWNqcldOSkta
dzJNZUxkb08xKzBkdkc3YzZ0aFNxTXdvVFhNR0ZkU0JTQVZmVFNHSlp5DQpa
aHBEOFpCc24wM2wwUWJWTTUxbkdqLzBPL3FWVS91RW0rWkdxbzUzbzlVUlc2
MktVNEJFb2lNR1pxQUQNCjY2UE9QbWtLZVlzYVJEWi9hdWFBUk8xR0M4OGhZ
YWp1dU9LVjE3NFE0cVMzQXV2ZFdZckhJa1g4N09vVA0KdVdMbm01OVRJY3dv
MzQwbUo4UUZZZlV2ckdGWjJSakRpNDZhMFV1aWdVWnJ2Ti84cU5XM2lYWXdr
cmxpDQpQZDh5R21uR1JwVTlKTDljQUdjNEVQWjlrWWF2S3htZWRZYUk2QU1W
cjhCNldpMkxtQld5MnhoVXRSMWMNClFKVHM0Q0RrdFJSd1c3S3MrOGVMcHBq
cmRtMmd4MmV1QWpjZStVRjJubmtyUEtWeXdyanJKd0tVcUkvSw0KMHJ0eVl5
NFFXdk10cjFoUktiRmYyaU9ua2grSkxVNGduekRPY0RyaWNkR2YySGJTVldV
Q1M0TEh0endhDQp2bFZRZ3l0d0Z4UXNUQW5CMjZoQjQ5TlVhdWppZHVsbXBy
Vk1qNUF0S2NFK2hxa1AyL2U0ZU5Jck95ZTANCmJSMEI5cVdGRFNZaFhrWkVN
S291L255bDhXY3c0RTZmbkcyaXp1TXV2RUd5aVZ0aXByNnhuVWYyM1hLSA0K
ZTdPSVhCcGpWZkdHK29TYnVROU5MeGVueURxZUJoVU51ZWxLa0JBbkZLOWJP
NG93MW91MEtvRFBXaTJRDQo1YmhyTzUyZ0t4RkFqOVVIZUlhL0czbEJLeGhB
NmFnY0JDVWtNTE1FU0hmU1F3RkxEQWtWSEcrekY1NEUNCjBHcGViY2lOOFQ2
YjRReFJFS2p4d0pQczlMQ3NWQjcyREZIVldLanVNWTF5U1prQ2E1WEkycmFK
RW1qWg0KVk5mZlVlTmQ5N2VBZzh3PQ0KPVdMWkkNCi0tLS0tRU5EIFBHUCBN
RVNTQUdFLS0tLS0NCsLBuQQBAQoAbQWCZ37BggmQZReUiWDT299FFAAAAAAA
HAAgc2FsdEBub3RhdGlvbnMub3BlbnBncGpzLm9yZybrslGrsK2X50iXQuqL
mIg3Ld29vkGDSWXjoTCUwddxFiEE8InV8/3dzQfdIr70ZReUiWDT298AAJYR
D/wLIA4YVugMU8AegE5uZs3VRP01XrZlyGVdbfkDc8eNzhXlaZSeRNeMZDXv
9rIifzbnRs8w6WDOL4AOi+ZK/jUun7ffuRsNf6MonRo2bJiY03jwqIB9co0Q
GSymI5lI1iMM7Z3xGCmiqbB1/9aiNtE72aDD66lJ7qQQpJcz1uxo8ltL2xb4
+Tx4DrcvI3IW1xf/Zs+iZsDBO4iWakMPBEUMSBT4spskPWB2M6cvKIRbXzAC
heX+Q7gctmJwjJMawBd6Y2D6JMxlmTWjL5V/GHv9qtlGRUsPx4bWQxlft+Ei
yoa/K0GsnXtiIRMDAuf3oCNsYqpat82G3UICNePXfUZ/CpSndA8VOGlXHDAB
LSZwz6o5v2sRfGw8jjbb6l6gErGm2zluqNuAsxCCgxPAwO6D2mlkUdbi4Xgm
D4TSBVkNbpT2X8tMDWNbT7IA5OYAp2U8o9Kdd9C9GvEh8uve9oBSq1aqy4xg
eLqB3vVVn9oRN6GW1Om65joNtwlbMKq54osvaq9DV12Ac9TRoF4B7UBL3Pin
caEuMGA8/uVcfe6M5PMZT0azX4JxlrAPMsKcZovu0bDB/mjm/9Mjg1ZahUBh
lvxB4SpVOROtLvUCfNDmrefuG7fZATe4H5/W/R1mTnoq+GtPznrSkWMqEY4k
tH8L7cYRQTQQ1+zQ13jF1XaUxg==
=Aw41
-----END PGP MESSAGE-----
', 'Phan Mỹ Linh', '1a5d09c4-ef79-4cfb-acc8-e70fb777c76a', '-----BEGIN PGP SIGNATURE-----

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
', 1000.00);


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 215
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.accounts_id_seq', 3, true);


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 217
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, false);


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 219
-- Name: banks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.banks_id_seq', 3, true);


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 221
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.contacts_id_seq', 1, false);


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 223
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.customers_id_seq', 4, false);


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 225
-- Name: debt_deletions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.debt_deletions_id_seq', 1, false);


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 227
-- Name: debt_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.debt_payments_id_seq', 1, false);


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 229
-- Name: debts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.debts_id_seq', 1, false);


--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 231
-- Name: deposits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.deposits_id_seq', 1, false);


--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 233
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.employees_id_seq', 1, false);


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 235
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wnc
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- TOC entry 3292 (class 2606 OID 17325)
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- TOC entry 3294 (class 2606 OID 17334)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 3297 (class 2606 OID 17343)
-- Name: banks banks_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_pkey PRIMARY KEY (id);


--
-- TOC entry 3299 (class 2606 OID 17352)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 3303 (class 2606 OID 17361)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 3307 (class 2606 OID 17371)
-- Name: debt_deletions debt_deletions_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_deletions
    ADD CONSTRAINT debt_deletions_pkey PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 17378)
-- Name: debt_payments debt_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_payments
    ADD CONSTRAINT debt_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3311 (class 2606 OID 17389)
-- Name: debts debts_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debts
    ADD CONSTRAINT debts_pkey PRIMARY KEY (id);


--
-- TOC entry 3313 (class 2606 OID 17399)
-- Name: deposits deposits_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.deposits
    ADD CONSTRAINT deposits_pkey PRIMARY KEY (id);


--
-- TOC entry 3317 (class 2606 OID 17409)
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- TOC entry 3320 (class 2606 OID 17420)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3324 (class 2606 OID 17435)
-- Name: otp otp_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_pkey PRIMARY KEY (email);


--
-- TOC entry 3322 (class 2606 OID 17429)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 3290 (class 1259 OID 17436)
-- Name: accounts_account_number_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX accounts_account_number_key ON public.accounts USING btree (account_number);


--
-- TOC entry 3295 (class 1259 OID 17437)
-- Name: admins_username_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX admins_username_key ON public.admins USING btree (username);


--
-- TOC entry 3300 (class 1259 OID 17439)
-- Name: customers_email_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX customers_email_key ON public.customers USING btree (email);


--
-- TOC entry 3301 (class 1259 OID 17440)
-- Name: customers_phone_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX customers_phone_key ON public.customers USING btree (phone);


--
-- TOC entry 3304 (class 1259 OID 17438)
-- Name: customers_username_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX customers_username_key ON public.customers USING btree (username);


--
-- TOC entry 3305 (class 1259 OID 17441)
-- Name: debt_deletions_id_debt_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX debt_deletions_id_debt_key ON public.debt_deletions USING btree (id_debt);


--
-- TOC entry 3314 (class 1259 OID 17443)
-- Name: employees_email_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX employees_email_key ON public.employees USING btree (email);


--
-- TOC entry 3315 (class 1259 OID 17444)
-- Name: employees_phone_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX employees_phone_key ON public.employees USING btree (phone);


--
-- TOC entry 3318 (class 1259 OID 17442)
-- Name: employees_username_key; Type: INDEX; Schema: public; Owner: wnc
--

CREATE UNIQUE INDEX employees_username_key ON public.employees USING btree (username);


--
-- TOC entry 3325 (class 2606 OID 17445)
-- Name: accounts accounts_id_customer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_id_customer_fkey FOREIGN KEY (id_customer) REFERENCES public.customers(id);


--
-- TOC entry 3326 (class 2606 OID 17450)
-- Name: contacts contacts_id_bank_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_id_bank_fkey FOREIGN KEY (id_bank) REFERENCES public.banks(id);


--
-- TOC entry 3327 (class 2606 OID 17455)
-- Name: contacts contacts_id_customer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_id_customer_fkey FOREIGN KEY (id_customer) REFERENCES public.customers(id);


--
-- TOC entry 3328 (class 2606 OID 17460)
-- Name: debt_deletions debt_deletions_id_debt_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_deletions
    ADD CONSTRAINT debt_deletions_id_debt_fkey FOREIGN KEY (id_debt) REFERENCES public.debts(id);


--
-- TOC entry 3329 (class 2606 OID 17465)
-- Name: debt_deletions debt_deletions_id_deleter_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_deletions
    ADD CONSTRAINT debt_deletions_id_deleter_fkey FOREIGN KEY (id_deleter) REFERENCES public.customers(id);


--
-- TOC entry 3330 (class 2606 OID 17470)
-- Name: debt_payments debt_payments_id_debt_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_payments
    ADD CONSTRAINT debt_payments_id_debt_fkey FOREIGN KEY (id_debt) REFERENCES public.debts(id);


--
-- TOC entry 3331 (class 2606 OID 17475)
-- Name: debt_payments debt_payments_id_transaction_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debt_payments
    ADD CONSTRAINT debt_payments_id_transaction_fkey FOREIGN KEY (id_transaction) REFERENCES public.transactions(id);


--
-- TOC entry 3332 (class 2606 OID 17480)
-- Name: debts debts_id_creditor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debts
    ADD CONSTRAINT debts_id_creditor_fkey FOREIGN KEY (id_creditor) REFERENCES public.customers(id);


--
-- TOC entry 3333 (class 2606 OID 17485)
-- Name: debts debts_id_debtor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.debts
    ADD CONSTRAINT debts_id_debtor_fkey FOREIGN KEY (id_debtor) REFERENCES public.customers(id);


--
-- TOC entry 3334 (class 2606 OID 17490)
-- Name: deposits deposits_id_customer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.deposits
    ADD CONSTRAINT deposits_id_customer_fkey FOREIGN KEY (id_customer) REFERENCES public.customers(id);


--
-- TOC entry 3335 (class 2606 OID 17495)
-- Name: deposits deposits_id_employee_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.deposits
    ADD CONSTRAINT deposits_id_employee_fkey FOREIGN KEY (id_employee) REFERENCES public.employees(id);


--
-- TOC entry 3336 (class 2606 OID 17500)
-- Name: notifications notifications_id_recipient_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_id_recipient_fkey FOREIGN KEY (id_recipient) REFERENCES public.customers(id);


--
-- TOC entry 3337 (class 2606 OID 17505)
-- Name: transactions transactions_id_recipient_bank_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_id_recipient_bank_fkey FOREIGN KEY (id_recipient_bank) REFERENCES public.banks(id);


--
-- TOC entry 3338 (class 2606 OID 17510)
-- Name: transactions transactions_id_sender_bank_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wnc
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_id_sender_bank_fkey FOREIGN KEY (id_sender_bank) REFERENCES public.banks(id);


-- Completed on 2025-01-09 16:23:03

--
-- PostgreSQL database dump complete
--

