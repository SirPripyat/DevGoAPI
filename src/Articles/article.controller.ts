import articleService from "./article.service";
import { Request, Response } from "express";

class ArticleController {
  public async realizeScrape(req: Request, res: Response) {
    await new articleService().realizeScrape();

    return res.status(200).json("Foi");
  }

  public async createAll(req: Request, res: Response) {
    const createdAll = await new articleService().createAll();

    return createdAll
      ? res.status(200).json(createdAll)
      : res.status(500).json("ERROR");
  }

  public async createOne(req: Request, res: Response) {
    const created = await new articleService().createOne(req.body);

    return created
      ? res.status(200).json(created)
      : res.status(500).json("ERROR");
  }

  public async findAll(req: Request, res: Response) {
    const findedAll = await new articleService().findAll();

    return res.status(200).json(findedAll);
  }

  public async findOne(req: Request, res: Response) {
    const findedOneArticle = await new articleService().findOne(
      req.params.link
    );

    return res.status(200).json(findedOneArticle);
  }

  public async update(req: Request, res: Response) {
    const updated = await new articleService().update(req.params.id, req.body);

    return res.status(200).json(updated);
  }

  public async deleteOne(req: Request, res: Response) {
    await new articleService().deleteOne(req.params.id);

    return res.status(200).json("Foi de Vasco");
  }

  public async deleteAll(req: Request, res: Response) {
    await new articleService().deleteAll();

    return res.status(200).json("Os artigos foram pro vasco");
  }
}

export default new ArticleController();
