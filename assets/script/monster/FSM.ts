import { animation, Component, Vec3 } from "cc";
import { Dictionary } from "../common/Dictionary";
import { IdleState } from "./IdleState";
import IState from "./MonsterEnum";
import { PatrolState } from "./PatrolState";

/**
 * enum StateType
 */
export enum StateType {
    //站立
    Idle,
    //跑路
    Patrol
}

/**
 * Paramater 
 * 怪物包含的参数
 */
export interface Parameter {
    //行走的速度
    moveSpeed: number;
    //站立的时间
    idleTime: number;
    //行走的点
    patrolPoints: Vec3[];
    //动作控制，这里使用的3D最新的玩偶动画
    animator: animation.AnimationController;
}

/* 怪物的有限状态机FSM */
export default class FSM extends Component {
    public parameter: Parameter = null!;

    private currentState: IState = null!;
    private states: Dictionary<StateType, IState> = new Dictionary<StateType, IState>();

    start(): void {
        this.states.add(StateType.Idle, new IdleState(this));
        this.states.add(StateType.Patrol, new PatrolState(this));

        this.transitionState(StateType.Idle);
    }

    update(): void {
        this.currentState.onUpdate();
    }

    public transitionState(type: StateType): void {
        if (this.currentState != null) {
            this.currentState.onExit();
        }
        this.currentState = this.states.tryGetValue(type);
        this.currentState.onEnter();
    }
}