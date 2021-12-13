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
            this.points.slice(-100).forEach((point, i) => {
                const height = (point.infected/100) * 60;
                this.ctx.lineTo(i + 1, 60 - height);
            });
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    get completeImage() {
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = 1200;
        finalCanvas.height = 628;
        const finalCTX = finalCanvas.getContext('2d');
        
        // background
        finalCTX.fillStyle = '#224';
        finalCTX.fillRect(0, 0, 1200, 628);

        // draw axes
        finalCTX.beginPath();
        finalCTX.strokeStyle = '#ccc';
        finalCTX.moveTo(40, 40);
        finalCTX.lineTo(40, 588);
        finalCTX.lineTo(1160, 588);
        finalCTX.lineWidth = 3;
        finalCTX.stroke();
        finalCTX.closePath();

        // draw points
        const MIN_DAYS = 30;
        const dayWidth = Math.floor(1120/Math.max(MIN_DAYS, this.points.length));
        finalCTX.beginPath();
        finalCTX.strokeStyle = 'yellow';
        finalCTX.moveTo(40, 588);
        this.points.forEach(point => {
            const height = (point.infected/100) * (588-40);
            finalCTX.lineTo(
                (point.day * dayWidth) + 40,
                588 - height
            );
        });
        finalCTX.lineWidth = 2;
        finalCTX.stroke();
        finalCTX.closePath();

        return finalCanvas.toDataURL('image/png');
    }
}