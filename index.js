import assert from 'assert'
import {axiosPromise} from '@davidkhala/axios'

export class CouchdbCluster {
    async ping(url) {
        const resp = await axiosPromise({url, method: 'GET'})
        const {couchdb, vendor: {name}} = resp
        assert.strictEqual(couchdb, 'Welcome')
        assert.strictEqual(name, 'The Apache Software Foundation')
        delete resp.couchdb
        delete resp.vendor
        return resp
    }

}