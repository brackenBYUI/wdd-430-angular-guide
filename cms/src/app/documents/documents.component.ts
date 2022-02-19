import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  selectedDocument: Document[];
  private subscription: Subscription;

  constructor(private docService: DocumentService) { }

  ngOnInit(): void {
    this.subscription = this.docService.documentListChangedEvent.subscribe(
      (doc: Document[]) => {
        this.selectedDocument = doc;
      }
    )
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe()
  }
}
