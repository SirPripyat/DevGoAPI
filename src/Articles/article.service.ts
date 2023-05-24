import puppeteer, { Page } from "puppeteer";
import listOfLinksService from "../ListOfLinks/listOfLinks.service";
import articleSchema from "./article.schema";
import { writeFile, readFile } from "fs/promises";

class ArticleService {
  public async realizeScrape() {
    const listedLinks = await new listOfLinksService().findAll();

    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null,
    });

    const writeFileData = [];

    for (let i = 0; i < listedLinks.length; i++) {
      const page = await browser.newPage();

      const link = listedLinks[i].link;

      link ? await page.goto(link) : null;

      let handleLink;

      link?.includes("https://devgo.com.br/")
        ? (handleLink = link?.replace("https://devgo.com.br", ""))
        : null;

      const articleHeader = await this.scrapeArticleHeader(page);

      const articleBody = await this.scrapeArticleBody(page);

      const article = {
        header: {
          image: {
            src: articleHeader.image.src,
          },
          title: articleHeader.title,
          author: {
            name: articleHeader.authorName.name,
            href: articleHeader.authorName.href,
            profilePicture: {
              src: articleHeader.autorImage.src,
            },
          },
        },
        data: articleHeader.data,
        text: articleBody,
        link: handleLink,
      };

      await page.close();

      writeFileData.push(article);
    }

    await writeFile(
      "./src/files/articles.json",
      JSON.stringify(writeFileData, null, 2)
    );

    await browser.close();
  }

  private async scrapeArticleHeader(currentPage: Page) {
    const headerSelector = "#__next div div main article div.css-a1d51z div";

    const image = await currentPage.$eval(
      `${headerSelector} .css-2179a6`,
      (imageProp) => {
        return {
          src: imageProp?.getAttribute("src"),
        };
      }
    );

    const title = await currentPage.$eval(
      `${headerSelector} h1`,
      (title) => title.textContent
    );

    const authorImage = await currentPage.$eval(
      `${headerSelector} .css-1yapcyz`,
      (authorImage) => {
        return {
          src: authorImage.getAttribute("src"),
        };
      }
    );

    const authorName = await currentPage.$eval(
      `${headerSelector} .css-1d1xwb0`,
      (name) => {
        return {
          name: name.textContent,
          href: name.getAttribute("href"),
        };
      }
    );

    const data = await currentPage.$eval(
      `${headerSelector} .tooltip-handle.css-z70pxu`,
      (data) => data.getAttribute("data-title")
    );

    const articleHeader = {
      image: image,
      title: title,
      autorImage: authorImage,
      authorName: authorName,
      data: data,
    };

    return articleHeader;
  }

  private async scrapeArticleBody(currentPage: Page) {
    const getBody = await currentPage.$eval(
      "#post-content-wrapper",
      (body) => body.outerHTML
    );

    const getHandleBody = getBody.replace(/<\/pre>/g, "</pre>\n\n");

    const handleBody = getHandleBody.split(/\r?\n/);

    handleBody.pop();

    return handleBody;
  }

  public async createAll() {
    const articles = JSON.parse(
      await readFile("./src/files/articles.json", "utf-8")
    );

    const createdAll = [];

    for (let i = 0; i < articles.length; i++) {
      const getTextContent = articles[i].text;

      const currentArticle = articles[i];

      for (let i = 0; i < getTextContent.length; i++) {
        if (!getTextContent[i].includes("<img")) {
          getTextContent[i] = getTextContent[i].replace(/<[^>]*>/g, "");
        } else {
          const src = /src="([^"]+)"/;
          const hasIncludes = getTextContent[i].match(src);
          hasIncludes ? (getTextContent[i] = hasIncludes[1]) : null;
        }

        getTextContent[i].includes("Permalink")
          ? (getTextContent[i] = getTextContent[i].replace(
              /Permalink/g,
              "<h1>"
            ))
          : null;
      }

      const textContent = getTextContent.filter((i: any) => {
        return i;
      });

      const bodyArticle = {
        header: {
          image: currentArticle.header.image.src,
          title: currentArticle.header.title,
          author: {
            name: currentArticle.header.author.name,
            href: currentArticle.header.author.href,
            profilePicture: currentArticle.header.author.profilePicture.src,
          },
        },
        data: currentArticle.data,
        text: textContent,
        link: currentArticle.link,
      };

      const createdArticle = await articleSchema.create(bodyArticle);

      createdAll.push(createdArticle);
    }

    return createdAll;
  }

  public async createOne(article: any) {
    const created = await articleSchema.create(article);

    return created;
  }

  public async findAll() {
    const findedAll = await articleSchema.find().sort({ data: 1 });

    return findedAll;
  }

  public async findOne(link: any) {
    const regex = new RegExp(`.*${link}.*`, "i");

    const listedArticle = await articleSchema.find({ "header.title": regex });

    return listedArticle;
  }

  public async update(id: string, dataToUpdate: any) {
    const updatedArticle = await articleSchema.findOneAndUpdate(
      { _id: id },
      {
        header: {
          title: dataToUpdate.header.title,
          image: dataToUpdate.header.image,
          author: {
            name: dataToUpdate.header.author.name,
            href: dataToUpdate.header.author.href,
            profilePicture: dataToUpdate.header.author.profilePicture,
          },
        },
        data: dataToUpdate.data,
        text: dataToUpdate.text,
        link: dataToUpdate.link,
      },
      {
        new: true,
      }
    );

    return updatedArticle;
  }

  public async deleteOne(id: string) {
    await articleSchema.findByIdAndDelete(id);
  }

  public async deleteAll() {
    const deletedsArticles = await this.findAll();

    const deletedIds = deletedsArticles.map((article) => article._id);

    const filter = { _id: { $in: deletedIds } };

    await articleSchema.deleteMany(filter);
  }
}

export default ArticleService;
