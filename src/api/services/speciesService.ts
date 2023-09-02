// src/services/speciesService.ts
import { FastifyInstance } from "fastify";
import axios, { AxiosResponse } from "axios";
import { PoolClient } from "pg";
import { FastifyApp, Planet, PlanetUpdate, Species } from "../types";

/**
 * The function `getAllSpeciesWithPlanets` retrieves data about species from a Star Wars API and their
 * corresponding homeworlds, including information about the planets' destruction status.
 * @param {FastifyInstance} app - The `app` parameter is of type `FastifyInstance`, which is an
 * instance of the Fastify web framework. It represents the Fastify application and provides methods
 * for handling HTTP requests and responses.
 * @returns an array of objects, where each object contains information about a species and its
 * homeworld. Each object has the following structure:
 */
async function getAllSpeciesWithPlanets(app: FastifyInstance): Promise<any[]> {
  const swapiApiUrl: string = process.env.SWAPI_API_URL || "";
  const speciesDataResponse: AxiosResponse<any> = await axios.get(
    `${swapiApiUrl}/species`
  );

  const speciesWithPlanets = await Promise.all(
    speciesDataResponse.data.results.map(async (species: any) => {
      const planetURL: string = species.homeworld;
      if (planetURL) {
        const planetResponse: AxiosResponse<any> = await axios.get(planetURL);
        const planetData: Planet = {
          name: planetResponse.data.name,
          population: planetResponse.data.population,
          climate: planetResponse.data.climate,
          terrain: planetResponse.data.terrain,
          is_destroyed: await getPlanetDestructionStatus(
            app,
            planetResponse.data.name
          ),
        };

        const speciesData: Species = {
          ...species,
          planet: planetData,
        };

        return speciesData;
      }
      return {
        ...species,
        planet: null,
      };
    })
  );

  return speciesWithPlanets;
}

/**
 * The function `getPlanetDestructionStatus` retrieves the destruction status of a planet from a
 * PostgreSQL database using the provided app and planet name.
 * @param {FastifyApp} app - The `app` parameter is an object that represents the application context. It
 * likely contains various properties and methods related to the application, such as a database
 * connection pool.
 * @param {string} planetName - The `planetName` parameter is a string that represents the name of the
 * planet for which we want to retrieve the destruction status.
 * @returns a Promise that resolves to a boolean value.
 */
async function getPlanetDestructionStatus(
  app: FastifyApp,
  planetName: string
): Promise<boolean> {
  const client: PoolClient = app.pg;
  try {
    const queryResult = await client.query(
      "SELECT is_destroyed FROM planets WHERE name = $1",
      [planetName?.toLowerCase()]
    );
    return queryResult.rows.length > 0
      ? queryResult.rows[0].is_destroyed
      : false;
  } catch (err) {
    console.error("Error querying the database:", err);
    throw err;
  }
}

/**
 * The function updates the destruction status of a planet in a PostgreSQL database.
 * @param {FastifyApp} app - The `app` parameter is an object that represents the application context. It
 * likely contains various properties and methods related to the application, such as a database
 * connection pool.
 * @param {string} planetName - A string representing the name of the planet.
 * @param {boolean} isDestroyed - A boolean value indicating whether the planet is destroyed or not.
 */
async function updatePlanetDestructionStatus(
  app: FastifyApp,
  data: PlanetUpdate
): Promise<void> {
  const client: PoolClient = app.pg;
  try {
    await client.query(
      "INSERT INTO planets (name, is_destroyed) VALUES (LOWER($1), $2) \
   ON CONFLICT (name) DO UPDATE SET is_destroyed = excluded.is_destroyed",
      [data.planetName.toLowerCase(), data.isDestroyed]
    );
  } catch (err) {
    console.error("Error updating the database:", err);
    throw err;
  }
}

export default {
  getAllSpeciesWithPlanets,
  updatePlanetDestructionStatus,
};
