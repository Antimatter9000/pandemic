export const STAGES = {
    unaffected: 0,
    infected: 1,
    symptomatic: 2,
    immune: 3,
    dead: 4
};

export const COLOURS = {
    0: '#ccc',
    1: 'orange',
    2: 'red',
    3: '#ccf',
    4: 'black'
};

class Config {
    constructor() {
        this.fps = 60;
        this.infectiousRange = {
            min: 1,
            max: 2
        }
    }

    getVal(id, defaultVal) {
        const val = document.getElementById(id).value;
        return val
            ? (typeof val === 'string' ? parseInt(val) : val)
            : defaultVal;
    }

    get population() {
        // number of people (#)
        return this.getVal('initial-population', 100);
    }

    get particleRadius() {
        return 5;
    }

    get costOfLiving() {
        return 100; // daily cost of living per person
    }

    get dailyIncome() {
        return 150; // daily income of person at max movement
    }

    get dayLength() {
        return 1000; // ms
    }

    get populationSpeed() {
        // Rate of movement of people (px/s)
        return this.getVal('speed', 100);
    }

    get severity() {
        // Amount the virus will slow people down (%)
        return this.getVal('severity', 80);
    }

    get infectionRate() {
        // Likelihood of infection (%)
        return this.getVal('infection-rate', 80);
    }

    get mortalityRate() {
        // Likelihood of death (%)
        return this.getVal('mortality-rate', 5);
    }

    get asymptomaticPeriod() {
        // Period during which infected people show no symptoms (days)
        return this.getVal('asymptomatic-period', 5);
    }

    get symptomaticPeriod() {
        // Period during which infected people have symptoms (days);
        return this.getVal('symptomatic-period', 10);
    }
}

export const config = new Config();
