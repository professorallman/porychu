import { Client } from './network/Client';
import { Game } from './game/Game';

const client = new Client();

document.querySelector('#host').addEventListener('click',async ()=>{
    const offer = await client.host();
    document.querySelector<HTMLInputElement>('input[name="hostcode"]').value = btoa(offer);
});

document.querySelector('#join').addEventListener('click',async ()=>{
    const offer = document.querySelector<HTMLInputElement>('input[name="remoteHostCode"]').value;
    const reply = await client.join(atob(offer));
    document.querySelector<HTMLInputElement>('input[name="joinCode"]').value = btoa(reply);
});

document.querySelector('#hostConnect').addEventListener('click',async ()=>{
    const answer = document.querySelector<HTMLInputElement>('input[name="remoteJoinCode"').value;
    const connected = await client.connect(atob(answer));

}); 

client.on('connected',(data)=>{
    const connectionResult =  document.querySelector('#connectionResult');
    connectionResult.textContent = 'Connected successfullyyy';
    connectionResult.classList.add('success');
    const game:Game = new Game(client);
    game.start();
});