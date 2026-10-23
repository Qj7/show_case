import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LinearSRGBColorSpace,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Timer,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const COUNT = 100000;
const MOBILE_COUNT = 60000;
const SIZE = 0.014;
const RADIUS = 5;
const BRANCHES = 3;
const SPIN = 1;
const RANDOMNESS_POWER = 3;
const INSIDE_COLOR = 0xeb3700;
const OUTSIDE_COLOR = 0x07d3ed;
const BACKGROUND = 0x08080b;
const HERO_BACKGROUND = 0x000000;
const ROTATION_SPEED = 0.05;
const CAMERA_DISTANCE = Math.hypot(3, 3, 3);
const MIN_ZOOM = 0.55;
const MAX_ZOOM = 2.5;
const ZOOM_EASE = 12;
const WHEEL_ZOOM_SPEED = 0.004;
const MAX_WHEEL_DELTA = 50;

export type GalaxyHint = "wheel" | "touch";
export type GalaxyVariant = "section" | "hero";

type GestureEvent = Event & { scale: number };

// The original was tuned for three r138 without color management, so colors are
// blended and written to the framebuffer as raw values.
const linear = (hex: number) => new Color().setHex(hex, LinearSRGBColorSpace);

const randomOffset = () =>
  Math.pow(Math.random(), RANDOMNESS_POWER) * (Math.random() < 0.5 ? 1 : -1);

export function mountGalaxyScene(
  el: HTMLElement,
  {
    animate,
    onHint,
    variant = "section",
  }: { animate: boolean; onHint: (hint: GalaxyHint) => void; variant?: GalaxyVariant },
) {
  const hero = variant === "hero";
  const hint = hero ? () => {} : onHint;
  const mobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 600;
  const count = mobile ? MOBILE_COUNT : COUNT;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorInside = linear(INSIDE_COLOR);
  const colorOutside = linear(OUTSIDE_COLOR);
  const mixed = new Color();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * RADIUS;
    const angle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2 + radius * SPIN;

    positions[i3] = Math.cos(angle) * radius + randomOffset();
    positions[i3 + 1] = randomOffset();
    positions[i3 + 2] = Math.sin(angle) * radius + randomOffset();

    mixed.copy(colorInside).lerp(colorOutside, radius / RADIUS);
    colors[i3] = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  const material = new PointsMaterial({
    size: SIZE,
    sizeAttenuation: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
  });
  const points = new Points(geometry, material);

  const scene = new Scene();
  scene.add(points);

  const camera = new PerspectiveCamera(hero ? 68 : 75, 1, 0.1, 100);
  const target = new Vector3();
  const home = new Vector3(3, 3, 3);
  const frameOffset = new Vector3();
  camera.position.copy(home);

  const renderer = new WebGLRenderer({ antialias: true, powerPreference: "low-power" });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setClearColor(linear(hero ? HERO_BACKGROUND : BACKGROUND));
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  el.appendChild(canvas);

  // Touch drags must keep scrolling the page, so the galaxy is only draggable with a mouse.
  const controls = window.matchMedia("(pointer: fine)").matches ? new OrbitControls(camera, canvas) : null;
  if (controls) {
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
  } else {
    canvas.style.touchAction = "pan-x pan-y";
  }

  let baseDistance = CAMERA_DISTANCE;
  let zoom = 1;
  const setZoom = (value: number) => {
    zoom = Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM);
  };

  let width = 0;
  let height = 0;
  const resize = () => {
    const nextWidth = el.clientWidth;
    const nextHeight = el.clientHeight;
    if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return;
    width = nextWidth;
    height = nextHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const aspectFit = Math.min(Math.max(1 / camera.aspect, 1), 1.8);
    if (hero) {
      const short = height < 720;
      target.set(0, short ? -0.85 : -0.3, 0);
      home.set(1.7, short ? 3.6 : 4.4, 2);
    } else {
      target.set(0, 0, 0);
      home.set(3, 3, 3);
    }
    baseDistance = home.length() * aspectFit * (hero ? 0.88 : 1);
    home.setLength(baseDistance * zoom);
    camera.position.copy(target).add(home);
    camera.lookAt(target);
    if (controls) controls.target.copy(target);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.render(scene, camera);
  };

  // Section: plain wheel scrolls the page; Ctrl/⌘ + wheel zooms.
  // Hero: wheel over the orbit block zooms (page scroll when already fully zoomed in/out).
  const onWheel = (e: WheelEvent) => {
    const zoomGesture = hero || e.ctrlKey || e.metaKey;
    if (!zoomGesture) {
      if (e.deltaY) hint("wheel");
      return;
    }

    const delta = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? e.deltaY * 16 : e.deltaY;
    const clamped = Math.min(Math.max(delta, -MAX_WHEEL_DELTA), MAX_WHEEL_DELTA);
    const factor = Math.exp(clamped * WHEEL_ZOOM_SPEED);
    const nextZoom = Math.min(Math.max(zoom * factor, MIN_ZOOM), MAX_ZOOM);

    if (hero) {
      const zoomingIn = factor < 1;
      const zoomingOut = factor > 1;
      if ((zoom <= MIN_ZOOM && zoomingIn) || (zoom >= MAX_ZOOM && zoomingOut)) return;
      if (nextZoom === zoom) return;
    }

    e.preventDefault();
    setZoom(nextZoom);
  };

  let pinchDistance = 0;
  let pinchZoom = 1;
  const touchDistance = (touches: TouchList) =>
    Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      pinchDistance = touchDistance(e.touches);
      pinchZoom = zoom;
    } else if (e.touches.length === 1 && !controls) {
      hint("touch");
    }
  };
  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 2 || !pinchDistance) return;
    if (e.cancelable) e.preventDefault();
    setZoom((pinchZoom * pinchDistance) / touchDistance(e.touches));
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (e.touches.length < 2) pinchDistance = 0;
  };

  // Safari reports trackpad pinch as non-standard gesture events instead of Ctrl + wheel.
  let gestureZoom = 1;
  const onGestureStart = (e: Event) => {
    e.preventDefault();
    gestureZoom = zoom;
  };
  const onGestureChange = (e: Event) => {
    e.preventDefault();
    if (!pinchDistance) setZoom(gestureZoom / (e as GestureEvent).scale);
  };

  const timer = new Timer();
  let elapsed = 0;
  let frame = 0;
  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    timer.update(now);
    const delta = Math.min(timer.getDelta(), 0.1);
    if (animate) {
      elapsed += delta;
      points.rotation.y = elapsed * ROTATION_SPEED;
    }
    frameOffset.copy(camera.position).sub(target);
    const distance = frameOffset.length() || baseDistance;
    const targetDistance = baseDistance * zoom;
    if (Math.abs(targetDistance - distance) > 0.001) {
      frameOffset.setLength(distance + (targetDistance - distance) * (1 - Math.exp(-delta * ZOOM_EASE)));
      camera.position.copy(target).add(frameOffset);
    }
    controls?.update();
    renderer.render(scene, camera);
  };
  const start = () => {
    if (frame) return;
    timer.reset();
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(el);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) start();
    else stop();
  });
  intersectionObserver.observe(el);

  const listenerOptions = { passive: false } as const;
  const wheelTarget = hero ? document.getElementById("hero-orbit") : null;
  const wheelRoot = wheelTarget ?? canvas;
  wheelRoot.addEventListener("wheel", onWheel, listenerOptions);
  canvas.addEventListener("touchstart", onTouchStart, listenerOptions);
  canvas.addEventListener("touchmove", onTouchMove, listenerOptions);
  canvas.addEventListener("touchend", onTouchEnd);
  canvas.addEventListener("touchcancel", onTouchEnd);
  canvas.addEventListener("gesturestart", onGestureStart, listenerOptions);
  canvas.addEventListener("gesturechange", onGestureChange, listenerOptions);
  return () => {
    stop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    wheelRoot.removeEventListener("wheel", onWheel);
    canvas.removeEventListener("touchstart", onTouchStart);
    canvas.removeEventListener("touchmove", onTouchMove);
    canvas.removeEventListener("touchend", onTouchEnd);
    canvas.removeEventListener("touchcancel", onTouchEnd);
    canvas.removeEventListener("gesturestart", onGestureStart);
    canvas.removeEventListener("gesturechange", onGestureChange);
    controls?.dispose();
    timer.dispose();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
