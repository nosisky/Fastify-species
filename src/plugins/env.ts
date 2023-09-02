import fastifyEnv from "@fastify/env";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import dbPlugin from "./db";

async function envPlugin(fastify: FastifyInstance) {
  const schema = {
    type: "object",
    required: ["PORT", "REDIS_URL"],
    properties: {
      PORT: {
        type: "string",
        default: 3000,
      },
      SWAPI_API_URL: {
        type: "string",
        default: "https://swapi.dev/api",
      },
      POSTGRES_DB: {
        type: "string",
      },
      POSTGRES_PASSWORD: {
        type: "string",
      },
      POSTGRES_USER: {
        type: "string",
      },
      REDIS_URL: {
        type: "string",
      },
    },
  };

  const options = {
    confKey: "config",
    schema: schema,
    dotenv: true,
    data: process.env,
  };
  fastify
    .register(fastifyEnv, options)
    .after(() => {
      fastify.register(dbPlugin);
      fastify.register(require("@fastify/redis"), {
        url: process.env.REDIS_URL,
      });
    })
    .ready((err) => {
      if (err) console.error(err);
    });
}

export default fp(envPlugin);
