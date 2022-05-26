DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id serial NOT NULL,
    nome character varying(30) NOT NULL,
    saldo numeric(15,2) NOT NULL DEFAULT 0.00,
    senha character varying(64) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    pendencias numeric(15,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)