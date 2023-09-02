import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";

const dbPlugin: FastifyPluginCallback = async (fastify: any, options, done) => {
  const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

  fastify.register(fastifyPostgres, {
    connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}`,
  });

  fastify.ready(async () => {
    try {
      const client = await fastify.pg.connect();

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS planets (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          is_destroyed BOOLEAN NOT NULL DEFAULT false,
          CONSTRAINT planets_name_unique UNIQUE (name)
        )
      `;

      await client.query(createTableQuery);
      console.log('Created "planets" table successfully.');

      client.release();
    } catch (error) {
      console.error('Error creating "planets" table:', error);
      throw error; // Throw the error to prevent Fastify from starting
    }
  });

  done();
};

export default fp(dbPlugin);
