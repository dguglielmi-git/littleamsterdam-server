const Like = require("../models/like");
const NotLike = require("../models/notLike");
const Trash = require("../models/trash");

function addLike(idPublication, ctx) {
  try {
    const like = new Like({
      idPublication,
      idUser: ctx.user.id,
    });

    like.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function addNotLike(idPublication, ctx) {
  try {
    const notLike = new NotLike({
      idPublication,
      idUser: ctx.user.id,
    });

    notLike.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function addTrash(idPublication, ctx) {
  try {
    const trash = new Trash({
      idPublication,
      idUser: ctx.user.id,
    });

    trash.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteLike(idPublication, ctx) {
  try {
    await Like.findOneAndDelete({ idPublication }).where({
      idUser: ctx.user.id,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteNotLike(idPublication, ctx) {
  try {
    await NotLike.findOneAndDelete({ idPublication }).where({
      idUser: ctx.user.id,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteTrash(idPublication, ctx) {
  try {
    await Trash.findOneAndDelete({ idPublication }).where({
      idUser: ctx.user.id,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function isLike(idPublication, ctx) {
  try {
    const result = await Like.findOne({ idPublication }).where({
      idUser: ctx.user.id,
    });
    if (!result) throw new Error("No ha dado Like");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function isNotLike(idPublication, ctx) {
  try {
    const result = await NotLike.findOne({ idPublication }).where({
      idUser: ctx.user.id,
    });
    if (!result) throw new Error("No ha dado Not Like");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function isTrash(idPublication, ctx) {
  try {
    const result = await Trash.findOne({ idPublication }).where({
      idUser: ctx.user.id,
    });
    if (!result) throw new Error("No ha dado Trash");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function countLikes(idPublication) {
  try {
    const result = await Like.countDocuments({ idPublication });
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function countNotLikes(idPublication) {
  try {
    const result = await NotLike.countDocuments({ idPublication });
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function countTrash(idPublication) {
  try {
    const result = await Trash.countDocuments({ idPublication });
    return result;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

module.exports = {
  addLike,
  deleteLike,
  isLike,
  countLikes,
  addNotLike,
  deleteNotLike,
  deleteTrash,
  isNotLike,
  countNotLikes,
  addTrash,
  isTrash,
  countTrash,
};
