import Stage from './Stage';
import Person from './Person';
import { config } from './Config';

let stage = null;

function start() {
    console.log('starting');
    if (stage) {
        stage.endAnimation();
    }
    stage = new Stage(document.getElementById('pandemic-canvas'));
    stage.add([...Array(config.population)].map(item => new Person(stage.width, stage.height)));
    stage.animate();
}

start();
document.getElementById('start-button').onclick = start;