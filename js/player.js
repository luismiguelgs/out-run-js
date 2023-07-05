 class Player{
    x=0;
    y=0;
    z=0;

    sprite = new Sprite;

    get width(){
        return this.sprite.width;
    }
    get height(){
        return this.sprite.height;
    }
    update(){
        if(keyboard.isKeyDown("arrowLeft")){
            this.x -= 5/100;
        }else if(keyboard.isKeyDown("arrowRight")){
            this.x += 5/100;
        }
    }
    /**
     * 
     * @param {Render} render 
     * @param {Camera} camera 
     * @param {Number} roadWidth 
     */
    render(render, camera, roadWidth){
        const midpoint = camera.screen.midpoint;
        const clip = 0;
        const scale = 1/camera.h;
        const destX = midpoint.x;
        const destY = camera.screen.height;
        render.drawSprite(this.sprite, camera, this, roadWidth, scale,destX,destY,clip);
    }
    
}