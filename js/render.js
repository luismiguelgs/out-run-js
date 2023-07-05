class Render{
    #renderingContext;
    /**
     * 
     * @param {CanvasRenderingContext2D} renderingContext 
     */
    constructor(renderingContext){
        this.#renderingContext = renderingContext;
    }
    get renderingContext(){
        return this.#renderingContext;
    }
    clear(x,y,w,h){
        this.renderingContext.clearRect(x,y,w,h);
    }
    save(){
        this.renderingContext.save();
    }
    restore(){
        this.renderingContext.restore();
    }
    drawQuad(x1, y1, w1, x2, y2, w2, color="green"){
        this.drawPolygon(color,
            x1-w1,y1,
            x1+w1, y1,
            x2+w2,y2,
            x2-w2,y2
        );
    }
    drawPolygon(color, ...coords){
        if(coords.length > 1){
            const renderingContext = this.renderingContext;
            renderingContext.save();
            renderingContext.fillStyle = color;
            renderingContext.beginPath();
            renderingContext.moveTo(coords[0],coords[1]);
            for (let index = 2; index < coords.length; index+=2) {
                renderingContext.lineTo(coords[index],coords[(index+1)%coords.length])
            }
            renderingContext.closePath();
            renderingContext.fill();
            renderingContext.restore();
        }
    }
    /**
     * 
     * @param {Sprite} sprite 
     * @param {Camera} camera 
     * @param {Player} player 
     * @param {Number} roadWidth 
     * @param {Number} scale 
     * @param {Number} destX 
     * @param {Number} destY 
     * @param {Number} clip 
     */
    drawSprite(sprite, camera, player, roadWidth, scale, destX, destY,clip){
        const midpoint = camera.screen.midpoint;
        const w = sprite.width;
        const h = sprite.height;
        const factor = 1/3;
        const offsetY = sprite.offsetY || 1;
        const scaleX = sprite.scaleX;
        const scaleY = sprite.scaleY;
        const destW = (w * scale * midpoint.x)*((roadWidth * scaleX/(player.width ?? 64)) * factor);
        const destH = (h * scale * midpoint.x)*((roadWidth * scaleY/(player.width ?? 64)) * factor);
        destX += -destW * 0.5;
        destY -= destH * offsetY;
        const clipH = clip ? Math.max(0, (destY+destH - clip))  : 0;
        if(clipH < destH){
            this.renderingContext.drawImage(
                sprite.image,
                0,0,
                w,h - h*clipH/destH,
                destX,destY,destW,destH - clipH    
            );
        }
    }
    drawTunnel(color,tunnel,py,clipH,camera,h,screen){
        const leftFace = tunnel.leftFace;
        const rightFace = tunnel.rightFace;
        const visibleFaces = tunnel.visibleFaces;

        //left front face
        if(visibleFaces.leftFront){
            this.drawPolygon(
                color,
                0, py,
                screen.x - screen.w * leftFace.offsetX1, py,
                screen.x - screen.w * leftFace.offsetX2, screen.y - clipH,
                0, screen.y - clipH
            );
        }
         //right front face
        if(visibleFaces.rightFront){
           this.drawPolygon(
                color,
                camera.screen.width, py,
                screen.x + screen.w * rightFace.offsetX1, py,
                screen.x + screen.w * rightFace.offsetX2, screen.y - clipH,
                camera.screen.width, screen.y - clipH
            );
        }
        //top fron face
        if(visibleFaces.topFront){
            this.drawPolygon(
                color,
                0, py,
                camera.screen.width, py,
                camera.screen.width, py + h,
                0, py + h    
            );
            if(tunnel.title){
                const renderingContext = this.renderingContext;
                renderingContext.save();
                renderingContext.font = `${h*0.5}px monospace`;
                renderingContext.fillStyle = 'blue';
                renderingContext.textAlign = "center";
                renderingContext.textBaseline = "middle";
                renderingContext.fillText(tunnel.title,screen.x,py+h*0.5);
                renderingContext.restore();
            }
        }  
                      
        const previousSegment = tunnel.previousSegment;
        if(previousSegment){
            const previousScreenPoint = previousSegment.points.screen;
            const previousTunnel = previousSegment.tunnel;
            const previousLeftFace = previousTunnel.leftFace;
            const previousRightFace = previousTunnel.rightFace;
            if(visibleFaces.leftTop){
                //left top face
                this.drawPolygon(
                    color,
                    0,previousTunnel.py,
                    previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX1, previousTunnel.py,
                    screen.x - screen.w*leftFace.offsetX1, tunnel.py,
                    0, py,
                );
            }
            if(visibleFaces.rightTop){
                //right top face
                this.drawPolygon(
                    color,
                    camera.screen.width, previousTunnel.py,
                    previousScreenPoint.x + previousScreenPoint.w * previousLeftFace.offsetX1, previousTunnel.py,
                    screen.x + screen.w*leftFace.offsetX1, tunnel.py,
                    camera.screen.width, py,
                );
            }
            if(visibleFaces.top){
                //top face
                this.drawPolygon(
                    color,
                    previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX1, previousTunnel.py,
                    previousScreenPoint.x + previousScreenPoint.w * previousRightFace.offsetX1, previousTunnel.py,
                    screen.x + screen.w * rightFace.offsetX1, py, 
                    screen.x - screen.w * leftFace.offsetX1, py, 
                );
            }
            //faces do acostamento
            if(visibleFaces.left){
                //left face
                this.drawPolygon(
                    color,
                    previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX1, previousTunnel.py,
                    previousScreenPoint.x - previousScreenPoint.w * previousLeftFace.offsetX2, previousScreenPoint.y - previousTunnel.clipH,
                    screen.x - screen.w * leftFace.offsetX2, screen.y - clipH,
                    screen.x - screen.w * leftFace.offsetX1, py   
                );
            }
            if(visibleFaces.right){
                //right face
                this.drawPolygon(
                    color,
                    previousScreenPoint.x + previousScreenPoint.w * previousRightFace.offsetX1, previousTunnel.py,
                    previousScreenPoint.x + previousScreenPoint.w * previousRightFace.offsetX2, previousScreenPoint.y - previousTunnel.clipH,
                    screen.x + screen.w * rightFace.offsetX2, screen.y - clipH,
                    screen.x + screen.w * rightFace.offsetX1, py   
                );
            }
        }
    }
    drawRoad(colors,previousScreenPoint,currentScreenPoint,camera)
    {
         //road
         this.drawQuad(
            previousScreenPoint.x, previousScreenPoint.y, previousScreenPoint.w,
            currentScreenPoint.x,currentScreenPoint.y,currentScreenPoint.w,colors.road
        );
        //left grass
        this.drawPolygon(
            colors.grass,
            0, previousScreenPoint.y,
            previousScreenPoint.x - previousScreenPoint.w *1.3, previousScreenPoint.y,
            currentScreenPoint.x - currentScreenPoint.w *1.3, currentScreenPoint.y,
            0,currentScreenPoint.y
        );
        //right grass
        this.drawPolygon(
            colors.grass,
            previousScreenPoint.x + previousScreenPoint.w *1.3, previousScreenPoint.y,
            camera.screen.width, previousScreenPoint.y,
            camera.screen.width, currentScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w *1.3, currentScreenPoint.y,
        );
        //rumble left
        this.drawPolygon(
            colors.rumble,
            previousScreenPoint.x - previousScreenPoint.w *1.3, previousScreenPoint.y,
            previousScreenPoint.x - previousScreenPoint.w, previousScreenPoint.y,
            currentScreenPoint.x - currentScreenPoint.w, currentScreenPoint.y,
            currentScreenPoint.x - currentScreenPoint.w*1.3, currentScreenPoint.y,
        );
        //rumble right
        this.drawPolygon(
            colors.rumble,
            previousScreenPoint.x + previousScreenPoint.w *1.3, previousScreenPoint.y,
            previousScreenPoint.x + previousScreenPoint.w, previousScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w, currentScreenPoint.y,
            currentScreenPoint.x + currentScreenPoint.w*1.3, currentScreenPoint.y,
        );
        if(colors.strip){
            const value = 1/100;
            this.drawQuad(
                previousScreenPoint.x , previousScreenPoint.y, previousScreenPoint.w * value,
                currentScreenPoint.x, currentScreenPoint.y, currentScreenPoint.w * value,
                colors.strip
            );
        }   
    }
}