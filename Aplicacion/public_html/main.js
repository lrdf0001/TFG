/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

function main() {
  var CANVAS = document.getElementById("mi_canvas");
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  /*========================= GET WEBGL CONTEXT ========================= */
  var GL;
  try {
    GL = CANVAS.getContext("webgl", {antialias: true});
  } catch (e) {
    alert("WebGL context cannot be initialized");
    return false;
  }

  /*========================= SHADERS ========================= */
  /*jshint multistr: true */

  var shader_vertex_source = "\n\
            attribute vec3 position;\n\
            uniform mat4 Pmatrix, Vmatrix, Mmatrix;\n\
            attribute vec3 color;\n\
            varying vec3 vColor;\n\
            \n\
            void main(void) {\n\
            gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);\n\
            vColor = color;\n\
            }";

  var shader_fragment_source = "\n\
            precision mediump float;\n\
            varying vec3 vColor;\n\
            \n\
            void main(void) {\n\
            gl_FragColor = vec4(vColor, 1.);\n\
            }";

    var compile_shader = function(source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };

  var shader_vertex=compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
  var shader_fragment=compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

  var SHADER_PROGRAM=GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);

  GL.linkProgram(SHADER_PROGRAM);

  var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
  var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
  var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");

  var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

  GL.enableVertexAttribArray(_color);
  GL.enableVertexAttribArray(_position);

  GL.useProgram(SHADER_PROGRAM);

  /*========================= THE CUBE ========================= */
    
    var CUBE_VERTEX = GL.createBuffer ();
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER,
                  new Float32Array(LIBS.conoVertices(20,1,1.5)), //Cargamos vertices y colores
                  GL.STATIC_DRAW);

  var CUBE_FACES = GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(LIBS.conoCaras(20)),    //Cargamos las carar
                GL.STATIC_DRAW);

  /*========================= MATRIX ========================= */

  var PROJMATRIX = LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100);
  var MOVEMATRIX = LIBS.get_I4();
  var VIEWMATRIX = LIBS.get_I4();



  LIBS.translateZ(VIEWMATRIX, -6);

  /*========================= DRAWING ========================= */
  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);
  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  GL.clearDepth(1.0);

  var time_prev = 0;
  var animate = function(time) {
    var dt = time - time_prev;
    LIBS.rotateZ(MOVEMATRIX, dt*0.001);
    LIBS.rotateY(MOVEMATRIX, dt*0.0013);
    LIBS.rotateX(MOVEMATRIX, dt*0.0017);
    time_prev = time;

    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    
    GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
    GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
    GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
    
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
    
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 4*(3+3), 0);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4*(3+3), 3*4);
    GL.drawElements(GL.TRIANGLES, 20*2*3, GL.UNSIGNED_SHORT, 0);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
    
    GL.flush();

    window.requestAnimationFrame(animate);
  };
  animate(0);
}

window.addEventListener('load', main);