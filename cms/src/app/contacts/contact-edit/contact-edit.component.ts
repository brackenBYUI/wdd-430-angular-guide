import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        let id = params.id;
        if (!id) {
          this.editMode = false
          return
        }
        this.originalContact = this.contactService.getContact(id);
        if (!this.originalContact) {
          return
        }
        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));
        if (this.originalContact.group) {
          this.groupContacts = this.originalContact.group.slice();
        }
      }
    )
  }
  
  onSubmit(form: NgForm) {
    const value = form.value;
    const id = this.contactService.getMaxId();
    let newContact = new Contact(id, value.name, value.email, value.phone, value.imageUrl, this.groupContacts);

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['../'], {relativeTo: this.route})
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route})
  }
}
