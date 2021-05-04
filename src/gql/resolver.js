const userController = require('../controllers/user');
const followController = require('../controllers/follow');
const publicationController = require('../controllers/publication');
const commentController = require('../controllers/comment');
const likeController = require('../controllers/like');
const albumController = require('../controllers/album');

const resolvers = {
	Query: {
		// User
		getUser: (_, { id, username }) => userController.getUser(id, username),
		search: (_, { search }) => userController.search(search),

		// Album
		getAlbums: (_, { id }) => albumController.getAlbums(id),
		countAlbums: (_, { idUser }) => albumController.countAlbums(idUser),

		// Follow
		isFollow: (_, { username }, ctx) => followController.isFollow(username, ctx),
		getFollowers: (_, { username }) => followController.getFollowers(username),
		getFolloweds: (_, { username }) => followController.getFolloweds(username),
		getNotFolloweds: (_, {}, ctx) => followController.getNotFolloweds(ctx),

		// Publication
		getPublications: (_, { username, idAlbum }) => publicationController.getPublications(username, idAlbum),
		getPublicationsFolloweds: (_, {}, ctx) => publicationController.getPublicationsFolloweds(ctx),

		// Comments
		getComments: (_, { idPublication }) => commentController.getComments(idPublication),
		countComments: (_, { idPublication }) => commentController.countComments(idPublication),

		// Like
		isLike: (_, { idPublication }, ctx) => likeController.isLike(idPublication, ctx),
		countLikes: (_, { idPublication }) => likeController.countLikes(idPublication),

		// Not Like
		isNotLike: (_, { idPublication }, ctx) => likeController.isNotLike(idPublication, ctx),
		countNotLikes: (_, { idPublication }) => likeController.countNotLikes(idPublication),

		// Trash
		isTrash: (_, { idPublication }, ctx) => likeController.isTrash(idPublication, ctx),
		countTrash: (_, { idPublication }) => likeController.countTrash(idPublication),
	},

	Mutation: {
		// User
		register: (_, { input }) => userController.register(input),
		login: (_, { input }) => userController.login(input),
		updateLanguage: (_, { input }, ctx) => userController.updateLanguage(input, ctx),
		updateAvatar: (_, { file }, ctx) => userController.updateAvatar(file, ctx),
		deleteAvatar: (_, {}, ctx) => userController.deleteAvatar(ctx),
		updateUser: (_, { input }, ctx) => userController.updateUser(input, ctx),

		// Album
		addAlbum: (_, { input }, ctx) => albumController.addAlbum(input, ctx),
		removeAlbum: (_, { idAlbum }) => albumController.removeAlbum(idAlbum),

		// Follow
		follow: (_, { username }, ctx) => followController.follow(username, ctx),
		unFollow: (_, { username }, ctx) => followController.unFollow(username, ctx),

		// Publish
		publish: (_, { file, album }, ctx) => publicationController.publish(file, album, ctx),
		deletePublication: (_, { idPublication }) => publicationController.deletePublication(idPublication),

		// Comment
		addComment: (_, { input }, ctx) => commentController.addComment(input, ctx),

		// Likes
		addLike: (_, { idPublication }, ctx) => likeController.addLike(idPublication, ctx),
		deleteLike: (_, { idPublication }, ctx) => likeController.deleteLike(idPublication, ctx),

		// Not Likes
		addNotLike: (_, { idPublication }, ctx) => likeController.addNotLike(idPublication, ctx),
		deleteNotLike: (_, { idPublication }, ctx) => likeController.deleteNotLike(idPublication, ctx),

		// Trash
		addTrash: (_, { idPublication }, ctx) => likeController.addTrash(idPublication, ctx),
		deleteTrash: (_, { idPublication }, ctx) => likeController.deleteTrash(idPublication, ctx),
	},
};

module.exports = resolvers;
