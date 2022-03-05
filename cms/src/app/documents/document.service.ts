import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>()
  maxDocumentId: number

  private documents: Document[] = [];

  constructor(private http: HttpClient) { 
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[]{
    this.http.get<Document[]>('https://wdd430-cms-e2d4c-default-rtdb.firebaseio.com/documents.json').subscribe(
    // success method
    (documents: Document[] ) => {
      this.documents = documents
      this.maxDocumentId = this.getMaxId()
      this.documents.sort((curEl, nextEl) => {
        if (curEl.name < nextEl.name) {
          return -1
        } else if (curEl.name > nextEl.name) {
          return 1
        } else {
          return 0
        }
      })
      this.documentListChangedEvent.next(this.documents.slice())
    },
    // error method
    (error: any) => {
      console.log(error)
    } 
    )
    return this.documents.slice()
  }

  getDocument(id: string): Document {
    for (let doc of this.documents) {
      if (doc.id === id) {
        return doc;
      }
    }
    return null
  }

  deleteDocument(document: Document) {
    if (!document) {
       return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments();
 }

 getMaxId(): number {
  let maxId = 0
  let currentId = 0

  for(let document of this.documents) {
      currentId = +document.id;

      if ( currentId > maxId ){
        maxId = currentId
      }
 }

  return maxId
}

addDocument(newDocument: Document) {
  if (!newDocument) {
    return
  }

  this.maxDocumentId++
  newDocument.id = this.maxDocumentId.toString()
  this.documents.push(newDocument)
  this.storeDocuments()
}

updateDocument(originalDocument: Document, newDocument: Document) {
  if (!newDocument || !originalDocument) {
    return
  }

  let pos = this.documents.indexOf(originalDocument)
  if (pos < 0) {
    return
  } 
      
  newDocument.id = originalDocument.id
  this.documents[pos] = newDocument
  this.storeDocuments()
}

storeDocuments() {
  let newDocArray = JSON.stringify(this.documents)
  this.http.put('https://wdd430-cms-e2d4c-default-rtdb.firebaseio.com/documents.json', newDocArray, 
  {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }).subscribe(response => {
    this.documentListChangedEvent.next(this.documents.slice())
  })
}
}
