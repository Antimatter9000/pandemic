import { config, STAGES, COLOURS } from './Config';

function toRad(angle) {
    return angle * (Math.PI/180);
}

export default class Person {
    constructor(stageWidth, stageHeight) {
        const diceRoll = Math.random() * 100;
        this.stage = diceRoll < 1
            ? (this.startSymptomsTime = new Date(
                Date.now() + (config.asymptomaticPeriod * config.dayLength)
            ), STAGES.infected)
            : STAGES.unaffected;
        this.radius = 1.5;
        this.x = Math.random() * stageWidth;
        this.y = Math.random() * stageHeight;
        this.direction = Math.random() * 360;
    }

    get speed() {
        return this.stage === STAGES.symptomatic
            ? config.populationSpeed - (config.populationSpeed * (config.severity/100))
            : config.populationSpeed;
    }

    get isInfectious() {
        return this.stage >= config.infectiousRange.min
            && this.stage <= config.infectiousRange.max;
    }

    get income() {
        return this.stage === STAGES.symptomatic || this.stage === STAGES.dead
            ? 0
            : config.dailyIncome
    }

    progressStages() {
        const now = new Date();
        switch (this.stage) {
            case STAGES.infected:
                if (now >= this.startSymptomsTime) {
                    this.stage = STAGES.symptomatic;
                    this.endSymptomsTime = new Date(
                        Date.now() + (config.symptomaticPeriod * config.dayLength)
                    );
                }
                break;
            case STAGES.symptomatic:
                if (now >= this.endSymptomsTime) {
                    this.endSymptoms();
                }
                break;
            default:
                break;
        }
    }

    endSymptoms() {
        const diceRoll = Math.random() * 100;
        if (diceRoll <= config.mortalityRate) {
            this.stage = STAGES.dead;
        } else {
            this.stage = STAGES.immune;
        }
    }

    move(stageWidth, stageHeight) {
        let walls = {
            upper: 0,
            right: stageWidth,
            lower: stageHeight,
            left: 0
        };

        if(this.y < walls.upper + this.radius) {
            this.y = walls.upper + this.radius + 1;
            this.direction = 180 - this.direction;
        } else if(this.x > walls.right - this.radius) {
            this.x = walls.right - this.radius - 1;
            this.direction = 360 - this.direction;
        } else if(this.y > walls.lower - this.radius) {  
            this.y = walls.lower - this.radius - 1;
            this.direction = 360 - (180 + this.direction);
        } else if(this.x < walls.left + this.radius) {
            this.x = walls.left + this.radius + 1;
            this.direction = 360 - this.direction;
        }

        this.distance = this.speed/config.fps;
        this.xDistance = this.distance * Math.cos(toRad(90) - toRad(this.direction));
        this.yDistance = this.distance * Math.cos(toRad(this.direction));

        this.x += this.xDistance;
        this.y += this.yDistance;
    }

    handleInteractions(otherPeople) {
        if (this.stage === STAGES.unaffected) {
            otherPeople.forEach(otherPerson => {
                if (otherPerson.isInfectious
                    && (otherPerson.x >= this.x - 10 && otherPerson.x <= this.x + 10)
                    && (otherPerson.y >= this.y - 10 && otherPerson.y <= this.y + 10)
                ) {
                    const diceRoll = Math.random() * 100;
                    if (diceRoll <= config.infectionRate) {
                        this.stage = STAGES.infected;
                        this.startSymptomsTime = new Date(
                            Date.now() + (config.asymptomaticPeriod * config.dayLength)
                        );
                    }
                }
            });
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
        ctx.fillStyle = COLOURS[this.stage];
        ctx.fill();
        ctx.closePath();
    }
}