import { Router } from "express";
import DevGoController from "./DevGo/DevGo.controller";
import crawlerController from "./Crawler/crawler.controller";

const routes = Router();

routes.post("/crawler-automate", crawlerController.automateScraping);

routes.post("/crawler-create", crawlerController.createLinkToScrape);

routes.get("/crawler-links", crawlerController.listLinks);

// routes.get("/crawler-one-link", crawlerController.findOneLink);

routes.delete("/crawler-deleteOne", crawlerController.deleteOneLink);

routes.post("/crawler-content", crawlerController.articleContent);

export default routes;
