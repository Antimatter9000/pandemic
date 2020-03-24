import Stage from './Stage';
import Person from './Person';
import { config } from './Config';

const stage = new Stage(document.getElementById('pandemic-canvas'));
stage.add([...Array(config.population)].map(item => new Person(stage.width, stage.height)));
stage.animate();