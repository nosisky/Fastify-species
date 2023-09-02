import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import speciesService from "../services/speciesService";
import { deleteKeys, sortSpeciesByAverageHeight } from "../helpers";
import { FastifyApp, PlanetUpdate } from "../types";

async function getAllSpecies(
  app: FastifyApp,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const { sortBy } = request.query as { sortBy?: string };
  const cacheKey = `species:${sortBy}`;
  const EXPIRATION_SECONDS = 3600;

  try {
    const cachedData = await app.redis.get(cacheKey);

    if (cachedData) {
      // If the data is found in the cache, return the cached response
      const speciesData = JSON.parse(cachedData);
      return reply.send(speciesData);
    }

    let speciesData = await speciesService.getAllSpeciesWithPlanets(app);

    if (sortBy === "average_height") {
      speciesData = sortSpeciesByAverageHeight(speciesData);
    }
    // Store the fetched data in the cache
    await app.redis.set(
      cacheKey,
      JSON.stringify(speciesData),
      "EX",
      EXPIRATION_SECONDS
    );

    reply.send(speciesData);
  } catch (err: any) {
    reply.internalServerError(`Internal Server Error: ${err.message}`);
  }
}

/**
 * The function updates the destruction status of a planet and sends a response message.
 * @param {FastifyInstance} app - The `app` parameter is an instance of the Fastify application. It is
 * used to access the various functionalities provided by Fastify, such as registering routes, handling
 * requests, and sending responses.
 * @param {any} request - The `request` parameter is an object that contains information about the
 * incoming HTTP request. It includes properties such as `params`, which contains the route parameters,
 * and `body`, which contains the request body data.
 * @param {FastifyReply} reply - The `reply` parameter is an instance of the `FastifyReply` class. It
 * is used to send the response back to the client. It provides methods like `send()` to send a
 * response payload, `status()` to set the response status code, and `header()` to set response headers
 */
async function updateDestroyedStatus(
  app: FastifyInstance,
  request: any,
  reply: FastifyReply
): Promise<void> {
  try {
    const { isDestroyed, planetName } = request.body as PlanetUpdate;

    if (!planetName) {
      return reply.badRequest("planetName is required");
    }
    const data = {
      planetName,
      isDestroyed,
    };
    await speciesService.updatePlanetDestructionStatus(app, data);
    deleteKeys(app, "species:*");
    reply.send({ message: `${planetName} updated successfully!` });
  } catch (err: any) {
    reply.internalServerError(`Internal Server Error: ${err.message}`);
  }
}

export default {
  getAllSpecies,
  updateDestroyedStatus,
};
