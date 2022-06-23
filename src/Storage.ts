import { IEntry } from "./types";
import { MMKV as MMKV_old } from 'react-native-mmkv';
import { MMKVLoader } from 'react-native-mmkv-storage';
import { eventEmitter } from "./Globals";

export default class Storage {
    private static instanceId = 'app.data';
    private static key = 'entries';
    private static instance: Storage | null = null;
    private storage;

    private constructor() {
        this.storage = new MMKVLoader().withInstanceID(Storage.instanceId).initialize();
    }

    public static async getInstance() {
        if (Storage.instance === null) {
            Storage.instance = new Storage();
        }
        if (!(await Storage.instance.storage.getBoolAsync('initialized'))) {
            await Storage.instance.init();
        }
        return Storage.instance;
    }

    private async init() {
        const old = Storage_old.getInstance();
        const data = await old.loadEntries();
        await this.storage.setStringAsync(Storage.key, JSON.stringify(data));
        await this.storage.setBoolAsync('initialized', true);
    }

    public async loadEntries() {
        const s = await this.storage.getStringAsync(Storage.key)
        if (!s) return [];
        const entries: IEntry[] = JSON.parse(s);
        return entries || [];
    }

    public async getSum() {
        const entries = await this.loadEntries();
        return entries.reduce((acc, entry) => acc + entry.price, 0);
    }

    public async saveEntry(name: string, price: number, timestamp?: number, id?: number) {
        const entry = { name, price, timestamp: timestamp || new Date().valueOf(), id: id || await Storage.generateId() };
        return await this._saveEntry(entry);
    }

    private async _saveEntry(entry: IEntry) {
        const entries = await this.loadEntries();
        await this.storage.setStringAsync(Storage.key, JSON.stringify([...entries, entry]));
        eventEmitter.emit('listChanged');
    }

    public async purgeEntries() {
        this.storage.removeItem(Storage.key);
        eventEmitter.emit('listChanged');
    }

    public async deleteEntry(id: number) {
        const entries = await this.loadEntries();
        await this.storage.setStringAsync(Storage.key, JSON.stringify(entries.filter(entry => entry.id !== id)));
        eventEmitter.emit('listChanged');
    }

    public async updateOrCreate(id: number, { name, price }: { name: string, price: number }) {
        const entries = await this.loadEntries();
        const entry = entries.find(entry => entry.id === id);
        if (!entry) {
            return await this.saveEntry(name, price);
        }
        return await this._updateEntry(id, { name, price });
    }

    private async _updateEntry(id: number, newEntry: { name: string, price: number }) {
        const entries = await this.loadEntries();
        const entry = entries.find(entry => entry.id === id);
        if (!entry) throw new Error("Entry not found");

        const _newEntry: IEntry = { ...entry, ...newEntry };
        if (!_newEntry.edits) _newEntry.edits = []
        _newEntry.edits.push(new Date().valueOf());

        await this.storage.setStringAsync(Storage.key, JSON.stringify(entries.map(entry => entry.id === id ? _newEntry : entry)))
        eventEmitter.emit('listChanged');
    }

    private static async generateId() {
        return new Date().valueOf();
    }
}

class Storage_old {
    private static key = 'entries';
    private static instance: Storage_old | null = null;
    private storage;

    private constructor() {
        this.storage = new MMKV_old();
    }

    public static getInstance() {
        if (Storage_old.instance === null) {
            Storage_old.instance = new Storage_old();
        }
        return Storage_old.instance;
    }

    public async loadEntries() {
        const s = this.storage.getString(Storage_old.key)
        if (!s) return [];
        const entries: IEntry[] = JSON.parse(s);
        return entries || [];
    }

    public async getSum() {
        const entries = await this.loadEntries();
        return entries.reduce((acc, entry) => acc + entry.price, 0);
    }

    public async saveEntry(name: string, price: number, timestamp?: number, id?: number) {
        const entry = { name, price, timestamp: timestamp || new Date().valueOf(), id: id || await Storage_old.generateId() };
        return await this._saveEntry(entry);
    }

    private async _saveEntry(entry: IEntry) {
        const entries = await this.loadEntries();
        this.storage.set(Storage_old.key, JSON.stringify([...entries, entry]));
        eventEmitter.emit('listChanged');
    }

    public async purgeEntries() {
        this.storage.delete(Storage_old.key);
        eventEmitter.emit('listChanged');
    }

    public async deleteEntry(id: number) {
        const entries = await this.loadEntries();
        this.storage.set(Storage_old.key, JSON.stringify(entries.filter(entry => entry.id !== id)));
        eventEmitter.emit('listChanged');
    }

    public async updateOrCreate(id: number, { name, price }: { name: string, price: number }) {
        const entries = await this.loadEntries();
        const entry = entries.find(entry => entry.id === id);
        if (!entry) {
            return await this.saveEntry(name, price);
        }
        return await this._updateEntry(id, { name, price });
    }

    private async _updateEntry(id: number, newEntry: { name: string, price: number }) {
        const entries = await this.loadEntries();
        const entry = entries.find(entry => entry.id === id);
        if (!entry) throw new Error("Entry not found");

        const _newEntry: IEntry = { ...entry, ...newEntry };
        if (!_newEntry.edits) _newEntry.edits = []
        _newEntry.edits.push(new Date().valueOf());

        this.storage.set(Storage_old.key, JSON.stringify(entries.map(entry => entry.id === id ? _newEntry : entry)))
        eventEmitter.emit('listChanged');
    }

    private static async generateId() {
        return new Date().valueOf();
    }
}