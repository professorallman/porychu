import { Client } from "../network/Client";

export class Game{
    constructor(private client:Client){}
    start(){
        console.log('START CALLED!!!!');
    }
}