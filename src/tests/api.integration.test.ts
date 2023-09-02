import { build } from "../server";

const server = build();

describe("general API behaviour", () => {
  describe("invalid route called", () => {
    it("should return a 404 status code", async () => {
      const response = await server.inject().get("/foo");

      expect(response.statusCode).toBe(404);
    });
  });

  describe("GET /species", () => {
    it("should return species data with planet data", async () => {
      const response = await server.inject().get("/species");

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data).toBeDefined();
      expect(response.json()[0]).toHaveProperty(["planet", "name"]);
    });

    it("should return species data sorted by average height", async () => {
      const response = await server
        .inject()
        .get("/species?sortBy=average_height");

      expect(response.statusCode).toBe(200);

      const data = JSON.parse(response.payload);
      expect(data).toBeDefined();

      if (data.length > 1) {
        for (let i = 1; i < data.length; i++) {
          const currentHeight = Number(data[i].average_height);
          const previousHeight = Number(data[i - 1].average_height);

          if (!isNaN(currentHeight) && !isNaN(previousHeight)) {
            expect(currentHeight).toBeGreaterThanOrEqual(previousHeight);
          }
        }
      }
    });
  });

  describe("PATCH /planets/destroy", () => {
    it("should update the destroyed status of a planet", async () => {
      const planetName = "Coruscant";
      const response = await server.inject().patch("/planets/destroy").body({
        planetName,
        isDestroyed: true,
      });

      expect(response.statusCode).toBe(200);

      const data = JSON.parse(response.payload);
      expect(data).toBeDefined();
      expect(data.message).toBe(`${planetName} updated successfully!`);
    });
  });
});

afterAll(async () => {
  await server.close();
});
