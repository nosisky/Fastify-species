import AutoLoad from "@fastify/autoload";
import { FastifyInstance } from "fastify";
import path from "path";

export default () => async (instance: FastifyInstance) => {
  // Register 404 handler
  instance.setNotFoundHandler((request, reply) => {
    const { method, url } = request;

    instance.log.error(
      { err: { url, method } },
      "Request not recognized or route not found."
    );

    reply.code(404).send();
  });

  // Load plugins
  await instance.register(AutoLoad, {
    dir: path.join(__dirname, "..", "plugins"),
    ignorePattern: /.*(db).*\.ts/,
  });

  // Load routes
  instance.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    ignorePattern: /\.test?\.(ts|js)/,
  });
};
