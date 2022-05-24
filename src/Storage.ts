import { IEntry } from "./types";
import { MMKVLoader } from "react-native-mmkv-storage";

export default class Storage {
    private static storage = new MMKVLoader().initialize();
    private static key = 'entries';

    static async loadEntries() {
        const entries = this.storage.getArray<IEntry>(this.key);
        return entries || [];
    }

    static async getSum() {
        const entries = await this.loadEntries();
        return entries.reduce((acc, entry) => acc + entry.price, 0);
    }

    static async saveEntry(name: string, price: number, timestamp?: number, id?: number) {
        const entry = { name, price, timestamp: timestamp || new Date().valueOf(), id: id || (await this.loadEntries()).length };
        return await this._saveEntry(entry);
    }

    private static async _saveEntry(entry: IEntry) {
        const entries = await this.loadEntries();
        return this.storage.setArray(this.key, [...entries, entry]);
    }

    static async purgeEntries() {
        return this.storage.removeItem(this.key) || false;
    }
}