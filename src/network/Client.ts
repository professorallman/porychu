import SimplePeer, { Instance } from 'simple-peer';
import { Message } from './Message'
import { MessageType } from './MessageType';

type Callback = (message:Message)=>void

export class Client{
    callbacks:{[key in MessageType]?:Array<Callback>} = {};
    private peer:Instance
    host():Promise<string>{
        return new Promise((resolve,reject)=>{
            this.peer = new SimplePeer({initiator:true, trickle:false});
            const offer = (data)=>{
                resolve(JSON.stringify(data));
                this.peer.off('signal',offer);
            };
            this.peer.on('signal',offer);
            this.peer.on('data',(data)=>this._data(data));
            
        });
    }
    join(offerCode:string):Promise<string>{
        return new Promise((resolve,reject)=>{
            this.peer = new SimplePeer({trickle:false});
            const answer = (data)=>{
                resolve(JSON.stringify(data));
                this.peer.off('signal',answer);
            }
            this.peer.on('signal',answer);
            this.peer.signal(JSON.parse(offerCode));
            this.peer.on('data',(data)=>this._data(data));
            this.once('connected',(message)=>this.send('connected'));
        });
    }
    connect(answer:string):Promise<boolean>{
        return new Promise((resolve,reject)=>{
            const onConnect = ()=>{
                resolve(true);
                this.send('connected');
                this.peer.off('connect',onConnect);
            };
            this.peer.on('connect',onConnect);
            this.peer.signal(JSON.parse(answer));
        });
    }
    send(type:MessageType, data?:Object){
        console.log(type,data,this.peer);
        this.peer.send(JSON.stringify({type,data}));
    }
    on(messageType:MessageType, callback:Callback){
        if(!this.callbacks[messageType]) this.callbacks[messageType] = [];
         this.callbacks[messageType].push(callback);
    }
    off(messageType:MessageType, callback:Callback){
        if(!this.callbacks[messageType]) return;
        this.callbacks[messageType] = this.callbacks[messageType].filter((current)=>current != callback);
    }
    once(messageType:MessageType, callback:Callback){
        const proxy = (message:Message)=>{
            callback(message);
            this.off(messageType,proxy);
        }
        this.on(messageType,proxy);
    }
    private _data(data){
        const message:Message = JSON.parse(data); 
        if(!this.callbacks[message.type]) return;
        this.callbacks[message.type].forEach((callback)=>callback(message));
    }
}