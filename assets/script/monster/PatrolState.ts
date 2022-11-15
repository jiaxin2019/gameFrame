import { math, tween, v3, Vec3 } from "cc";
import FSM, { Parameter, StateType } from "./FSM";
import IState, { Time } from "./MonsterEnum";

/* 走状态 */
export class PatrolState implements IState {
    private manager: FSM = null!;
    private parameter: Parameter = null!;
    private patrolPosition: number = 0;

    public constructor(manager: FSM) {
        this.manager = manager;
        this.parameter = manager.parameter;
    }

    public onEnter(): void {
        this.parameter.animator.setValue("站立的动作属性", false);//停止站立动画
        this.parameter.animator.setValue("走的动作属性", true);//开始走的动画
    }

    public onExit(): void {
        this.patrolPosition++;
        if (this.patrolPosition >= this.parameter.patrolPoints.length) {
            this.patrolPosition = 0;
        }
    }

    public onUpdate(): void {
        let position = this.parameter.patrolPoints[this.patrolPosition];
        tween(this.manager.node).to(this.parameter.moveSpeed * Time.deltaTime, { position: position });

        if (math.Vec3.distance(this.manager.node.position, position) < 0.1) {
            this.manager.transitionState(StateType.Idle);
        }
    }
}