import { config, STAGES, COLOURS } from './Config';

function toRad(angle) {
    return angle * (Math.PI/180);
}

const diameter = config.particleRadius * 2;

function getAssets() {
    return Object.keys(STAGES).reduce((obj, stage) => {
        const img = new Image(diameter, diameter);
        img.src = `/images/pandemic/${stage}.png`;
        return {
            ...obj,
            [STAGES[stage]]: img
        }
    }, {});
}

const ASSETS = getAssets();

export default class Person {
    constructor(stageWidth, stageHeight, infected) {
        const diceRoll = Math.random() * 100;
        this.stage = (diceRoll < 1) || infected
            ? (this.startSymptomsTime = new Date(
                Date.now() + (config.asymptomaticPeriod * config.dayLength)
            ), STAGES.infected)
            : STAGES.unaffected;
        this.radius = config.particleRadius;
        this.x = Math.random() * stageWidth;
        this.y = Math.random() * stageHeight;
        this.direction = Math.random() * 360;

        const maxSpeed = this.speed;
        this.maxDistance = this.speed/config.fps;
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

    getDistance(stageWidth, stageHeight) {
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
    }

    move() {
        this.x += this.xDistance;
        this.y += this.yDistance;
    }

    handleInteractions(otherPeople) {
        if (this.stage === STAGES.unaffected) {
            otherPeople.forEach(otherPerson => {
                handleSymptomatic.call(this, otherPerson);
                handleInfectious.call(this, otherPerson);
            });
        }

        function handleSymptomatic(otherPerson) {
            if (otherPerson.stage === STAGES.symptomatic) {
                const xDistance2Other = otherPerson.x - this.x;
                const yDistance2Other = Math.abs(otherPerson.y - this.y);
                const distance2Other = Math.sqrt((xDistance2Other ** 2) + (yDistance2Other ** 2));
                const repulsion = distance2Other - config.socialDistance < 0
                    ? (Math.abs(distance2Other - config.socialDistance)/config.socialDistance) * config.severity
                    : 0;

                if (repulsion > 0) {
                    repelX.call(this, otherPerson, repulsion, xDistance2Other);
                    repelY.call(this, otherPerson, repulsion, yDistance2Other);
                }
            }

            function repelX(otherPerson, repulsion, xDistance2Other) {
                const maxXDistance = this.maxDistance * Math.cos(toRad(90) - toRad(this.direction));
                const xRepulsionEffect = maxXDistance * (repulsion/100);
                this.xDistance = xDistance2Other > 0 // the infected person is to the right
                    ? this.xDistance - xRepulsionEffect
                    : this.xDistance + xRepulsionEffect;
            }

            function repelY(otherPerson, repulsion, yDistance2Other) {
                const maxYDistance = this.distance * Math.cos(toRad(this.direction));
                const yRepulsionEffect = maxYDistance * (repulsion/100);
                this.yDistance = yDistance2Other > 0
                    ? this.yDistance - yRepulsionEffect
                    : this.yDistance + yRepulsionEffect;
            }
        }

        function handleInfectious(otherPerson) {
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
        }
    }

    draw(ctx) {
        ctx.drawImage(ASSETS[this.stage], this.x - config.particleRadius, this.y - config.particleRadius, diameter, diameter);
    }
}