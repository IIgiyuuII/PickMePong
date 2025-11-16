import { _decorator, Component, Node, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Particle')
export class Particle extends Component {

    @property(Node)
    ball: Node | null = null;           // ссылка на мяч

    @property(Node)
    innerFire: Node | null = null;      // яркий слой частиц

    @property(Node)
    outerFire: Node | null = null;      // тусклый слой частиц

    start() {
        // Запускаем частицы
        if (this.innerFire) {
            const ps1 = this.innerFire.getComponent(ParticleSystem);
            ps1?.resetSystem();
        }
        if (this.outerFire) {
            const ps2 = this.outerFire.getComponent(ParticleSystem);
            ps2?.resetSystem();
        }
    }

    update(deltaTime: number) {
        if (!this.ball) return;

        // Обновляем позицию частиц на мяч
        if (this.innerFire) this.innerFire.position = this.ball.position;
        if (this.outerFire) this.outerFire.position = this.ball.position;
    }
}
