import { _decorator, Component, Node, Vec3, UITransform, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {

    @property
    speed = 600;

    @property(Node)
    paddleLeft: Node | null = null;

    @property(Node)
    paddleRight: Node | null = null;

    @property(Node)
    scoreManager: Node | null = null;

    // ==== ЗВУКИ ====
    @property({ type: AudioSource })
    audioSource: AudioSource | null = null;

    @property({ type: AudioClip })
    hitPaddleSfx: AudioClip | null = null;

    @property({ type: AudioClip })
    hitWallSfx: AudioClip | null = null;

    @property({ type: AudioClip })
    goalSfx: AudioClip | null = null;


    direction = new Vec3(1, 1, 0);
    ballRadius = 10;
    fieldWidth = 1280;
    fieldHeight = 680;

    start() {
        this.resetBall();
    }

    update(dt: number) {
        let pos = this.node.position;

        pos.x += this.direction.x * this.speed * dt;
        pos.y += this.direction.y * this.speed * dt;

        // ==== Верх / Низ ====
        const halfHeight = this.fieldHeight / 2 - this.ballRadius;
        if (pos.y > halfHeight || pos.y < -halfHeight) {
            this.direction.y *= -1;

            // Звук стены
            if (this.audioSource && this.hitWallSfx) {
                this.audioSource.playOneShot(this.hitWallSfx);
            }

            pos.y = Math.min(Math.max(pos.y, -halfHeight), halfHeight);
        }

        // ==== Столкновения с падлами ====
        if (this.paddleLeft && this.checkCollision(this.paddleLeft, pos, 1)) {
            this.direction.x = 1;

            if (this.audioSource && this.hitPaddleSfx) {
                this.audioSource.playOneShot(this.hitPaddleSfx);
            }
        }

        if (this.paddleRight && this.checkCollision(this.paddleRight, pos, -1)) {
            this.direction.x = -1;

            if (this.audioSource && this.hitPaddleSfx) {
                this.audioSource.playOneShot(this.hitPaddleSfx);
            }
        }

        // ==== ГОЛ ====
        const halfWidth = this.fieldWidth / 2;

        if (pos.x < -halfWidth - this.ballRadius) {
            this.onScore('right');
        }
        else if (pos.x > halfWidth + this.ballRadius) {
            this.onScore('left');
        }

        this.node.setPosition(pos);
    }

    checkCollision(paddle: Node, ballPos: Vec3, directionX: number): boolean {
        const paddlePos = paddle.position;
        const paddleSize = paddle.getComponent(UITransform);
        if (!paddleSize) return false;

        const halfW = paddleSize.width / 2;
        const halfH = paddleSize.height / 2;

        const left = paddlePos.x - halfW;
        const right = paddlePos.x + halfW;
        const top = paddlePos.y + halfH;
        const bottom = paddlePos.y - halfH;

        if (
            ballPos.x + this.ballRadius > left &&
            ballPos.x - this.ballRadius < right &&
            ballPos.y + this.ballRadius > bottom &&
            ballPos.y - this.ballRadius < top
        ) {
            ballPos.x = paddlePos.x + (directionX * (halfW + this.ballRadius + 1));
            return true;
        }
        return false;
    }

    onScore(side: 'left' | 'right') {

        // Звук гола
        if (this.audioSource && this.goalSfx) {
            this.audioSource.playOneShot(this.goalSfx);
        }

        // Сообщаем ScoreManager
        if (this.scoreManager) {
            const manager = this.scoreManager.getComponent('ScoreManager');
            if (manager) manager.addScore(side);
        }


        this.resetBall(side);
    }

    resetBall(lastScored?: 'left' | 'right') {
        this.node.setPosition(new Vec3(0, 0, 0));

        const dirX =
            lastScored === 'left' ? 1 :
            lastScored === 'right' ? -1 :
            Math.random() < 0.5 ? -1 : 1;

        const dirY = Math.random() < 0.5 ? -1 : 1;

        this.direction.set(dirX, dirY, 0);
    }
}
