import {
    ContainerManager as DockerManager,
    ContainerOptsBuilder as DockerOptsBuilder
} from '@davidkhala/dockerode/docker.js';
import {
    ContainerManager as PodmanManager,
    ContainerOptsBuilder as PodmanOpts,
} from '@davidkhala/dockerode/podman.js'
import {OptionBuilder, Cmd} from '../container.js'

const network = 'couchNetwork';
const Image = 'couchdb:3.1.1';
const config = {
    couchdb1: {
        port: 6984
    },
    couchdb2: {
        port: 7984
    }
};

describe('use docker', function () {
    this.timeout(0)
    const docker = new DockerManager()
    it('start', async () => {
        await docker.imagePull(Image)
        await docker.networkCreateIfNotExist({Name: network}, false);
        for (const [name, configEntry] of Object.entries(config)) {
            const opts = new DockerOptsBuilder(Image, name)

            opts.setNetwork(network, [name])
            opts.setPortBind(`${configEntry.port}:5984`)

            await docker.containerStart(opts.opts);
        }
    })
    it('stop', async () => {
        for (const name of Object.keys(config)) {
            await docker.containerDelete(name);
        }
        await docker.networkRemove(network);
    })
})
describe('use podman', function () {
    this.timeout(0)
    const podman = new PodmanManager()
    it('start', async () => {
        await podman.imagePull(Image)
        await podman.networkCreate({Name: network});
        for (const [name, configEntry] of Object.entries(config)) {

            const opts = new OptionBuilder(PodmanOpts)


            opts.opts.setNetwork(network)
            opts.setPortBind(configEntry.port)

            await podman.containerStart(opts.build(name));
        }
    })
    it('stop', async () => {
        for (const name of Object.keys(config)) {
            await podman.containerDelete(name);
        }
        await podman.networkRemove(network);
    })
    it('cmd', async () => {
        const name= 'sampleCouch'
        await podman.containerDelete(name);
        const cmd = new Cmd(name)
        cmd.setHostPort(5984)
        cmd.start()
    })
})

