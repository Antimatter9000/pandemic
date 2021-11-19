import { addCommas } from 'scrapyard';
import { config, STAGES } from './Config';

export default class Stage {
    constructor(canvasEl, curve) {
        this.curve = curve;
        this.ctx = canvasEl.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        this.day = 0;
        this.infected = 0;
        this.income = 0;
        this.outgoings = 0;
        this.frameLength = 1000/config.fps;

        this.people = [];
        this.complete = false;
    }

    get funds() {
        return Math.floor(this.income - this.outgoings)
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
            this.updateValues();
            this.updateDOM();
            iteration++;
            if (this.people.filter(person => person.isInfectious).length < 1) {
                this.complete = true;
                const message = this.getCompleteMessage();
                const image = this.getImage();
                if (!window.location.search.includes('preview=true')) {
                    this.showModal(message);
                }
                window.parent.postMessage({ action: 'updateData', image, message }, '*');
                clearInterval(this.animation);
            }
        }, this.frameLength);
    }

    getCompleteMessage() {
        let message = 'The virus has run its course. ';
        const totalInfected = (this.people.filter(person => (
            person.stage !== STAGES.unaffected
        )).length/this.people.length) * 100;
        message += `${Math.round(totalInfected)}% of the population got infected. `;
        const totalDead = (this.people.filter(person => (
            person.stage === STAGES.dead
        )).length/this.people.length) * 100;
        message += `${totalDead}% of the population died. `;
        message += this.funds < 0 ? 'The economy is ruined.' : 'The economy survived.';
        return message;
    }

    getImage() {
        return this.curve.el.toDataURL('image/jpeg', 1.0);
    }

    showModal(message) {
        document.getElementById('complete-modal-wrapper').classList.add('visible');
        document.getElementById('complete-modal-message').textContent = message;
    }

    endAnimation() {
        window.parent.postMessage({ action: 'updateData', image }, '*');
        clearInterval(this.animation);
    }

    calculateDay(i) {
        const msPassed = i * this.frameLength;
        const savedDay = this.day;
        const realDay = Math.floor(msPassed/config.dayLength);
        if (realDay !== savedDay) {
            this.day += realDay - savedDay;
            if (!this.complete) {
                this.curve.update(this.day, this.infected);
            }
        }
    }

    calculateCosts() {
        const { costOfLiving, fps } = config;
        this.outgoings += this.people.length * (costOfLiving/fps);
    }

    handlePeople() {
        this.people.forEach(person => {
            if (person.stage !== STAGES.dead) {
                person.progressStages(this.day);
                person.getDistance(this.width, this.height);
                const maxIncomePerFrame = person.income/config.fps;
                const relativeDistance = person.distance/person.maxDistance;
                this.income += maxIncomePerFrame * relativeDistance;
                person.handleInteractions(this.people, this.day);
                person.move();
            }
            person.draw(this.ctx);
        });
    }

    updateValues() {
        this.infected = this.people.filter(person => person.isInfectious).length;
    }

    updateDOM() {
        this.updateEl('day', this.day);
        this.updateEl('population', this.people.filter(person => person.stage !== STAGES.dead).length);
        this.updateEl('infected', this.infected);
        this.updateEl('immune', this.people.filter(person => person.stage === STAGES.immune).length);
        this.updateEl('dead', this.people.filter(person => person.stage === STAGES.dead).length);
        this.updateEl('funds', addCommas(this.funds));
    }

    updateEl(id, val) {
        document.getElementById(id).innerText = val;
    }
}
