export interface IEntry {
    [key: string]: any;
    price: number,
    name: string,
    timestamp: number,
    edits?: number[],
    id: number;
}