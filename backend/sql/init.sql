-- sql/init.sql
DO
$$
BEGIN
    -- Cria o usuário 'aura' apenas se não existir, com a senha
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'aura') THEN
        CREATE ROLE aura WITH LOGIN PASSWORD 'auradb124';
    END IF;

    -- Cria o banco de dados 'auraDB' apenas se não existir, com o owner 'aura'
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'auraDB') THEN
        CREATE DATABASE "auraDB" OWNER aura;
    END IF;

    -- Define a senha para o usuário padrão 'postgres'
    -- Isso pode ser útil se alguma ferramenta ou processo interno tentar usar o usuário 'postgres'
    ALTER USER postgres WITH PASSWORD 'auradb124'; -- Usando a mesma senha para simplificar
END
$$;