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
        return 100; // Rate of movement of people (px/s)
    }

    get severity() {
        return 80; // Amount the virus will slow people down (%)
    }

    get infectionRate() {
        return 80; // Likelihood of infection (%)
    }

    get mortalityRate() {
        return 5; // Likelihood of death (%)
    }

    get asymptomaticPeriod() {
        return 5; // Period during which infected people show no symptoms (days)
    }

    get symptomaticPeriod() {
        return 10; // Period during which infected people have symptoms (days);
    }
}

export const config = new Config();
