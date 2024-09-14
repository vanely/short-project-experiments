import sequelize from '../config/db';
import User from './User';
import FriendRequest from './FriendRequest';
import BookClub from './BookClub';
import SoloReadingList from './SoloReadingList';
import { setupAssociations } from './associations';

const models = {
	User,
	FriendRequest,
	BookClub,
	SoloReadingList,
};

// initialize models
Object.values(models).forEach((model: any) => {
	model.init({...model.getAttributes()}, {
		...sequelize,
		...model.options
	});
});

setupAssociations(models);

export { User, FriendRequest, BookClub, SoloReadingList };
// export default models;
