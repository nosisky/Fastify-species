import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import speciesController from "../controllers/speciesController";

export default async (instance: FastifyInstance) => {
  instance.get("/species", (request, reply) =>
    speciesController.getAllSpecies(instance, request, reply)
  );
  instance.patch("/planets/destroy", (request, reply) =>
    speciesController.updateDestroyedStatus(instance, request, reply)
  );
};
