import {execSync} from '@davidkhala/light/devOps.js'

export const defaultImage = 'couchdb:3.1.1'
export const defaultUser = 'admin'
export const defaultPassword = 'password'

export const envBuilder = (user, password, clusterOpt) => {
    let env = [`COUCHDB_USER=${user}`, `COUCHDB_PASSWORD=${password}`];
    if (clusterOpt) {
        // TODO couchdb cluster
        const {nodeName, flag} = clusterOpt;
        env = env.concat([
            `NODENAME=${nodeName}`,
            `ERL_FLAGS=-setcookie "${flag}"`
        ]);
    }
    return env;
};

export class OptionBuilder {
    constructor(OCIContainerOptsBuilder, Image = defaultImage) {
        this.opts = new OCIContainerOptsBuilder(Image, ["/opt/couchdb/bin/couchdb"])
    }

    setPortBind(hostPort) {
        this.opts.setPortBind(`${hostPort}:5984`)
    }

    build(name, user = defaultUser, password = defaultPassword) {
        this.opts.setName(name)
        this.opts.setEnv(envBuilder(user, password))
        return this.opts.opts
    }
}

export class Cmd {
    constructor(name, user = defaultUser, password = defaultPassword) {
        this.cmdOptions = `-d -e COUCHDB_USER=${user} -e COUCHDB_PASSWORD=${password} ${name ? '--name ' + name : ''}`
    }

    setHostPort(port) {
        this.cmdOptions += ` -p=${port}:5984`
    }

    start() {

        const cmd = `podman run ${this.cmdOptions.trim()} ${defaultImage}`
        console.debug(cmd)
        execSync(cmd)
    }
}