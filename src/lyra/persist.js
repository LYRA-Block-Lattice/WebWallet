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

    }

    static async setData(data) {
        await localforage.setItem('rxstor', JSON.stringify(data));
    }

    static async removeData() {
        localforage.removeItem('rxstor');
    }
}

export default persist;