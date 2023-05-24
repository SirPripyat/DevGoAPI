import listOfLinksService from "./listOfLinks.service";
import { Request, Response } from "express";

class listOfLinksController {
  public async createAll(req: Request, res: Response) {
    const createdAll = await new listOfLinksService().createAll();

    return res.status(200).json(createdAll);
  }

  public async createOne(req: Request, res: Response) {
    const created = await new listOfLinksService().createOne(req.body);

    return res.status(200).json(created);
  }

  public async findAll(req: Request, res: Response) {
    const links = await new listOfLinksService().findAll();

    return res.status(200).json(links);
  }

  public async findOne(req: Request, res: Response) {
    const finded = await new listOfLinksService().findOne(req.params.id);

    return res.status(200).json(finded);
  }

  public async update(req: Request, res: Response) {
    const updated = await new listOfLinksService().update(
      req.params.id,
      req.body
    );

    return res.status(200).json(updated);
  }

  public async deleteOne(req: Request, res: Response) {
    await new listOfLinksService().deleteOne(req.params.id);

    return res.status(200).json("foi");
  }

  public async deleteAll(req: Request, res: Response) {
    await new listOfLinksService().deleteAll();

    return res.status(200).json("foi");
  }
}

export default new listOfLinksController();
