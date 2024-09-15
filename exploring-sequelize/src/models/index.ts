import sequelize from '../config/db';
import User from './User';
import FriendRequest from './FriendRequest';
import BookClub from './BookClub';
import SoloReadingList from './SoloReadingList';
import { setupAssociations } from './associations';
import { fail } from 'assert';

const models = {
	User,
	FriendRequest,
	BookClub,
	SoloReadingList,
};

// // initialize models
// function createAndAssociateModels(models: any, associationsConnection: any) {
// 	Object.values(models).forEach((model: any) => {
// 		model.init({...model.getAttributes()}, {
// 			...sequelize,
// 			...model.options
// 		});
// 	});
	
// 	associationsConnection(models);
// }

// async function syncModel(model: any) {
// 	let syncedModel;
// 	try {
// 		console.log(`Syncing Model: ${model?.name || model?.constructor?.name}`);
// 		syncedModel = await model.sync();
// 		console.log(`Model: ${model?.name || model?.constructor?.name} was successfully synced`);
// 	} catch (error) {
// 		return `Error, Unable to sync model: ${model?.name || model?.constructor?.name}\n${error}`);
// 	}
// 	return syncedModel;
// }

// function syncModels(models: any) {
// 	const modelSyncProms = Object.values(models).map(async (model) => await syncModel(model))
// 	const settledModelSyncs = await Promise.allSettled(modelSyncProms);
// 	const failed = settledModelSyncs.filter((model) => model.status === 'rejected');
// 	if (failed.length) {
// 		console.log(`the following models failed to sync:${JSON.stringify(fail, null, 2)}`);
// 	}
// }

// createAndAssociateModels(models, setupAssociations);
// syncModels(models);

export { User, FriendRequest, BookClub, SoloReadingList };
export default models;
