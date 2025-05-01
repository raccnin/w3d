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

// button functionality
const wireframeToggle = document.getElementById("wireframeToggle");
wireframeToggle.addEventListener('click', toggleWireframe, false);

var rotating = true;
const rotateToggle = document.getElementById("rotationToggle");
rotateToggle.addEventListener('click', () => {rotating = !rotating})

const loader = new GLTFLoader();


loader.load(drink_data['model_path'], 
	function (gltf){
		let model_scene = gltf.scene;
		scene.add(model_scene);
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

function animate(){
	
	// perform transforms
	scene.traverse((child) => {
		if (child instanceof THREE.Mesh){
			if (rotating) {
				child.rotateY(0.01);
			}
		}
	})

	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

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