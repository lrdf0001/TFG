
var LIBS = {
    
    degToRad: function(angle){
        return(angle*Math.PI/180);
    },


    get_projection: function(angle, a, zMin, zMax) {
        var tan = Math.tan(LIBS.degToRad(0.5*angle)),
            A = -(zMax+zMin)/(zMax-zMin),
            B = (-2*zMax*zMin)/(zMax-zMin);

        return [
            0.5/tan, 0 ,   0, 0,
            0, 0.5*a/tan,  0, 0,
            0, 0,         A, -1,
            0, 0,         B, 0
        ];
    },
  
  
    //Matriz identidad
    get_I4: function() {
        return [1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1];
    },


    rotateX: function(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv1=m[1], mv5=m[5], mv9=m[9];
        m[1]=m[1]*c-m[2]*s;
        m[5]=m[5]*c-m[6]*s;
        m[9]=m[9]*c-m[10]*s;

        m[2]=m[2]*c+mv1*s;
        m[6]=m[6]*c+mv5*s;
        m[10]=m[10]*c+mv9*s;
    },


    rotateY: function(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0=m[0], mv4=m[4], mv8=m[8];
        m[0]=c*m[0]+s*m[2];
        m[4]=c*m[4]+s*m[6];
        m[8]=c*m[8]+s*m[10];

        m[2]=c*m[2]-s*mv0;
        m[6]=c*m[6]-s*mv4;
        m[10]=c*m[10]-s*mv8;
    },


    rotateZ: function(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0=m[0], mv4=m[4], mv8=m[8];
        m[0]=c*m[0]-s*m[1];
        m[4]=c*m[4]-s*m[5];
        m[8]=c*m[8]-s*m[9];

        m[1]=c*m[1]+s*mv0;
        m[5]=c*m[5]+s*mv4;
        m[9]=c*m[9]+s*mv8;
    },
  
  
    translateZ: function(m, t){
        m[14]+=t;
    },
  
  
    cuboVerticesDegradado: function(){
        var cube_vertex = [
            -1, -1, -1, //izquierda-abajo-atras
            0, 0, 0,
            1, -1, -1,  //derecha-abajo-atras
            0, 0, 1,
            1, 1, -1,   //derecha-arriba-atras
            0, 1, 0,
            -1, 1, -1,  //izquierda-arriba-atras
            0, 1, 1,
            -1, -1, 1,  //izquierda-abajo-delante
            1, 0, 0, 
            1, -1, 1,   //derecha-abajo-delante
            1, 0, 1,
            1, 1, 1,   //derecha-arriba-delante
            1, 1, 0,
            -1, 1, 1,  //izquierda-arriba-delante
            1, 1, 1
        ];
        return cube_vertex;
    },
  
  
    cuboVerticesPlano: function(){
        //Colores uniformes, cada cara un color
        var cube_vertex = [
            //Vertice       Color
            -1, -1, -1,     1, 1, 0, //Cara de atras
            1, -1, -1,     1, 1, 0,
            1,  1, -1,     1, 1, 0,
            -1,  1, -1,     1, 1, 0,

            -1, -1, 1,     0, 0, 1, //Cara frontal
            1, -1, 1,     0, 0, 1,
            1,  1, 1,     0, 0, 1,
            -1,  1, 1,     0, 0, 1,

            -1, -1, -1,     0, 1, 1, //Izquierda
            -1,  1, -1,     0, 1, 1,
            -1,  1,  1,     0, 1, 1,
            -1, -1,  1,     0, 1, 1,

            1, -1, -1,     1, 0, 0, //Derecha
            1,  1, -1,     1, 0, 0,
            1,  1,  1,     1, 0, 0,
            1, -1,  1,     1, 0, 0,

            -1, -1, -1,     1, 0, 1, //Abajo
            -1, -1,  1,     1, 0, 1,
            1, -1,  1,     1, 0, 1,
            1, -1, -1,     1, 0, 1,

            -1, 1, -1,     0, 1, 0, //Arriba
            -1, 1,  1,     0, 1, 0,
            1, 1,  1,     0, 1, 0,
            1, 1, -1,     0, 1, 0
        ];
        return cube_vertex;
    },
  
  
    cuboCarasDegradado: function(){
        var cube_faces = [
            0, 1, 2, //Cara atras
            0, 2, 3,

            1, 2, 6, //Cara derecha
            1, 6, 5,

            0, 4, 1, //Cara abajo
            1, 4, 5,

            0, 3, 7, //Cara izquierda
            0, 7, 4,

            2, 3, 7, //Cara arriba
            2, 7, 6,

            4, 5, 6, //Cara frente
            4, 6, 7
        ];
        return cube_faces;
    },
  
  
    cuboCarasPlano: function(){
        var cube_faces = [ //Asignamos a cada cara los vertices segun el color 
            0, 1, 2,
            0, 2, 3,

            4, 5, 6,
            4, 6, 7,

            8, 9, 10,
            8, 10, 11,

            12, 13, 14,
            12, 14, 15,

            16, 17, 18,
            16, 18, 19,

            20, 21, 22,
            20, 22, 23
        ];
        return cube_faces;
    },
    
    conoVertices: function(secciones, radio, altura){
        
        var angulo = (360 / secciones);
        
        var coords = [];
        
        //==== Vertice 0: centro de la base =====
        coords.push(0);
        coords.push(0);
        coords.push(0);
        
        coords.push(0.9);
        coords.push(0.9);
        coords.push(0.9);
        
        //==== Vertices [1, secciones]: borde de la base =====
        for(let i=0; i<360; i+=angulo){
            var x = Math.cos(degToRad(i))*radio;            
            var z = Math.sin(degToRad(i))*radio;
            
            coords.push(x);
            coords.push(0);
            coords.push(z);
            
            coords.push(Math.random());
            coords.push(Math.random());
            coords.push(Math.random());
        }
        
        //==== Vertice secciones+1: cuspide del cono ====
        coords.push(0);
        coords.push(altura);
        coords.push(0);
        
        coords.push(0.1);
        coords.push(0.1);
        coords.push(0.1);
        
        return coords;
    },
    
    conoCaras: function(secciones){
        
        var caras = [];
        
        
        for (let i=1; i<=secciones; i+=1){
            //Triangulos base
            caras.push(0);
            caras.push(i);
            caras.push((i+1)%secciones);
            
            //Triengulos laterales
            caras.push(secciones+1);
            caras.push(i);
            caras.push((i+1)%secciones);
        }
        
        return caras;
    }
};

