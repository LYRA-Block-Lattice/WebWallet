import localforage from 'localforage';

class persist {
    static async getData() {
        const value = await localforage.getItem('rxstor');
        var wallets = JSON.parse(value);
        return wallets;
    }

    static async setData(data) {
        await localforage.setItem('rxstor', JSON.stringify(data));
    }
}

export default persist;