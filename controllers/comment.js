const Comment = require('../models/comments');

function addComment(input, ctx) {
	try {
		const comment = new Comment({
			idPublication: input.idPublication,
			idUser: ctx.user.id,
			comment: input.comment,
		});
		comment.save();
		return comment;
	} catch (error) {
		console.log(error);
	}
}

async function getComments(idPublication) {
	const result = await Comment.find({ idPublication }).populate('idUser');
	return result;
}

async function countComments(idPublication) {
	try {
		const result = await Comment.countDocuments({ idPublication });
		return result;
	} catch (error) {
		console.log(error);
		return 0;
	}
}

module.exports = {
	addComment,
	getComments,
	countComments,
};
