import puppeteer, { Page } from "puppeteer";
import listOfLinksSchema from "./listOfLinks.schema";
import { ListOfLinksType } from "./listOfLinks.interface";
import mongoose from "mongoose";

class ListOfLinksService {
  private url: string;

  public constructor() {
    this.url = "https://devgo.com.br/";
  }

  public async createAll() {
    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto(this.url);

    const buttonClick = await page.$(
      "body div .blog-articles-area.css-lap1ur button"
    );

    await buttonClick?.click();

    await buttonClick?.dispose();

    await this.scrollToBottom(page);

    const getHref = await page.$$(
      "body div .blog-article-card a.blog-article-card-cover.css-gb564i"
    );

    const href = getHref.map(async (anchorElement) => {
      return await anchorElement.evaluate((el) => el.getAttribute("href"));
    });

    const hrefResult = await Promise.all(href);

    await browser.close();

    const list: Array<string | null> = this.handleListOfLinks(hrefResult);

    const documentData = [];

    for (let i = 0; i < list.length; i++) {
      const data = {
        link: list[i],
      };

      documentData.push(data);
    }

    const created = await listOfLinksSchema.create(documentData);

    return created;
  }

  private handleListOfLinks(listOfLinks: Array<string | null>) {
    const url = "https://devgo.com.br";

    for (let i = 0; i < listOfLinks.length; i++) {
      if (!listOfLinks[i]?.includes("https://")) {
        listOfLinks[i] = url + listOfLinks[i];
      }
    }

    return listOfLinks;
  }

  private async scrollToBottom(page: Page) {
    let count = 0;

    while (count < 2) {
      await new Promise((r) => setTimeout(r, 1500));

      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      count++;
    }
  }

  public async createOne(link: ListOfLinksType) {
    const createdOne = await listOfLinksSchema.create(link);

    return createdOne;
  }

  public async findAll() {
    const listedLinks = await listOfLinksSchema.find().sort({
      "header.title": 1,
    });

    return listedLinks;
  }

  public async findOne(id: string) {
    const finded = await listOfLinksSchema.findById({ _id: id });

    return finded;
  }

  public async update(id: string, data: any) {
    const updatedLink = await listOfLinksSchema.findOneAndUpdate(
      { _id: id },
      {
        link: data.link,
      },
      {
        new: true,
      }
    );

    return updatedLink;
  }

  public async deleteOne(id: string) {
    const deleteOneLink = await listOfLinksSchema.deleteOne({ _id: id });

    return deleteOneLink;
  }

  public async deleteAll() {
    const deletedLinks = await this.findAll();

    const deletedIds = deletedLinks.map((article) => article._id);

    const filter = { _id: { $in: deletedIds } };

    await listOfLinksSchema.deleteMany(filter);
  }
}

export default ListOfLinksService;
