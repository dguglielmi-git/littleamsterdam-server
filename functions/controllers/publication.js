const Publication = require('../models/publication');
const User = require('../models/user');
const Follow = require('../models/follow');
const awsUploadImage = require('../utils/aws-upload-image');
const { v4: uuidv4 } = require('uuid');

async function publish(file, album, ctx) {
	const { id } = ctx.user;
	const { createReadStream, mimetype } = await file;
	const extension = mimetype.split('/')[1];
	const fileName = `publication/${uuidv4()}.${extension}`;
	const fileData = await createReadStream();

	try {
		const result = await awsUploadImage(fileData, fileName);
		const publication = new Publication({
			idUser: id,
			file: result,
			idAlbum: album,
			typeFile: mimetype.split('/')[0],
			createAt: Date.now(),
		});
		publication.save();
		return {
			status: true,
			urlFile: result,
		};
	} catch (error) {
		return {
			status: null,
			urlFile: '',
		};
	}
}

async function getPublications(username, idAlbum) {
	const user = await User.findOne({ username });

	if (!user) throw new Error('User not found.');

	if (idAlbum) {
		const publications = await Publication.find().where({ idUser: user._id, idAlbum }).sort({ createAt: -1 });

		return publications;
	} else {
		const publications = await Publication.find().where({ idUser: user._id, idAlbum: 0 }).sort({ createAt: -1 });

		return publications;
	}
}

async function getPublicationsFolloweds(ctx) {
	const followeds = await Follow.find({ idUser: ctx.user.id }).populate('follow');

	const followedsList = [];
	for await (const data of followeds) {
		followedsList.push(data.follow);
	}

	const publicationList = [];
	for await (const data of followedsList) {
		const publications = await Publication.find()
			.where({
				idUser: data._id,
			})
			.sort({ createAt: -1 })
			.populate('idUser');
		publicationList.push(...publications);
	}

	const result = publicationList.sort((a, b) => {
		return new Date(b.createAt) - new Date(a.createAt);
	});

	return result;
}

async function deletePublication(_id) {
	try {
		const result = await Publication.findByIdAndDelete({ _id });
		if (result) return true;
	} catch (error) {
		console.log(error);
	}
	return false;
}

module.exports = {
	publish,
	getPublications,
	getPublicationsFolloweds,
	deletePublication,
};
