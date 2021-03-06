const { gql } = require('apollo-server');

const typeDefs = gql`
	type User {
		id: ID
		name: String
		username: String
		email: String
		siteWeb: String
		description: String
		password: String
		avatar: String
		createAt: String
		roleName: String
		language: String
	}

	type Album {
		id: ID
		title: String
		picture: String
		createAt: String
	}

	type Token {
		token: String
	}

	type UpdateLanguage {
		status: Boolean
	}

	type UpdateAvatar {
		status: Boolean
		urlAvatar: String
	}

	type Publish {
		status: Boolean
		urlFile: String
	}

	type Publication {
		id: ID
		idUser: ID
		file: String
		typeFile: String
		createAt: String
	}

	type Comment {
		idPublication: ID
		idUser: User
		comment: String
		createAt: String
	}

	type FeedPublication {
		id: ID
		idUser: User
		file: String
		typeFile: String
		createAt: String
	}

	input UserInput {
		name: String!
		username: String!
		email: String!
		password: String!
	}

	input AlbumInput {
		title: String!
	}

	input LoginInput {
		email: String!
		password: String!
	}

	input UserUpdateInput {
		name: String
		email: String
		currentPassword: String
		newPassword: String
		siteWeb: String
		description: String
	}

	input CommentInput {
		idPublication: ID
		comment: String
	}

	type Query {
		# User
		getUser(id: ID, username: String): User
		search(search: String): [User]

		# Follow
		isFollow(username: String!): Boolean
		getFollowers(username: String!): [User]
		getFolloweds(username: String!): [User]
		getNotFolloweds: [User]

		# Publication
		getPublications(username: String!, idAlbum: String): [Publication]
		getPublicationsFolloweds: [FeedPublication]

		# Comment
		getComments(idPublication: ID!): [Comment]
		countComments(idPublication: ID!): Int

		# Album
		getAlbums(id: ID): [Album]
		countAlbums(idUser: ID!): Int

		# Like
		isLike(idPublication: ID!): Boolean
		countLikes(idPublication: ID!): Int
		isNotLike(idPublication: ID!): Boolean
		countNotLikes(idPublication: ID!): Int
		isTrash(idPublication: ID!): Boolean
		countTrash(idPublication: ID!): Int
	}

	type Mutation {
		# User
		register(input: UserInput): User
		login(input: LoginInput): Token
		updateLanguage(input: String!): Boolean
		updateAvatar(file: Upload): UpdateAvatar
		deleteAvatar: Boolean
		updateUser(input: UserUpdateInput): Boolean

		#Album
		addAlbum(input: AlbumInput): Album
		removeAlbum(idAlbum: ID!): Boolean

		#Follow
		follow(username: String!): Boolean
		unFollow(username: String!): Boolean

		#Publish
		publish(file: Upload, album: String): Publish
		deletePublication(idPublication: ID!): Boolean

		# Comment
		addComment(input: CommentInput): Comment

		# Likes
		addLike(idPublication: ID!): Boolean
		deleteLike(idPublication: ID!): Boolean
		addNotLike(idPublication: ID!): Boolean
		deleteNotLike(idPublication: ID!): Boolean
		addTrash(idPublication: ID!): Boolean
		deleteTrash(idPublication: ID!): Boolean
	}
`;

module.exports = typeDefs;
