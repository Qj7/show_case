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
// The camera looks from -Z, so world +X is screen-left. A positive camera X
// slides every figure toward the text; the boy is wide enough to pass under it.
const CAMERA_X = 0.45;
const CAMERA_PARALLAX_X = 0.18;
// Half-width of the horse, the widest of the small figures, including its yaw sway.
const SMALL_FIGURE_HALF = 1.05;

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

function starPoints(count: number, radius: number) {
  const outer = radius;
  const inner = radius * 0.38;
  const ring: { x: number; y: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = Math.PI / 2 + (i * Math.PI) / 5;
    ring.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }
  const tris: { ax: number; ay: number; bx: number; by: number; area: number }[] = [];
  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    const next = ring[(i + 1) % ring.length];
    const area = Math.abs(ring[i].x * next.y - next.x * ring[i].y) * 0.5;
    tris.push({ ax: ring[i].x, ay: ring[i].y, bx: next.x, by: next.y, area });
    total += area;
  }
  const out = new Float32Array(count * 3);
  for (let n = 0; n < count; n++) {
    let pick = Math.random() * total;
    let tri = tris[0];
    for (const candidate of tris) {
      pick -= candidate.area;
      if (pick <= 0) {
        tri = candidate;
        break;
      }
    }
    let u = Math.random();
    let v = Math.random();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    out[n * 3] = tri.ax * u + tri.bx * v;
    out[n * 3 + 1] = tri.ay * u + tri.by * v;
    out[n * 3 + 2] = (Math.random() - 0.5) * radius * 0.06;
  }
  return out;
}

function makeTreeTexture(geometry: BufferGeometryType) {
  geometry.computeBoundingBox();
  const tip = geometry.boundingBox!.max.y;
  const radius = 0.22;
  const count = 1100;
  const star = starPoints(count, radius);
  // Sit the star on the tip, overlapping it the way the 2 overlaps the E.
  const offsetY = tip + radius * 0.42;
  for (let i = 0; i < count; i++) star[i * 3 + 1] += offsetY;

  const source = geometry.attributes.position.array as Float32Array;
  shuffleArrayByThree(source);
  const treeCount = geometry.attributes.position.count;
  const total = treeCount + count;
  const texWidth = Math.ceil(Math.sqrt(total));
  const texHeight = Math.ceil(total / texWidth);
  const data = new Float32Array(texWidth * texHeight * 4);
  const order = Array.from({ length: total }, (_, index) => index);
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = order[i];
    order[i] = order[j];
    order[j] = swap;
  }
  for (let i = 0; i < total; i++) {
    const src = order[i];
    const out = i * 4;
    if (src < treeCount) {
      data[out] = source[src * 3];
      data[out + 1] = source[src * 3 + 1];
      data[out + 2] = source[src * 3 + 2];
    } else {
      const starIndex = (src - treeCount) * 3;
      data[out] = star[starIndex];
      data[out + 1] = star[starIndex + 1];
      data[out + 2] = star[starIndex + 2];
      data[out + 3] = 1;
    }
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

// The equation uses the original E2 mesh. E and the superscript 2 are that
// model; the other marks are extruded to the same depth.
function formulaFromE2(geometry: BufferGeometryType) {
  geometry.scale(3.7, 3.7, 3.7);
  geometry.computeBoundingBox();
  const center = geometry.boundingBox!.getCenter(new Vector3());
  geometry.translate(-center.x, -center.y, -center.z);
  const src = geometry.attributes.position.array as Float32Array;

  let jitter = 1;
  const nextJitter = (amount: number) => {
    jitter = (jitter * 16807) % 2147483647;
    return (jitter / 2147483647 - 0.5) * amount;
  };

  const letter: number[] = [];
  const digit: number[] = [];
  let letterMinX = Infinity;
  let letterMinY = Infinity;
  let letterMaxY = -Infinity;
  let digitMinX = Infinity;
  let digitMinY = Infinity;
  let digitMaxX = -Infinity;
  let digitMaxY = -Infinity;
  for (let i = 0; i < src.length; i += 3) {
    const x = src[i] + nextJitter(0.04);
    const y = src[i + 1] + nextJitter(0.04);
    const z = src[i + 2] + nextJitter(0.02);
    if (src[i] < -0.2 || src[i + 1] > 0.46) {
      digit.push(x, y, z);
      digitMinX = Math.min(digitMinX, x);
      digitMaxX = Math.max(digitMaxX, x);
      digitMinY = Math.min(digitMinY, y);
      digitMaxY = Math.max(digitMaxY, y);
    } else {
      letter.push(x, y, z);
      letterMinX = Math.min(letterMinX, x);
      letterMinY = Math.min(letterMinY, y);
      letterMaxY = Math.max(letterMaxY, y);
    }
  }

  const depth = 0.34;
  const stroke = 0.2;
  const gap = 0.34;
  const letterHeight = letterMaxY - letterMinY;
  const placeCloud = (
    target: number[],
    cloud: number[],
    minX: number,
    minY: number,
    dx: number,
    dy: number,
    scale: number,
  ) => {
    for (let i = 0; i < cloud.length; i += 3) {
      target.push((cloud[i] - minX) * scale + dx, (cloud[i + 1] - minY) * scale + dy, cloud[i + 2] * scale);
    }
  };

  let seed = 123456789;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const segmentE: number[] = [];
  const segmentEq: number[] = [];
  const segmentM: number[] = [];
  const segmentC: number[] = [];
  const segmentTwo: number[] = [];

  const pushTo = (target: number[], x: number, y: number, z: number) => {
    target.push(x + nextJitter(0.03), y + nextJitter(0.03), z + nextJitter(0.02));
  };

  const addBox = (target: number[], x: number, y: number, w: number, h: number) => {
    const perFace = Math.max(10, Math.round((w * h + (w + h) * depth) * 90));
    const faces: { at: (u: number, v: number) => [number, number, number] }[] = [
      { at: (u, v) => [x + u * w, y + v * h, -depth / 2] },
      { at: (u, v) => [x + u * w, y + v * h, depth / 2] },
      { at: (u, v) => [x + u * w, y, -depth / 2 + v * depth] },
      { at: (u, v) => [x + u * w, y + h, -depth / 2 + v * depth] },
      { at: (u, v) => [x, y + u * h, -depth / 2 + v * depth] },
      { at: (u, v) => [x + w, y + u * h, -depth / 2 + v * depth] },
    ];
    for (const face of faces) {
      for (let n = 0; n < perFace; n++) {
        const [px, py, pz] = face.at(rand(), rand());
        pushTo(target, px, py, pz);
      }
    }
  };

  const glyphStroke = (char: string, targetHeight: number, sampleCount: number) => {
    const fontSize = targetHeight * 1.08;
    const dpr = 56;
    const font = `italic 700 ${fontSize * dpr}px "Times New Roman", Times, Georgia, serif`;
    const probe = document.createElement("canvas").getContext("2d");
    if (!probe) return { points: [] as number[], width: 0 };
    probe.font = font;
    const textWidth = probe.measureText(char).width;
    const pad = 6 * dpr;
    const canvasW = Math.ceil(textWidth * dpr) + pad * 2;
    const canvasH = Math.ceil(fontSize * dpr * 1.18) + pad * 2;
    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return { points: [], width: 0 };
    ctx.font = font;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(char, pad, canvasH - pad);
    const image = ctx.getImageData(0, 0, canvasW, canvasH);
    const filled: { x: number; y: number }[] = [];
    for (let py = 0; py < canvasH; py++) {
      for (let px = 0; px < canvasW; px++) {
        if (image.data[(py * canvasW + px) * 4 + 3] > 40) filled.push({ x: px, y: py });
      }
    }
    if (filled.length === 0) return { points: [], width: 0 };
    let minPx = canvasW;
    let minPy = canvasH;
    let maxPx = 0;
    let maxPy = 0;
    for (const p of filled) {
      minPx = Math.min(minPx, p.x);
      maxPx = Math.max(maxPx, p.x);
      minPy = Math.min(minPy, p.y);
      maxPy = Math.max(maxPy, p.y);
    }
    const scale = targetHeight / Math.max(maxPy - minPy, 1);
    const layoutWidth = (maxPx - minPx) * scale;
    const points: number[] = [];
    for (let n = 0; n < sampleCount; n++) {
      const pick = filled[Math.floor(rand() * filled.length)];
      const x = (pick.x - minPx) * scale;
      const y = (maxPy - pick.y) * scale;
      const z = (rand() - 0.5) * depth;
      points.push(x + nextJitter(0.04), y + nextJitter(0.04), z + nextJitter(0.02));
    }
    return { points, width: layoutWidth };
  };

  const placeGlyph = (
    target: number[],
    char: string,
    x: number,
    height: number,
    samples: number,
    mirrorX = false,
  ) => {
    const glyph = glyphStroke(char, height, samples);
    for (let i = 0; i < glyph.points.length; i += 3) {
      const localX = mirrorX ? glyph.width - glyph.points[i] : glyph.points[i];
      target.push(localX + x, glyph.points[i + 1], glyph.points[i + 2]);
    }
    return glyph.width;
  };

  const subsample = (segment: number[], count: number) => {
    const verts = segment.length / 3;
    if (verts === 0) return new Float32Array(0);
    const picked = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const j = Math.floor(rand() * verts) * 3;
      picked[i * 3] = segment[j];
      picked[i * 3 + 1] = segment[j + 1];
      picked[i * 3 + 2] = segment[j + 2];
    }
    return picked;
  };

  // Larger world X is screen-left, so the equation is laid out from its right end.
  const rowHeight = letterHeight * 0.64;
  const digitScale = (rowHeight * 0.85) / Math.max(digitMaxY - digitMinY, 0.001);
  const digitWidth = (digitMaxX - digitMinX) * digitScale;
  const glyphHeight = rowHeight;
  const glyphSamples = 7200;
  let cursor = stroke * 0.2;

  const cLeft = cursor;
  const cWidth = placeGlyph(segmentC, "c", cursor, glyphHeight, glyphSamples, true);
  cursor += cWidth + gap * 0.85;
  placeCloud(
    segmentTwo,
    digit,
    digitMinX,
    digitMinY,
    cLeft - digitWidth * 0.95,
    rowHeight * 0.72,
    digitScale * 0.9,
  );

  const mWidth = placeGlyph(segmentM, "m", cursor, glyphHeight, glyphSamples);
  cursor += mWidth + gap;

  const bar = 0.16;
  const equalsWidth = 0.55;
  const mid = letterHeight * 0.5;
  addBox(segmentEq, cursor, mid + 0.1, equalsWidth, bar);
  addBox(segmentEq, cursor, mid - 0.1 - bar, equalsWidth, bar);
  cursor += equalsWidth + gap;

  placeCloud(segmentE, letter, letterMinX, letterMinY, cursor, 0, 1);

  const budget = FBO_SIZE * FBO_SIZE;
  const quotas = {
    e: Math.round(budget * 0.27),
    eq: Math.round(budget * 0.08),
    m: Math.round(budget * 0.27),
    c: Math.round(budget * 0.27),
    two:
      budget -
      Math.round(budget * 0.27) -
      Math.round(budget * 0.27) -
      Math.round(budget * 0.27) -
      Math.round(budget * 0.08),
  };
  const merged = new Float32Array(budget * 3);
  let offset = 0;
  for (const chunk of [
    subsample(segmentE, quotas.e),
    subsample(segmentEq, quotas.eq),
    subsample(segmentM, quotas.m),
    subsample(segmentC, quotas.c),
    subsample(segmentTwo, quotas.two),
  ]) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  const points: number[] = Array.from(merged);

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const pad = stroke * 0.95;
  for (let i = 0; i < points.length; i += 3) {
    minX = Math.min(minX, points[i]);
    maxX = Math.max(maxX, points[i]);
    minY = Math.min(minY, points[i + 1]);
    maxY = Math.max(maxY, points[i + 1]);
  }
  minX -= pad;
  maxX += pad;
  minY -= pad;
  maxY += pad;
  const worldWidth = 2.88;
  const fit = worldWidth / Math.max(maxX - minX, 0.001);
  const originX = (minX + maxX) / 2;
  const originY = (minY + maxY) / 2;
  const yaw = -0.1;
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const positions = new Float32Array(points.length);
  for (let i = 0; i < points.length; i += 3) {
    const x = (points[i] - originX) * fit - 0.18;
    const y = (points[i + 1] - originY) * fit;
    const z = points[i + 2] * fit;
    positions[i] = x * cos + z * sin;
    positions[i + 1] = y;
    positions[i + 2] = -x * sin + z * cos;
  }
  const formula = new BufferGeometry();
  formula.setAttribute("position", new BufferAttribute(positions, 3));
  return formula;
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
  const sideShift = { value: 0 };
  const desktop = window.matchMedia("(min-width: 1024px)");

  const resize = () => {
    const nextWidth = el.clientWidth;
    const nextHeight = el.clientHeight;
    if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return;
    width = nextWidth;
    height = nextHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Wide figures stay fully inside the frame. On a wide desktop the distance
    // stays at the template value; a narrower canvas only backs the camera up.
    const tan = Math.tan((camera.fov * Math.PI) / 360);
    const aspect = camera.aspect || 1;
    const distance = Math.max(4, 2.55 / (tan * aspect), 1.55 / tan);
    camera.position.z = -distance;
    const halfWidth = distance * tan * aspect;
    // Positive world X is screen-left. Park the horse's right edge left of the
    // text, and keep its left edge inside the frame when parallax pulls that way.
    const desiredShift = CAMERA_X + 0.18 * halfWidth + SMALL_FIGURE_HALF;
    const maxShift = CAMERA_X - CAMERA_PARALLAX_X + 0.9 * halfWidth - SMALL_FIGURE_HALF;
    sideShift.value = desktop.matches ? Math.max(0, Math.min(desiredShift, maxShift)) : 0;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(width, height);
  };

  const loader = new GLTFLoader();
  const ready = Promise.all([
    document.fonts.ready,
    loader.loadAsync(modelUrl("boy")),
    loader.loadAsync(modelUrl("oni")),
    loader.loadAsync(modelUrl("e2")),
    loader.loadAsync(modelUrl("tree")),
    loader.loadAsync(modelUrl("horse")),
  ])
    .then(([, boy, oni, e2, tree, horse]) => {
    if (disposed) return;

    const boyGeometry = geometryAt(boy.scene, 0);
    boyGeometry.scale(2.2, 2.2, 2.2);
    boyGeometry.translate(-1, -2.5, 0);
    boyGeometry.rotateY(-Math.PI / 2);
    boyGeometry.rotateZ(Math.PI / 3);

    const e2Geometry = formulaFromE2(geometryAt(e2.scene, 0));

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
    const textureE = makeTreeTexture(treeGeometry);

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
        uShift: sideShift,
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
        uShift: sideShift,
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

    disposables.push(simMaterial, renderMaterial, horseMaterial, textureA, textureB, textureC, textureD, textureE, fbo.rtt, fbo.simGeometry, fbo.particleGeometry, e2Geometry);

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
        camera.position.x += (CAMERA_X + cursor.x * CAMERA_PARALLAX_X - camera.position.x) * 5 * delta;
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
