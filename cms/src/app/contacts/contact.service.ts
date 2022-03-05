import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactChangedEvent = new Subject<Contact[]>();
  maxContactId: string

  private contacts: Contact[] = [];

  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
   }

   getContacts(): Contact[] {
    this.http.get<Contact[]>('https://wdd430-cms-e2d4c-default-rtdb.firebaseio.com/contacts.json').subscribe(
      // success method
      (contacts: Contact[] ) => {
        this.contacts = contacts
        this.maxContactId = this.getMaxId()
        this.contacts.sort((curEl, nextEl) => {
          if (curEl.name < nextEl.name) {
            return -1
          } else if (curEl.name > nextEl.name) {
            return 1
          } else {
            return 0
          }
        })
        this.contactChangedEvent.next(this.contacts.slice())
      },
      // error method
      (error: any) => {
        console.log(error)
      } 
      )
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
     this.storeContacts()
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

  addContact(newContact: Contact) {
    if (!newContact) {
      return
    }
    let id = parseInt(this.maxContactId) + 1
    this.maxContactId = id.toString()
    newContact.id = this.maxContactId
    this.contacts.push(newContact)
    this.storeContacts()
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!newContact || !originalContact) {
      return
    }
  
    let pos = this.contacts.indexOf(originalContact)
    if (pos < 0) {
      return
    } 
        
    newContact.id = originalContact.id
    this.contacts[pos] = newContact
    this.storeContacts();
  }

  storeContacts() {
    let newConArray = JSON.stringify(this.contacts)
    this.http.put('https://wdd430-cms-e2d4c-default-rtdb.firebaseio.com/contacts.json', newConArray, 
    {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe(response => {
      this.contactChangedEvent.next(this.contacts.slice())
    })
  }
}
