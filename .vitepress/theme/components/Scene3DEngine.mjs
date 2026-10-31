/**
 * Real-Time 3D Volumetric Mascot & Interactive Particle Engine
 * Renders articulated 3D characters (Mr. QA Wizard & Nova Cyber-Architect),
 * orbiting 3D holo-cubes, flying 3D neon bugs, laser beams, and explosions
 * with true 3D rotation matrices (pitch, yaw, roll) and specular shading.
 */

export function rotate3D(x, y, z, pitch, yaw, roll = 0) {
  // Rotate around Y axis (yaw)
  const cosY = Math.cos(yaw)
  const sinY = Math.sin(yaw)
  let x1 = x * cosY + z * sinY
  let z1 = -x * sinY + z * cosY
  let y1 = y

  // Rotate around X axis (pitch)
  const cosX = Math.cos(pitch)
  const sinX = Math.sin(pitch)
  let y2 = y1 * cosX - z1 * sinX
  let z2 = y1 * sinX + z1 * cosX
  let x2 = x1

  // Rotate around Z axis (roll)
  if (roll !== 0) {
    const cosZ = Math.cos(roll)
    const sinZ = Math.sin(roll)
    const x3 = x2 * cosZ - y2 * sinZ
    const y3 = x2 * sinZ + y2 * cosZ
    x2 = x3
    y2 = y3
  }

  return { x: x2, y: y2, z: z2 }
}

export function project3D(pt, cx, cy, scale = 1, fov = 320) {
  const perspective = fov / Math.max(fov - pt.z, 60)
  return {
    x: cx + pt.x * perspective * scale,
    y: cy + pt.y * perspective * scale,
    z: pt.z,
    s: perspective * scale
  }
}

/**
 * Draw a 3D shaded sphere with ambient + directional specular highlight
 */
export function drawSphere3D(ctx, x, y, radius, baseColor, highlightColor, shadowColor) {
  if (radius <= 0.5) return
  const grad = ctx.createRadialGradient(
    x - radius * 0.32,
    y - radius * 0.35,
    radius * 0.08,
    x,
    y,
    radius
  )
  grad.addColorStop(0, highlightColor)
  grad.addColorStop(0.55, baseColor)
  grad.addColorStop(1, shadowColor)

  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()
}

/**
 * Renders 3D Mr. QA Wizard at (cx, cy) with scale, 3D head orientation (pitch, yaw, roll),
 * animation time `t`, action state (`idle`, `casting`, `celebrating`, `moving`), and velocity.
 */
export function renderWizard3D(ctx, {
  cx,
  cy,
  scale = 1,
  pitch = 0,
  yaw = 0,
  roll = 0,
  t = 0,
  isCasting = false,
  isHovered = false,
  vx = 0
}) {
  ctx.save()

  const hoverBob = Math.sin(t * 3.2) * 6 * scale
  const bodyTilt = Math.max(-0.35, Math.min(0.35, vx * 0.025)) + roll
  const rootY = cy + hoverBob

  // 1. Ground / Levitation 3D Aura Shadow & Rune Ring
  ctx.save()
  ctx.translate(cx, cy + 68 * scale)
  ctx.scale(1, 0.32)
  const auraRadius = (46 + Math.sin(t * 4) * 5) * scale
  const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, auraRadius)
  auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)')
  auraGrad.addColorStop(0.5, 'rgba(79, 70, 229, 0.28)')
  auraGrad.addColorStop(1, 'rgba(79, 70, 229, 0)')
  ctx.fillStyle = auraGrad
  ctx.beginPath()
  ctx.arc(0, 0, auraRadius, 0, Math.PI * 2)
  ctx.fill()

  // Spinning magic rune circle
  ctx.strokeStyle = isCasting ? 'rgba(52, 211, 153, 0.85)' : 'rgba(56, 189, 248, 0.5)'
  ctx.lineWidth = 2 * scale
  ctx.setLineDash([8 * scale, 6 * scale])
  ctx.beginPath()
  ctx.arc(0, 0, 36 * scale, t * 1.5, t * 1.5 + Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // 2. 3D Floating Cloak / Hoodie Torso (Rounded 3D frustum)
  ctx.save()
  ctx.translate(cx, rootY + 26 * scale)
  ctx.rotate(bodyTilt * 0.6)

  const cloakGrad = ctx.createLinearGradient(-28 * scale, -22 * scale, 28 * scale, 34 * scale)
  cloakGrad.addColorStop(0, '#4f46e5')
  cloakGrad.addColorStop(0.5, '#312e81')
  cloakGrad.addColorStop(1, '#1e1b4b')

  ctx.beginPath()
  ctx.moveTo(-18 * scale, -20 * scale)
  ctx.quadraticCurveTo(-30 * scale, 12 * scale, -24 * scale, 30 * scale)
  ctx.quadraticCurveTo(0, 38 * scale, 24 * scale, 30 * scale)
  ctx.quadraticCurveTo(30 * scale, 12 * scale, 18 * scale, -20 * scale)
  ctx.closePath()
  ctx.fillStyle = cloakGrad
  ctx.fill()

  // Glowing Cyan Circuit Trim on Cloak
  ctx.strokeStyle = isCasting ? '#34d399' : '#38bdf8'
  ctx.lineWidth = 2.2 * scale
  ctx.shadowColor = isCasting ? '#34d399' : '#38bdf8'
  ctx.shadowBlur = 8 * scale
  ctx.stroke()

  // Center glowing rune line on hoodie
  ctx.beginPath()
  ctx.moveTo(0, -14 * scale)
  ctx.lineTo(0, 32 * scale)
  ctx.stroke()
  ctx.restore()

  // 3. 3D Head Sphere (rotates with pitch & yaw)
  const headCenter = project3D(
    rotate3D(0, -8, 6, pitch * 0.5, yaw * 0.5, bodyTilt),
    cx,
    rootY,
    scale
  )
  const headRadius = 25 * scale

  // Hood collar behind head
  drawSphere3D(
    ctx,
    cx,
    rootY - 4 * scale,
    28 * scale,
    '#3730a3',
    '#6366f1',
    '#1e1b4b'
  )

  // Warm 3D Stylized Face Sphere
  drawSphere3D(
    ctx,
    headCenter.x,
    headCenter.y,
    headRadius,
    '#f5cba7',
    '#fdebd0',
    '#ca8a5b'
  )

  // 4. Facial Features (3D projected onto front of head sphere)
  const faceYaw = Math.max(-0.55, Math.min(0.55, yaw))
  const facePitch = Math.max(-0.4, Math.min(0.4, pitch))

  const leftEye3D = rotate3D(-9, -9, 22, facePitch, faceYaw, bodyTilt)
  const rightEye3D = rotate3D(9, -9, 22, facePitch, faceYaw, bodyTilt)
  const nose3D = rotate3D(0, -4, 26, facePitch, faceYaw, bodyTilt)
  const mouth3D = rotate3D(0, 4, 23, facePitch, faceYaw, bodyTilt)

  const leftEyePt = project3D(leftEye3D, cx, rootY, scale)
  const rightEyePt = project3D(rightEye3D, cx, rootY, scale)
  const nosePt = project3D(nose3D, cx, rootY, scale)
  const mouthPt = project3D(mouth3D, cx, rootY, scale)

  // Blinking logic
  const isBlinking = Math.sin(t * 1.7) > 0.96

  // Eyes (Whites + Iris + Pupil)
  ;[leftEyePt, rightEyePt].forEach((eye) => {
    ctx.beginPath()
    if (isBlinking) {
      ctx.moveTo(eye.x - 4.5 * scale, eye.y)
      ctx.lineTo(eye.x + 4.5 * scale, eye.y)
      ctx.strokeStyle = '#312e81'
      ctx.lineWidth = 2.2 * scale
      ctx.stroke()
    } else {
      ctx.arc(eye.x, eye.y, 4.8 * scale, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      // Iris tracking cursor
      const pupilX = eye.x + faceYaw * 3 * scale
      const pupilY = eye.y + facePitch * 2.5 * scale
      ctx.beginPath()
      ctx.arc(pupilX, pupilY, 2.7 * scale, 0, Math.PI * 2)
      ctx.fillStyle = '#1e1b4b'
      ctx.fill()

      // Eye sparkle
      ctx.beginPath()
      ctx.arc(pupilX - 1 * scale, pupilY - 1 * scale, 1 * scale, 0, Math.PI * 2)
      ctx.fillStyle = '#38bdf8'
      ctx.fill()
    }
  })

  // 3D Glowing Cyan Wizard Glasses (in front of eyes at z=25)
  const leftLensPt = project3D(rotate3D(-9.5, -9, 25, facePitch, faceYaw, bodyTilt), cx, rootY, scale)
  const rightLensPt = project3D(rotate3D(9.5, -9, 25, facePitch, faceYaw, bodyTilt), cx, rootY, scale)

  ctx.save()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 2.4 * scale
  ctx.shadowColor = '#38bdf8'
  ctx.shadowBlur = 8 * scale

  // Left glass frame
  ctx.beginPath()
  ctx.arc(leftLensPt.x, leftLensPt.y, 7.5 * scale, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.14)'
  ctx.fill()
  ctx.stroke()

  // Right glass frame
  ctx.beginPath()
  ctx.arc(rightLensPt.x, rightLensPt.y, 7.5 * scale, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.14)'
  ctx.fill()
  ctx.stroke()

  // Bridge between lenses
  ctx.beginPath()
  ctx.moveTo(leftLensPt.x + 7 * scale, leftLensPt.y)
  ctx.lineTo(rightLensPt.x - 7 * scale, rightLensPt.y)
  ctx.stroke()
  ctx.restore()

  // Cute 3D Nose
  drawSphere3D(ctx, nosePt.x, nosePt.y, 3.2 * scale, '#f0b27a', '#fdebd0', '#ca8a5b')

  // Confident Smile
  ctx.beginPath()
  if (isCasting || isHovered) {
    ctx.arc(mouthPt.x, mouthPt.y - 1 * scale, 5.5 * scale, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.fillStyle = '#7c2d12'
    ctx.fill()
  } else {
    ctx.arc(mouthPt.x, mouthPt.y - 2 * scale, 5.5 * scale, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.strokeStyle = '#7c2d12'
    ctx.lineWidth = 2 * scale
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  // 5. 3D Wizard Hat (Brim + Conical Bent Tip with Glowing Cyan Circuit)
  const hatBasePt = project3D(rotate3D(0, -24, 4, facePitch * 0.7, faceYaw * 0.7, bodyTilt), cx, rootY, scale)
  const hatTipPt = project3D(
    rotate3D(10 + Math.sin(t * 3) * 3, -68, -6, facePitch * 0.9, faceYaw * 0.9, bodyTilt),
    cx,
    rootY,
    scale
  )

  ctx.save()
  // Hat Cone
  const hatGrad = ctx.createLinearGradient(hatBasePt.x - 24 * scale, hatBasePt.y, hatTipPt.x, hatTipPt.y)
  hatGrad.addColorStop(0, '#312e81')
  hatGrad.addColorStop(0.5, '#4f46e5')
  hatGrad.addColorStop(1, '#38bdf8')

  ctx.beginPath()
  ctx.moveTo(hatBasePt.x - 24 * scale, hatBasePt.y)
  ctx.quadraticCurveTo(hatBasePt.x - 8 * scale, hatBasePt.y - 34 * scale, hatTipPt.x, hatTipPt.y)
  ctx.quadraticCurveTo(hatBasePt.x + 16 * scale, hatBasePt.y - 26 * scale, hatBasePt.x + 24 * scale, hatBasePt.y)
  ctx.closePath()
  ctx.fillStyle = hatGrad
  ctx.fill()

  // Glowing hat band
  ctx.beginPath()
  ctx.ellipse(hatBasePt.x, hatBasePt.y - 2 * scale, 24 * scale, 6 * scale, bodyTilt * 0.5, 0, Math.PI * 2)
  ctx.fillStyle = '#7c3aed'
  ctx.fill()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1.8 * scale
  ctx.stroke()

  // Wide 3D Hat Brim
  ctx.beginPath()
  ctx.ellipse(hatBasePt.x, hatBasePt.y + 2 * scale, 38 * scale, 10 * scale, bodyTilt * 0.5, 0, Math.PI * 2)
  const brimGrad = ctx.createRadialGradient(hatBasePt.x, hatBasePt.y, 8 * scale, hatBasePt.x, hatBasePt.y, 38 * scale)
  brimGrad.addColorStop(0, '#4338ca')
  brimGrad.addColorStop(0.75, '#1e1b4b')
  brimGrad.addColorStop(1, '#38bdf8')
  ctx.fillStyle = brimGrad
  ctx.fill()
  ctx.restore()

  // 6. 3D Levitating Hands & Futuristic Magnifying Staff
  const staffSwing = isCasting ? Math.sin(t * 18) * 14 : Math.sin(t * 3.5) * 4
  const rightHandPt = project3D(
    rotate3D(32, 12 + staffSwing * 0.4, 18, facePitch * 0.3, faceYaw * 0.3, bodyTilt),
    cx,
    rootY,
    scale
  )
  const leftHandPt = project3D(
    rotate3D(-32, 10 - staffSwing * 0.4, 20, facePitch * 0.3, faceYaw * 0.3, bodyTilt),
    cx,
    rootY,
    scale
  )

  // Staff Handle & Glowing Magnifying Lens
  const staffTopX = rightHandPt.x + (8 + staffSwing * 0.5) * scale
  const staffTopY = rightHandPt.y - 32 * scale
  const staffBotX = rightHandPt.x - 6 * scale
  const staffBotY = rightHandPt.y + 26 * scale

  ctx.save()
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 4 * scale
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(staffBotX, staffBotY)
  ctx.lineTo(staffTopX, staffTopY)
  ctx.stroke()

  // Magnifying Glass 3D Ring & Translucent Lens
  ctx.beginPath()
  ctx.arc(staffTopX, staffTopY - 12 * scale, 14 * scale, 0, Math.PI * 2)
  ctx.fillStyle = isCasting ? 'rgba(52, 211, 153, 0.38)' : 'rgba(56, 189, 248, 0.25)'
  ctx.fill()
  ctx.lineWidth = 3.5 * scale
  ctx.strokeStyle = isCasting ? '#34d399' : '#38bdf8'
  ctx.shadowColor = isCasting ? '#34d399' : '#38bdf8'
  ctx.shadowBlur = 14 * scale
  ctx.stroke()
  ctx.restore()

  // Draw 3D Hands
  drawSphere3D(ctx, rightHandPt.x, rightHandPt.y, 7.5 * scale, '#f5cba7', '#fdebd0', '#ca8a5b')
  drawSphere3D(ctx, leftHandPt.x, leftHandPt.y, 7.5 * scale, '#f5cba7', '#fdebd0', '#ca8a5b')

  // Magic orb floating above left hand
  const orbY = leftHandPt.y - (14 + Math.sin(t * 6) * 4) * scale
  drawSphere3D(
    ctx,
    leftHandPt.x,
    orbY,
    (isCasting ? 9 : 6) * scale,
    '#10b981',
    '#a7f3d0',
    '#047857'
  )

  ctx.restore()

  // Return staff tip coordinates so laser beams can fire from the magnifying glass!
  return {
    staffTipX: staffTopX,
    staffTipY: staffTopY - 12 * scale
  }
}

/**
 * Renders 3D Nova (The AI & Automation Cyber-Architect) at (cx, cy) with 3D orientation,
 * orbiting holographic code cubes, expressive LED visor eyes, and hovering cyber-hands.
 */
export function renderNova3D(ctx, {
  cx,
  cy,
  scale = 1,
  pitch = 0,
  yaw = 0,
  roll = 0,
  t = 0,
  isCasting = false,
  isHovered = false,
  vx = 0
}) {
  ctx.save()

  const hoverBob = Math.cos(t * 3.4) * 6 * scale
  const bodyTilt = Math.max(-0.35, Math.min(0.35, vx * 0.025)) + roll
  const rootY = cy + hoverBob

  // 1. Ground 3D Cyber Pulse Ring
  ctx.save()
  ctx.translate(cx, cy + 68 * scale)
  ctx.scale(1, 0.32)
  const auraRadius = (46 + Math.cos(t * 4.5) * 5) * scale
  const auraGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, auraRadius)
  auraGrad.addColorStop(0, 'rgba(192, 132, 252, 0.6)')
  auraGrad.addColorStop(0.5, 'rgba(34, 211, 238, 0.25)')
  auraGrad.addColorStop(1, 'rgba(168, 85, 247, 0)')
  ctx.fillStyle = auraGrad
  ctx.beginPath()
  ctx.arc(0, 0, auraRadius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // 2. Back-side Orbiting 3D Holographic Nodes (z < 0)
  const orbitNodes = [0, 1, 2, 3].map((i) => {
    const angle = t * 1.8 + (i * Math.PI) / 2
    const ox = Math.cos(angle) * 48
    const oz = Math.sin(angle) * 48
    const oy = Math.sin(angle * 2) * 10 + 4
    return {
      ...project3D({ x: ox, y: oy, z: oz }, cx, rootY, scale),
      i
    }
  })

  orbitNodes
    .filter((n) => n.z < 0)
    .forEach((n) => {
      drawSphere3D(ctx, n.x, n.y, 4.5 * n.s, '#a855f7', '#f3e8ff', '#581c87')
    })

  // 3. 3D Cyber-Armor Torso (Sleek pearl-titanium pod)
  ctx.save()
  ctx.translate(cx, rootY + 26 * scale)
  ctx.rotate(bodyTilt * 0.6)

  const armorGrad = ctx.createLinearGradient(-24 * scale, -18 * scale, 24 * scale, 28 * scale)
  armorGrad.addColorStop(0, '#e2e8f0')
  armorGrad.addColorStop(0.45, '#64748b')
  armorGrad.addColorStop(1, '#1e1b4b')

  ctx.beginPath()
  ctx.moveTo(-20 * scale, -16 * scale)
  ctx.quadraticCurveTo(-24 * scale, 10 * scale, -12 * scale, 26 * scale)
  ctx.quadraticCurveTo(0, 32 * scale, 12 * scale, 26 * scale)
  ctx.quadraticCurveTo(24 * scale, 10 * scale, 20 * scale, -16 * scale)
  ctx.closePath()
  ctx.fillStyle = armorGrad
  ctx.fill()
  ctx.strokeStyle = '#c084fc'
  ctx.lineWidth = 2 * scale
  ctx.stroke()

  // Glowing AI Core Reactor on Chest
  ctx.beginPath()
  ctx.arc(0, 4 * scale, 7 * scale, 0, Math.PI * 2)
  ctx.fillStyle = isCasting ? '#34d399' : '#22d3ee'
  ctx.shadowColor = isCasting ? '#34d399' : '#22d3ee'
  ctx.shadowBlur = 12 * scale
  ctx.fill()
  ctx.restore()

  // 4. 3D Robot Helmet Sphere (Pearl-Violet & Titanium)
  const faceYaw = Math.max(-0.55, Math.min(0.55, yaw))
  const facePitch = Math.max(-0.4, Math.min(0.4, pitch))
  const headPt = project3D(
    rotate3D(0, -10, 6, facePitch * 0.5, faceYaw * 0.5, bodyTilt),
    cx,
    rootY,
    scale
  )

  // Ear-pods (3D side cylinders)
  const leftEarPt = project3D(rotate3D(-27, -10, 4, facePitch, faceYaw, bodyTilt), cx, rootY, scale)
  const rightEarPt = project3D(rotate3D(27, -10, 4, facePitch, faceYaw, bodyTilt), cx, rootY, scale)
  drawSphere3D(ctx, leftEarPt.x, leftEarPt.y, 7.5 * scale, '#7c3aed', '#d8b4fe', '#3b0764')
  drawSphere3D(ctx, rightEarPt.x, rightEarPt.y, 7.5 * scale, '#7c3aed', '#d8b4fe', '#3b0764')

  // Main Helmet Sphere
  drawSphere3D(
    ctx,
    headPt.x,
    headPt.y,
    27 * scale,
    '#94a3b8',
    '#f8fafc',
    '#312e81'
  )

  // 5. 3D Glossy Black LED Visor Screen on Front of Helmet
  const visorCenter = project3D(rotate3D(0, -10, 22, facePitch, faceYaw, bodyTilt), cx, rootY, scale)
  ctx.save()
  ctx.translate(visorCenter.x, visorCenter.y)
  ctx.rotate(bodyTilt * 0.5)

  ctx.beginPath()
  ctx.roundRect(-19 * scale, -13 * scale, 38 * scale, 25 * scale, 11 * scale)
  ctx.fillStyle = '#090a14'
  ctx.fill()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1.8 * scale
  ctx.stroke()

  // Glowing LED Eyes inside Visor
  const eyeOffsetX = faceYaw * 5 * scale
  const eyeOffsetY = facePitch * 4 * scale
  const isBlinking = Math.cos(t * 2.1) > 0.96

  ctx.shadowColor = '#22d3ee'
  ctx.shadowBlur = 10 * scale
  ctx.fillStyle = isCasting ? '#34d399' : '#22d3ee'
  ctx.strokeStyle = isCasting ? '#34d399' : '#22d3ee'
  ctx.lineWidth = 2.6 * scale
  ctx.lineCap = 'round'

  if (isBlinking) {
    // Happy blink arcs
    ctx.beginPath()
    ctx.moveTo(-12 * scale + eyeOffsetX, -2 * scale + eyeOffsetY)
    ctx.lineTo(-4 * scale + eyeOffsetX, -2 * scale + eyeOffsetY)
    ctx.moveTo(4 * scale + eyeOffsetX, -2 * scale + eyeOffsetY)
    ctx.lineTo(12 * scale + eyeOffsetX, -2 * scale + eyeOffsetY)
    ctx.stroke()
  } else if (isCasting || isHovered) {
    // Excited '^ ^' cyber eyes
    ctx.beginPath()
    ctx.arc(-8.5 * scale + eyeOffsetX, -1 * scale + eyeOffsetY, 4.5 * scale, Math.PI, 0)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(8.5 * scale + eyeOffsetX, -1 * scale + eyeOffsetY, 4.5 * scale, Math.PI, 0)
    ctx.stroke()
  } else {
    // Glowing cyan/violet digital eyes
    ctx.beginPath()
    ctx.arc(-8.5 * scale + eyeOffsetX, -2 * scale + eyeOffsetY, 4.8 * scale, 0, Math.PI * 2)
    ctx.arc(8.5 * scale + eyeOffsetX, -2 * scale + eyeOffsetY, 4.8 * scale, 0, Math.PI * 2)
    ctx.fill()

    // Inner violet core
    ctx.fillStyle = '#c084fc'
    ctx.beginPath()
    ctx.arc(-8.5 * scale + eyeOffsetX, -2 * scale + eyeOffsetY, 2 * scale, 0, Math.PI * 2)
    ctx.arc(8.5 * scale + eyeOffsetX, -2 * scale + eyeOffsetY, 2 * scale, 0, Math.PI * 2)
    ctx.fill()
  }

  // LED Smile
  ctx.beginPath()
  ctx.arc(eyeOffsetX * 0.6, 4 * scale + eyeOffsetY * 0.6, 5 * scale, 0.15 * Math.PI, 0.85 * Math.PI)
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 2 * scale
  ctx.stroke()
  ctx.restore()

  // 6. 3D Hovering Cyber Hands & Front Orbiting Nodes (z >= 0)
  const handWave = isCasting ? Math.cos(t * 16) * 12 : Math.cos(t * 3.8) * 5
  const leftHandPt = project3D(
    rotate3D(-34, 10 + handWave * 0.4, 20, facePitch * 0.3, faceYaw * 0.3, bodyTilt),
    cx,
    rootY,
    scale
  )
  const rightHandPt = project3D(
    rotate3D(34, 10 - handWave * 0.4, 20, facePitch * 0.3, faceYaw * 0.3, bodyTilt),
    cx,
    rootY,
    scale
  )

  drawSphere3D(ctx, leftHandPt.x, leftHandPt.y, 7 * scale, '#cbd5e1', '#ffffff', '#475569')
  drawSphere3D(ctx, rightHandPt.x, rightHandPt.y, 7 * scale, '#cbd5e1', '#ffffff', '#475569')

  // Front orbiting holographic spheres + `< >` symbols
  orbitNodes
    .filter((n) => n.z >= 0)
    .forEach((n) => {
      drawSphere3D(ctx, n.x, n.y, 5.5 * n.s, '#22d3ee', '#ecfeff', '#0284c7')
    })

  ctx.restore()

  return {
    emitterX: rightHandPt.x,
    emitterY: rightHandPt.y
  }
}

/**
 * Renders a 3D Flying Neon Software Bug at (x, y) with flapping wings
 */
export function renderBug3D(ctx, bug, t) {
  ctx.save()
  ctx.translate(bug.x, bug.y)
  const wingFlap = Math.sin(t * 28 + bug.id) * 0.55

  // Left Wing
  ctx.save()
  ctx.rotate(-0.5 + wingFlap)
  ctx.beginPath()
  ctx.ellipse(-9, -4, 9, 4.5, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(52, 211, 153, 0.55)'
  ctx.fill()
  ctx.restore()

  // Right Wing
  ctx.save()
  ctx.rotate(0.5 - wingFlap)
  ctx.beginPath()
  ctx.ellipse(9, -4, 9, 4.5, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(52, 211, 153, 0.55)'
  ctx.fill()
  ctx.restore()

  // Glowing 3D Bug Body
  drawSphere3D(ctx, 0, 0, 8.5, '#10b981', '#a7f3d0', '#064e3b')

  // Bug Antennae
  ctx.strokeStyle = '#34d399'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(-3, -6)
  ctx.lineTo(-6, -12)
  ctx.moveTo(3, -6)
  ctx.lineTo(6, -12)
  ctx.stroke()

  ctx.restore()
}

/**
 * Shared 60FPS Synchronization Bridge between:
 * 1. HeroInteractiveStage.vue (Plane: 'stage')
 * 2. CharacterPathShowcase.vue (Plane: 'cards')
 * 3. CharacterCompanion.vue (Plane: 'screen')
 * Ensures Mr. QA Wizard & Nova are true singletons (never duplicated) and
 * smoothly migrate between the 3D Stage, 3D Mentor Cards, and Screen.
 */
export const stageBridge = {
  isStageMounted: false,
  isStageVisible: false,
  wizardStageScreen: { x: 640, y: 300 },
  novaStageScreen: { x: 880, y: 300 },

  isCardsMounted: false,
  isCardsVisible: false,
  wizardCardScreen: { x: 360, y: 420 },
  novaCardScreen: { x: 860, y: 420 },

  // Active foreground 3D container: 'stage' | 'cards' | 'none'
  activePlane: 'none',

  // Whether each mentor is currently out on the full-screen overlay
  wizInScreenPlane: false,
  novaInScreenPlane: false,

  // True while flying back from the screen into the active 3D plane ('stage' or 'cards')
  wizReturning: false,
  novaReturning: false,

  // Current movement mode & selected mentor synced from CharacterCompanion
  roamMode: 'roam',
  activeMentor: 'wizard'
}

/**
 * Renders an empty 3D perspective holo-pedestal / portal ring on the stage or card pod floor
 * when a character has migrated onto the screen (e.g., following the mouse or scrolling).
 */
export function renderStagePortalPad(ctx, cx, cy, color = '#38bdf8', t = 0, label = '') {
  ctx.save()

  // Perspective floor ellipse
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(1, 0.36)

  const pulse = 1 + Math.sin(t * 4) * 0.08
  const outerR = 38 * pulse

  const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, outerR)
  grad.addColorStop(0, 'rgba(56, 189, 248, 0.35)')
  grad.addColorStop(0.6, 'rgba(99, 102, 241, 0.14)')
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, outerR, 0, Math.PI * 2)
  ctx.fill()

  // Outer spinning dashed holo-ring
  ctx.strokeStyle = color
  ctx.lineWidth = 2.2
  ctx.shadowColor = color
  ctx.shadowBlur = 10
  ctx.setLineDash([7, 5])
  ctx.beginPath()
  ctx.arc(0, 0, 30 * pulse, t * 2.2, t * 2.2 + Math.PI * 2)
  ctx.stroke()

  // Inner counter-spinning ring
  ctx.setLineDash([4, 6])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(0, 0, 17, -t * 3, -t * 3 + Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // Vertical holographic energy beam columns rising from the empty pedestal
  ctx.save()
  const beamAlpha = 0.16 + Math.sin(t * 5) * 0.06
  ctx.strokeStyle = color
  ctx.globalAlpha = beamAlpha
  ctx.lineWidth = 1.2
  for (let i = -1; i <= 1; i++) {
    const bx = cx + i * 14
    const byTop = cy - 42 - Math.sin(t * 4 + i) * 8
    ctx.beginPath()
    ctx.moveTo(bx, cy)
    ctx.lineTo(bx, byTop)
    ctx.stroke()
  }
  ctx.restore()

  if (label) {
    ctx.save()
    ctx.font = '700 9px Outfit, sans-serif'
    ctx.fillStyle = color
    ctx.globalAlpha = 0.78
    ctx.textAlign = 'center'
    ctx.fillText(label, cx, cy - 22 + Math.sin(t * 3) * 3)
    ctx.restore()
  }

  ctx.restore()
}

/**
 * Renders 3D dimensional warp rings around a character while it transitions
 * between the screen plane and the 3D Stage / Card plane.
 */
export function renderPlaneTransitionRings(ctx, cx, cy, scale = 1, color = '#38bdf8', progress = 0.5, t = 0) {
  ctx.save()
  ctx.translate(cx, cy)

  const ringCount = 3
  for (let i = 0; i < ringCount; i++) {
    const offset = ((t * 3 + i / ringCount) % 1)
    const ringY = (offset - 0.5) * 90 * scale
    const ringRadius = (48 - Math.abs(offset - 0.5) * 35) * scale

    ctx.save()
    ctx.translate(0, ringY)
    ctx.scale(1, 0.35)
    ctx.strokeStyle = color
    ctx.globalAlpha = Math.max(0.15, (1 - Math.abs(offset - 0.5) * 1.8) * 0.75)
    ctx.lineWidth = 2.5 * scale
    ctx.shadowColor = color
    ctx.shadowBlur = 12
    ctx.beginPath()
    ctx.arc(0, 0, Math.max(6, ringRadius), 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  ctx.restore()
}

/**
 * Renders a 3D Holographic Synergy Link & Energy Sparks between Mr. QA Wizard and Nova
 * when they meet and interact on screen.
 */
export function renderMentorSynergyLink(ctx, x1, y1, x2, y2, t = 0) {
  ctx.save()

  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2 - 18 + Math.sin(t * 5) * 6

  // Glowing gradient connection arc
  const grad = ctx.createLinearGradient(x1, y1, x2, y2)
  grad.addColorStop(0, '#38bdf8')
  grad.addColorStop(0.5, '#34d399')
  grad.addColorStop(1, '#c084fc')

  ctx.strokeStyle = grad
  ctx.lineWidth = 2.6
  ctx.shadowColor = '#38bdf8'
  ctx.shadowBlur = 12
  ctx.setLineDash([6, 5])
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.quadraticCurveTo(midX, midY, x2, y2)
  ctx.stroke()

  // Travelling 3D data pulse spheres along the synergy arc
  for (let i = 0; i < 3; i++) {
    const p = ((t * 1.4 + i / 3) % 1)
    const inv = 1 - p
    const px = inv * inv * x1 + 2 * inv * p * midX + p * p * x2
    const py = inv * inv * y1 + 2 * inv * p * midY + p * p * y2
    drawSphere3D(
      ctx,
      px,
      py,
      4.2,
      i % 2 === 0 ? '#38bdf8' : '#c084fc',
      '#ffffff',
      '#312e81'
    )
  }

  ctx.restore()
}



