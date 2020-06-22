import { config } from './Config';

export default class Curve {
    constructor(canvas) {
        this.el = canvas;
        this.ctx = this.el.getContext('2d');
        this.points = [];
    }

    addPoint(day, infected) {
        this.points.push({day, infected})
    }

    update(day, infected) {
        // curve shows infections/day
        this.addPoint(day, infected);

        this.ctx.clearRect(0, 0, 100, 60);
        if (this.points.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, 60);
            this.ctx.strokeStyle = 'yellow';
            this.points.forEach(point => {
                const height = (point.infected/100) * 60;
                this.ctx.lineTo(point.day, 60 - height);
            });
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
}