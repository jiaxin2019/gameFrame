declare module "cc" {
    export class RenderFlowExtro extends RenderFlow {
        static FLAG_DONOTHING: number;
        static FLAG_BREAK_FLOW: number;
        static FLAG_LOCAL_TRANSFORM: number;
        static FLAG_WORLD_TRANSFORM: number;
        static FLAG_TRANSFORM: number;
        static FLAG_UPDATE_RENDER_DATA: number;
        static FLAG_OPACITY: number;
        static FLAG_COLOR: number;
        static FLAG_OPACITY_COLOR: number;
        static FLAG_RENDER: number;
        static FLAG_CHILDREN: number;
        static FLAG_POST_RENDER: number;
        static FLAG_FINAL: number;

        static flows: any;

        _doNothing(): void;
        _localTransform(): void;
        _worldTransform(): void;
        _opacity(): void;
        _color(): void;
        _updateRenderData(): void;
        _render(): void;
        _children(): void;
        _postRender(): void;
    }

    export interface Node {
        _renderFlag: number;
        _dirtyRenderFlag: number;
    }

    export interface Camera {
        position: Vec3;
        render(node?: any): void;
    }

    export interface RenderableComponent {
        markForRender(shouldRender: boolean): void;
    }
}