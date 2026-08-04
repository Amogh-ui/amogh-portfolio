import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const noiseFieldShader = `
  precision highp float;

  uniform float uTime;
  uniform float uAmplitude;
  uniform float uReveal;

  varying vec2 vUv;

  void main() {
    vec2 c = 2.0 * vUv - 1.0;
    float ds = uAmplitude * uReveal;

    c += ds * 0.4 * sin(c.yx + vec2(1.2, 3.4) + uTime);
    c += ds * 0.2 * sin(5.2 * c.yx + vec2(3.5, 0.4) + uTime);
    c += ds * 0.3 * sin(3.5 * c.yx + vec2(1.2, 3.1) + uTime);
    c += ds * 1.6 * sin(0.4 * c.yx + vec2(0.8, 2.4) + uTime);

    float L = length(c);
    float v = 0.0;
    for (int i = 0; i < 4; i++) {
      v = mix(v, float(i) / 3.0, cos(float(i) * L));
    }

    gl_FragColor = vec4(clamp(v, 0.0, 1.0), 0.0, 0.0, 1.0);
  }
`

const halftoneShader = `
  precision highp float;

  uniform sampler2D uFieldTex;
  uniform vec2 uFieldRes;
  uniform vec2 uResolution;
  uniform float uReveal;

  uniform float uPixelSize;
  uniform float uGooeyness;
  uniform float uContrast;
  uniform float uBias;
  uniform int uInvert;
  uniform vec3 uBg;
  uniform vec3 uFg;
  uniform int uTransparentBg;

  uniform float uWaveTime;
  uniform float uWaveFrequency;
  uniform float uWaveAmplitude;

  varying vec2 vUv;

  float lumaToRadius(float luma, float pixelSize, float biasOffset) {
    float v = clamp((luma - 0.5 + uBias + biasOffset) * uContrast + 0.5, 0.0, 1.0);
    if (uInvert == 1) v = 1.0 - v;
    return v * pixelSize * 0.6 + pixelSize * 0.05;
  }

  float smin(float a, float b, float k) {
    if (k <= 0.001) return min(a, b);
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }

  void main() {
    vec2 pixelCoord = vUv * uResolution;
    vec2 baseCellIndex = floor(pixelCoord / uPixelSize);
    float minDist = 1.0e5;
    float smoothK = uGooeyness * 1.5;

    const int R = 1;
    for (int dx = -R; dx <= R; dx++) {
      for (int dy = -R; dy <= R; dy++) {
        vec2 cellIndex = baseCellIndex + vec2(float(dx), float(dy));
        if (mod(cellIndex.x + cellIndex.y, 2.0) > 0.5) continue;

        vec2 cellCenter = (cellIndex + 0.5) * uPixelSize;
        vec2 fieldUv    = (cellIndex + 0.5) / uFieldRes;
        float luma      = texture2D(uFieldTex, fieldUv).r;

        float cellY     = cellCenter.y / uResolution.y;
        float wavePhase = cellY * uWaveFrequency * 6.2831853 - uWaveTime;
        float waveBias  = sin(wavePhase) * uWaveAmplitude;

        float dist   = length(pixelCoord - cellCenter);
        float radius = lumaToRadius(luma, uPixelSize, waveBias);
        minDist = smin(minDist, dist - radius, smoothK * uPixelSize);
      }
    }

    float aa    = max(fwidth(minDist), 0.0001);
    float shape = 1.0 - smoothstep(-aa, aa, minDist);

    if (uTransparentBg == 1) {
      gl_FragColor = vec4(uFg * uReveal, shape * uReveal);
    } else {
      vec3 color = mix(uBg, uFg, shape);
      gl_FragColor = vec4(color * uReveal, 1.0);
    }
  }
`

function hexToRgbVector(hex) {
  const c = new THREE.Color(hex)
  return new THREE.Vector3(c.r, c.g, c.b)
}

const defaultParams = {
  amplitude: 0.8,
  timeSpeed: 0.0045,
  holdAmplitudeMultiplier: 2.0,
  holdTimeSpeedMultiplier: 1.5,
  lerpSpeed: 0.03,
  autoReveal: true,
  revealDuration: 2.0,
  revealDelay: 0.3,
  pixelSize: 4,
  gooeyness: 0.58,
  contrast: 1.5,
  bias: 0.0,
  invert: 1,
  bg: '#02040a', // User website dark background
  fg: '#2f79ff', // User website accent blue
  transparentBg: 0,
  waveFrequency: 1.0,
  waveAmplitude: 0.0,
  waveTimeSpeed: 0.0,
  maxDpr: 1.5,
  targetFrameMs: 1000 / 60,
  interactive: true
}

export function createHalftoneAnimation(container, canvas, options = {}) {
  if (!container || !canvas) {
    return null
  }

  const params = { ...defaultParams, ...options }
  const sceneNoise = new THREE.Scene()
  const sceneHalftone = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
  renderer.setClearColor(0, params.transparentBg ? 0 : 1)

  // WebGLRenderTarget to store the noise field texture (Red channel format)
  const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RedFormat,
    type: THREE.UnsignedByteType,
    depthBuffer: false,
    stencilBuffer: false
  })

  const planeGeo = new THREE.PlaneGeometry(2, 2)

  const noiseMat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: noiseFieldShader,
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: params.amplitude },
      uReveal: { value: 0 }
    }
  })

  const halftoneMat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: halftoneShader,
    transparent: params.transparentBg === 1,
    uniforms: {
      uFieldTex: { value: renderTarget.texture },
      uFieldRes: { value: new THREE.Vector2(1, 1) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uReveal: { value: 0 },
      uPixelSize: { value: params.pixelSize },
      uGooeyness: { value: params.gooeyness },
      uContrast: { value: params.contrast },
      uBias: { value: params.bias },
      uInvert: { value: params.invert },
      uBg: { value: hexToRgbVector(params.bg) },
      uFg: { value: hexToRgbVector(params.fg) },
      uTransparentBg: { value: params.transparentBg },
      uWaveTime: { value: 0 },
      uWaveFrequency: { value: params.waveFrequency },
      uWaveAmplitude: { value: params.waveAmplitude }
    }
  })

  const meshNoise = new THREE.Mesh(planeGeo, noiseMat)
  const meshHalftone = new THREE.Mesh(planeGeo, halftoneMat)

  sceneNoise.add(meshNoise)
  sceneHalftone.add(meshHalftone)

  const state = {
    isHolding: false,
    currentAmplitude: params.amplitude,
    currentTimeSpeed: params.timeSpeed,
    reveal: 0,
    animationId: 0,
    running: false,
    lastFrameTime: performance.now()
  }

  // Handle pointer interactions for disruption
  const onMouseDown = () => { 
    state.isHolding = true
    if (window.triggerHaptic) window.triggerHaptic([15, 30, 15, 30])
  }
  const onMouseUp = () => { state.isHolding = false }

  if (params.interactive) {
    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('touchstart', onMouseDown, { passive: true })
    window.addEventListener('touchend', onMouseUp)
  }

  const resize = () => {
    const width = container.clientWidth
    const height = container.clientHeight
    if (width === 0 || height === 0) return

    const dpr = Math.min(window.devicePixelRatio, params.maxDpr)
    renderer.setSize(width, height)
    renderer.setPixelRatio(dpr)

    const renderW = width * dpr
    const renderH = height * dpr
    halftoneMat.uniforms.uResolution.value.set(renderW, renderH)

    const cellW = Math.ceil(renderW / params.pixelSize) + 1
    const cellH = Math.ceil(renderH / params.pixelSize) + 1
    renderTarget.setSize(cellW, cellH)
    halftoneMat.uniforms.uFieldRes.value.set(cellW, cellH)
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)

  let isIntersecting = true
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    isIntersecting = entry.isIntersecting
    if (isIntersecting) {
      startLoop()
    } else {
      stopLoop()
    }
  }, { threshold: 0 })
  intersectionObserver.observe(canvas)

  const animate = (now) => {
    if (!state.running) return

    const elapsed = now - state.lastFrameTime
    state.lastFrameTime = now

    // Cap delta multiplier to avoid massive jumps
    const dtMultiplier = Math.min(elapsed / params.targetFrameMs, 3)

    const targetAmp = state.isHolding ? params.amplitude * params.holdAmplitudeMultiplier : params.amplitude
    const targetSpeed = state.isHolding ? params.timeSpeed * params.holdTimeSpeedMultiplier : params.timeSpeed
    const lerpVal = 1 - Math.pow(1 - params.lerpSpeed, dtMultiplier)

    state.currentAmplitude += (targetAmp - state.currentAmplitude) * lerpVal
    state.currentTimeSpeed += (targetSpeed - state.currentTimeSpeed) * lerpVal

    noiseMat.uniforms.uAmplitude.value = state.currentAmplitude
    noiseMat.uniforms.uTime.value += state.currentTimeSpeed * dtMultiplier

    if (params.waveAmplitude > 0 && params.waveTimeSpeed > 0) {
      halftoneMat.uniforms.uWaveTime.value += params.waveTimeSpeed * dtMultiplier
    }

    // Render noise field first
    renderer.setRenderTarget(renderTarget)
    renderer.render(sceneNoise, camera)

    // Render final halftone
    renderer.setRenderTarget(null)
    renderer.render(sceneHalftone, camera)

    state.animationId = requestAnimationFrame(animate)
  }

  const startLoop = () => {
    if (state.running) return
    state.running = true
    state.lastFrameTime = performance.now()
    state.animationId = requestAnimationFrame(animate)
  }

  const stopLoop = () => {
    state.running = false
    if (state.animationId) {
      cancelAnimationFrame(state.animationId)
      state.animationId = 0
    }
  }

  const reveal = () => {
    // Smooth fade-in reveal of the halftone pattern
    let revealState = { val: 0 }
    const duration = params.revealDuration * 1000
    const startTime = performance.now()

    const updateReveal = (now) => {
      const progress = Math.min((now - startTime) / duration, 1.0)
      // Ease out quad
      const eased = progress * (2 - progress)
      
      noiseMat.uniforms.uReveal.value = eased
      halftoneMat.uniforms.uReveal.value = eased

      if (progress < 1.0) {
        requestAnimationFrame(updateReveal)
      }
    }

    setTimeout(() => {
      requestAnimationFrame(updateReveal)
    }, params.revealDelay * 1000)
  }

  const destroy = () => {
    stopLoop()
    resizeObserver.disconnect()
    intersectionObserver.disconnect()

    if (params.interactive) {
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('touchstart', onMouseDown)
      window.removeEventListener('touchend', onMouseUp)
    }

    sceneNoise.remove(meshNoise)
    sceneHalftone.remove(meshHalftone)
    planeGeo.dispose()
    noiseMat.dispose()
    halftoneMat.dispose()
    renderTarget.dispose()
    renderer.dispose()
  }

  resize()
  startLoop()
  
  if (params.autoReveal) {
    reveal()
  } else {
    noiseMat.uniforms.uReveal.value = 1
    halftoneMat.uniforms.uReveal.value = 1
  }

  return {
    destroy,
    resize,
    reveal
  }
}
