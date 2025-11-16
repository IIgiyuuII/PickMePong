import { _decorator, Component, Node, Label } from 'cc';
import { ScoreManager } from './ScoreManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    gameOverPanel: Node | null = null;

    @property(Label)
    winnerLabel: Label | null = null;

    @property(Node)
    ball: Node | null = null;

    @property(Node)
    paddleLeft: Node | null = null;

    @property(Node)
    paddleRight: Node | null = null;

    @property(ScoreManager)
    scoreManager: ScoreManager | null = null;

    maxScore = 2;
    isGameOver = false;

    start() {
        // Прячем панель
        if (this.gameOverPanel)
            this.gameOverPanel.active = false;
    }

    update(dt: number) {
        if (this.isGameOver) return;

        if (!this.scoreManager) return;

        if (this.scoreManager.leftScore >= this.maxScore) {
            this.endGame("Игрок 1");
        }
        if (this.scoreManager.rightScore >= this.maxScore) {
            this.endGame("Игрок 2");
        }
    }

    endGame(winner: string) {
        this.isGameOver = true;

        // Остановить мяч
        if (this.ball) {
            const ballComp = this.ball.getComponent('Ball');
            if (ballComp) {
                ballComp.speed = 0;
            }
        }

        // Показать панель
        if (this.gameOverPanel) this.gameOverPanel.active = true;

        if (this.winnerLabel)
            this.winnerLabel.string = `Победитель: ${winner}`;
    }

    public onNewGame() {
        this.isGameOver = false;

        // Спрятать панель
        if (this.gameOverPanel) this.gameOverPanel.active = false;

        // Сброс счета
        if (this.scoreManager) {
            this.scoreManager.leftScore = 0;
            this.scoreManager.rightScore = 0;
            this.scoreManager.updateLabel();
        }

        // Сброс мяча
        if (this.ball) {
            const ballComp = this.ball.getComponent('Ball');
            if (ballComp) ballComp.resetBall();
        }

        // Вернуть скорость мяча
        if (this.ball) {
            const ballComp = this.ball.getComponent('Ball');
            if (ballComp) ballComp.speed = 300;
        }
    }
}
