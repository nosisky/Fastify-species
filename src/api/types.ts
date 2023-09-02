import { PoolClient } from "pg";
import { FastifyInstance } from "fastify";
import { FastifyRedis } from "@fastify/redis";

export interface Species {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: string;
  language: string;
  people: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
  planet: {
    name: string;
    population: string;
    climate: string;
    terrain: string;
    is_destroyed: boolean;
  };
}

export type FastifyApp = FastifyInstance & {
  pg: PoolClient;
  redis: FastifyRedis;
};

export interface Planet {
  name: string;
  population: string;
  climate: string;
  terrain: string;
  is_destroyed: boolean;
}

export interface PlanetUpdate {
  planetName: string;
  isDestroyed: boolean;
}
