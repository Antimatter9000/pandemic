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

    get population() {
        return 1000; // number of people (#)
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
        return document.getElementById('speed').value
            ? parseInt(document.getElementById('speed').value)
            : 100;
    }

    get severity() {
        // Amount the virus will slow people down (%)
        return document.getElementById('severity').value
            ? parseInt(document.getElementById('severity').value)
            : 80;
    }

    get infectionRate() {
        // Likelihood of infection (%)
        return document.getElementById('infection-rate').value
            ? parseInt(document.getElementById('infection-rate').value)
            : 80;
    }

    get mortalityRate() {
        // Likelihood of death (%)
        return document.getElementById('mortality-rate').value
            ? parseInt(document.getElementById('mortality-rate').value)
            : 5;
    }

    get asymptomaticPeriod() {
        // Period during which infected people show no symptoms (days)
        return document.getElementById('mortality-rate').value
            ? parseInt(document.getElementById('mortality-rate').value)
            : 5;
    }

    get symptomaticPeriod() {
        // Period during which infected people have symptoms (days);
        return document.getElementById('mortality-rate').value
            ? parseInt(document.getElementById('mortality-rate').value)
            : 10;
    }
}

export const config = new Config();
