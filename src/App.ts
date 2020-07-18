import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, Mesh } from 'babylonjs';

/* const canvas:HTMLCanvasElement = document.querySelector('#renderCanvas');
console.log(canvas);
const engine:Engine = new Engine(canvas, true);

const scene:Scene = new Scene(engine);

const camera: ArcRotateCamera = new ArcRotateCamera('Camera', Math.PI / 2, Math.PI/2, 2, Vector3.Zero(), scene);

const light1:HemisphericLight = new HemisphericLight('light1', new Vector3(1,1,0),scene);

const sphere:Mesh = MeshBuilder.CreateSphere('sphere', {diameter:1},scene);


engine.runRenderLoop(()=>{
    scene.render();
}); */


import SimplePeer from 'simple-peer';

const p = new SimplePeer({
    initiator: location.hash === '#1',
    trickle:false
});

console.log(p);

p.on('error', err => console.log('error', err))

p.on('signal', data => {
  console.log('SIGNAL', JSON.stringify(data))
  document.querySelector('#outgoing').textContent = JSON.stringify(data)
})

document.querySelector('form').addEventListener('submit', ev => {
  ev.preventDefault()
  p.signal(JSON.parse(document.querySelector('#incoming').value))
})

p.on('connect', () => {
  console.log('CONNECT')
  p.send('whatever' + Math.random())
})

p.on('data', data => {
  console.log('data: ' + data)
});


