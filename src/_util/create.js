module.exports = `
CREATE TABLE if not exists public.usuarios
(
    pk_cod_usuario integer NOT NULL DEFAULT nextval('usuarios_pk_cod_usuario_seq'::regclass),
    nome_usuario character varying(100) COLLATE pg_catalog."default",
    usuario character varying(100) COLLATE pg_catalog."default" NOT NULL,
    senha character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT usuarios_pkey PRIMARY KEY (pk_cod_usuario, usuario)
)

TABLESPACE pg_default;

ALTER TABLE public.usuarios
    OWNER to postgres;

CREATE TABLE if not exists public.categorias
(
    pk_cod_categoria integer NOT NULL DEFAULT nextval('categorias_pk_cod_categoria_seq'::regclass),
    nome_categoria character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT categorias_pkey PRIMARY KEY (pk_cod_categoria)
)

TABLESPACE pg_default;

ALTER TABLE public.categorias
    OWNER to postgres;




    `