
import { _decorator, Component, Node, Size, NodePool, Vec2, ScrollView, Enum, Graphics, Color, UITransform, resources, Prefab, instantiate, size, AssetManager, Slider } from 'cc';
import InfiniteCell, { InfiniteCellBaseData } from './InfiniteCell';
const { ccclass, property } = _decorator;

enum Direction {
    vertical = 1,
    horizontal,
}

interface GetCellNumber {
    /**
     * 返回这个 List 中数据的总数量
     */
    (): number;
}

interface GetCellIdentifer {
    /**
     * 通过数据的下标返回这个 Cell 的表现类型的标志
     * @param dataIndex: 当前 Cell 所渲染的数据在列表中的下标
     */
    (dataIndex?: number): string;
}

interface GetCellSize {
    /**
     * 通过数据的下标返回这个 Cell 的尺寸（垂直 List 为高度，水平 List 为宽度）
     * @param dataIndex: 当前 Cell 所渲染的数据在列表中的下标
     */
    (dataIndex?: number): Size;
}

interface GetCellView {
    /**
     * 获取一个 Cell 的 View 实例，记住这个控件必须已经挂在一个存在的 Node 上
     * @param dataIndex: 当前 Cell 所渲染的数据在列表中的下标
     * @param identifier: 这个 Cell 的表现类型标志
     * 
     * 这个回调函数只会出现在已经没有可以重用的 Cell 时，List 才会向这个函数请求新的 Cell 实例
     * 所有已经请求的 Cell 实例都会被重复利用。
     */
    (dataIndex?: number, identifier?: string): InfiniteCell;
}

interface GetCellData {
    /**
     * 根据一个 Cell 的下标获取一个 Cell 的数据，这个数据会作为 Cell 的 UpdateContent 的参数
     * 这个回调是可选的，可以不提供，如果不提供的话，Cell 需要自己在 UpdateContent 中向其他模块获取更新自己内容的数据
     */
    (dataIndex?: number): any;
}

interface InitParam {
    getCellNumber: GetCellNumber,
    getCellSize: GetCellSize,
    getCellIdentifer: GetCellIdentifer,
    getCellView: GetCellView,
    getCellData?: GetCellData,
}

interface ListItemData {
    itemName: string
}

interface CellPools {
    [index: string]: NodePool;
}

@ccclass('InfiniteList')
export class InfiniteList extends Component {
    @property({
        type: Enum(Direction),
        tooltip: "List 滚动的方向，可以选择垂直或者水平"
    })
    public direction = Direction.vertical;

    @property({
        tooltip: "cell 之间的像素间隔，最开始和最后面不会添加"
    })
    public spacing = 0;

    @property({ tooltip: "List 顶部（水平滚动则是最左边）的间隔空间" })
    public headPadding = 0;

    @property({ tooltip: "List 底部（水平滚动则是最右边）的间隔空间" })
    public bottomPadding = 0;

    @property({ tooltip: "侧边的间距，垂直滚动就是左右边的间距，水平滚动就是上下边的间距" })
    public sidePadding: Vec2 = new Vec2(0, 0);

    @property({ tooltip: "list 的列数（行数）" })
    public columns = 1;

    //预制体的cell的名字
    public prefabCellName: string[] = [];
    //预制体的cell
    private prefabCell: { [key: string]: Prefab } = {};
    //list的data数据
    private listData: InfiniteCellBaseData[] = [];

    /**
     * 数据初始化接口（固定cell可以使用这个初始化）
     * @param data:[] 数组形式的数据，
    */
    public updata(data: InfiniteCellBaseData[]) {
        this.listData = data;
        let sf = this;
        if (!sf.prefabCellName) {
            console.warn("list缺少item的prefab路径")
            return;
        }
        resources.load(sf.prefabCellName, Prefab, this.complete.bind(this));
    }

    private complete(err: Error | null, data: Prefab[]): void {
        let sf = this;
        if (err) {
            console.log(err);
            return;
        }
        console.warn(data);
        data.forEach(item => {
            let name = item.data.name + "";
            sf.prefabCell[name] = item;
        });
        this._init();
    }
    /**
     * Reload 整个 List，这时获取数据的回调函数会重新触发一遍，所有的 cell 也会更新一遍内容
     */
    public reload(keepPos: boolean = false) {
        this._clear(keepPos);
        this._load();
    }

    /**
     * 重新刷新当前显示 cell 的内容，不会重新载入整个列表
     * 所以如果列表的数据数量发生了变化，或是想要修改 Cell 的尺寸，调用 Refresh 是没有用处的，请调用 Reload
     */
    public refresh() {
        this._updateActiveCellContent();
    }

    /**
     * 返回相对于 ScrollView 的这个 Cell 的滚动坐标
     * @param idx Cell 的索引下标
     */
    public getScrollPosOfCell(idx: number): Vec2 {
        let sp = this._getCellPosOfIndex(idx);
        if (this.direction == Direction.vertical) {
            return new Vec2(0, sp);
        } else {
            return new Vec2(sp * -1, 0);
        }
    }

    /**
     * 在规定的时间里滚动到指定的 Cell
     * @param idx 目标的 Cell 的下标
     */
    public scrollToCell(idx: number, timeInSecond: number = 1, attenuated: boolean = true) {
        let pos = this.getScrollPosOfCell(idx);
        this._scrollView.scrollToOffset(pos, timeInSecond, attenuated);
    }

    /**
     * 查看一个 Cell 是否当前可见
     * @param idx Cell 的下标
     */
    public isCellVisible(idx: number): boolean {
        if (idx >= this._activeCellIndexRange.x && idx <= this._activeCellIndexRange.y) return true;
        else return false;
    }

    ////////////////////////////////////////////////////////////
    // Implenmentions
    ////////////////////////////////////////////////////////////

    private _debug = false;
    private _scrollView: ScrollView = null!;
    private _content: Node = null!;
    private _delegate: InitParam = null!;
    private _inited = false;

    private _scrollPosition = 0;
    private _activeCellIndexRange: Vec2 = null!;
    private _cellPools: CellPools = {};

    // 列表的y值计算
    private _cellsOffset: Array<number> = [];
    private _cellsSize: Array<number> = [];

    // 列表的x值计算
    private _cellsXOffset: Array<number> = [];
    private _cellsXSize: Array<number> = [];
    private _activeCellViews = new Array<InfiniteCell>();

    public onLoad() {
        this._scrollView = this.node.getComponent(ScrollView)!;
        if (!this._scrollView) {
            this._scrollView = this.node.addComponent(ScrollView);
            if (this.direction == Direction.horizontal) {
                this._scrollView.vertical = false;
                this._scrollView.horizontal = true;
            } else {
                this._scrollView.vertical = true;
                this._scrollView.horizontal = false;
            }
        }

        this._content = new Node();
        let uiTransform = this._content.addComponent(UITransform);
        uiTransform.setAnchorPoint(0, 1);
        let view = this.node.getChildByName("view")!;
        view.addChild(this._content);
        this._scrollView.content = this._content;
        if (this._debug) {
            this._content.addComponent(Graphics);
        }

        this._inited = true;
        if (this.listData) {
            this._load();
        }
    }

    public update() {
        if (this._debug) {
            let g = this._content.getComponent(Graphics) as Graphics;
            g.clear();
            g.fillColor = Color.YELLOW;
            let ui = this._content.getComponent(UITransform)!;
            g.fillRect(0, 0, ui.width, ui.height);
        }
    }

    public onEnable() {
        this.node.on("scrolling", this._onScrolling, this);
    }

    public onDisable() {
        this.node.targetOff(this);
    }

    private _onScrolling() {
        if (!this.listData) return;
        const offset = this._scrollView.getScrollOffset();
        if (this.direction == Direction.vertical) {
            this._scrollPosition = offset.y;
        } else {
            this._scrollPosition = offset.x * -1;
        }

        this._refreshActiveCells();
    }

    //初始化入口
    private _init() {
        let needClear = false;
        if (this.listData) needClear = true;
        if (this._inited) {
            if (needClear) this._clear();
            this._load();
        }
    }

    private _clear(keepPos: boolean = false) {
        if (this._activeCellViews) {
            while (this._activeCellViews.length > 0) {
                this._recycleCell(this._activeCellViews.length - 1);
            }
        }

        this._activeCellIndexRange = new Vec2(-1, -1);
        if (!keepPos) {
            this._scrollPosition = 0;
            this._content.setPosition(0, 0, 0);
        }
    }

    private get getCellNumber(): number {
        return this.listData.length;
    }

    private getCellSize(name: string): Size {
        let urlArr = name.split("/");
        let itemName = urlArr[urlArr.length - 1];
        let prefab = this.prefabCell[itemName];
        if (!prefab) {
            let key = Object.keys(this.prefabCell)[0];
            prefab = this.prefabCell[key];
        }
        if (!prefab) {
            console.warn("使用的item预制体跟数据名字对应不上.或者缺少item预制体");
            return size(0, 0);
        }
        let width = prefab.data.width;
        let height = prefab.data.height;
        return size(width, height);
    }

    private _load() {
        let liDa = this.listData;
        const dataLen = liDa.length;
        if (dataLen <= 0) return;

        let offset = this.headPadding;
        let offsetX = 0;
        this._cellsOffset = new Array<number>(dataLen);
        this._cellsSize = new Array<number>(dataLen);
        this._cellsXOffset = new Array<number>(dataLen);
        this._cellsXSize = new Array<number>(dataLen);
        let colNum = 0;
        for (let i = 0; i < dataLen; i++) {
            let name = liDa[i].prefabName || "";
            let size = this.getCellSize(name);
            let s;
            let x;
            if (this.direction == Direction.vertical) {
                s = size.height;
                x = size.width;
            } else {
                s = size.width;
                x = size.height;
            }
            //每一个item的高/宽值
            this._cellsSize[i] = s;
            //每一个item的宽/高值
            this._cellsXSize[i] = x;
            if (this.columns > 1) {
                //多列/行
                let col = i % this.columns;
                if (col === 0 && i !== 0) {
                    offset = s + (colNum == 0 ? 0 : this.spacing) + offset;
                    colNum++;
                }
                this._cellsXSize[i] = col * x;
                this._cellsOffset[i] = offset + s;
                if (i + 1 == dataLen) {
                    //最后一个要算一行
                    offset += s;
                }
            } else {
                //单列/行
                offset = s + (colNum == 0 ? 0 : this.spacing) + offset;
                colNum++;
                this._cellsXSize[i] = 0;
                this._cellsOffset[i] = offset;
            }
        }
        offset += this.bottomPadding;

        let thisNodeUI = this.node.getComponent(UITransform)!;
        let contentUI = this._content.getComponent(UITransform)!;
        if (this.direction == Direction.vertical) {
            contentUI.setContentSize(thisNodeUI.width, offset);
        } else {
            contentUI.setContentSize(offset, thisNodeUI.height);
        }

        // create visible cells
        const range = this._getActiveCellIndexRange();
        this._activeCellIndexRange = range;

        for (let i = range.x; i <= range.y; i++) {
            this._addCellView(i);
        }
    }
    private _refreshActiveCells() {
        // update current active cells with new scroll position
        const range = this._getActiveCellIndexRange();
        // check if any cell need update
        if (range.equals(this._activeCellIndexRange)) return;

        // recycle all out of range cell
        let i = 0;
        while (i < this._activeCellViews.length) {
            let cell = this._activeCellViews[i];
            if (cell.dataIndex < range.x || cell.dataIndex > range.y) {
                this._recycleCell(i);
            } else {
                i++;
            }
        }

        // add any not exist cell
        // !TODO: boost this part effecient
        for (let i = range.x; i <= range.y; i++) {
            let needadd = true;
            for (let j = 0; j < this._activeCellViews.length; j++) {
                if (this._activeCellViews[j].dataIndex == i) {
                    needadd = false;
                    break;
                }
            }

            if (needadd) this._addCellView(i);
        }

        // update current active cell range
        this._activeCellIndexRange = range;
    }

    /**
     * remove one active cell from _activeCellViews array
     * @param cellIndex index of active cell views array
     */
    private _recycleCell(cellIndex: number) {
        // !TODO: need store this cell in node pool
        let cell = this._activeCellViews[cellIndex];
        this._activeCellViews.splice(cellIndex, 1);
        cell.node.removeFromParent();
        cell.dataIndex = -1;

        if (!this._cellPools[cell.cellIdentifier]) {
            this._cellPools[cell.cellIdentifier] = new NodePool();
        }
        let pool = this._cellPools[cell.cellIdentifier];
        pool.put(cell.node);
    }

    private _getCellViewFromPool(id: string): InfiniteCell | null {
        if (!this._cellPools[id]) return null;
        let pool = this._cellPools[id];
        let cellNode = pool.get();
        if (!cellNode) return null;
        return cellNode.getComponent(InfiniteCell);
    }

    /**
     * Return vector2 for start and end cell index of current scroll position
     */
    private _getActiveCellIndexRange(): Vec2 {
        let startPos = this._scrollPosition;
        let thNoUI = this.node.getComponent(UITransform)!;
        let endPos = startPos + (this.direction == Direction.vertical ? thNoUI.height : thNoUI.width);
        let endV = this._getCellIndexOfPos(endPos) + (this.columns - 1) > this._cellsOffset.length - 1 ? this._getCellIndexOfPos(endPos) : this._getCellIndexOfPos(endPos) + (this.columns - 1);
        return new Vec2(this._getCellIndexOfPos(startPos), endV);
    }

    private _getCellIndexOfPos(pos: number): number {
        // !TODO: boost this function speed by using binary search
        for (let i = 0; i < this._cellsOffset.length; i++) {
            if (this._cellsOffset[i] >= pos) return i;
        }
        return this._cellsOffset.length - 1;
    }

    /**
     * Get cell top position by its index
     * @param idx Cell index
     */
    private _getCellPosOfIndex(idx: number): number {
        return this._cellsOffset[idx] - this._cellsSize[idx];
    }

    //每个cell的name名字
    private getCellIdentifer(data: InfiniteCellBaseData): string {
        if (data.prefabName) {
            return data.prefabName;
        }
        //传递的数据没有名字的时候，默认取第一个预制体
        let keys = Object.keys(this.prefabCell);
        let name = keys[0];
        return name;
    }

    //获取cell实体类
    private getCellView(data: InfiniteCellBaseData): InfiniteCell {
        let prefab;
        if (data.prefabName) {
            let nameArr = data.prefabName.split("/");
            let key = nameArr[nameArr.length - 1];
            prefab = this.prefabCell[key];
        } else {
            let keys = Object.keys(this.prefabCell);
            let name = keys[0];
            prefab = this.prefabCell[name];
        }
        if (!prefab) {
            console.log("没有对应名字的预支体");
            return null!;
        }
        let node = instantiate(prefab);
        return node.getComponent(InfiniteCell)!;
    }

    private _addCellView(dataIndex: number) {
        let ceDa = this.listData[dataIndex];
        let id = this.getCellIdentifer(ceDa);
        let cell = this._getCellViewFromPool(id);
        if (!cell) {
            cell = this.getCellView(ceDa);
            !cell && console.warn("预支体上没有绑定对应ts类:" + ceDa.prefabName);
            let ceUI = cell.addComponent(UITransform)!;
            ceUI.setAnchorPoint(0, 1);
            cell.cellIdentifier = id;
        }

        cell.dataIndex = dataIndex;
        cell.enabled = true;
        this._activeCellViews.push(cell)
        this._content.addChild(cell.node);

        let thNoUI = this.node.getComponent(UITransform)!;
        let cellUI = cell.node.getComponent(UITransform)!;
        if (this.direction == Direction.vertical) {
            let x = this.sidePadding.x + this._cellsXSize[cell.dataIndex];
            let y = (this._cellsOffset[cell.dataIndex] - this._cellsSize[cell.dataIndex]) * -1;
            cell.node.setPosition(x, y, 0);
            cellUI.setContentSize(thNoUI.width - this.sidePadding.x - this.sidePadding.y, this._cellsSize[dataIndex]);
        } else {
            let x = (this._cellsOffset[cell.dataIndex] - this._cellsSize[cell.dataIndex]);
            let y = (this.sidePadding.x + this._cellsXSize[cell.dataIndex]) * -1;
            cell.node.setPosition(x, y, 0);
            cellUI.setContentSize(this._cellsSize[dataIndex], thNoUI.height - this.sidePadding.x - this.sidePadding.y);
        }

        cell.dataIndex = dataIndex;
        this._updateCellContent(cell);
    }

    private _updateActiveCellContent() {
        this._activeCellViews.forEach(cell => {
            this._updateCellContent(cell);
        });
    }

    private _updateCellContent(cell: InfiniteCell) {
        if (!this.listData) {
            console.warn("缺少list类别数据");
            return;
        }
        let data = this.listData[cell.dataIndex];
        cell.updateContent(data);
    }
}
