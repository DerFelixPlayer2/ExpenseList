import { IEntry } from "./types";
import { MMKVLoader } from "react-native-mmkv-storage";
import { EventEmitter } from "eventemitter3";

export default class Storage {
    private static storage = new MMKVLoader().initialize();
    private static key = 'entries';

    static EE = new EventEmitter();

    static async loadEntries() {
        const entries = this.storage.getArrayAsync<IEntry>(this.key);
        return await entries || [];
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
        const r = await this.storage.setArrayAsync(this.key, [...entries, entry]);
        this.EE.emit('listChanged');
        return r || false;
    }

    static async purgeEntries() {
        const r = this.storage.removeItem(this.key);
        this.EE.emit('listChanged');
        return r || false;
    }

    static async updateOrCreate(id: number, { name, price }: { name: string, price: number }) {
        const entries = await this.loadEntries();
        const entry = entries.find(entry => entry.id === id);
        if (!entry) {
            return await this.saveEntry(name, price);
        }
        return await this._updateEntry(id, { name, price });
    }

    private static async _updateEntry(id: number, newEntry: { name: string, price: number }) {
        const entries = await this.loadEntries();
        const entry = entries.find(entry => entry.id === id);
        if (!entry) throw new Error("Entry not found");

        const _newEntry: IEntry = { ...entry, ...newEntry };
        if (!_newEntry.edits) _newEntry.edits = []
        _newEntry.edits.push(new Date().valueOf());

        const r = await this.storage.setArrayAsync(this.key, entries.map(entry => entry.id === id ? _newEntry : entry))
        this.EE.emit('listChanged');
        return r || false;
    }
}