DROP TABLE IF EXISTS public.pendencia;

CREATE TABLE IF NOT EXISTS public.pendencia
(
    id serial NOT NULL,
    iduser integer NOT NULL,
    tipo boolean NOT NULL,
    valor numeric(15,2) NOT NULL DEFAULT 0.00,
    descricao character varying(500),
    previsao timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    CONSTRAINT pendencia_pkey PRIMARY KEY (id),
    CONSTRAINT pendencia_iduser_fkey FOREIGN KEY (iduser)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)