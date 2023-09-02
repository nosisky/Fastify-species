### Description
This pull request implements the following enhancements and updates to the project:

Integration with the Star Wars API (SWAPI) to fetch species data along with corresponding planet data in a single API call.

- Sorting of species data by average height using a query parameter.
- Addition of a new API endpoint to update the "destroyed" status of a planet.
- Implementation of a PostgreSQL database for data persistence.
- Introduction of the fastify-env plugin for environment variable management.
- Utilization of the fastify-postgres plugin for connecting to the PostgreSQL database.
- Integration of the fastify-redis plugin for caching and improved performance.
- Configuration updates to handle environment variables, including renaming .env.example to .env.
- Added steps for setting up the PostgreSQL database and running npm install to install new dependencies.

### Setup Steps
To set up the project locally and run the application, follow these steps:

Rename the .env.example file to .env.
Set up a PostgreSQL database and update the database connection details in the .env file.
Run npm install to install the required dependencies.
Run the application using npm start or the preferred start command.