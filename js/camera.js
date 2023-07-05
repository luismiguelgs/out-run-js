class Camera{
    x=0;
    y=1500;
    z=0;
    h = this.y;
    cursor=0;
    deltaZ=0;
    acceleration = 0;
    _distanceToProjectPlane = 1 / Math.tan(THETA);
    screen = new class{

        get width(){
            return CANVAS.width;
        }
        get height(){
            return CANVAS.height;
        }

        midpoint = new class{
            #screen;
            constructor(screen){
                this.#screen = screen;
            }
            get x(){
                return this.#screen.width*0.5;
            }
            get y(){
                return this.#screen.height*0.5;
            }
        }(this);
    }
    get distanceToProjectionPlane(){
        return this._distanceToProjectPlane;
    }
    /**
     * 
     * @param {Road} road 
     */
    update(road){
        const step = road.segmentLength;
        const length = road.trackLength;
        const delta = timeObject.delta/400000;
        const speed = timeObject.currentFramerate*step*delta;
        if(keyboard.isKeyDown("arrowUp")){
            this.cursor += step + this.acceleration;
            if(this.acceleration <400){
                this.acceleration += speed;
            }
        }else if(keyboard.isKeyDown("arrowDown")){
            this.cursor -= step;
        }
        else{
            if(this.acceleration > 0){
                this.acceleration -= speed;
                this.cursor += step + this.acceleration;
                if(this.acceleration < 0){
                    this.acceleration = 0;
                }
            }
        }
        if(this.cursor>=length){
            this.cursor -= length;
        }
        else if(this.cursor<0){
            this.cursor += length;
        }
    }
}