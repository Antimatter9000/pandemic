import { addCommas } from 'scrapyard';
import { config, STAGES } from './Config';

console.log(addCommas);

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

        this.people = [];
    }

    add(people) {
        const peopleArr = people.length ? people : [people];
        this.people = [...this.people, ...peopleArr];
    }

    animate() {
        let iteration = 0;
        this.animation = setInterval(() => {
            this.ctx.clearRect(0, 0, this.width, this.height)
            this.calculateDay(iteration);
            this.calculateCosts();
            this.handlePeople();
            this.updateDOM();
            iteration++;
            if (this.people.filter(person => person.isInfectious).length < 1) {
                console.log('COMPLETE');
            }
        }, this.frameLength);
    }

    endAnimation() {
        clearInterval(this.animation)
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
                person.getDistance(this.width, this.height);
                this.income += person.income/config.fps;
                person.handleInteractions(this.people);
                person.move();
            }
            person.draw(this.ctx);
        });
    }

    updateDOM() {
        this.updateEl('day', this.day);
        this.updateEl('population', this.people.filter(person => person.stage !== STAGES.dead).length);
        this.updateEl('infected', this.people.filter(person => person.stage >= STAGES.infected).length);
        this.updateEl('immune', this.people.filter(person => person.stage === STAGES.immune).length);
        this.updateEl('dead', this.people.filter(person => person.stage === STAGES.dead).length);
        this.updateEl('funds', addCommas(Math.floor(this.income - this.outgoings)));
    }

    updateEl(id, val) {
        document.getElementById(id).innerText = val;
    }
}
