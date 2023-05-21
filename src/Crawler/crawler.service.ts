import puppeteer, { Page } from "puppeteer";
import CrawlerSchema from "./crawler.schema";
import { CrawlerType } from "./crawler.interface";

class CrawlerService {
  private url: string;

  public constructor() {
    this.url = "https://devgo.com.br/";
  }

  public async automateScraping() {
    const browser = await puppeteer.launch({
      headless: false,
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

    const listedLinks = await CrawlerSchema.create(documentData);

    return listedLinks;
  }

  public async createLinkToScrape(link: CrawlerType) {
    const createdLink = await CrawlerSchema.create(link);

    return createdLink;
  }

  public async listLinks() {
    const listedLinks = await CrawlerSchema.find();

    return listedLinks;
  }

  public async findOneLink(link: CrawlerType) {
    const findedLink = await CrawlerSchema.findOne({ link: link });

    return findedLink;
  }

  public async deleteOneLink(link: any) {
    const deleteOneLink = await CrawlerSchema.deleteOne({ link: link });

    return deleteOneLink;
  }

  public async validateCreate(request: any) {
    const existingLinks = await this.listLinks();

    const insertLink = request;

    for (let i = 0; i < existingLinks.length; i++) {
      if (
        !insertLink.link.includes(existingLinks[i].link) &&
        insertLink.link.includes("https://devgo.com.br/")
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  public async validateDelete(linkToDelete: CrawlerType) {
    const linkToValidate = await this.findOneLink(linkToDelete);

    return linkToValidate ? true : false;
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

  public async getArticleContent() {
    const listOfLinks = await this.listLinks();

    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null,
    });

    const article = [];

    for (let i = 0; i < listOfLinks.length; i++) {
      const page = await browser.newPage();

      await page.goto(listOfLinks[i]);

      // ArticleHeader

      const selectorArticleHeader =
        "#__next div div main article div.css-a1d51z div";

      const mainImage = await page.$eval(
        `${selectorArticleHeader} .css-2179a6`,
        (image) => {
          return {
            tag: image.tagName,
            src: image.getAttribute("src"),
            alt: image.getAttribute("alt"),
            style: image.getAttribute("style"),
          };
        }
      );

      const title = await page.$eval(`${selectorArticleHeader} h1`, (title) => {
        return {
          tag: title.tagName,
          text: title.textContent,
        };
      });

      const authorImage = await page.$eval(
        `${selectorArticleHeader} .css-1yapcyz`,
        (image) => {
          return {
            tag: image.tagName,
            src: image.getAttribute("src"),
            alt: image.getAttribute("alt"),
            style: image.getAttribute("style"),
          };
        }
      );

      const authorName = await page.$eval(
        `${selectorArticleHeader} .css-1d1xwb0`,
        (allName) => {
          return {
            name: allName.textContent,
            href: allName.getAttribute("href"),
          };
        }
      );

      const dataPost = await page.$eval(
        `${selectorArticleHeader} .tooltip-handle.css-z70pxu`,
        (data) => {
          const getHour = data.getAttribute("data-title");

          const handleHour = getHour?.split(" ");

          let hour;

          if (handleHour) {
            hour = handleHour[handleHour.length - 1];
          }

          return {
            hour: hour,
            data: data.textContent,
          };
        }
      );

      // Article Body

      const getBody = await page.$eval("#post-content-wrapper", (body) => {
        return body.outerHTML;
      });

      const handleBody = getBody.split("\n");

      handleBody.pop();

      for (let i = 0; i < handleBody.length; i++) {
        if (!handleBody[i].includes("<img")) {
          handleBody[i] = handleBody[i].replace(/<[^>]+>/g, "");
        } else {
          const src = /src="([^"]+)"/;
          const match = handleBody[i].match(src);

          match ? (handleBody[i] = match[1]) : null;
        }

        if (handleBody[i].includes("Permalink")) {
          handleBody[i] = handleBody[i].replace("Permalink", "");
        }
      }

      article.push({
        mainImage: mainImage,
        title: title,
        authorInfo: {
          name: authorName.name,
          profile: authorName.href,
          image: authorImage,
        },
        data: dataPost,
        contentText: handleBody,
      });

      await page.close();
    }
    await writeFile("posts.json", JSON.stringify(article, null, 2));

    await browser.close();
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
}

export default CrawlerService;
