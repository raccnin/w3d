import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('threeCanvas');
const canvasContainer = document.getElementById('canvasContainer');
var width = canvasContainer.offsetWidth - 40, height = window.innerHeight - 180;

const scene = new THREE.Scene();
scene.background = new THREE.Color(toHex(drink_data['colour']));

const camera = new THREE.PerspectiveCamera(75, width/height , 0.1, 1000);
camera.position.y = 0;
camera.position.z = 4;
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(width, height);

window.addEventListener('resize', onResize, false);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;

// button functionality
const wireframeToggle = document.getElementById("wireframeToggle");
wireframeToggle.addEventListener('click', toggleWireframe, false);

const rotateToggle = document.getElementById("rotationToggle");
rotateToggle.addEventListener('click', () => {controls.autoRotate = !controls.autoRotate})

const animationBtn = document.getElementById("animateButton");
animationBtn.addEventListener('click', animate);
const sound_effect = new Audio(drink_data['sound_path']);

const loader = new GLTFLoader();

var mixer;
var open = false;
const actions = [];
loader.load(drink_data['model_path'], 
	function (gltf){
		const model_scene = gltf.scene;
		scene.add(model_scene);
		mixer = new THREE.AnimationMixer(model_scene);
		gltf.animations.forEach(clip => {
			let action = mixer.clipAction(clip);
			action.setLoop(THREE.LoopOnce);
			action.clampWhenFinished = true;
			actions.push(action);
		})
	}, 
	undefined, 
	function (error) {
		console.error(error)
	})

var lights = [];
const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(0, 1, 2);

const ambientLight = new THREE.HemisphereLight(0xffffff);

lights.push(directionalLight, ambientLight);

lights.forEach((light) => {scene.add(light)})

const clock = new THREE.Clock();

function animationLoop(){
	controls.update();
	
	// perform transforms
	if (mixer) {
		mixer.update(clock.getDelta());
	}

	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animationLoop);

function onResize() {
	width = canvasContainer.offsetWidth;
	height = canvasContainer.offsetHeight;
	renderer.setSize(width, height);
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
}

function toHex(s) {
	return parseInt(s, 16);
}

function toggleWireframe() {
	scene.traverse((child) => {
		if (child instanceof(THREE.Mesh)){
			child.material.wireframe = !child.material.wireframe;
		}
	})
}

function animate() {
	// perform animation
	if (!open) {
		actions.forEach(action => {action.stop()});
		actions.forEach(action => {action.timeScale = 1});
		animationBtn.innerHTML = 'Close Me!';
		
		// pause then play sound if playing
		sound_effect.pause();
		sound_effect.currentTime = 0;
		sound_effect.play();
		open = true;
	} else {
		actions.forEach(action => {action.paused = false});
		actions.forEach(action => {action.timeScale = -1});
		animationBtn.innerHTML = 'Open Me!';

		sound_effect.pause();
		sound_effect.currentTime = 0;
		open = false;
	}
	actions.forEach(action => {action.play()});
}