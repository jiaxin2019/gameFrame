
import { _decorator, Component, Node, Label } from 'cc';
import InfiniteCell, { InfiniteCellBaseData } from '../common/gameBase/InfiniteCell';
const { ccclass, property } = _decorator;
export interface ListItemData extends InfiniteCellBaseData {
    name: string
}
@ccclass('ListItem')
export class ListItem extends InfiniteCell {


    start() {
        // [3]
    }

    updateContent(data: ListItemData): void {
        let labelNo = this.node.getChildByName("name")!;
        let label = labelNo.getComponent(Label)!;
        label.string = data.prefabName + this.dataIndex + "/" + this.node.position;

    }
}


