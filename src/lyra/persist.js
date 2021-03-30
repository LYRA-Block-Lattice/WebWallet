import localforage from 'localforage';

class persist {
    static checkData() {
        const promis = new Promise(( ok, fail ) => {
            localforage.getItem('rxstor').then( val => {
                if (val === null) {
                    ok(null);
                }
                else {
                    var wallets = JSON.parse(val);
                    ok(wallets);
                }
            }).catch(err => {
                fail(err);
            });
        });
        return promis;
    }

    static async getData() {
        const data = await localforage.getItem('rxstor');
        return JSON.parse(data);
    }

    static setData(data) {
        return localforage.setItem('rxstor', JSON.stringify(data));
    }

    static async removeData() {
        localforage.removeItem('rxstor');
    }
}

export default persist;