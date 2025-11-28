// src/swagger.js
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const spec = YAML.load("./src/openapi.yaml");
export default (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
};
