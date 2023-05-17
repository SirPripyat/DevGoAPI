import mongoose from "mongoose";
import express from "express";

class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
    this.middleware();
    this.database();
  }

  public middleware(): void {
    this.express.use(express.json());
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
