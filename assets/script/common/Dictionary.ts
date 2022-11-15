import { StateType } from "../monster/FSM";

export class Dictionary<KT, VT> {
    private keys: KT[] = [];
    private values: VT[] = [];
    private isCache: boolean;
    public get count(): number {
        return this.keysCount();
    }

    public constructor(isCache: boolean = false) {
        this.isCache = isCache;
    }

    public add(key: any, value: any): number {
        if (this.isCache) {
            (this as any)[key] = value;
        }
        this.keys.push(key);
        return this.values.push(value);
    }

    public remove(key: any) {
        var index = this.keys.indexOf(key, 0);
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
        if (this.isCache) {
            delete (this as any)[key];
        }
    }

    private keysCount(): number {
        return this.keys.length;
    }

    public setDicValue(key: any, value: any) {
        var index = this.keys.indexOf(key, 0);
        if (index != -1) {
            this.keys[index] = key;
            this.values[index] = value;
            if (this.isCache) {
                (this as any)[key] = value;
            }
        }
        else {
            this.add(key, value);
        }
    }

    public tryGetValue(key: KT): VT {
        var index = this.keys.indexOf(key, 0);
        if (index != -1) {
            return this.values[index];
        }
        return null!;
    }

    public containsKey(key: any): boolean {
        let ks = this.keys;
        for (let i = 0; i < ks.length; ++i) {
            if (ks[i] == key) {
                return true;;
            }
        }
        return false;
    }

    public getKeys(): KT[] {
        return this.keys;
    }

    public getValues(): VT[] {
        return this.values;
    }
}
