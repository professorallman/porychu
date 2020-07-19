import { MessageType } from "./MessageType";

export type Message = {
    type:MessageType,
    data?:any
};