import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number

  private messages: Message[] = [];

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES;
  }

  getMessages(): Message[] {
    this.http.get<Message[]>('https://wdd430-cms-e2d4c-default-rtdb.firebaseio.com/messages.json').subscribe(
    // success method
    (messages: Message[] ) => {
      this.messages = messages
      this.maxMessageId = this.getMaxId()
      this.messageChangedEvent.next(this.messages.slice())
    },
    // error method
    (error: any) => {
      console.log(error)
    } 
    )
    return this.messages.slice()
  }

  storeMessages() {
    let newMesArray = JSON.stringify(this.messages)
    this.http.put('https://wdd430-cms-e2d4c-default-rtdb.firebaseio.com/messages.json', newMesArray, 
    {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe(response => {
      this.messageChangedEvent.next(this.messages.slice())
    })
  }

  getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id === id) {
        return message
      }
    }
    return null
  }

  getMaxId(): number {
    let maxId = 0
    let currentId = 0
  
    for(let document of this.messages) {
        currentId = +document.id;
  
        if ( currentId > maxId ){
          maxId = currentId
        }
   }
  
    return maxId
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages()
  }
}
