const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const awsUploadImage = require('../utils/aws-upload-image');
const functions = require('firebase-functions');

let config = require('../../env.json');

if (Object.keys(functions.config()).length) {
	config = functions.config();
}

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

	const MAIL_EXISTS = 'The e-mail address is already taken.';
	const USER_EXISTS = 'Username is already taken';

	const { email, username, password } = newUser;

	// Check if e-mail is taken
	const foundEmail = await User.findOne({ email });
	if (foundEmail) errorMsg(MAIL_EXISTS);

	// Check if Username is taken
	const foundUsername = await User.findOne({ username });
	if (foundUsername) errorMsg(USER_EXISTS);

	// Crypt
	const salt = await bcryptjs.genSaltSync(10);
	newUser.password = await bcryptjs.hash(password, salt);
	newUser.roleName = 'user';

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
	const PASSWORD_ERROR = 'User or Password incorrect.';
	const { email, password } = input;

	const userFound = await User.findOne({ email: email.toLowerCase() });
	if (!userFound) errorMsg(PASSWORD_ERROR);

	const passwordSuccess = await bcryptjs.compare(password, userFound.password);
	if (!passwordSuccess) errorMsg(PASSWORD_ERROR);

	return {
		token: createToken(userFound, config.service.secret_key, '24h'),
	};
}

async function getUser(id, username) {
	const USER_NOT_FOUND = 'User does not exist';
	let user = null;
	if (id) user = await User.findById(id);
	if (username) user = await User.findOne({ username });
	if (!user) errorMsg(USER_NOT_FOUND);

	return user;
}

async function updateAvatar(file, ctx) {
	const { id } = ctx.user;
	const { createReadStream, mimetype } = await file;
	const extension = mimetype.split('/')[1];
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
}

async function deleteAvatar(ctx) {
	const { id } = ctx.user;
	try {
		await User.findByIdAndUpdate(id, { avatar: '' });
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function updateLanguage(input, ctx) {
	const { id } = ctx.user;
	console.log(input);
	try {
		await User.findByIdAndUpdate(id, { language: input });
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}

async function updateUser(input, ctx) {
	const { id } = ctx.user;
	try {
		// Updating User password
		if (input.currentPassword && input.newPassword) {
			const userFound = await User.findById(id);
			const passwordSuccess = await bcryptjs.compare(input.currentPassword, userFound.password);
			if (!passwordSuccess) throw new Error('Password incorrect');
			const salt = await bcryptjs.genSaltSync(10);
			const newPasswordCrypt = await bcryptjs.hash(input.newPassword, salt);

			// Updating data base
			await User.findByIdAndUpdate(id, { password: newPasswordCrypt });
		} else {
			// Update of the rest user's data
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
		name: { $regex: search, $options: 'i' },
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
	updateLanguage,
	updateAvatar,
	deleteAvatar,
	updateUser,
	search,
};
