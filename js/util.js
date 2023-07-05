const FOV = 120/180*Math.PI;
const THETA = FOV * 0.5;
const CANVAS = document.querySelector("canvas");

const keyboard = new class{
    #map = {};
    constructor(){
        window.addEventListener("keydown",(evt)=>this.#handler(evt));
        window.addEventListener("keyup",(evt)=>this.#handler(evt));
    }
    /**
     * 
     * @param {KeyboardEvent} evt
     */
    #handler(evt){
        const key = evt.key.toLowerCase();
        this.#map[key] = evt.type === "keydown";
    }
    isKeyDown(key){
        return !!this.#map[key.toLowerCase()];
    }
};
const resource = new class{
    #cache = new Map;
    #list = [];

    add(name, url){
        if(arguments.length === 2){
            this.#list.push({name, url});
        }
        else if(arguments.length === 1){
            this.#list.push({name, url:name});
        }
        return this;
    }
    get cache(){
        return this.#cache;
    }
    get(res){
        return this.cache.get(res) || null;
    }
    load(callback){
        if(this.#list.length > 0){
            const res = this.#list.pop();
            const image = new Image;
            image.onload = ()=>{
                this.cache.set(res.name, image);
                this.load(callback);
            };
            image.src = res.url;
        }else{
            if(callback) callback(this);
        }
    }
};
const timeObject = new class{
    fps = 60;
    frameRate = 1/this.fps;
    fpm = this.frameRate/1000;
    _delta;
    elapsed = 0;

    get currentFramerate(){
        return this._delta /1000;
    }

    set delta(delta){
        this._delta = delta;
    }
    get delta(){
        return this._delta/this.fpm;
    }
}
class Sprite{
    /**
     * @type{HTMLImageElement}
     */
    image;
    offsetX = 0;
    offsetY = 0;
    scaleX = 1;
    scaleY = 1;

    get width(){
        return this.image.width;
    }
    get height(){
        return this.image.height;
    }
    
}
class Tunnel{
    //offsetX = 0;
    /**
     * @type{String}
     */
    title;
    /**
     * @type{Number}
     */
    py;
    /**
     * @type{Number}
     */
    clipH;
    /**
     * @type{Number}
     */
    worldH;

    leftFace = new class{
        offsetX1 =0;
        offsetX2 =0;
    };
    rightFace = new class{
        offsetX1 = 0;
        offsetX2 = 0;
    };
    visibleFaces = new class{
        leftFront = true;
        topFront = true;
        rightFront = true;
        leftTop = true;
        top = true;
        rightTop = true;
        left = true;
        right = true;
    }
    /**
     * @type{Line}
     */
    previousSegment;

}