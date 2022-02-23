import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactChangedEvent = new Subject<Contact[]>();
  maxContactId: string

  private contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
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

   getMaxId(): string {
    let maxId = 0
    let currentId = 0
  
    for(let document of this.contacts) {
        currentId = +document.id;
  
        if ( currentId > maxId ){
          maxId = currentId
        }
   }
  
    return maxId.toString()
  }

  addDocument(newContact: Contact) {
    if (!newContact) {
      return
    }
    let id = parseInt(this.maxContactId) + 1
    this.maxContactId = id.toString()
    newContact.id = this.maxContactId
    this.contacts.push(newContact)
    this.contactChangedEvent.next(this.contacts.slice())
  }

  updateDocument(originalContact: Contact, newContact: Contact) {
    if (!newContact || !originalContact) {
      return
    }
  
    let pos = this.contacts.indexOf(originalContact)
    if (pos < 0) {
      return
    } 
        
    newContact.id = originalContact.id
    this.contacts[pos] = newContact
    this.contactChangedEvent.next(this.contacts.slice())
  }
}
