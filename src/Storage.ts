import { IEntry } from "./types";
import { MMKV } from 'react-native-mmkv';
import { eventEmitter } from "./Globals";

export default class Storage {
    private static storage = new MMKV();
    private static key = 'entries';
    private static idKey = 'id';


    static async loadEntries() {
        const s = this.storage.getString(this.key)
        if (!s) return [];
        const entries: IEntry[] = JSON.parse(s);
        return entries || [];
    }

    static async getSum() {
        const entries = await this.loadEntries();
        return entries.reduce((acc, entry) => acc + entry.price, 0);
    }

    static async saveEntry(name: string, price: number, timestamp?: number, id?: number) {
        const entry = { name, price, timestamp: timestamp || new Date().valueOf(), id: id || await this.generateId() };
        return await this._saveEntry(entry);
    }

    private static async _saveEntry(entry: IEntry) {
        const entries = await this.loadEntries();
        this.storage.set(this.key, JSON.stringify([...entries, entry]));
        eventEmitter.emit('listChanged');
    }

    static async purgeEntries() {
        this.storage.delete(this.key);
        this.storage.set(this.idKey, 0);
        eventEmitter.emit('listChanged');
    }

    static async deleteEntry(id: number) {
        const entries = await this.loadEntries();
        this.storage.set(this.key, JSON.stringify(entries.filter(entry => entry.id !== id)));
        eventEmitter.emit('listChanged');
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

        this.storage.set(this.key, JSON.stringify(entries.map(entry => entry.id === id ? _newEntry : entry)))
        eventEmitter.emit('listChanged');
    }

    private static async generateId() {
        const nextId = (this.storage.getNumber(this.idKey) || 0) + 1;
        console.log("nextId", nextId)
        this.storage.set(this.idKey, nextId);
        return nextId;
    }
}