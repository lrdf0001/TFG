

class CajaZapatos{
	constructor(){
		const geometriaCaja = new THREE.BoxGeometry( 1, 1, 2 )
		const materialCaja = new THREE.MeshBasicMaterial( { color:    0x239b56   } )
		
		this.caja = new THREE.Mesh( geometriaCaja, materialCaja )
		
		const geometriaTapa = new THREE.BoxGeometry( 1.15, 0.25, 2.15 )
		const materialTapa = new THREE.MeshBasicMaterial( { color:    0x239b56   } )
		
		const tapa = new THREE.Mesh( geometriaTapa, materialTapa )
		tapa.translateY(0.5)
		
	}
	
	rotarX(x){
		caja.rotation.x += 0.1
		
		tapa.translateY(-0.5)
		tapa.rotation.x += 0.1
		tapa.translateY(0.5)
	}
	
	rotarY(y){
		caja.rotation.y += 0.1
		
		tapa.translateY(-0.5)
		tapa.rotation.y += 0.1
		tapa.translateY(0.5)
	}
	
	getCaja(){
		return this.caja
	}
	
	getTapa(){
		return this.tapa
	}
	
}