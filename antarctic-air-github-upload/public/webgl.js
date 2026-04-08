const canvas = document.getElementById('webgl-hero');
const gl = canvas.getContext('webgl', { alpha: true });

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    #ifdef GL_ES
    precision highp float;
    #endif

    uniform float u_time;
    uniform vec2 u_resolution;

    // Pseudo-random hash
    vec2 hash(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    // 2D Simplex Noise
    float noise(vec2 p) {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2
        const float K2 = 0.211324865; // (3-sqrt(3))/6
        vec2 i = floor(p + (p.x + p.y) * K1);
        vec2 a = p - i + (i.x + i.y) * K2;
        float m = step(a.y, a.x);
        vec2 o = vec2(m, 1.0 - m);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0 * K2;
        vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
        vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
        return dot(n, vec3(70.0));
    }

    // Fractional Brownian Motion (fBM)
    float fbm(vec2 uv) {
        float f = 0.0;
        mat2 m = mat2(1.6,  1.2, -1.2,  1.6);
        f  = 0.5000 * noise(uv); uv = m * uv;
        f += 0.2500 * noise(uv); uv = m * uv;
        f += 0.1250 * noise(uv); uv = m * uv;
        f += 0.0625 * noise(uv); uv = m * uv;
        return f;
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        // Keep aspect ratio
        uv.x *= u_resolution.x / u_resolution.y;

        // Ultra slow-motion time
        float t = u_time * 0.15;

        // Fluid distortion layers (Glass Curtains)
        vec2 q = vec2(0.);
        q.x = fbm(uv + 0.00 * t);
        q.y = fbm(uv + vec2(1.0));

        vec2 r = vec2(0.);
        r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
        r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

        float f = fbm(uv + r * 2.0 + t);

        // Color Palette: Midnight blue to icy blue
        vec3 deepMidnight = vec3(0.027, 0.075, 0.145) * 0.3; // #071325 darkened
        vec3 smoothBlue   = vec3(0.15, 0.35, 0.65) * 0.6;    
        vec3 icyBlue      = vec3(0.631, 0.788, 1.0);         // #a1c9ff

        // Mix base colors
        vec3 color = mix(deepMidnight, smoothBlue, clamp(f*f*3.0, 0.0, 1.0));

        // Create volumetric "glowing folds" and glass edges
        float edge = smoothstep(0.4, 0.6, abs(fract(r.y * 2.0) - 0.5) * 2.0);
        color = mix(color, deepMidnight, clamp(length(q), 0.0, 1.0));
        
        // Subtle icy-blue edge highlights glowing inside the glass folds
        color += icyBlue * pow(1.0 - edge, 4.0) * 0.25; // reduced from 1.5
        
        // Soft bokeh / volumetric depth
        color += icyBlue * f * f * f * 0.15; // reduced from 0.8

        // Stronger Vignette for text readability
        vec2 centeredUv = gl_FragCoord.xy / u_resolution.xy - 0.5;
        float vignette = 1.0 - smoothstep(0.1, 1.2, length(centeredUv));
        color *= mix(0.15, 0.8, vignette);

        gl_FragColor = vec4(color, 1.0);
    }
`;

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0,
]), gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

const timeLocation = gl.getUniformLocation(program, 'u_time');
const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function render(time) {
    gl.useProgram(program);
    gl.uniform1f(timeLocation, time * 0.001);
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
