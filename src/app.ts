import mongoose from "mongoose";
import express from "express";
import routes from "./routes";

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
