const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  // author: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
  author: {
    type: String,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
