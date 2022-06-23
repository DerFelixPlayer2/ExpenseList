import { MMKVLoader } from 'react-native-mmkv-storage';

type IRType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export default class Settings {
  private static instanceId = 'user.settings';
  private static instance: Settings | null = null;
  private storage;

  private constructor() {
    this.storage = new MMKVLoader().withInstanceID(Settings.instanceId).withEncryption().initialize();
  }

  public static getInstance() {
    if (Settings.instance === null) {
      Settings.instance = new Settings();
    }
    return Settings.instance;
  }

  public async get(type: 'string', key: string): Promise<string | null | undefined>;
  public async get(type: 'number', key: string): Promise<number | null | undefined>;
  public async get(type: 'boolean', key: string): Promise<boolean | null | undefined>;
  public async get(type: 'array', key: string): Promise<unknown[] | null | undefined>;
  public async get(type: 'object', key: string): Promise<unknown>;
  public async get(type: IRType, key: string) {
    switch (type) {
      case 'string':
        return await this.storage.getStringAsync(key);
      case 'number':
        return await this.storage.getIntAsync(key);
      case 'boolean':
        return await this.storage.getBoolAsync(key);
      case 'array':
        return await this.storage.getArrayAsync(key);
      case 'object':
        return await this.storage.getMapAsync(key);
    }
  }

  public async set(key: string, value: string): Promise<boolean | null | undefined>;
  public async set(key: string, value: number): Promise<boolean | null | undefined>;
  public async set(key: string, value: boolean): Promise<boolean | null | undefined>;
  public async set(key: string, value: unknown[]): Promise<boolean | null | undefined>;
  public async set(key: string, value: Object): Promise<boolean | null | undefined>;
  public async set(key: string, value: unknown) {
    switch (typeof value) {
      case 'string':
        return await this.storage.setStringAsync(key, value);
      case 'number':
        return await this.storage.setIntAsync(key, value);
      case 'boolean':
        return await this.storage.setBoolAsync(key, value);
      case 'object':
        if (value instanceof Array) {
          return await this.storage.setArrayAsync(key, value);
        } else if (value instanceof Object) {
          return await this.storage.setMapAsync(key, value);
        }
      default:
        throw new Error('Unsupported type');
    }
  }
}