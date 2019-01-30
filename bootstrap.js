const {imagePull, containerStart, containerDelete, networkRemove, networkCreate} = require('./docker-manager/nodejs/dockerode-util');
const {setNetwork, setPortBind} = require('./docker-manager/nodejs/containerOptsBuilder');
const config = {
	couchdb1: {
		port: 5984
	},
	couchdb2: {
		port: 6984
	}
};
const network = 'couchNetwork';
const Image = 'couchdb:latest';
const start = async () => {
	await imagePull(Image);
	await networkCreate({Name: network}, false);
	for (const [name, configEntry] of Object.entries(config)) {
		let containerOpts = {name, Image};
		containerOpts = setNetwork(containerOpts, network, [name]);
		containerOpts = setPortBind(containerOpts, `${configEntry.port}:5984`);

		await containerStart(containerOpts);
	}
};
exports.start = start;
const stop = async () => {
	for (const name of Object.keys(config)) {
		await containerDelete(name);
	}
	await networkRemove(network);
};
exports.restart = async () => {
	await stop();
	await start();
};
exports.stop = stop;