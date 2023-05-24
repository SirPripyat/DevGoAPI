import { model, Schema } from "mongoose";

const articleSchema = new Schema({
  header: {
    image: String,
    title: String,
    author: {
      name: String,
      href: String,
      profilePicture: String,
    },
  },
  data: String,
  text: Array<string>,
  link: String,
});

export default model("Articles", articleSchema);
