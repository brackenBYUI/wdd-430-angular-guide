import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>()
  maxDocumentId: number

  private documents: Document[] = [];

  constructor() { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {
    return this.documents.slice();
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
    this.documentListChangedEvent.next(this.documents.slice());
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
  newDocument.id = this.maxDocumentId
  this.documents.push(newDocument)
  this.documentListChangedEvent.next(this.documents.slice())
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
  this.documentListChangedEvent.next(this.documents.slice())
}
}
