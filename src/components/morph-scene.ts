import {
  AdditiveBlending,
  AnimationMixer,
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  FloatType,
  MathUtils,
  Mesh,
  LinearSRGBColorSpace,
  NearestFilter,
  OrthographicCamera,
  PerspectiveCamera,
  Points,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
  type BufferGeometry as BufferGeometryType,
  type Object3D,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { asset } from "@/content/site";
import {
  horseFragment,
  horseVertex,
  particlesFragment,
  particlesVertex,
  simFragment,
  simVertex,
} from "@/components/morph-shaders";

// Same section count as the template: five screens, morph range split in four.
const SECTION_COUNT = 4;
const RANGE = 1 / SECTION_COUNT;
const FBO_SIZE = 256;
const DEFINES = {
  uTotalModels: SECTION_COUNT.toFixed(2),
  uRange: RANGE.toFixed(2),
};
// Hold on the model figures. The template's in-between state is an unbound particle cloud.
const STOPS = [0, RANGE, RANGE * 2, RANGE * 3, 1, RANGE * 3, RANGE * 2, RANGE];
const HOLD = 3.2;

const modelUrl = (name: string) => asset(`/morph/models/${name}.glb`);

function geometryAt(root: Object3D, index: number) {
  return (root.children[index] as Mesh).geometry;
}

function shuffleArrayByThree(array: ArrayLike<number> & { [index: number]: number }) {
  const groupLength = 3;
  const numGroups = Math.floor(array.length / groupLength);
  for (let i = numGroups - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    for (let k = 0; k < groupLength; k++) {
      const a = i * groupLength + k;
      const b = j * groupLength + k;
      const temp = array[a];
      array[a] = array[b];
      array[b] = temp;
    }
  }
}

function makeTexture(geometry: BufferGeometryType) {
  const position = geometry.attributes.position;
  const vertAmount = position.count;
  const texWidth = Math.ceil(Math.sqrt(vertAmount));
  const texHeight = Math.ceil(vertAmount / texWidth);
  const data = new Float32Array(texWidth * texHeight * 4);
  const source = position.array as Float32Array;

  shuffleArrayByThree(source);

  for (let i = 0; i < vertAmount; i++) {
    data[i * 4] = source[i * 3];
    data[i * 4 + 1] = source[i * 3 + 1];
    data[i * 4 + 2] = source[i * 3 + 2];
  }

  const texture = new DataTexture(data, texWidth, texHeight, RGBAFormat, FloatType);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.flipY = false;
  texture.colorSpace = LinearSRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function randomTexture(width: number, height: number, size: number) {
  const data = new Float32Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data[i * 4] = (Math.random() - 0.5) * size;
    data[i * 4 + 1] = (Math.random() - 0.5) * size;
    data[i * 4 + 2] = (Math.random() - 0.5) * size;
  }
  const texture = new DataTexture(data, width, height, RGBAFormat, FloatType);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.flipY = false;
  texture.colorSpace = LinearSRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function mountMorphScene(el: HTMLElement, { animate }: { animate: boolean }) {
  let disposed = false;

  const renderer = new WebGLRenderer({
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 1);
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.touchAction = "pan-y";
  el.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 10000);
  camera.position.set(0, 0, -4);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.45, 0.25, 0.55);
  bloom.enabled = false;
  composer.addPass(bloom);

  const cursor = { x: 0, y: 0 };
  const onPointerMove = (event: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) {
      cursor.x = 0;
      cursor.y = 0;
      return;
    }
    cursor.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    cursor.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };
  window.addEventListener("pointermove", onPointerMove);

  let frame = 0;
  let elapsed = 0;
  let stop = 0;
  let hold = 0;
  let scroll = 0;
  let width = 0;
  let height = 0;
  const disposables: { dispose: () => void }[] = [];

  const resize = () => {
    const nextWidth = el.clientWidth;
    const nextHeight = el.clientHeight;
    if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return;
    width = nextWidth;
    height = nextHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(width, height);
  };

  const loader = new GLTFLoader();
  const ready = Promise.all([
    loader.loadAsync(modelUrl("boy")),
    loader.loadAsync(modelUrl("oni")),
    loader.loadAsync(modelUrl("e2")),
    loader.loadAsync(modelUrl("tree")),
    loader.loadAsync(modelUrl("horse")),
  ])
    .then(([boy, oni, e2, tree, horse]) => {
    if (disposed) return;

    const boyGeometry = geometryAt(boy.scene, 0);
    boyGeometry.scale(2.2, 2.2, 2.2);
    boyGeometry.translate(-1, -2.5, 0);
    boyGeometry.rotateY(-Math.PI / 2);
    boyGeometry.rotateZ(Math.PI / 3);

    const e2Geometry = geometryAt(e2.scene, 0);
    e2Geometry.scale(4, 4, 4);
    e2Geometry.rotateY(-Math.PI / 6);

    const oniGeometry = geometryAt(oni.scene, 0);
    oniGeometry.scale(0.3, 0.3, 0.3);
    oniGeometry.translate(0, -7, 0);

    const treeGeometry = geometryAt(tree.scene, 1);
    treeGeometry.scale(0.007, 0.007, 0.007);
    treeGeometry.computeBoundingBox();
    const treeCenter = treeGeometry.boundingBox!.getCenter(new Vector3());
    treeGeometry.translate(-treeCenter.x, -treeCenter.y, -treeCenter.z);
    treeGeometry.scale(0.58, 0.58, 0.58);

    const textureA = makeTexture(boyGeometry);
    const textureB = makeTexture(oniGeometry);
    const textureC = makeTexture(e2Geometry);
    const textureD = randomTexture(FBO_SIZE, FBO_SIZE, 30);
    const textureE = makeTexture(treeGeometry);

    const simMaterial = new ShaderMaterial({
      uniforms: {
        uTextureA: { value: textureA },
        uTextureB: { value: textureB },
        uTextureC: { value: textureC },
        uTextureD: { value: textureD },
        uTextureE: { value: textureE },
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uTreePos: { value: new Vector3() },
      },
      defines: DEFINES,
      vertexShader: simVertex,
      fragmentShader: simFragment,
    });

    const renderMaterial = new ShaderMaterial({
      uniforms: {
        uPositions: { value: null },
        uSize: { value: 12 },
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uScroll: { value: 0 },
        uResolution: { value: new Vector2() },
      },
      defines: DEFINES,
      vertexShader: particlesVertex,
      fragmentShader: particlesFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    const fbo = createFbo(renderer, simMaterial, renderMaterial);
    fbo.particles.frustumCulled = false;
    scene.add(fbo.particles);

    const horseMaterial = new ShaderMaterial({
      uniforms: {
        uPositions: { value: null },
        uSize: { value: 2 },
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uScroll: { value: 0 },
      },
      defines: DEFINES,
      vertexShader: horseVertex,
      fragmentShader: horseFragment,
      transparent: true,
      depthWrite: false,
    });

    const horseMesh = horse.scene.children[0] as Mesh;
    const horsePositions = horseMesh.geometry.attributes.position.array as Float32Array;
    const e2Positions = e2Geometry.attributes.position.array as Float32Array;
    const e2Copy = new Float32Array(horsePositions.length);
    for (let i = 0; i < horsePositions.length; i++) e2Copy[i] = e2Positions[i] ?? 0;
    horseMesh.geometry.setAttribute("aE2Geometry", new BufferAttribute(e2Copy, 3));

    const horsePoints = new Points(horseMesh.geometry, horseMaterial);
    horsePoints.frustumCulled = false;
    horse.scene.rotateY(Math.PI / 2);
    scene.add(horsePoints);

    const mixer = new AnimationMixer(horse.scene);
    const clip = horse.animations[0];
    if (clip) mixer.clipAction(clip).play();
    horsePoints.morphTargetInfluences = horseMesh.morphTargetInfluences;
    horsePoints.morphTargetDictionary = horseMesh.morphTargetDictionary;

    disposables.push(simMaterial, renderMaterial, horseMaterial, textureA, textureB, textureC, textureD, textureE, fbo.rtt, fbo.simGeometry, fbo.particleGeometry);

    const applyScroll = (value: number) => {
      simMaterial.uniforms.uScroll.value = value;
      renderMaterial.uniforms.uScroll.value = value;
      horseMaterial.uniforms.uScroll.value = value;
    };

    const render = (delta: number) => {
      if (animate) {
        elapsed += delta;
        hold += delta;
        if (hold > HOLD && Math.abs(scroll - STOPS[stop]) < 0.02) {
          stop = (stop + 1) % STOPS.length;
          hold = 0;
        }
        scroll = MathUtils.damp(scroll, STOPS[stop], 3, delta);
        simMaterial.uniforms.uTime.value = elapsed;
        renderMaterial.uniforms.uTime.value = elapsed;
        horseMaterial.uniforms.uTime.value = elapsed;
        mixer.update(delta);
        camera.position.x += (cursor.x * 0.5 - camera.position.x) * 5 * delta;
        camera.position.y += (-cursor.y * 0.5 - camera.position.y) * 5 * delta;
      }
      applyScroll(scroll);
      renderMaterial.uniforms.uResolution.value.set(width * renderer.getPixelRatio(), height * renderer.getPixelRatio());
      fbo.update();
      composer.render();
    };

    resize();
    render(0);
    el.dataset.ready = "";

    const tick = (now: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(tick);
      const delta = Math.min((now - last) / 1000, 0.06);
      last = now;
      if (delta > 0) render(delta);
    };
    let last = performance.now();
    const start = () => {
      if (frame || !animate) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onResize = () => {
      resize();
      render(0);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(el);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) start();
      else stopLoop();
    });
    intersectionObserver.observe(el);
    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      mixer.stopAllAction();
    };
  })
    .catch(() => undefined);

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", onPointerMove);
    void ready.then((release) => release?.());
    disposables.forEach((item) => item.dispose());
    composer.dispose();
    renderer.dispose();
    canvas.remove();
  };
}

function createFbo(renderer: WebGLRenderer, simulationMaterial: ShaderMaterial, renderMaterial: ShaderMaterial) {
  const simScene = new Scene();
  const simCamera = new OrthographicCamera(-1, 1, 1, -1, 1 / 2 ** 53, 1);
  const rtt = new WebGLRenderTarget(FBO_SIZE, FBO_SIZE, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    generateMipmaps: false,
    colorSpace: LinearSRGBColorSpace,
    depthBuffer: false,
    stencilBuffer: false,
    format: RGBAFormat,
    type: FloatType,
  });

  const simGeometry = new BufferGeometry();
  simGeometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]), 3),
  );
  simGeometry.setAttribute("uv", new BufferAttribute(new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]), 2));
  simScene.add(new Mesh(simGeometry, simulationMaterial));

  const length = FBO_SIZE * FBO_SIZE;
  const vertices = new Float32Array(length * 3);
  for (let i = 0; i < length; i++) {
    vertices[i * 3] = (i % FBO_SIZE) / FBO_SIZE;
    vertices[i * 3 + 1] = i / FBO_SIZE / FBO_SIZE;
  }
  const particleGeometry = new BufferGeometry();
  particleGeometry.setAttribute("position", new BufferAttribute(vertices, 3));
  const particles = new Points(particleGeometry, renderMaterial);

  return {
    rtt,
    simGeometry,
    particleGeometry,
    particles,
    update() {
      renderer.setRenderTarget(rtt);
      renderer.clear();
      renderer.render(simScene, simCamera);
      renderer.setRenderTarget(null);
      renderMaterial.uniforms.uPositions.value = rtt.texture;
    },
  };
}
