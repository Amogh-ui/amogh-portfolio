import * as THREE from 'three'

export function createShaderAnimation(container, { reducedMotion = false } = {}) {
  if (!container) {
    return () => {}
  }

  const vertexShader = `
    void main() {
      gl_Position = vec4( position, 1.0 );
    }
  `

  const fragmentShader = `
    #define TWO_PI 6.2831853072
    #define PI 3.14159265359

    precision highp float;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;

    void main(void) {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
      vec2 pointer = (mouse * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
      float t = time*0.05;
      float lineWidth = 0.002;

      vec3 color = vec3(0.0);
      for(int j = 0; j < 3; j++){
        for(int i=0; i < 5; i++){
          color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
        }
      }

      float wave = clamp((color[0] + color[1] + color[2]) / 3.0, 0.0, 1.0);
      wave = smoothstep(0.0, 0.15, wave);

      vec3 deepNavy = vec3(0.008, 0.015, 0.07);
      vec3 oceanBlue = vec3(0.055, 0.145, 0.56);
      vec3 jellyBlue = vec3(0.11, 0.29, 0.96);
      vec3 electricCyan = vec3(0.305, 0.75, 1.0);
      vec3 softGlow = vec3(0.78, 0.9, 1.0);

      vec3 blueColor = mix(deepNavy, oceanBlue, wave);
      blueColor = mix(blueColor, jellyBlue, wave * 0.72);
      blueColor += electricCyan * wave * 0.2;
      blueColor += softGlow * pow(wave, 1.35) * 0.09;

      vec3 ambientBlue = vec3(0.012, 0.022, 0.11);
      vec3 upperGlow = vec3(0.06, 0.16, 0.66) * smoothstep(-0.85, 0.68, uv.y + 0.12);
      vec3 bloomLeft = vec3(0.09, 0.28, 1.0) * exp(-dot(uv - vec2(-0.58, 0.62), uv - vec2(-0.58, 0.62)) * 1.65);
      vec3 bloomRight = vec3(0.05, 0.2, 0.88) * exp(-dot(uv - vec2(0.72, -0.08), uv - vec2(0.72, -0.08)) * 1.9);

      blueColor = ambientBlue + upperGlow * 0.55 + bloomLeft * 0.52 + bloomRight * 0.34 + blueColor * 0.88;

      float pointerDistance = distance(uv, pointer);
      float pointerGlow = exp(-pointerDistance * pointerDistance * 18.0);
      float diagonalLines = 1.0 - smoothstep(0.02, 0.18, abs(fract((uv.x + uv.y + t * 0.42) * 4.0) - 0.5));
      float pointerGrid = pointerGlow * (0.18 + diagonalLines * 0.45);

      blueColor += vec3(0.12, 0.34, 1.0) * pointerGrid * 1.16;
      blueColor += vec3(0.5, 0.88, 1.0) * pointerGrid * 0.12;
      blueColor += vec3(0.01, 0.04, 0.14) * pointerGlow * 0.35;

      gl_FragColor = vec4(blueColor, 1.0);
    }
  `

  const camera = new THREE.Camera()
  camera.position.z = 1

  const scene = new THREE.Scene()
  const geometry = new THREE.PlaneGeometry(2, 2)

  const uniforms = {
    time: { type: 'f', value: 1.0 },
    resolution: { type: 'v2', value: new THREE.Vector2() },
    mouse: { type: 'v2', value: new THREE.Vector2() }
  }

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)

  container.appendChild(renderer.domElement)
  const appRoot = container.closest('.app')

  const state = {
    animationId: 0,
    running: false,
    finished: false,
    startTime: 0,
    pointerActive: false,
    pointerVisible: false,
    pointerMoveAt: 0,
    screenX: 0,
    screenY: 0,
    mouseCurrent: new THREE.Vector2(),
    mouseTarget: new THREE.Vector2()
  }

  const renderFrame = () => {
    renderer.render(scene, camera)
  }

  const updateCursorGlow = () => {
    if (!appRoot) {
      return
    }

    const width = renderer.domElement.width || 1
    const height = renderer.domElement.height || 1
    const xPercent = (state.mouseCurrent.x / width) * 100
    const yPercent = 100 - (state.mouseCurrent.y / height) * 100

    appRoot.style.setProperty('--cursor-glow-x', `${xPercent}%`)
    appRoot.style.setProperty('--cursor-glow-y', `${yPercent}%`)
    appRoot.style.setProperty('--cursor-glow-opacity', state.pointerActive ? '0.12' : '0.04')
    appRoot.style.setProperty('--cursor-follow-x', `${state.screenX}px`)
    appRoot.style.setProperty('--cursor-follow-y', `${state.screenY}px`)
    appRoot.style.setProperty('--cursor-follow-visible', state.pointerVisible ? '1' : '0')
  }

  const setPointerTarget = (clientX, clientY) => {
    const rect = renderer.domElement.getBoundingClientRect()

    if (!rect.width || !rect.height) {
      return
    }

    const scaleX = renderer.domElement.width / rect.width
    const scaleY = renderer.domElement.height / rect.height
    const insideBounds = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom

    state.pointerActive = insideBounds
    state.pointerVisible = true
    state.pointerMoveAt = performance.now()
    state.screenX = clientX
    state.screenY = clientY

    if (insideBounds) {
      state.mouseTarget.x = (clientX - rect.left) * scaleX
      state.mouseTarget.y = renderer.domElement.height - ((clientY - rect.top) * scaleY)
    } else {
      state.mouseTarget.x = -renderer.domElement.width
      state.mouseTarget.y = -renderer.domElement.height
    }
  }

  const onPointerMove = (event) => {
    setPointerTarget(event.clientX, event.clientY)

    if ((state.running || state.finished) && !state.animationId) {
      state.animationId = requestAnimationFrame(animate)
    }
  }

  const onPointerLeave = () => {
    state.pointerActive = false
    state.pointerVisible = false
    state.pointerMoveAt = performance.now()
    state.mouseTarget.x = -renderer.domElement.width
    state.mouseTarget.y = -renderer.domElement.height

    if ((state.running || state.finished) && !state.animationId) {
      state.animationId = requestAnimationFrame(animate)
    }
  }

  // Handle window resize
  const onWindowResize = () => {
    const width = container.clientWidth
    const height = container.clientHeight
    renderer.setSize(width, height)
    uniforms.resolution.value.x = renderer.domElement.width
    uniforms.resolution.value.y = renderer.domElement.height

    if (!state.pointerActive) {
      state.mouseCurrent.x = -renderer.domElement.width
      state.mouseCurrent.y = -renderer.domElement.height
      state.mouseTarget.copy(state.mouseCurrent)
      uniforms.mouse.value.copy(state.mouseCurrent)
    }

    updateCursorGlow()
    renderFrame()
  }

  // Initial resize
  onWindowResize()
  window.addEventListener('resize', onWindowResize, false)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerleave', onPointerLeave, false)
  window.addEventListener('blur', onPointerLeave, false)

  const animate = (now) => {
    if (!state.running && !state.finished) {
      return
    }

    if (state.running) {
      uniforms.time.value += 0.07

      if (now - state.startTime >= 4200) {
        state.running = false
        state.finished = true
      }
    }

    state.mouseCurrent.lerp(state.mouseTarget, state.pointerActive ? 0.05 : 0.05)
    uniforms.mouse.value.copy(state.mouseCurrent)
    updateCursorGlow()
    renderFrame()

    const pointerSettled =
      !state.pointerActive &&
      now - state.pointerMoveAt > 120

    if (state.running || !pointerSettled) {
      state.animationId = requestAnimationFrame(animate)
    } else {
      state.animationId = 0
      renderFrame()
    }
  }

  const start = () => {
    if (reducedMotion) {
      renderFrame()
      state.finished = true
      return
    }

    if (state.running || state.finished) {
      renderFrame()
      return
    }

    state.running = true
    state.startTime = performance.now()
    state.pointerMoveAt = state.startTime
    updateCursorGlow()
    renderFrame()
    state.animationId = requestAnimationFrame(animate)
  }

  const stop = () => {
    state.running = false

    if (state.animationId) {
      cancelAnimationFrame(state.animationId)
    }

    state.animationId = 0
  }

  // Render the initial static frame, then the caller can start the one-shot animation.
  updateCursorGlow()
  renderFrame()

  // Cleanup function
  const cleanup = () => {
    window.removeEventListener('resize', onWindowResize)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerleave', onPointerLeave)
    window.removeEventListener('blur', onPointerLeave)
    stop()

    if (container && renderer.domElement && renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement)
    }

    renderer.dispose()
    geometry.dispose()
    material.dispose()
  }

  cleanup.start = start
  cleanup.stop = stop
  cleanup.render = renderFrame

  return cleanup
}
