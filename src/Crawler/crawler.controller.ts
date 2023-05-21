import CrawlerService from "./crawler.service";
import { Request, Response } from "express";

class CrawlerController {
  public async automateScraping(req: Request, res: Response) {
    const listedLinks = await new CrawlerService().automateScraping();

    return res.status(200).json(listedLinks);
  }

  public async createLinkToScrape(req: Request, res: Response) {
    const validation = await new CrawlerService().validateCreate(req.body);

    const errorMessage =
      "The link you are trying to insert into the DataBase already exists or the host of site is invalid (isnt devgo.com.br)";

    if (validation === true) {
      return res.status(200).json("Link created");
    }
    return res.status(500).json(errorMessage);
  }

  public async listLinks(req: Request, res: Response) {
    const links = await new CrawlerService().listLinks();

    return res.status(200).json(links);
  }

  // public async findOneLink(req: Request, res: Response) {
  //   const findedLink = await new CrawlerService().findOneLink(req.body);

  //   const errorMessage = `The link ${req.body} was not found`;

  //   return findedLink
  //     ? res.status(200).json(findedLink)
  //     : res.status(500).json(errorMessage);
  // }

  public async deleteOneLink(req: Request, res: Response) {
    const linkToDelete = req.body.link;

    const validatedLink = await new CrawlerService().validateDelete(
      linkToDelete
    );

    if (validatedLink === true) {
      await new CrawlerService().deleteOneLink(linkToDelete);

      const sucessMessage = `Success when you try to delete one link ${linkToDelete}`;

      return res.status(200).json(sucessMessage);
    } else {
      const errorMessage = `Error when you try to delete one link (${linkToDelete}). `;
      return res.status(500).json(errorMessage);
    }
  }
}

export default new CrawlerController();
