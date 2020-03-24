import { config, STAGES } from './Config';

export default class Stage {
    constructor(canvasEl) {
        this.ctx = canvasEl.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        this.day = 0;
        this.income = 0;
        this.outgoings = 0;
        this.frameLength = 1000/config.fps;
    }

    add(people) {
        this.people = people;
    }

    animate() {
        let iteration = 0;
        const animation = setInterval(() => {
            this.ctx.clearRect(0, 0, this.width, this.height)
            this.calculateDay(iteration);
            this.calculateCosts();
            this.handlePeople();
            iteration++;
            if (iteration % 60 === 0) {
                console.log(`Day ${this.day}`);
                console.log(`Dead: ${this.people.filter(person => person.stage === STAGES.dead).length}`);
                console.log(`Alive: ${this.people.filter(person => person.stage !== STAGES.dead).length}`);
                console.log(`Immune: ${this.people.filter(person => person.stage === STAGES.immune).length}`);
            }
            if (this.people.filter(person => person.isInfectious).length < 1) {
                console.log('COMPLETE');
                clearInterval(animation);
            }
        }, this.frameLength);
    }

    calculateDay(i) {
        const msPassed = i * this.frameLength;
        this.day = Math.floor(msPassed/config.dayLength);
    }

    calculateCosts() {
        const { costOfLiving, fps } = config;
        this.outgoings += this.people.length * (costOfLiving/fps);
    }

    handlePeople() {
        this.people.forEach(person => {
            if (person.stage !== STAGES.dead) {
                person.progressStages();
                person.move(this.width, this.height);
                this.income += person.income/config.fps;
                person.handleInteractions(this.people);
                person.draw(this.ctx);
            }
        });
    }
}
