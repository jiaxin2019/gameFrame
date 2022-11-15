/** IState 接口*/
export default interface IState {
    //方法在进入状态时执行；
    onEnter(): void;
    //方法在该状态下时执行；
    onUpdate(): void;
    //方法在退出该状态时执行。
    onExit(): void;
}

export const Time = {
    //怪物站立状态时间
    deltaTime: 10
}