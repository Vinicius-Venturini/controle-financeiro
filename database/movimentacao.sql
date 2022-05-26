DROP TABLE IF EXISTS public.movimentacao;

CREATE TABLE IF NOT EXISTS public.movimentacao
(
    id serial NOT NULL,
    iduser integer NOT NULL,
    tipo boolean NOT NULL,
    valor numeric(15,2) NOT NULL DEFAULT 0.00,
    descricao character varying(500) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    CONSTRAINT movimentacao_pkey PRIMARY KEY (id),
    CONSTRAINT movimentacao_iduser_fkey FOREIGN KEY (iduser)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)