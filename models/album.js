const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = Schema({
  title: {
    type: String,
    trim: true,
    require: true,
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  picture: {
    type: String,
    trim: true,
    default: "none",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Album", AlbumSchema);
