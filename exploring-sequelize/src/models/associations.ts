export function setupAssociations(models: { User: any, FriendRequest: any, BookClub: any, SoloReadingList: any }) {
	const { User, FriendRequest, BookClub, SoloReadingList } = models;

	// User associations
	User.hasMany(FriendRequest, {
		as: 'receivedFriendRequests',
		foreignKey: 'fromId',
	});

	User.hasMany(FriendRequest, {
		as: 'sentFriendRequests',
		foreignKey: 'toId',
	})

	User.belongsToMany(BookClub, {
		as: 'belongsToBookClubs',
		through: 'UserInBookClubs',
	});

	User.hasMany(BookClub, {
		as: 'ownedBookClubs',
		foreignKey: 'ownerId',
	})

	User.hasMany(SoloReadingList, {
		as: 'soloReadingLists',
	});

	User.hasMany(User, {
		as: 'friends',
	});

	// FriendRequest associations
	FriendRequest.belongsTo(User, {
		as: 'from',
		foreignKey: 'fromId',
	});

	FriendRequest.belongsTo(User, {
		as: 'to',
		foreignKey: 'toId',
	});

	// BookClub associations
	BookClub.hasMany(User, { as: 'members' });
}
