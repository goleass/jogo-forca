module.exports = `
CREATE TABLE if not exists public.usuarios
(
    pk_cod_usuario serial,
    nome_usuario character varying(100) COLLATE pg_catalog."default",
    usuario character varying(100) COLLATE pg_catalog."default" NOT NULL,
    senha character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT usuarios_pkey PRIMARY KEY (pk_cod_usuario, usuario)
)

TABLESPACE pg_default;

ALTER TABLE public.usuarios
    OWNER to postgres;

CREATE TABLE if not exists public.usuarios_pk_cod_usuario_seqcategorias
(
    pk_cod_categoria serial,
    nome_categoria character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT categorias_pkey PRIMARY KEY (pk_cod_categoria)
)

TABLESPACE pg_default;

ALTER TABLE public.categorias
    OWNER to postgres;

CREATE TABLE if not exists public.palavras
(
    pk_cod_palavra serial,
    nome_palavra character varying(100) COLLATE pg_catalog."default" NOT NULL,
    fk_cod_categoria integer,
    dificuldade smallint,
    CONSTRAINT palavras_pkey PRIMARY KEY (pk_cod_palavra)
)
    `