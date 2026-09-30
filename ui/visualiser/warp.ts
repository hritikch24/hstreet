/**
 * Fits a flat drawing into four points on a photo, in perspective.
 *
 * A homography (3×3 projective transform) maps the unit square onto the
 * quadrilateral the customer marked. A WebGL2 fragment shader runs its
 * inverse for every pixel: pixels inside the quad sample the drawing, the
 * rest show the photo. One draw call per change, a millisecond or so even on
 * a mid-range phone. No libraries, no server.
 */
export type Pt = [number, number];
export type Quad = [Pt, Pt, Pt, Pt]; // top-left, top-right, bottom-right, bottom-left

type M3 = [number, number, number, number, number, number, number, number, number];

/** Unit square → quad (Heckbert's closed form). Row-major. */
export function squareToQuad([[x0, y0], [x1, y1], [x2, y2], [x3, y3]]: Quad): M3 {
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  let g = 0, h = 0;
  if (Math.abs(dx3) > 1e-9 || Math.abs(dy3) > 1e-9) {
    const den = dx1 * dy2 - dx2 * dy1;
    g = (dx3 * dy2 - dx2 * dy3) / den;
    h = (dx1 * dy3 - dx3 * dy1) / den;
  }
  return [x1 - x0 + g * x1, x3 - x0 + h * x3, x0, y1 - y0 + g * y1, y3 - y0 + h * y3, y0, g, h, 1];
}

export function invert([a, b, c, d, e, f, g, h, i]: M3): M3 {
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C;
  const k = 1 / det;
  return [
    A * k, -(b * i - c * h) * k, (b * f - c * e) * k,
    B * k, (a * i - c * g) * k, -(a * f - c * d) * k,
    C * k, -(a * h - b * g) * k, (a * e - b * d) * k,
  ];
}

/** A quad is usable if it is convex and not collapsed. */
export function isSensible(q: Quad): boolean {
  let sign = 0;
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = q[i], [bx, by] = q[(i + 1) % 4], [cx, cy] = q[(i + 2) % 4];
    const z = (bx - ax) * (cy - by) - (by - ay) * (cx - bx);
    if (Math.abs(z) < 1) return false;
    const s = Math.sign(z);
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  return true;
}

/** Width ÷ height of the opening, estimated from the marked quad. */
export function aspectOf(q: Quad): number {
  const len = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const w = (len(q[0], q[1]) + len(q[3], q[2])) / 2;
  const h = (len(q[0], q[3]) + len(q[1], q[2])) / 2;
  return Math.max(0.2, Math.min(8, w / Math.max(1, h)));
}

const VERT = `#version 300 es
in vec2 a_pos;
uniform vec2 u_size;
out vec2 v_px;
void main() {
  v_px = vec2((a_pos.x * 0.5 + 0.5) * u_size.x, (1.0 - (a_pos.y * 0.5 + 0.5)) * u_size.y);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 v_px;
uniform vec2 u_size;
uniform mat3 u_inv;
uniform sampler2D u_photo;
uniform sampler2D u_front;
uniform float u_show;
uniform float u_light;
out vec4 outColour;
void main() {
  vec4 photo = texture(u_photo, v_px / u_size);
  vec3 p = u_inv * vec3(v_px, 1.0);
  vec2 uv = p.xy / p.z;
  vec2 e = fwidth(uv) * 1.2;
  float inside = smoothstep(0.0, e.x, uv.x) * smoothstep(0.0, e.x, 1.0 - uv.x)
               * smoothstep(0.0, e.y, uv.y) * smoothstep(0.0, e.y, 1.0 - uv.y);
  if (p.z <= 0.0) inside = 0.0;
  vec4 front = texture(u_front, clamp(uv, 0.0, 1.0));
  float a = front.a * inside * u_show;
  outColour = vec4(mix(photo.rgb, front.rgb * u_light, a), 1.0);
}`;

export class Warp {
  private gl: WebGL2RenderingContext;
  private prog: WebGLProgram;
  private photoTex: WebGLTexture;
  private frontTex: WebGLTexture;
  private size: [number, number] = [1, 1];

  private static checked: boolean | undefined;

  /** Asked once per page load; creating a context on every check would leak them. */
  static supported(): boolean {
    if (Warp.checked === undefined) {
      try {
        Warp.checked = !!document.createElement('canvas').getContext('webgl2');
      } catch {
        Warp.checked = false;
      }
    }
    return Warp.checked;
  }

  constructor(readonly canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false, premultipliedAlpha: false });
    if (!gl) throw new Error('WebGL2 is not available');
    this.gl = gl;
    this.prog = this.link(VERT, FRAG);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(this.prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.photoTex = gl.createTexture()!;
    this.frontTex = gl.createTexture()!;
  }

  private link(vs: string, fs: string): WebGLProgram {
    const gl = this.gl;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? 'link');
    return p;
  }

  private upload(tex: WebGLTexture, source: TexImageSource, mipmaps: boolean) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (mipmaps) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  }

  /** Frees the GPU context when the canvas is replaced. */
  dispose() {
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }

  setPhoto(photo: HTMLCanvasElement) {
    this.size = [photo.width, photo.height];
    this.canvas.width = photo.width;
    this.canvas.height = photo.height;
    this.upload(this.photoTex, photo, false);
  }

  setFront(front: HTMLCanvasElement) {
    this.upload(this.frontTex, front, true);
  }

  draw(quad: Quad, opts: { show: boolean; light: number }) {
    const gl = this.gl;
    gl.viewport(0, 0, this.size[0], this.size[1]);
    gl.useProgram(this.prog);
    const inv = invert(squareToQuad(quad));
    gl.uniformMatrix3fv(gl.getUniformLocation(this.prog, 'u_inv'), true, inv);
    gl.uniform2f(gl.getUniformLocation(this.prog, 'u_size'), this.size[0], this.size[1]);
    gl.uniform1f(gl.getUniformLocation(this.prog, 'u_show'), opts.show ? 1 : 0);
    gl.uniform1f(gl.getUniformLocation(this.prog, 'u_light'), opts.light);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.photoTex);
    gl.uniform1i(gl.getUniformLocation(this.prog, 'u_photo'), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.frontTex);
    gl.uniform1i(gl.getUniformLocation(this.prog, 'u_front'), 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

/**
 * How bright the photo is around the opening, as a multiplier for the
 * drawing, so a dull day or a night shot doesn't get a glowing new front.
 */
export function lightFor(photo: HTMLCanvasElement, q: Quad): number {
  const xs = q.map((p) => p[0]);
  const ys = q.map((p) => p[1]);
  const x = Math.max(0, Math.min(...xs));
  const y = Math.max(0, Math.min(...ys));
  const w = Math.max(1, Math.min(photo.width, Math.max(...xs)) - x);
  const h = Math.max(1, Math.min(photo.height, Math.max(...ys)) - y);
  const probe = document.createElement('canvas');
  probe.width = 32;
  probe.height = 32;
  const ctx = probe.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(photo, x, y, w, h, 0, 0, 32, 32);
  const d = ctx.getImageData(0, 0, 32, 32).data;
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
  const lum = sum / (d.length / 4) / 255;
  return Math.max(0.62, Math.min(1.08, 0.78 + (lum - 0.45) * 0.7));
}
