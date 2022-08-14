import {CouchdbCluster} from '../index.js'

describe('couchdb', function () {
    const cluster = new CouchdbCluster()
    it('ping', async () => {
        const url = 'http://127.0.0.1:5984/'
        const resp = await cluster.ping(url)
        console.debug(resp)
    })
})