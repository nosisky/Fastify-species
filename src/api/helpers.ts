import { Species } from "./types";

/**
 * The function sorts an array of species objects by their average height, with "n/a" values placed at
 * the end.
 * @param {Species[]} speciesData - An array of objects representing different species. Each object
 * should have a property called "average_height" which represents the average height of that species.
 * @returns an array of species objects sorted by their average height in ascending order.
 */
export const sortSpeciesByAverageHeight = (
  speciesData: Species[]
): Species[] => {
  return speciesData.sort((a, b) => {
    if (a.average_height === "n/a") return 1;
    if (b.average_height === "n/a") return -1;

    return Number(a.average_height) - Number(b.average_height);
  });
};

/**
 * The `deleteKeys` function deletes all keys in a Redis database that match a given pattern.
 * @param app - The "app" parameter is an object that represents the application or framework you are
 * working with. It likely contains various properties and methods related to the application's
 * functionality.
 * @param pattern - The `pattern` parameter is a string that specifies a pattern to match against the
 * keys in the Redis database. The `deleteKeys` function will delete all keys that match this pattern.
 */
export const deleteKeys = (app, pattern) => {
  const stream = app.redis.scanStream({
    match: pattern,
  });

  stream.on("data", function (keys) {
    if (keys.length) {
      const pipeline = app.redis.pipeline();
      keys.forEach(function (key) {
        pipeline.del(key);
      });
      pipeline.exec();
    }
  });

  stream.on("end", function () {
    console.log("All keys have been deleted");
  });
};
