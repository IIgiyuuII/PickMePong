import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Component {
    @property(Label)
    scoreLabel: Label | null = null;

    leftScore = 0;
    rightScore = 0;

    addScore(side: 'left' | 'right') {
        if (side === 'left') this.leftScore++;
        else this.rightScore++;

        this.updateLabel();
    }

    updateLabel() {
        if (this.scoreLabel) {
            this.scoreLabel.string = `${this.leftScore} : ${this.rightScore}`;
        }
    }
}
