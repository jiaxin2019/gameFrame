import { PriorityElement } from "./PriorityQueue";

/**
 * 带优先级的栈
 * */
export default class PriorityStack<T>{
    private stack: Array<PriorityElement<T>> = [];
    private _size = 0;
    public get size() {
        return this._size;
    }

    public clear() {
        this.stack.length = 0;
        this._size = 0;
        return true;
    }

    public getTopEPriority(): number {
        if (this.stack.length <= 0) return -1;
        return this.stack[this.stack.length - 1].priority;
    }

    public getTopElement(): T {
        if (this.stack.length <= 0) return null!;
        return this.stack[this.stack.length - 1].data;
    }

    public getElements(): T[] {
        let elements: T[] = [];
        for (let e of this.stack) {
            elements.push(e.data);
        }
        return elements;
    }

    public push(e: T, priority = 0): void {
        this.stack.push(new PriorityElement(e, priority));
        this._size++;
        this.adjust();
    }

    private adjust(): void {
        for (let i = this.stack.length - 1; i > 0; i--) {
            if (this.stack[i].priority < this.stack[i - 1].priority) {
                this.swap(i, i - 1);
            }
        }
    }
    private swap(a: number, b: number) {
        let tmp = this.stack[a];
        this.stack[a] = this.stack[b];
        this.stack[b] = tmp;
    }

    public hasElement(t: T) {
        for (let e of this.stack) {
            if (e.data === t) {
                return true;
            }
        }
        return false;
    }

    public remove(t: T) {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            if (this.stack[i].data === t) {
                this.stack.splice(i, 1);
                this._size--;
                return true;
            }
        }
        return false;
    }
}