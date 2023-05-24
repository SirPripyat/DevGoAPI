import { model, Schema } from "mongoose";

const listOfLinksSchema = new Schema({
  link: String,
});

export default model("Link", listOfLinksSchema);
