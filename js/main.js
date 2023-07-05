
/**
 * 
 * @param {Number} time 
 * @param {Render} render 
 * @param {Camera} camera 
 * @param {Player} player 
 * @param {Road} road 
 * @param {Number} width 
 * @param {Number} height 
 */
const loop = function(time, render, camera, player, road, width, height){
    requestAnimationFrame((time)=>loop(time,render,camera,player,road,width,height));
    timeObject.delta = time - timeObject.elapsed;
    timeObject.elapsed = time;
    render.clear(0,0,width,height);
    render.save();
    camera.update(road);
    player.update();
    road.render(render,camera,player);
    player.render(render,camera,road.width);
    render.restore();
};

const init = function(time){
    const render = new Render(CANVAS.getContext("2d"));
    const camera = new Camera();
    const player = new Player();
    player.sprite.image = resource.get("car");
    const road = new Road();
    road.create();
    //va a la boca del tunel
    //camera.cursor = 980 * road.segmentLength //apunta al lugar donde estoy en la pista z
    camera.cursor =-road.segmentLength * road.rumbleLength; //apunta al lugar donde estoy en la pista z
    loop(time,render,camera,player,road, CANVAS.width,CANVAS.height);
};
resource
    .add("tree1","./assets/foliagePack_005.png")
    .add("car","./assets/car.png")
    .add("finish-line","./assets/finish.png")
    .add("tree2","./assets/foliagePack_013.png")
    .load(()=>{
        requestAnimationFrame((time)=> init(time));
    });