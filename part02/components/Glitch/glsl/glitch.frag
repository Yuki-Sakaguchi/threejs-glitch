#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D img1;
uniform sampler2D img2;
uniform sampler2D blockNoiseTexture;
uniform float time;
uniform float timeOffset;
uniform float glitchValue;
uniform float imgRatio;
uniform vec2 resolution;
uniform vec3 randomValues;

varying vec2 vUv;

float PI = 3.1415926535897932384626433832795;

float map(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {
    if(clamp == true) {
      if(value < inputMin) return outputMin;
      if(value > inputMax) return outputMax;
    }

    float p = (outputMax - outputMin) / (inputMax - inputMin);
    return ((value - inputMin) * p) + outputMin;
}

const int   oct  = 8;
const float per  = 0.5;
const float cCorners = 1.0 / 16.0;
const float cSides   = 1.0 / 8.0;
const float cCenter  = 1.0 / 4.0;

// 補間関数
float interpolate(float a, float b, float x){
    float f = (1.0 - cos(x * PI)) * 0.5;
    return a * (1.0 - f) + b * f;
}

// 乱数生成
float rnd(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

// 補間乱数
float irnd(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec4 v = vec4(rnd(vec2(i.x,       i.y      )),
                rnd(vec2(i.x + 1.0, i.y      )),
                rnd(vec2(i.x,       i.y + 1.0)),
                rnd(vec2(i.x + 1.0, i.y + 1.0)));
    return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}

// ノイズ生成
float noise(vec2 p){
    float t = 0.0;
    for(int i = 0; i < oct; i++){
        float freq = pow(2.0, float(i));
        float amp  = pow(per, float(oct - i));
        t += irnd(vec2(p.x / freq, p.y / freq)) * amp;
    }
    return t;
}

void main(){
    vec2 uv = vUv;

    float posY = floor(mod(-time * 0.02, resolution.y));
    float subY = posY - uv.t * resolution.y;
    if(subY > -0.45 && subY < 0.45) {
        uv.x += 0.02 * randomValues.x;
    }

    posY = floor(mod(-time * 0.03, resolution.y));
    subY = posY - uv.t * resolution.y;
    if(subY > -0.25 && subY < 0.25) {
        uv.x += 0.02 * randomValues.z;
    }

    float r = mod(time, 10.0) * 100000.0 * uv.y;
    uv.x += map(noise(vec2(randomValues.y * r, randomValues.x * r)), 0.0, 1.0, -1.0, 1.0, true) * 0.1 * glitchValue;
    uv.y += map(noise(vec2(randomValues.x * r, randomValues.z * r)), 0.0, 1.0, -1.0, 1.0, true) * 0.1 * glitchValue;

    vec4 blockNoise = texture2D(blockNoiseTexture, vUv);
    uv.x += blockNoise.r * glitchValue * 0.3;
    uv.y += blockNoise.g * glitchValue * 0.3;

    vec4 color1 = texture2D(img1, uv);
    vec4 color2 = texture2D(img2, uv);
    vec4 color = mix(color1, color2, imgRatio);
    if(color.a == 0.0) {
        discard;
    } else {
        gl_FragColor = color;
    }
}
