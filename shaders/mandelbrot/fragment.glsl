precision highp float;
precision highp int;
uniform float offsetX;
uniform float offsetY;
uniform float ww;
uniform float wh;
uniform float zoom;
uniform int maxIterations;
uniform int colorScheme;

float modI(float a,float b) {
  float m=a-floor((a+0.5)/b)*b;
  return floor(m+0.5);
}

void main(void) {
  float x0 = (gl_FragCoord.x - ww/2.0)*(0.0004*zoom) + (offsetX * 0.25) - 0.5;
  float y0 = (gl_FragCoord.y - wh/2.0)*(0.0004*zoom) + (offsetY * 0.25);
  float x = 0.0;
  float y = 0.0;

  int iteration = 0;
  for (int i = 0; i < 999999; i++) {
    if (x*x + y*y > 4.0 || i > maxIterations)
        break;

    float temp = x*x - y*y + x0;
    y = 2.0*x*y + y0;
    x = temp;
    iteration++;
  }

  float q = float(iteration)/float(maxIterations);
  q = q > 1.0 ? 1.0 : q;
  q = q < 0.0 ? 0.0 : q;

  vec3 color; // COLORING https://stackoverflow.com/questions/16500656/which-color-gradient-is-used-to-color-mandelbrot-in-wikipedia

  if (colorScheme == 0) {
    if (q == 1.0)
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    else if (q > 0.5)
      gl_FragColor = vec4(q, 1.0, q, 1.0);
    else
      gl_FragColor = vec4(0.1, q, 0.1, 1.0);
  } else if (colorScheme == 1) {
    float i = modI(float(iteration), float(16));
    if(i < 1.0 ) color = vec3(66, 30, 15) / float(255); else
    if(i < 2.0 ) color = vec3(25, 7, 26) / float(255); else
    if(i < 3.0 ) color = vec3(9, 1, 47) / float(255); else
    if(i < 4.0 ) color = vec3(4, 4, 73) / float(255); else
    if(i < 5.0 ) color = vec3(0, 7, 100) / float(255); else
    if(i < 6.0 ) color = vec3(12, 44, 138) / float(255); else
    if(i < 7.0 ) color = vec3(24, 82, 177) / float(255); else
    if(i < 8.0 ) color = vec3(57, 125, 209) / float(255); else
    if(i < 9.0 ) color = vec3(134, 181, 229) / float(255); else
    if(i < 10.0 ) color = vec3(211, 236, 248) / float(255); else
    if(i < 11.0 ) color = vec3(241, 233, 191) / float(255); else
    if(i < 12.0 ) color = vec3(248, 201, 95) / float(255); else
    if(i < 13.0 ) color = vec3(255, 170, 0) / float(255); else
    if(i < 14.0 ) color = vec3(204, 128, 0) / float(255); else
    if(i < 15.0 ) color = vec3(153, 87, 0) / float(255); else
    if(i < 16.0 ) color = vec3(106, 52, 3) / float(255);
    if (q >= 0.99) color = vec3(0,0,0);

    gl_FragColor = vec4(color, 1.0);
  } else {
    gl_FragColor = vec4(vec3(1 - (iteration/maxIterations)), 1.0);
  }
}