function map(value, inputMin, inputMax, outputMin, outputMax, clamp = true) {
    var p;
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

class Glitch {
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
            vertexShader: document.getElementById('v-shader').textContent,
            fragmentShader: document.getElementById('f-shader').textContent,
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
        for (let d of this.data) {
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

        this.swapTexturesTimeline = new TimelineMax()
            .to(this.material.uniforms.imgRatio, 0.2, { value:1, ease: Expo.easeInOut }, 0.2)
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
            let c1 = Math.random();
            let c2 = Math.random();
            let offsetX = Math.random() * this._BLOCK_NOISE_TEXTURE_SIZE;
            let offsetY = Math.random() * this._BLOCK_NOISE_TEXTURE_SIZE;
            let w = (0.1 + Math.random() * 0.1) * this._BLOCK_NOISE_TEXTURE_SIZE;
            let h = (0.04 + Math.random() * 0.04) * this._BLOCK_NOISE_TEXTURE_SIZE;

            this.blockNoiseCtx.fillStyle = `rgba(${Math.floor(c1 * 256)}, ${Math.floor(c2 * 256)}, 0, 1)`;
            this.blockNoiseCtx.fillRect(offsetX - w / 2, offsetY - h / 2, w, h);
        }

        this.blockNoiseTexture.needsUpdate = true;
        this.material.needUpdate = true;
    }

    doGlitch() {
        this.clearGlitchTimer();
        this.swapTextures();
    }

    cancelGlitch() {
        if (this.swapTexturesTimeline) {
            this.swapTexturesTimeline.kill();
        }
        this.material.uniforms.glitchValue.value = 0;
        this.material.uniforms.imgRatio.value = 0;
        this.setGlitchTimer();
    }
}

function init () {
    let animationId = undefined;
    let startTime = undefined;

    const container = document.querySelector('.js-mainCanvas');

    const renderer = new THREE.WebGLRenderer({
        canvas: container.querySelector('canvas'),
        alpha: true,
        antialias: false
    });

    const devicePixelRatio = Math.min(2, window.devicePixelRatio || 1)
    renderer.setPixelRatio(devicePixelRatio);

    const scene = new THREE.Scene();

    const canvasSize = {
        width: container.offsetWidth,
        height: container.offsetHeight
    };

    const camera = new THREE.PerspectiveCamera(45, canvasSize.width / canvasSize.height, 1, 1000);
    camera.position.z = 100;

    const glitch = new Glitch([
        { imgPath: './assets/images/img01.png' },
        { imgPath: './assets/images/img02.png' },
        { imgPath: './assets/images/img03.png' },
        { imgPath: './assets/images/img04.png' },
    ], 40, 40);
    scene.add(glitch.mesh);

    const raycaster = new THREE.Raycaster();
    const mouse = { x: 0, y: 0 };
    let isHoverd = false;

    const mousemove = (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // 真ん中が0になるように調整
        mouse.x = (x / canvasSize.width) * 2 - 1;
        mouse.y = -(y / canvasSize.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([glitch.mesh]);
        if (intersects.length > 0) {
            if (!isHoverd) {
                isHoverd = true;
                glitch.doGlitch();
            }
        } else {
            if (isHoverd) {
                isHoverd = false;
                glitch.cancelGlitch();
            }
        }
    };

    const resize = (e) => {
        canvasSize.width = container.offsetWidth;
        canvasSize.height = container.offsetHeight;
        renderer.setSize(canvasSize.width, canvasSize.height);
        camera.aspect = canvasSize.width / canvasSize.height;
        camera.updateProjectionMatrix();
    };

    const update = () => {
        animationId = requestAnimationFrame(update);
        time = new Date().getTime() - startTime;
        glitch.update(time);
        renderer.render(scene, camera);
    };

    window.addEventListener('mousemove', mousemove);

    window.addEventListener('resize', resize);
    resize();

    glitch.init().then(() => {
        startTime = new Date().getTime();
        glitch.start();
        update();
    });
}

window.addEventListener('DOMContentLoaded', init);