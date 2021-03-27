import localforage from 'localforage';

class persist {
    static async getData() {
        try {
            const value = await localforage.getItem('rxstor');
            var wallets = JSON.parse(value);
            return wallets;
        }
        catch (err) {
            // This code runs if there were any errors.
            console.log(err);
            return null;
        }
    }

    static async setData(data) {
        await localforage.setItem('rxstor', JSON.stringify(data));
    }
}

export default persist;