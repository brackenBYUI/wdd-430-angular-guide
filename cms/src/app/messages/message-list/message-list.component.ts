import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Message } from '../message-model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  @Output() messageSelected = new EventEmitter<Message>();
  messages: Message[] = [
    new Message('1', 'Test', 'Test message', 'Tom'),
    new Message('2', 'Test 2', 'Test message number 2', 'Dave'),
    new Message('3', 'Test 3', 'Test message number 3', 'Tyson')
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
