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
    this.http.get<Document[]>('http://localhost:3000/documents').subscribe(
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

  const pos = this.documents.findIndex(d => d.id === document.id);

  if (pos < 0) {
    return;
  }

  // delete from database
  this.http.delete('http://localhost:3000/documents/' + document.id)
    .subscribe(
      (response: Response) => {
        this.documents.splice(pos, 1);
        this.storeDocuments();
      }
    );
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


addDocument(document: Document) {
  if (!document) {
    return;
  }

  // make sure id of the new Document is empty
  document.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // add to database
  this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
    document,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.storeDocuments();
      }
    );
}


updateDocument(originalDocument: Document, newDocument: Document) {
  if (!originalDocument || !newDocument) {
    return;
  }

  const pos = this.documents.findIndex(d => d.id === originalDocument.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new Document to the id of the old Document
  newDocument.id = originalDocument.id;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // update database
  this.http.put('http://localhost:3000/documents/' + originalDocument.id,
    newDocument, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.documents[pos] = newDocument;
        this.storeDocuments();
      }
    );
}

storeDocuments() {
  let newDocArray = JSON.stringify(this.documents)
  this.http.put('https://localhost:3000/documents', newDocArray, 
  {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }).subscribe(response => {
    this.documentListChangedEvent.next(this.documents.slice())
  })
}
}
