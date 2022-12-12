import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../libs/three137/OrbitControls.js";

class App {
  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    /* 다른 method 에서 참조 할 수 있도록 field 화 */
    this._divContainer = divContainer;

    /* antialias : 오브젝트들의 경계선이 계단 현상 없이 부드럽게 표현되는 옵션 */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    /* pixel ratio : 픽셀 밀도 설정 */
    renderer.setPixelRatio(window.devicePixelRatio);
    /* renderer.domElement : canvas 타입의 Dom 객체 */
    divContainer.appendChild(renderer.domElement);
    this._renderer = renderer;

    const scene = new THREE.Scene();

    const spaceTexture = new THREE.TextureLoader().load("space.jpg");
    scene.background = spaceTexture;

    this._scene = scene;

    /* 밑줄로 시작하는 field 와 method는 App 클래스 내부에서만 사용된다는 의미로 씀.
		javascript에서는 private 성격을 부여할 수 있는 기능이 없기 때문에 이와 같이 밑줄로 표현하는것이 개발자간의 약속이다) */
    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();

    /* renderer 나 camera 는 창크기가 변경 될 때 마다 크기에 맞게 속성 값을 재설정해주어야 함 */
    /* resize method를 bind 통해 넘기는 이유 : resize method 안에서 this 가 가르키는 객체가 이벤트 객체가 아닌 App 클래스의 객체가 되도록 하기 위함 */
    window.onresize = this.resize.bind(this);
    /* 생성자에서 무조건 한 번은 호출 : 창크기에 맞게 설정 */
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupControls() {
    /* OrbitControls 객체 생성할때는 카메라 객체와 마우스 이벤트를 받는 돔 요소가 필요함 */
    /* #webgl-container를 가지고 있는 _divContainer를 넘겨줌 */
    new OrbitControls(this._camera, this._divContainer);
  }
  _setupCamera() {
    /* 3차원 그래픽을 출력할 영역에 대한 크기를 가져옴 */
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    /* 크기를 이용해서 카메라 객체 생성 */
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 20;
    this._camera = camera;
  }

  _setupLight() {
    /* 광원의 색상과 광원의 세기 값을 설정 */
    const color = 0xffffff;
    const intensity = 1;
    /* 광원 객체 생성 */
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupModel() {
    /* Solar System */
    const solarSystem = new THREE.Object3D();
    this._scene.add(solarSystem);
    const sphereGeometry = new THREE.SphereGeometry(1, 12, 12);
    const sunTexture = new THREE.TextureLoader().load("sun.jpeg");
    const sunMaterial = new THREE.MeshPhongMaterial();
    sunMaterial.map = sunTexture;
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(3, 3, 3);
    solarSystem.add(sunMesh);

    /* Earth */
    const earthOrbit = new THREE.Object3D();
    solarSystem.add(earthOrbit);

    // const earthMaterial = new THREE.MeshPhongMaterial({
    //   color: 0x2233ff,
    //   emissive: 0x112244,
    //   flatShading: true,
    // });

    const earthMaterial = new THREE.MeshPhongMaterial();
    const texture = new THREE.TextureLoader().load("earth.jpg");
    earthMaterial.map = texture;

    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthOrbit.position.x = 10;
    earthOrbit.add(earthMesh);

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 5;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
      flatShading: true,
    });
    const moonTexture = new THREE.TextureLoader().load("moon.jpg");
    const normalTexture = new THREE.TextureLoader().load("normal.jpg");

    const moonMesh = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture,
      })
    );
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);

    this._solarSystem = solarSystem;
    this._earthOrbit = earthOrbit;
    this._moonOrbit = moonOrbit;
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;

    /* camera 속성 변경 */
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    /* renderer 의 크기 설정 */
    this._renderer.setSize(width, height);
  }

  /* time : requestAnimationFrame 가 render 함수에 전달해주는 값 */
  render(time) {
    /* renderer 가 scene 을 카메라 시점으로 렌더링하도록 함 */
    this._renderer.render(this._scene, this._camera);
    /* time 인자 : 렌더링이 처음 시작된 이후 경과된 시간값. millisecond unit */
    this.update(time);
    /* 생성자 코드와 동일 */
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001; // second unit

    this._solarSystem.rotation.y = time / 2;
    this._earthOrbit.rotation.y = time / 2;
    this._moonOrbit.rotation.y = time * 5;
  }
}

window.onload = function () {
  new App();
};
