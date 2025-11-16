import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PaddleRight')
export class PaddleRight extends Component {
    @property(Node)
    ball: Node | null = null;

    @property
    speed: number = 400;

    update(dt: number) {
        if (!this.ball) return;

        const pos = this.node.position;
        const targetY = this.ball.position.y;
        const diff = targetY - pos.y;

        // простое "следование"
        const step = Math.sign(diff) * this.speed * dt;
        pos.y += Math.abs(diff) < Math.abs(step) ? diff : step;

        // ограничение по экрану
        pos.y = Math.min(260, Math.max(-260, pos.y));
        this.node.setPosition(pos);
    }
}
