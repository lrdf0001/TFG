

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
                attribute vec2 position; // the position of the point \n\
                attribute vec3 color;\n\
                varying vec3 vColor;\n\
                void main(void) { // pre-built function\n\
                gl_Position = vec4(position, 0., 1.); // 0. is the z, and 1 is w\n\
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
    var triangle_vertex = [ -1, -1,
                            0, 0, 1,
                            1, -1,
                            1, 1, 0,
                            1, 1,
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
                    
    /*========================= DRAWING ========================= */
    GL.clearColor(0.0, 0.0, 0.0, 0.0);

    //Funcion de dibujado
    var animate = function() {

        GL.viewport(0, 0, CANVAS.width, CANVAS.height);//Establecemos el viewport
        GL.clear(GL.COLOR_BUFFER_BIT);

        GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
        
        GL.vertexAttribPointer(_position, 2, GL.FLOAT, false, 4*(2+3), 0);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4*(2+3), 2*4);
        
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
        GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
        
        GL.flush(); //Finalizar dibujado

        window.requestAnimationFrame(animate); //Mostrar la escena
    };
    
    //Ejecutar dibujado
    animate();
}

window.addEventListener('load', main);