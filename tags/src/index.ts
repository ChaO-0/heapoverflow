import mongoose from 'mongoose';
import { app } from './app';
import { PostCreatedListener } from './events/listeners/post-created-listener';
import { PostDeletedListener } from './events/listeners/post-deleted-listener';
import { PostUpdatedListener } from './events/listeners/post-updated-listener';
import { natsWrapper } from './nats-wrapper';
import { dbSeeder } from './seed/seeder';

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}

	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined');
	}

	if (!process.env.NATS_CLIENT_ID) {
		throw new Error('NATS_CLIENT_ID must be defined');
	}

	if (!process.env.NATS_URL) {
		throw new Error('NATS_URL must be defined');
	}

	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error('NATS_CLUSTER_ID must be defined');
	}

	try {
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URL
		);

		natsWrapper.client.on('close', () => {
			console.log('NATS connection closed!');
			process.exit();
		});

		process.on('SIGINT', () => natsWrapper.client.close());
		process.on('SIGTERM', () => natsWrapper.client.close());

		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('Connected to MongoDB');

		new PostCreatedListener(natsWrapper.client).listen();
		new PostUpdatedListener(natsWrapper.client).listen();
		new PostDeletedListener(natsWrapper.client).listen();

		await dbSeeder();
	} catch (err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log('Listening on port 3000!!!!');
	});
};

start();
