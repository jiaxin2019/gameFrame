import FSM, { Parameter, StateType } from "./FSM";
import IState, { Time } from "./MonsterEnum";


/** 站立状态*/
export class IdleState implements IState {
    private manager: FSM = null!;
    private parameter: Parameter = null!;
    private timer: number = 0;

    public constructor(manager: FSM) {
        this.manager = manager;
        this.parameter = manager.parameter;
    }

    fight(): void {

    }

    public onEnter(): void {
        this.parameter.animator.setValue("走的动作属性", false);//停止走动画
        this.parameter.animator.setValue("站立的动作属性", true);//开始站立的动画
    }

    public onExit(): void {
        this.timer = 0;
    }

    public onUpdate(): void {
        this.timer += Time.deltaTime;
        if (this.timer >= this.parameter.idleTime) {
            this.manager.transitionState(StateType.Patrol);
        }
    }
}