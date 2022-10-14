

function main(){
    
    var CANVAS = document.getElementById("mi_canvas");                          //Obtención del canvas
    
    CANVAS.width = window.innerWidth;                                           //Redimensionar canvas        
    CANVAS.height = window.innerHeight;
    
    /*========================= GET WEBGL CONTEXT ========================= */
    var GL;
    try{
        GL = CANVAS.getContext("webgl",{antialias: true});
    }catch(e){ 
        alert("WebGL context cannot be initialized");
        return false;
    }
    
    /*========================= SHADERS ========================= */
    //Códdigo de los shaders
    var shader_vertex_source="\n\
                attribute vec3 position;\n\
                uniform mat4 Pmatrix;\n\
                uniform mat4 Vmatrix; // view matrix\n\
                uniform mat4 Mmatrix; // movement matrix\n\
                attribute vec3 color; // the color of the point\n\
                varying vec3 vColor;\n\
                void main(void) { // pre-built function\n\
                gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
                vColor = color;\n\
                }";
    
    var shader_fragment_source = "\n\
                precision mediump float;\n\
                varying vec3 vColor;\n\
                void main(void) {\n\
                gl_FragColor = vec4(vColor, 1.); \n\
                }";
    
    //Funcion que compila shaders
    var compile_shader = function(source, type, typeString){                    
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };
    
    //Compilación de shaders
    var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");
    
    //Creación del programa shader
    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);
    GL.linkProgram(SHADER_PROGRAM);
    
    var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
    var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
    var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");
    
    //Asociamos la atributo GLSL 'posicion' a la variable '_posicion'
    var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
    
    

    //Activamos el atributo
    GL.enableVertexAttribArray(_position);
    GL.enableVertexAttribArray(_color);

    //Usamos los shaders en el rendering 
    GL.useProgram(SHADER_PROGRAM);
    
    /*========================= THE TRIANGLE ========================= */
    // PUNTOS:
    var triangle_vertex = [ -1, -1, 0,
                            0, 0, 1,
                            1, -1, 0,
                            1, 1, 0,
                            1, 1, 0,
                            1, 0, 0];
    
    var TRIANGLE_VERTEX = GL.createBuffer ();
    GL.bindBuffer( GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
    GL.bufferData( GL.ARRAY_BUFFER,
                    new Float32Array(triangle_vertex),
                    GL.STATIC_DRAW);
    
    // INDICES:
    var triangle_faces = [0, 1, 2];
    var TRIANGLE_FACES = GL.createBuffer ();
    GL.bindBuffer( GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    GL.bufferData( GL.ELEMENT_ARRAY_BUFFER,
                    new Uint16Array(triangle_faces),
                    GL.STATIC_DRAW);
                    
    /*========================= MATRIX ========================= */
    var PROJMATRIX = LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100);
    var MOVEMATRIX = LIBS.get_I4();
    var VIEWMATRIX = LIBS.get_I4();
    
    LIBS.translateZ(VIEWMATRIX, -5); //Trasladar el tringulo pa verlo
    /*========================= DRAWING ========================= */
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
    
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearDepth(1.0);

    //Funcion de dibujado
    var time_prev = 0;
    var animate = function(time) {
        var dAngle = 0.002*(time-time_prev); //Ajustar velocidad
        LIBS.rotateZ(MOVEMATRIX, dAngle);
        LIBS.rotateY(MOVEMATRIX, dAngle); //Movimiento: rotación en eje Y
        LIBS.rotateX(MOVEMATRIX, dAngle);
        time_prev = time;

        GL.viewport(0, 0, CANVAS.width, CANVAS.height);//Establecemos el viewport
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        
        //Mandar matrices a los shaders
        GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
        GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);        
        GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);

        GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
        
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 4*(3+3), 0);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4*(3+3), 3*4);
        
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
        GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
        
        GL.flush(); //Finalizar dibujado

        window.requestAnimationFrame(animate); //Mostrar la escena
    };
    
    //Ejecutar dibujado
    animate(0);
}

window.addEventListener('load', main);