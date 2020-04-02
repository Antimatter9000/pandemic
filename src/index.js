import Stage from './Stage';
import Person from './Person';
import { config } from './Config';

let stage = null;

function start() {
    if (stage) {
        stage.endAnimation();
    }
    stage = new Stage(document.getElementById('pandemic-canvas'));
    stage.add([...Array(config.population)].map(item => new Person(stage.width, stage.height)));
    stage.animate();
}

if (!window.location.search.includes('hideControls=true')) {
    document.getElementById('controls').classList.remove('hidden');
    document.getElementById('results').classList.remove('hidden');
}

start();
document.getElementById('start-button').onclick = start;