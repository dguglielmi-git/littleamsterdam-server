const Album = require("../models/album");

function addAlbum(input, ctx) {
  try {
    const album = new Album({
      idUser: ctx.user.id,
      title: input.title,
    });

    album.save();
    return album;
  } catch (error) {
    console.log(error);
  }
}

function getAlbums(idUser) {
  const ALBUM_EMPTY = "Album List Empty";
  const result = Album.find({ idUser });
  if (!result) throw new Error(ALBUM_EMPTY);

  return result;
}

async function removeAlbum(_id) {
  try {
    const result = await Album.findByIdAndDelete({ _id });
    if (result) return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}

async function countAlbums(idUser) {
  try {
    const result = Album.countDocuments({ idUser });
    return result;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

module.exports = {
  addAlbum,
  getAlbums,
  removeAlbum,
  countAlbums,
};
