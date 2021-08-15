import { useEffect, useRef } from 'react';
import { WebGLRenderer, Scene, PerspectiveCamera } from 'three';

import GlitchAnimation from './js/GlitchAnimation';

/**
 * グリッチコンポーネント
 */
const Glitch = ({ images }) => {
  const containerEl = useRef(null);
  const canvasEl = useRef(null);

  let animationId = undefined;
  let startTime = undefined;
  let time = undefined;
  let renderer = undefined;
  let scene = undefined;
  let camera = undefined;
  let canvasSize = {
    width: undefined,
    height: undefined
  };
  let glitchAnimation = undefined;

  /**
   * リサイズ
   */
  const resize = () => {
    canvasSize.width = containerEl.current.offsetWidth;
    canvasSize.height = containerEl.current.offsetHeight;
    renderer.setSize(canvasSize.width, canvasSize.height);
    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();
  };

  /**
   * 更新処理
   */
  const update = () => {
    animationId = requestAnimationFrame(update);
    time = new Date().getTime() - startTime;
    glitchAnimation.update(time);
    renderer.render(scene, camera);
  };

  /**
   * 準備できたら動かす処理
   */
  const init = () => {
    renderer = new WebGLRenderer({
      canvas: canvasEl.current,
      alpha: true,
      antialias: false
    });

    const devicePixelRatio = Math.min(2, window.devicePixelRatio || 1)
    renderer.setPixelRatio(devicePixelRatio);

    scene = new Scene();

    canvasSize.width = containerEl.current.offsetWidth;
    canvasSize.height = containerEl.current.offsetHeight;

    camera = new PerspectiveCamera(45, canvasSize.width / canvasSize.height, 1, 1000);
    camera.position.z = 100;

    const imgList = [];
    for (const imgPath of images) {
      imgList.push({ imgPath });
    }
    glitchAnimation = new GlitchAnimation(imgList, 40, 40);
    scene.add(glitchAnimation.mesh);

    window.addEventListener('resize', resize);
    resize();

    glitchAnimation.init().then(() => {
      startTime = new Date().getTime();
      glitchAnimation.start();
      update();
    });
  };

  /**
   * マウント解除時に動かすリセット処理
   */
  const reset = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = undefined;
    }
    window.removeEventListener('resize', resize);
  };

  useEffect(() => {
    if (canvasEl.current === undefined || containerEl.current === undefined) {
      return;
    }
    init();
    return reset;
  }, [containerEl, canvasEl]);

  return (
    <div className="canvas-container" ref={containerEl}>
      <canvas className="glitch-canvas" ref={canvasEl} />
    </div>
  );
};

export default Glitch;