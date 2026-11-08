export const VERT = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/** Three soft drifting light pools over the base colour, with dithering to stop banding. */
export const FRAG = /* glsl */ `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uBg;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uStrength;

float pool(vec2 p, vec2 c, float r) {
  vec2 d = p - c;
  return exp(-dot(d, d) / (r * r));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.035;

  vec2 c1 = vec2((0.18 + 0.10 * sin(t * 1.3)) * aspect, 0.82 + 0.08 * cos(t * 0.9));
  vec2 c2 = vec2((0.82 + 0.08 * cos(t * 1.1)) * aspect, 0.30 + 0.12 * sin(t * 0.7));
  vec2 c3 = vec2((0.50 + 0.20 * sin(t * 0.5)) * aspect, -0.05 + 0.10 * cos(t * 1.7));

  vec3 col = uBg;
  col = mix(col, uA, pool(p, c1, 0.55) * 0.42 * uStrength);
  col = mix(col, uB, pool(p, c2, 0.65) * 0.50 * uStrength);
  col = mix(col, uC, pool(p, c3, 0.70) * 0.55 * uStrength);

  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (n - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;
