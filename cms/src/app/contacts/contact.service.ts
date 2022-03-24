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
    this.http.get<Contact[]>('http://localhost:3000/contacts').subscribe(
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

     const pos = this.contacts.findIndex(c => c.id === contact.id);
     if (pos < 0) {
       return
     }
     this.http.delete('http://localhost:3000/contacts/' + contact.id)
    .subscribe(
      (response: Response) => {
        this.contacts.splice(pos, 1);
        this.storeContacts();
      }
    );
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

  addContact(contact: Contact) {
    if (!contact) {
      return
    }
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // add to database
    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.contacts.push(responseData.contact);
          this.storeContacts();
        }
      );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!newContact || !originalContact) {
      return
    }
  
    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) {
      return
    } 

    newContact.id = originalContact.id;
        
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.contacts[pos] = newContact;
          this.storeContacts();
        }
      );
  }

  storeContacts() {
    let newConArray = JSON.stringify(this.contacts)
    this.http.put('https://localhost:3000/contacts', newConArray, 
    {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe(response => {
      this.contactChangedEvent.next(this.contacts.slice())
    })
  }
}
