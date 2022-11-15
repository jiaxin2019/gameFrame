import { Pool } from "cc";
import { IPool } from "./Pool";

class LRUNode implements IPool {
    value?: string;
    prev: LRUNode = null!;                                 // 前面的
    next: LRUNode = null!;                                 // 后面的
    constructor(value: string, next: LRUNode) {
        this.value = value;
        this.next = next;
    }
    use(value: string, next: LRUNode) {
        this.value = value;
        this.next = next;
    }

    free() {
        this.value = "";
        this.next = null!;
    }
}

/**
 * @author honmono
 * @description 为UIManager写的 lru cache控制.
 */
export class LRUCache {
    public maxSize: number = 0;
    private head: LRUNode = null!;
    private last: LRUNode = null!;
    private size: number = 0;

    private nodePool: Pool<LRUNode> = new Pool<LRUNode>(() => {
        return new LRUNode("", null!);
    }, 3)

    constructor(maxSize: number) {
        this.maxSize = maxSize;
        this.head = new LRUNode("head", null!);
        this.size = 0;
    }

    public remove(value: string) {
        let node = this.has(value);
        node && this.removeNode(node);
    }

    public put(value: string) {
        if (this.size <= 0) {
            this.last = this.nodePool.alloc();
            this.last.prev = this.head;
            this.head.next = this.last;
            this.size = 1;

            return;
        }
        let node = this.has(value);
        if (!node) {//node不存在的时候，直接加到最前面
            node = this.nodePool.alloc();
            this.addHead(node);
            return;
        }
        //node存在的时候，直接加到最前面
        if (this.last == node) {//如果这个node就是last，那么更换last
            this.last = node.prev;
        }
        this.removeNode(node);
        this.addHead(node);
    }

    public needDelete() {
        return this.size > this.maxSize;
    }


    public deleteLastNode() {
        let value = this.last.value;
        this.removeNode(this.last);
        this.nodePool.free(this.last);
        this.last = this.last.prev;
        return value;
    }

    public has(value: string) {
        let next = this.head?.next;
        while (next) {
            if (next.value == value) {
                return next;
            }
            next = next.next;
        }
        return null;
    }

    public toString() {
        let str = "";
        let next = this.head.next;
        while (next) {
            str += next.value + " ";
            next = next.next;
        }
        return str;
    }

    private removeNode(node: LRUNode) {
        node.prev.next = node.next;
        if (node.next) {
            node.next.prev = node.prev;
        }
        this.size--;
    }

    /** 向头部插入一个node */
    private addHead(node: LRUNode) {
        node.next = this.head.next;
        if (node.next) {
            node.next.prev = node;
        }
        this.head.next = node;
        node.prev = this.head;
        this.size++;
    }


}   