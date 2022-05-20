import { IEntry } from "./types";
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";

export default class Storage {
    private static storage = new MMKVLoader().initialize();

    static loadEntries(): IEntry[] {
        const [entries, setEntries] = useMMKVStorage<IEntry[]>('entries', this.storage, []);
        return entries || [];
    }

    static getSum(): number {
        const [entries, setEntries] = useMMKVStorage<IEntry[]>('entries', this.storage, []);
        return entries ? entries.reduce((acc, entry) => acc + entry.price, 0) : 0;
    }

    static saveEntry(entry: IEntry): void {
        const [entries, setEntries] = useMMKVStorage<IEntry[]>('entries', this.storage, []);
        entries ? setEntries([...entries, entry]) : setEntries([entry]);
    }
}