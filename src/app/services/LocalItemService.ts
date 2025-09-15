export class Item {
    key: string;

    constructor(key: string) {
        this.key = key;
    }

    public get() {
        return localStorage.getItem(this.key);
    }

    public remove() {
        localStorage.removeItem(this.key);
    }

    public set(value: string) {
        localStorage.setItem(this.key, value);
    }
}
