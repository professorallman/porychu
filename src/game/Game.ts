import {  Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, Mesh, ActionManager, ExecuteCodeAction } from 'babylonjs';
import { Client } from "../network/Client";


export class Game{
    scene:Scene;
    playerId;
    constructor(private client:Client){}
    start(){
        const canvas:HTMLCanvasElement = document.querySelector('#renderCanvas');
        const engine:Engine = new Engine(canvas,true);
        this.scene = new Scene(engine);
        const scene = this.scene;
        this.client.on('createPlayer',({data})=>this.createPlater(data));
        const camera:ArcRotateCamera = new ArcRotateCamera('Camera', Math.PI/2, Math.PI /2, 2, Vector3.Zero(), scene);
        
        const light1:HemisphericLight = new HemisphericLight('light1', new Vector3(,1,1,0), scene);
        
        this.playerId = (new Date().getMilliseconds() * Math.random()).toString(16);
        const playerId = this.playerId;
        setTimeout(()=>this.client.send('createPlayer',playerId), 5000);
        this.createPlater(playerId);
        this.client.on('playerMove',({data})=>this.movePlayer(data.id,data.pos));

        var map = {}; //object for multiple key presses
scene.actionManager = new ActionManager(scene);

scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

}));

scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
}));



scene.registerAfterRender(() => {

    if ((map["w"] || map["W"])) {
        this.movePlayer(playerId, new Vector3(0,0,.1));
    };

    if ((map["s"] || map["S"])) {
        this.movePlayer(playerId, new Vector3(0,0,-.1));
    };

    if ((map["a"] || map["A"])) {
        this.movePlayer(playerId, new Vector3(-0.1,0,0));
    };

    if ((map["d"] || map["D"])) {
        this.movePlayer(playerId, new Vector3(0.1,0,0));
    };

});


        
    // Run the render loop.
    engine.runRenderLoop(() => {
        scene.render();
    });

    // The canvas/window resize event handler.
    window.addEventListener('resize', () => {
        engine.resize();
    });
    }
    players = {};
    createPlater(id:string){
        this.players[id] = MeshBuilder.CreateSphere(id,{diameter:1},this.scene);
        console.log(this.players);
    }
    movePlayer(id:string, pos:Vector3){
        console.log('MOVE PLAYER CALLED!', id,pos);
        const player:Mesh = this.players[id];
        if(!player) return;
        player.position.addInPlace(pos);
        if(this.playerId === id)
        this.client.send('playerMove',{id,pos});
    }
}
