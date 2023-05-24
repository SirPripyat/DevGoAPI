import { Router } from "express";
import listOfLinksController from "./ListOfLinks/listOfLinks.controller";
import articleController from "./Articles/article.controller";

const routes = Router();

// List of Links
routes.post("/links/create-all", listOfLinksController.createAll);
routes.post("/links/create", listOfLinksController.createOne);

routes.get("/links/find", listOfLinksController.findAll);
routes.get("/links/find/:id", listOfLinksController.findOne);

routes.put("/links/update/:id", listOfLinksController.update);

routes.delete("/links/delete", listOfLinksController.deleteAll);
routes.delete("/links/delete/:id", listOfLinksController.deleteOne);

// Articles

routes.post("/articles", articleController.realizeScrape); // Rota mais importante, deve ser executada para gravar os dados no banco

routes.post("/articles/create-all", articleController.createAll);
routes.post("/articles/create", articleController.createOne);

routes.get("/articles/find", articleController.findAll);
routes.get("/articles/find/:link", articleController.findOne);

routes.put("/articles/update/:id", articleController.update);

routes.delete("/articles/delete", articleController.deleteAll);
routes.delete("/articles/delete/:id", articleController.deleteOne);

export default routes;
