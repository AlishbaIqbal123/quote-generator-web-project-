import { useEffect, useRef } from 'react';
import {
    Scene,
    OrthographicCamera,
    WebGLRenderer,
    PlaneGeometry,
    Mesh,
    ShaderMaterial,
    Vector3,
    Vector2,
    Clock
} from 'three';

const vertexShader = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);

  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }

  vec3 gradientColor;

  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);

    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];

    gradientColor = mix(c1, c2, f);
  }

  return gradientColor * 0.5;
}

  float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius); 
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;

  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);

  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(\n        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),\n        1.5 + 0.2 * fi,\n        baseUv,\n        mouseUv,\n        interactive\n      ) * 0.2;\n    }\n  }\n\n  if (enableMiddle) {\n    for (int i = 0; i < middleLineCount; ++i) {\n      float fi = float(i);\n      float t = fi / max(float(middleLineCount - 1), 1.0);\n      vec3 lineCol = getLineColor(t, b);\n\n      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);\n      vec2 ruv = baseUv * rotate(angle);\n      col += lineCol * wave(\n        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),\n        2.0 + 0.15 * fi,\n        baseUv,\n        mouseUv,\n        interactive\n      );\n    }\n  }\n\n  if (enableTop) {\n    for (int i = 0; i < topLineCount; ++i) {\n      float fi = float(i);\n      float t = fi / max(float(topLineCount - 1), 1.0);\n      vec3 lineCol = getLineColor(t, b);\n      float angle = topWavePosition.z * log(length(baseUv) + 1.0);\n      vec2 ruv = baseUv * rotate(angle);\n      ruv.x *= -1.0;\n      col += lineCol * wave(\n        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),\n        1.0 + 0.2 * fi,\n        baseUv,\n        mouseUv,\n        interactive\n      ) * 0.1;\n    }\n  }\n\n  fragColor = vec4(col, 1.0);\n}\n\nvoid main() {\n  vec4 color = vec4(0.0);\n  mainImage(color, gl_FragCoord.xy);\n  gl_FragColor = color;\n}\n`;

const MAX_GRADIENT_STOPS = 8;

function hexToVec3(hex) { \n  let value = hex.trim(); \n\n  if (value.startsWith('#')) { \n    value = value.slice(1); \n } \n\n  let r = 255; \n  let g = 255; \n  let b = 255; \n\n  if (value.length === 3) { \n    r = parseInt(value[0] + value[0], 16); \n    g = parseInt(value[1] + value[1], 16); \n    b = parseInt(value[2] + value[2], 16); \n } else if (value.length === 6) { \n    r = parseInt(value.slice(0, 2), 16); \n    g = parseInt(value.slice(2, 4), 16); \n    b = parseInt(value.slice(4, 6), 16); \n } \n\n  return new Vector3(r / 255, g / 255, b / 255); \n } \n\nexport default function FloatingLines({ \n  linesGradient = [\"#6366f1\", \"#a855f7\", \"#ec4899\"],\n  enabledWaves = ['top', 'middle', 'bottom'],\n  lineCount = [6, 6, 6],\n  lineDistance = [5, 5, 5],\n  topWavePosition,\n  middleWavePosition,\n  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },\n  animationSpeed = 1,\n  interactive = true,\n  bendRadius = 5.0,\n  bendStrength = -0.5,\n  mouseDamping = 0.05,\n  parallax = true,\n  parallaxStrength = 0.2,\n  mixBlendMode = 'screen'\n}) {\n  const containerRef = useRef(null);\n  const targetMouseRef = useRef(new Vector2(-1000, -1000));\n  const currentMouseRef = useRef(new Vector2(-1000, -1000));\n  const targetInfluenceRef = useRef(0);\n  const currentInfluenceRef = useRef(0);\n  const targetParallaxRef = useRef(new Vector2(0, 0));\n  const currentParallaxRef = useRef(new Vector2(0, 0));\n\n  const getLineCount = waveType => {\n    if (typeof lineCount === 'number') return lineCount;\n    if (!enabledWaves.includes(waveType)) return 0;\n    const index = enabledWaves.indexOf(waveType);\n    return lineCount[index] ?? 6;\n  };\n\n  const getLineDistance = waveType => {\n    if (typeof lineDistance === 'number') return lineDistance;\n    if (!enabledWaves.includes(waveType)) return 0.1;\n    const index = enabledWaves.indexOf(waveType);\n    return lineDistance[index] ?? 0.1;\n  };\n\n  const topLineCount = enabledWaves.includes('top') ? getLineCount('top') : 0;\n  const middleLineCount = enabledWaves.includes('middle') ? getLineCount('middle') : 0;\n  const bottomLineCount = enabledWaves.includes('bottom') ? getLineCount('bottom') : 0;\n\n  const topLineDistance = enabledWaves.includes('top') ? getLineDistance('top') * 0.01 : 0.01;\n  const middleLineDistance = enabledWaves.includes('middle') ? getLineDistance('middle') * 0.01 : 0.01;\n  const bottomLineDistance = enabledWaves.includes('bottom') ? getLineDistance('bottom') * 0.01 : 0.01;\n\n  useEffect(() => {\n    if (!containerRef.current) return;\n\n    const scene = new Scene();\n    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);\n    camera.position.z = 1;\n\n    const renderer = new WebGLRenderer({ antialias: true, alpha: true });\n    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));\n    renderer.domElement.style.width = '100%';\n    renderer.domElement.style.height = '100%';\n    containerRef.current.appendChild(renderer.domElement);\n\n    const uniforms = {\n      iTime: { value: 0 },\n      iResolution: { value: new Vector3(1, 1, 1) },\n      animationSpeed: { value: animationSpeed },\n\n      enableTop: { value: enabledWaves.includes('top') },\n      enableMiddle: { value: enabledWaves.includes('middle') },\n      enableBottom: { value: enabledWaves.includes('bottom') },\n\n      topLineCount: { value: topLineCount },\n      middleLineCount: { value: middleLineCount },\n      bottomLineCount: { value: bottomLineCount },\n\n      topLineDistance: { value: topLineDistance },\n      middleLineDistance: { value: middleLineDistance },\n      bottomLineDistance: { value: bottomLineDistance },\n\n      topWavePosition: {\n        value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4)\n      },\n      middleWavePosition: {\n        value: new Vector3(\n          middleWavePosition?.x ?? 5.0,\n          middleWavePosition?.y ?? 0.0,\n          middleWavePosition?.rotate ?? 0.2\n        )\n      },\n      bottomWavePosition: {\n        value: new Vector3(\n          bottomWavePosition?.x ?? 2.0,\n          bottomWavePosition?.y ?? -0.7,\n          bottomWavePosition?.rotate ?? 0.4\n        )\n      },\n\n      iMouse: { value: new Vector2(-1000, -1000) },\n      interactive: { value: interactive },\n      bendRadius: { value: bendRadius },\n      bendStrength: { value: bendStrength },\n      bendInfluence: { value: 0 },\n\n      parallax: { value: parallax },\n      parallaxStrength: { value: parallaxStrength },\n      parallaxOffset: { value: new Vector2(0, 0) },\n\n      lineGradient: {\n        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1))\n      },\n      lineGradientCount: { value: 0 }\n    };\n\n    if (linesGradient && linesGradient.length > 0) {\n      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);\n      uniforms.lineGradientCount.value = stops.length;\n\n      stops.forEach((hex, i) => {\n        const color = hexToVec3(hex);\n        uniforms.lineGradient.value[i].set(color.x, color.y, color.z);\n      });\n    }\n\n    const material = new ShaderMaterial({\n      uniforms,\n      vertexShader,\n      fragmentShader,\n      transparent: true\n    });\n\n    const geometry = new PlaneGeometry(2, 2);\n    const mesh = new Mesh(geometry, material);\n    scene.add(mesh);\n\n    const clock = new Clock();\n\n    const setSize = () => {\n      const el = containerRef.current;\n      if (!el) return;\n      const width = el.clientWidth || 1;\n      const height = el.clientHeight || 1;\n\n      renderer.setSize(width, height, false);\n\n      const canvasWidth = renderer.domElement.width;\n      const canvasHeight = renderer.domElement.height;\n      uniforms.iResolution.value.set(canvasWidth, canvasHeight, 1);\n    };\n\n    setSize();\n\n    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(setSize) : null;\n\n    if (ro && containerRef.current) {\n      ro.observe(containerRef.current);\n    }\n\n    const handlePointerMove = event => {\n      const rect = renderer.domElement.getBoundingClientRect();\n      const x = event.clientX - rect.left;\n      const y = event.clientY - rect.top;\n      const dpr = renderer.getPixelRatio();\n\n      targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr);\n      targetInfluenceRef.current = 1.0;\n\n      if (parallax) {\n        const centerX = rect.width / 2;\n        const centerY = rect.height / 2;\n        const offsetX = (x - centerX) / rect.width;\n        const offsetY = -(y - centerY) / rect.height;\n        targetParallaxRef.current.set(offsetX * parallaxStrength, offsetY * parallaxStrength);\n      }\n    };\n\n    const handlePointerLeave = () => {\n      targetInfluenceRef.current = 0.0;\n    };\n\n    if (interactive) {\n      renderer.domElement.addEventListener('pointermove', handlePointerMove);\n      renderer.domElement.addEventListener('pointerleave', handlePointerLeave);\n    }\n\n    let raf = 0;\n    const renderLoop = () => {\n      uniforms.iTime.value = clock.getElapsedTime();\n\n      if (interactive) {\n        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);\n        uniforms.iMouse.value.copy(currentMouseRef.current);\n\n        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;\n        uniforms.bendInfluence.value = currentInfluenceRef.current;\n      }\n\n      if (parallax) {\n        currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);\n        uniforms.parallaxOffset.value.copy(currentParallaxRef.current);\n      }\n\n      renderer.render(scene, camera);\n      raf = requestAnimationFrame(renderLoop);\n    };\n    renderLoop();\n\n    return () => {\n      cancelAnimationFrame(raf);\n      if (ro && containerRef.current) {\n        ro.disconnect();\n      }\n\n      if (interactive) {\n        renderer.domElement?.removeEventListener('pointermove', handlePointerMove);\n        renderer.domElement?.removeEventListener('pointerleave', handlePointerLeave);\n      }\n\n      geometry.dispose();\n      material.dispose();\n      renderer.dispose();\n      if (renderer.domElement.parentElement) {\n        renderer.domElement.parentElement.removeChild(renderer.domElement);\n      }\n    };\n  }, [linesGradient, enabledWaves, lineCount, lineDistance, topWavePosition, middleWavePosition, bottomWavePosition, animationSpeed, interactive, bendRadius, bendStrength, mouseDamping, parallax, parallaxStrength]);\n\n  return (\n    <div\n      ref={containerRef}\n      className=\"floating-lines-container\"\n      style={{\n        position: 'absolute',\n        top: 0,\n        left: 0,\n        width: '100%',\n        height: '100%',\n        overflow: 'hidden',\n        zIndex: -1,\n        mixBlendMode: mixBlendMode\n      }}\n    />\n  );\n}\n
