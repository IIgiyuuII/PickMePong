import { _decorator, Component, input, Input, EventMouse, EventTouch, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PaddleSwipe')
export class PaddleSwipe extends Component {
    @property
    boundY: number = 300;

    @property
    sensitivity: number = 1.0; // чувствительность свайпа

    private isDragging: boolean = false;
    private lastY: number = 0; // последняя позиция курсора/пальца
    private targetY: number = 0; // куда хотим переместить падл

    onLoad() {
        // Поддержка мыши
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

        // Поддержка касаний
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // === МЫШЬ ===
    onMouseDown(event: EventMouse) {
        this.isDragging = true;
        this.lastY = event.getLocationY();
    }

    onMouseMove(event: EventMouse) {
        if (!this.isDragging) return;
        const deltaY = (event.getLocationY() - this.lastY) * this.sensitivity;
        this.movePaddle(deltaY);
        this.lastY = event.getLocationY();
    }

    onMouseUp(event: EventMouse) {
        this.isDragging = false;
    }

    // === ТАЧ ===
    onTouchStart(event: EventTouch) {
        this.isDragging = true;
        const touch = event.getLocation();
        this.lastY = touch.y;
    }

    onTouchMove(event: EventTouch) {
        if (!this.isDragging) return;
        const touch = event.getLocation();
        const deltaY = (touch.y - this.lastY) * this.sensitivity;
        this.movePaddle(deltaY);
        this.lastY = touch.y;
    }

    onTouchEnd(event: EventTouch) {
        this.isDragging = false;
    }

    // === Движение падла ===
    movePaddle(deltaY: number) {
        let pos = this.node.position;
        let newY = pos.y + deltaY * (720 / view.getVisibleSize().height); // нормализуем под экран

        // Ограничиваем движение
        newY = Math.min(Math.max(newY, -this.boundY), this.boundY);

        this.node.setPosition(new Vec3(pos.x, newY, pos.z));
    }

    onDestroy() {
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }
}
