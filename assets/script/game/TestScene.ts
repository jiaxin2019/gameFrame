
import { _decorator, Component, Node, ScrollView, resources } from 'cc';
import { InfiniteList } from '../common/gameBase/InfiniteList';
import { ListItemData } from './ListItem';
const { ccclass, property } = _decorator;
export enum PreFabName {
    bagItem = "prefab/BagItem",
    spriItem = "prefab/SpriteSplashItem",
}
@ccclass('TestScene')
export class TestScene extends Component {

    start() {
        let data = [];
        for (let i = 0; i < 121; i++) {
            let item: ListItemData = {
                prefabName: PreFabName.spriItem,
                name: "skfasdjflasj" + i
            }
            data.push(item);
        }
        let scorllview = this.node.getChildByName("ScrollView")!;
        let ts = scorllview.getComponent(InfiniteList)!;
        ts.prefabCellName = [PreFabName.bagItem, PreFabName.spriItem];
        ts.updata(data);

        this.scheduleOnce(() => {
            ts.scrollToCell(43);
        }, 1);
    }

}
