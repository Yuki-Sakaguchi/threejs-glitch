import * as THREE from 'three';
import gsap from 'gsap';
import vertexShader from '../glsl/glitch.vert';
import fragmentShader from '../glsl/glitch.frag';

function map(value, inputMin, inputMax, outputMin, outputMax, clamp = true) {
  let p = null;
  if (clamp === true) {
    if (value < inputMin) {
      return outputMin;
    }
    if (value > inputMax) {
      return outputMax;
    }
  }
  p = (outputMax - outputMin) / (inputMax - inputMin);
  return ((value - inputMin) * p) + outputMin;
};

class GlitchAnimation {
  _BLOCK_NOISE_TEXTURE_SIZE = 256;

  constructor(data, width, height) {
      this.data = data;
      this.width = width;
      this.height = height;

      this.textures = [];
      this.textureIndex = 0;
      this.numTextures = data.length;
      this.numTotalImgs = 0;
      this.numLoadedImgs = 0;

      this.blockNoiseCanvas = document.createElement('canvas');
      this.blockNoiseCanvas.width = this._BLOCK_NOISE_TEXTURE_SIZE;
      this.blockNoiseCanvas.height = this._BLOCK_NOISE_TEXTURE_SIZE;
      this.blockNoiseCtx = this.blockNoiseCanvas.getContext('2d');
      this.blockNoiseTexture = new THREE.Texture(this.blockNoiseCanvas);
      this.blockNoiseTexture.minFilter = THREE.NearestFilter;
      this.blockNoiseTexture.magFilter = THREE.NearestFilter;
      this.blockNoiseTexture.wrapS = THREE.MirroredRepeatWrapping;
      this.blockNoiseTexture.wrapT = THREE.MirroredRepeatWrapping;
      this.blockNoiseCanvas.style.zIndex = 1000;
      this.blockNoiseCanvas.style.position = 'fixed';
      this.blockNoiseCanvas.style.top = '0px';
      this.blockNoiseCanvas.style.left = '0px';

      const geometry = new THREE.PlaneGeometry(width, height);

      this.material = new THREE.RawShaderMaterial({
          vertexShader,
          fragmentShader,
          depthTest: false,
          depthWrite: false,
          transparent: true,
          uniforms: {
              time: { type: '1f', value: 0 },
              timeOffset: { type: '1f', value: Math.random() * 1000.0 },
              img1: { type: 't', value: null },
              img2: { type: 't', value: null },
              resolution: { type: '2f', value: new THREE.Vector2(width, height) },
              blockNoiseTexture: { type: 't', value: this.blockNoiseTexture },
              randomValues: { type: '3f', value: new THREE.Vector3() },
              glitchValue: { type: '1f', value: 0 },
              imgRatio: { type: '1f', value: 0 }
          }
      });

      this.mesh = new THREE.Mesh(geometry, this.material);

      this.swapTexturesTimeline = null;
      this.glitchTimer = null;
  }

  init () {
      const promises = [];
      for (const d of this.data) {
          promises.push(this.loadTexture(d.imgPath));
      }

      return Promise.all(promises).then(() => {
          this.setImgs();
          return true;
      });
  }

  loadTexture(imgPath) {
      this.numTotalImgs++;
      const loader = new THREE.TextureLoader();

      return new Promise(resolve => {
          const texture = loader.load(imgPath, () => {
              this.numLoadedImgs++;
              resolve();
          });
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.maxFilter = THREE.LinearFilter;
          texture.wrapS = THREE.MirroredRepeatWrapping;
          texture.wrapT = THREE.MirroredRepeatWrapping;
          this.textures.push(texture);
      });
  }

  setImgs() {
      this.material.uniforms.img1.value = this.textures[this.textureIndex];
      this.textureIndex = ++this.textureIndex % this.numTextures;
      this.material.uniforms.img2.value = this.textures[this.textureIndex];
      this.material.needUpdate = true;
  }

  update(time) {
      this.material.uniforms.time.value = time;
      this.material.uniforms.randomValues.value.set(
          map(Math.random(), 0, 1, -1, 1),
          map(Math.random(), 0, 1, -1, 1),
          map(Math.random(), 0, 1, -1, 1),
      );
      this.material.needsUpdate = true;
  }

  start() {
      this.setGlitchTimer();
  }

  setGlitchTimer() {
      this.clearGlitchTimer();
      this.glitchTimer = setTimeout(() => this.swapTextures(), 5000);
  }

  clearGlitchTimer() {
      if (this.glitchTimer) clearTimeout(this.glitchTimer);
      this.glitchTimer = null;
  }

  swapTextures() {
      if (this.swapTexturesTimeline) {
          this.swapTexturesTimeline.kill();
      }

      this.material.uniforms.glitchValue.value = 1;

      this.swapTexturesTimeline = gsap.timeline()
          .to(this.material.uniforms.imgRatio, 0.2, { value:1, ease: "Expo.easeInOut" }, 0.2)
          .add(() => this.updateBlockNoise(), 0.05)
          .add(() => this.updateBlockNoise(), 0.1)
          .add(() => this.updateBlockNoise(), 0.15)
          .add(() => this.updateBlockNoise(), 0.2)
          .add(() => this.updateBlockNoise(), 0.25)
          .add(() => this.updateBlockNoise(), 0.3)
          .add(() => this.updateBlockNoise(), 0.35)
          .add(() => {
              this.material.uniforms.glitchValue.value = 0;
              this.material.uniforms.imgRatio.value = 0;
              this.setImgs();
              this.setGlitchTimer();
          }, 0.4);
  }

  updateBlockNoise() {
      this.blockNoiseCtx.clearRect(0, 0, this._BLOCK_NOISE_TEXTURE_SIZE, this._BLOCK_NOISE_TEXTURE_SIZE);

      for (let i = 0; i < 4 + Math.floor(Math.random()) * 4; i++) {
          const c1 = Math.random();
          const c2 = Math.random();
          const offsetX = Math.random() * this._BLOCK_NOISE_TEXTURE_SIZE;
          const offsetY = Math.random() * this._BLOCK_NOISE_TEXTURE_SIZE;
          const w = (0.1 + Math.random() * 0.1) * this._BLOCK_NOISE_TEXTURE_SIZE;
          const h = (0.04 + Math.random() * 0.04) * this._BLOCK_NOISE_TEXTURE_SIZE;

          this.blockNoiseCtx.fillStyle = `rgba(${Math.floor(c1 * 256)}, ${Math.floor(c2 * 256)}, 0, 1)`;
          this.blockNoiseCtx.fillRect(offsetX - w / 2, offsetY - h / 2, w, h);
      }

      this.blockNoiseTexture.needsUpdate = true;
      this.material.needUpdate = true;
  }
}


export default class Glitch {
  constructor(imgList) {
    this.startTime = undefined;
    this.time = undefined;

    this.container = document.querySelector('.js-mainCanvas');

    this.renderer = new THREE.WebGLRenderer({
        canvas: this.container.querySelector('canvas'),
        alpha: true,
        antialias: false
    });

    this.devicePixelRatio = Math.min(2, window.devicePixelRatio || 1)
    this.renderer.setPixelRatio(devicePixelRatio);

    this.scene = new THREE.Scene();

    this.canvasSize = {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
    };

    this.camera = new THREE.PerspectiveCamera(45, this.canvasSize.width / this.canvasSize.height, 1, 1000);
    this.camera.position.z = 100;

    this.imgList = [];
    for (const imgPath of imgList) {
      this.imgList.push({ imgPath });
    }
    this.glitchAnimation = new GlitchAnimation(this.imgList, 40, 40);
    this.scene.add(this.glitchAnimation.mesh);

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  init(callback) {
    this.glitchAnimation.init().then(callback);
  }

  start() {
    this.startTime = new Date().getTime();
    this.glitchAnimation.start();
    this.update();
  }

  resize() {
    this.canvasSize.width = this.container.offsetWidth;
    this.canvasSize.height = this.container.offsetHeight;
    this.renderer.setSize(this.canvasSize.width, this.canvasSize.height);
    this.camera.aspect = this.canvasSize.width / this.canvasSize.height;
    this.camera.updateProjectionMatrix();
  }

  update() {
    requestAnimationFrame(this.update.bind(this));
    this.time = new Date().getTime() - this.startTime;
    this.glitchAnimation.update(this.time);
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    window.removeEventListener('resize', this.resize.bind(this))
  }
}
