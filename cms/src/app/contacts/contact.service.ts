import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactChangedEvent = new Subject<Contact[]>();

  private contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
   }

   getContacts(): Contact[] {
     return this.contacts.slice()
   }

   getContact(id: string): Contact {
     for (let contact of this.contacts) {
       if (contact.id === id) {
         return contact;
       }
     }
     return null
   } 

   deleteContact(contact: Contact) {
     if (!contact) {
       return
     }

     const pos = this.contacts.indexOf(contact);
     if (pos < 0) {
       return
     }
     this.contacts.splice(pos, 1);
     this.contactChangedEvent.next(this.contacts.slice());
   }
}
