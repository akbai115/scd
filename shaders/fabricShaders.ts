
// ARCHITECTURE MUST BE EXPORTED. VISION IS STABLE.
export const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vStretch;
  varying float vObjectMold;

  uniform float uTime;
  uniform float uAudio;
  uniform vec2 uMouse;
  uniform vec3 uGhostPos;
  uniform float uClickImpulse;
  uniform float uViewFactor;
  uniform float uStillness;
  uniform bool uIsSpamming;
  uniform bool uIsAdmin;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - vec4(0.0, i1.x, i2.x, 1.0).xyz;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float movementFactor = 1.0 - uStillness;

    float pin = 1.0 - pow(max(abs(uv.x - 0.5), abs(uv.y - 0.5)) * 2.0, 4.0);
    float breathFreq = 0.2; 
    float breathing = (sin(uTime * breathFreq) * 0.5 + 0.5) * 0.01 * pin;
    pos.z += breathing * movementFactor;

    float distToGhost = distance(pos.xy, uGhostPos.xy);
    float ghostInfluence = smoothstep(5.0, 0.0, distToGhost); 
    pos.z += ghostInfluence * 0.2 * uViewFactor * movementFactor; 
    if(uIsAdmin) pos.z *= 1.05;

    float podDist = distance(uv, vec2(0.25, 0.4));
    float podMold = smoothstep(0.12, 0.02, podDist) * 0.15; 
    float archDist = distance(uv, vec2(0.75, 0.6));
    float archMold = smoothstep(0.15, 0.05, archDist) * 0.12; 
    
    float totalMold = podMold + archMold;
    pos.z += totalMold * uViewFactor;
    vObjectMold = totalMold;

    float distToMouse = distance(pos.xy, uMouse);
    float windRadius = 1.0;
    float mouseWind = smoothstep(windRadius, 0.0, distToMouse);
    pos.z -= mouseWind * 0.1 * movementFactor;
    
    float ripple = sin(distToMouse * 8.0 - uTime * 3.0) * uClickImpulse * 0.15 * smoothstep(1.0, 0.0, distToMouse);
    pos.z += ripple * movementFactor;

    float audioNoise = snoise(vec3(pos.xy * 0.8, uTime * 0.4)) * uAudio * 0.05 * uViewFactor;
    pos.z += audioNoise * pin * movementFactor;

    vStretch = ghostInfluence + mouseWind * 0.1 + uAudio * 0.1 + totalMold;
    vPosition = pos;
    
    float eps = 0.1;
    float n_x = snoise(vec3((pos.xy + vec2(eps, 0.0)) * 0.1, uTime * 0.02));
    float n_y = snoise(vec3((pos.xy + vec2(0.0, eps)) * 0.1, uTime * 0.02));
    vec3 bumpedNormal = normalize(vec3( (breathing - n_x)/eps, (breathing - n_y)/eps, 2.5));
    vNormal = mix(normal, bumpedNormal, 0.2);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// TEXTILE SOUL. BONE WHITE PRECISION.
export const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vStretch;
  varying float vObjectMold;

  uniform float uTime;
  uniform float uAudio;
  uniform float uViewFactor;
  uniform bool uIsHolyHour;
  uniform bool uIsSpamming;
  uniform bool uIsAdmin;

  float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float canvasWeave(vec2 uv) {
    float freq = 800.0;
    vec2 p = uv * freq;
    float pattern = mix(sin(p.x), sin(p.y), 0.5);
    return smoothstep(-1.0, 1.0, pattern);
  }

  void main() {
    vec3 goldColor = vec3(0.831, 0.686, 0.216); // GOLD #D4AF37
    
    if(uIsHolyHour) {
        goldColor = mix(goldColor, vec3(0.1, 0.1, 0.1), 0.05);
    }
    
    if(uIsAdmin) {
        goldColor = mix(goldColor, vec3(0.8, 0.4, 0.4), 0.01);
    }

    float weave = canvasWeave(vUv);
    float microGrain = random(vUv * 2000.0);
    float textileDetail = mix(weave, microGrain, 0.05);
    
    float translucency = smoothstep(0.0, 6.0, vStretch);
    vec3 darkFigure = vec3(0.02, 0.02, 0.02); 

    float moldOpacity = smoothstep(0.1, 0.6, vObjectMold);
    
    vec3 normal = normalize(vNormal);
    float lightIntensity = dot(normal, vec3(0.2, 0.2, 1.0)) * 0.4 + 0.6;
    float lightAbsorption = mix(0.95, 1.0, textileDetail);
    lightIntensity *= lightAbsorption;

    vec3 finalColor = mix(goldColor, darkFigure, translucency * 0.4);
    vec3 objectDetail = vec3(0.05, 0.05, 0.05); 
    finalColor = mix(finalColor, objectDetail, moldOpacity * 0.1);

    finalColor *= lightIntensity;
    finalColor -= (1.0 - textileDetail) * 0.02;

    float filmGrain = (random(vUv * (uTime * 0.1)) - 0.5) * 0.02; 
    finalColor += filmGrain;

    float distToCenter = distance(vUv, vec2(0.5));
    float vignette = smoothstep(1.3, 0.6, distToCenter);
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor * 0.98, 1.0);
  }
`;
