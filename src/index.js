import Stage from './Stage';
import Curve from './Curve';
import Person from './Person';
import { config } from './Config';
import './style.css';

let stage = null;

function start() {
    document.getElementById('controls').classList.remove('visible');
    document.getElementById('complete-modal-wrapper').classList.remove('visible');
    if (stage) {
        stage.endAnimation();
    }
    const curve = new Curve(document.getElementById('curve'));
    stage = new Stage(document.getElementById('pandemic-canvas'), curve);
    stage.add([...Array(config.population - 1)].map(item => new Person(stage.width, stage.height, false)));
    stage.add(new Person(stage.width, stage.height, true));
    stage.animate();
}

function setupInputListener(id) {
    document.getElementById(id).oninput = e => {
        document.getElementById(`${id}-value`).textContent = e.target.value;
    }
}

if (!window.location.search.includes('hideControls=true')) {
    document.getElementById('controls').classList.remove('hidden');
    document.getElementById('results').classList.remove('hidden');
}


setupInputListener('initial-population');
setupInputListener('speed');
setupInputListener('infection-rate');
setupInputListener('mortality-rate');
setupInputListener('severity');
setupInputListener('asymptomatic-period');
setupInputListener('symptomatic-period');
setupInputListener('social-distance');

document.getElementById('controls-toggle').onclick = () => {
    document.getElementById('results').classList.remove('visible');
    document.getElementById('controls').classList.toggle('visible');
}

document.getElementById('results-toggle').onclick = () => {
    document.getElementById('results').classList.toggle('visible');
    document.getElementById('controls').classList.remove('visible');
}

start();
document.getElementById('start-button').onclick = start;
document.getElementById('restart-button').onclick = start;


