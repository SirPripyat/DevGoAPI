import { model, Schema } from "mongoose";

const linkSchema = new Schema({
  link: String,
});

export default model("Link", linkSchema);
