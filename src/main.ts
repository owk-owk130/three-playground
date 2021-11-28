import "./style.scss";
import * as THREE from "three";
import VertexShader from "./glsl/vertexShader.glsl";
import FragmentShader from "./glsl/fragmentShader.glsl";

const canvasEl = <HTMLCanvasElement>document.getElementById("canvas");
const canvasSize = {
  w: window.innerWidth,
  h: window.innerHeight,
};

const renderer = new THREE.WebGLRenderer({ canvas: canvasEl });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasSize.w, canvasSize.h);

// ウィンドウとwebGLの座標を一致させるため、描画がウィンドウぴったりになるようカメラを調整
const fov = 60;
const fovRad = (fov / 2) * (Math.PI / 180);
const dist = canvasSize.h / 2 / Math.tan(fovRad);
const camera = new THREE.PerspectiveCamera(fov, canvasSize.w / canvasSize.h, 0.1, 1000);
camera.position.z = dist;

const scene = new THREE.Scene();

const loader = new THREE.TextureLoader();
const texture = loader.load("https://source.unsplash.com/whOkVvf0_hU/");

const uniforms = {
  uTexture: { value: texture },
  uImageAspect: { value: 1920 / 1280 },
  uPlaneAspect: { value: 800 / 500 },
  uTime: { value: 0 },
};

const geo = new THREE.PlaneBufferGeometry(800, 500, 100, 100);
const mat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: VertexShader,
  fragmentShader: FragmentShader,
});

const mesh = new THREE.Mesh(geo, mat);

scene.add(mesh);

const loop = () => {
  uniforms.uTime.value++;
  renderer.render(scene, camera);

  requestAnimationFrame(loop);
};

window.addEventListener("load", loop);
