const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const awsUploadImage = require("../utils/aws-upload-image");

function createToken(user, SECRET_KEY, expiresIn) {
  const { id, name, email, username } = user;
  const payload = {
    id,
    name,
    email,
    username,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

async function register(input) {
  const newUser = input;
  newUser.email = newUser.email.toLowerCase();
  newUser.username = newUser.username.toLowerCase();

  const MAIL_EN_USO = "El email ya esta en uso";
  const USUARIO_EN_USO = "El nombre de usuario ya esta en uso";

  const { email, username, password } = newUser;

  // Revisamos si el mail esta en uso
  const foundEmail = await User.findOne({ email });
  if (foundEmail) errorMsg(MAIL_EN_USO);

  // Revisamos si el username esta en uso
  const foundUsername = await User.findOne({ username });
  if (foundUsername) errorMsg(USUARIO_EN_USO);

  // Encriptar
  const salt = await bcryptjs.genSaltSync(10);
  newUser.password = await bcryptjs.hash(password, salt);

  try {
    const user = new User(newUser);
    user.save();
    return user;
  } catch (error) {
    console.log(error);
  }
  return null;
}

async function login(input) {
  const PASSWORD_ERROR = "Error en el mail o contraseña";
  const { email, password } = input;

  const userFound = await User.findOne({ email: email.toLowerCase() });
  if (!userFound) errorMsg(PASSWORD_ERROR);

  const passwordSuccess = await bcryptjs.compare(password, userFound.password);
  if (!passwordSuccess) errorMsg(PASSWORD_ERROR);

  return {
    token: createToken(userFound, process.env.SECRET_KEY, "24h"),
  };
}

async function getUser(id, username) {
  const USUARIO_INEXISTENTE = "El usuario no existe";
  let user = null;
  if (id) user = await User.findById(id);
  if (username) user = await User.findOne({ username });
  if (!user) errorMsg(USUARIO_INEXISTENTE);

  return user;
}

async function updateAvatar(file, ctx) {
  const { id } = ctx.user;
  const { createReadStream, mimetype } = await file;
  const extension = mimetype.split("/")[1];
  const imageName = `avatar/${id}.${extension}`;
  const fileData = await createReadStream();

  try {
    const result = await awsUploadImage(fileData, imageName);
    await User.findByIdAndUpdate(id, { avatar: result });
    return {
      status: true,
      urlAvatar: result,
    };
  } catch (error) {
    return {
      status: false,
      urlAvatar: null,
    };
  }
  return null;
}

async function deleteAvatar(ctx) {
  const { id } = ctx.user;
  try {
    await User.findByIdAndUpdate(id, { avatar: "" });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/*
 * updateUser: Modifica los datos del usuario en la Base de datos
 * Se utiliza una logica para el cambio de clave y otra logica para
 * el resto de los campos.
 */
async function updateUser(input, ctx) {
  const { id } = ctx.user;
  try {
    // Codigo de Actualizacion de la password del usuario
    if (input.currentPassword && input.newPassword) {
      const userFound = await User.findById(id);
      const passwordSuccess = await bcryptjs.compare(
        input.currentPassword,
        userFound.password
      );
      if (!passwordSuccess) throw new Error("Password incorrecto");
      const salt = await bcryptjs.genSaltSync(10);
      const newPasswordCrypt = await bcryptjs.hash(input.newPassword, salt);

      // Actualizamos en la base de datos
      await User.findByIdAndUpdate(id, { password: newPasswordCrypt });
    } else {
      // Actualizacion de los demas datos del usuario
      await User.findByIdAndUpdate(id, input);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function search(search) {
  const users = await User.find({
    name: { $regex: search, $options: "i" },
  });
  return users;
}

const errorMsg = (msg) => {
  throw new Error(msg);
};

module.exports = {
  register,
  login,
  getUser,
  updateAvatar,
  deleteAvatar,
  updateUser,
  search,
};
