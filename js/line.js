class Line{
    scale=0;
    index=0;
    curve=0;
    /**
     * @type{Tunnel}
     */
    tunnel;
    /**
     * @type{Sprite}
     */
    sprites = [];
    clip = 0;
    #colors = {road:"",grass:"",rumble:"",strip:"",tunnel:""};
    points = {
        world : new class{
            x=0;
            y=0;
            z=0;
            w=0;
        },
        screen : new class{
            X=0;
            Y=0;
            W=0;
            x=0;
            y=0;
            w=0;
        }
    };
    constructor(){}
    get colors(){
        return this.#colors;
    }
    set colors(colors){
        this.#colors = colors;
    }
    /**
     * 
     * @param {Camera} camera 
     */
    project(camera){
        const {world,screen} = this.points;
        const midpoint = camera.screen.midpoint;
        camera.deltaZ = world.z - camera.z;
        const scale = this.scale = camera.distanceToProjectionPlane/(camera.deltaZ);
        screen.X = (1+(world.x-camera.x)*scale)*midpoint.x;
        screen.Y = (1-(world.y-camera.y)*scale)*midpoint.y;
        screen.W = world.w * scale * camera.screen.width;
        screen.x = Math.round(screen.X);
        screen.y = Math.round(screen.Y);
        screen.w = Math.round(screen.W);
    }
    /**
     * 
     * @param {Render} render 
     * @param {Camera} camera 
     * @param {Player} player 
     */
    drawSprite(render,camera,player){
        const sprites = this.sprites;
        for (let index = sprites.length-1; index >= 0; index--) {
            const sprite = sprites[index];
            const scale = this.scale;
            const {screen,world} = this.points;
            const roadWidth = world.w;
            const destX = screen.X + screen.W*sprite.offsetX;
            const destY = screen.Y;
            render.drawSprite(sprite, camera, player, roadWidth, scale, destX,destY,this.clip);
        }
        return this;
    }
    /**
     * 
     * @param {Render} render 
     * @param {Camera} camera 
     * @param {Player} player 
     */
    drawTunnel(render,camera,player){
        if(this.tunnel){
            const tunnel = this.tunnel;
            const { screen , world } = this.points;
            const clip = this.clip;
            const scale = this.scale;
            const worldH = tunnel.worldH//5000+Math.abs(world.y);
            const py = tunnel.py = Math.round((1-(worldH-camera.y)*scale)*camera.screen.midpoint.y)
            const h = Math.round(worldH*0.2*scale*camera.screen.midpoint.y);
            const clipH = tunnel.clipH = clip? Math.max(0,screen.y - clip) : 0;
           
            if(clipH < screen.y-(py+h)){
                const color = this.colors.tunnel;
                render.drawTunnel(color,tunnel,py,clipH,camera,h,screen);
            }
        }
        return this;
    }
}