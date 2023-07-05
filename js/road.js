class Road{
    /**
     * @type {Line[]}
     */
    #segments = [];
    #segmentLength = 200;
    #rumbleLength = 13;
    #roadWidth = 2000;

    get rumbleLength(){
        return this.#rumbleLength;
    }
    /**
     * Segments size on the road
     */
    get segmentLength(){
        return this.#segmentLength;
    }
    /**
     * Total of segments
     */
    get segmentsLength(){
        return this.#segments.length
    }
    get trackLength(){
        return this.segmentsLength * this.#segmentLength;
    }
    get width(){
        return this.#roadWidth;
    }
    /**
     * 
     * @param {Number} cursor 
     * @returns 
     */
    getSegment(cursor){
        return this.#segments[Math.floor(cursor/this.#segmentLength)%this.segmentsLength];
    }
    getSegmentFromIndex(index){
        return this.#segments[index % this.segmentsLength];
    }
    create(segmentsNumber=2002){
        const rumbleLength = this.rumbleLength;
        for (let index = 0, angle=0, previousSegment; index < segmentsNumber + rumbleLength; index++) {
            const darkColors = {road:"black",grass:"darkgreen",rumble:"red",strip:"",tunnel:"darkblue"}
            const lightColors = {road:"black",grass:"green",rumble:"white",strip:"white",tunnel:"blue"}
            const line = new Line;
            line.index = index;
            line.colors = Math.floor(index/rumbleLength)%2 ? darkColors: lightColors;
            const world = line.points.world;
            world.w = this.width;
            world.z = (index+1)*this.#segmentLength;
            this.#segments.push(line);

            //curves
            if(index > 500 && index < 700) line.curve = 7.5;
            if(index >= 700 && index < 900) line.curve = -0.9;

            //hills
            if(index > 1000 && angle <360*2) {
                world.y = Math.sin(angle++/180*Math.PI)*2000;
                if(index < 1360){
                    line.curve = 1;
                }
                else{
                    line.curve = -1;
                }
            }
            if(index === 1800){
                world.y = Math.sin(Math.PI * 0.5)*500;
                line.colors.road = "yellow";
            }
            //sprites
            if(index % rumbleLength === 0){
                const sprite = new Sprite;
                sprite.offsetX = Math.floor(index/3) % 2 ? (-Math.random() * 3) - 2 : (Math.random() * 3) + 2;
                sprite.image = resource.get("tree1");
                line.sprites.push(sprite);
            }
            if(index === 500){
                const sprite = new Sprite;
                sprite.image = resource.get("tree2");
                sprite.offsetX = -1.7;
                line.sprites.push(sprite);
            }
            if(index === 5){
                const sprite = new Sprite;
                sprite.image = resource.get("finish-line");
                sprite.offsetX = 0;
                sprite.scaleX = 1.2;
                line.sprites.push(sprite);
            }
            //tunnels
            if(index > 1000 && index < 1720){
                if(index===1001){
                    const tunnel = new Tunnel;
                    tunnel.worldH = 5000 + Math.abs(world.y);
                    tunnel.leftFace.offsetX1 = 1.7;
                    tunnel.leftFace.offsetX2 = 1.3;
                    tunnel.rightFace.offsetX1 = 1.7;
                    tunnel.rightFace.offsetX2 = 1.3;
                    line.tunnel = tunnel;
                    line.colors.tunnel ="#fff";
                    tunnel.title = "Tunnel Racing Pseudo 3D";
                    previousSegment = line;
                }else if(index% rumbleLength === 0){
                    const tunnel = new Tunnel;
                    const visibleFaces = tunnel.visibleFaces;
                    tunnel.worldH = 5000 + Math.abs(world.y);
                    tunnel.leftFace.offsetX1 = 1.7;
                    tunnel.leftFace.offsetX2 = 1.3;
                    tunnel.rightFace.offsetX1 = 1.7;
                    tunnel.rightFace.offsetX2 = 1.3;
                    tunnel.previousSegment = previousSegment;
                    previousSegment = line;
                    line.tunnel = tunnel;
                    //caras visibles
                    visibleFaces.top = false;
                }
            }
        }
        //linea de inicio
        for (let j = 0; j < rumbleLength; j++) {
           this.#segments[j].colors.road = "#333";
        }
    }
    /**
     * @param {Render} render
     * @param {Camera} camera
     * @param {Player} player
     */
    render(render,camera,player){
        const segmentsLength = this.segmentsLength;
        const baseSegment = this.getSegment(camera.cursor);
        const startPos = baseSegment.index;
        let maxY = camera.screen.height;
        camera.y = camera.h + baseSegment.points.world.y;
        let x=0;
        let dx=0;
        const visibleSegments = 500;

        for (let index = startPos; index < startPos + visibleSegments; index++) {
            const currentSegment = this.getSegmentFromIndex(index);
            camera.z = camera.cursor - (index >= segmentsLength ? this.trackLength:0);
            camera.x = player.x * currentSegment.points.world.w-x;
            currentSegment.project(camera);
            x += dx;
            dx += currentSegment.curve;
            const currentScreenPoint = currentSegment.points.screen;
            currentSegment.clip = maxY;

            if(currentScreenPoint.y >= maxY || camera.deltaZ <= camera.distanceToProjectionPlane) continue;

            //maxY = currentScreenPoint.y;

            if(index>0){
                const previousSegment = this.getSegmentFromIndex(index-1);
                const previousScreenPoint = previousSegment.points.screen;

                if(currentScreenPoint.y >= previousScreenPoint.y) continue;

                const colors = currentSegment.colors;

                render.drawRoad(colors,previousScreenPoint,currentScreenPoint,camera);
            }
            maxY = currentScreenPoint.y;
        }
        for (let index = (visibleSegments+startPos)-1; index > startPos; index--) {
            const segment = this.getSegmentFromIndex(index);
            segment.drawSprite(render,camera,player);
            segment.drawTunnel(render,camera,player);
        }
    }
}