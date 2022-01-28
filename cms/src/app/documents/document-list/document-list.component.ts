import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  documents: Document[] = [
    new Document('1', 'Book', 'This is a test book', 'https://www.google.com/books/edition/American_Assassin/TlpbWL6lHHUC?hl=en&gbpv=1&printsec=frontcover'),
    new Document('2', 'Sroll', 'This is a text scroll', 'https://en.wikipedia.org/wiki/Dead_Sea_Scrolls')
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
