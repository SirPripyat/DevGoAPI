import mongoose from "mongoose";
import express from "express";
import routes from "./routes";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./apiDocs/swagger.json";

class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
    this.middleware();
    this.database();
    this.routes();
  }

  public middleware() {
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocs)
    );
  }

  public routes() {
    this.express.use(routes);
  }

  private async database() {
    try {
      mongoose.set("strictQuery", true);
      await mongoose.connect("mongodb://localhost:27017/devGoAPI");
      console.log("Connect database success");
    } catch (error) {
      console.error("Connect database fail. Error: ", error);
    }
  }
}

export default new App().express;
