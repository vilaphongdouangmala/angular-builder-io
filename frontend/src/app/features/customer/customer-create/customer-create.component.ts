import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface ContactPerson {
  contactName: string;
  email: string;
  remarks: string;
}

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss'
})
export class CustomerCreateComponent {
  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      customerType: ['individual', Validators.required],
      taxId: [''],
      prefix: ['', Validators.required],
      customPrefix: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: [''],
      contactPersons: this.fb.array([
        this.createContactPersonGroup()
      ])
    });
  }

  createContactPersonGroup(): FormGroup {
    return this.fb.group({
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      remarks: ['']
    });
  }

  get contactPersons(): FormArray {
    return this.customerForm.get('contactPersons') as FormArray;
  }

  addContactPerson() {
    this.contactPersons.push(this.createContactPersonGroup());
  }

  removeContactPerson(index: number) {
    if (this.contactPersons.length > 1) {
      this.contactPersons.removeAt(index);
    }
  }

  onBack() {
    this.router.navigate(['/customer']);
  }

  onCancel() {
    this.router.navigate(['/customer']);
  }

  onSave() {
    if (this.customerForm.valid) {
      console.log('Customer data:', this.customerForm.value);
      console.log("Call API to backend");
      const isSuccess = true;
      if (isSuccess) {
        console.log("sucessfully created customer")
      }
      // Here you would typically save the data to a service
      this.router.navigate(['/customer']);
    } else {
      // Mark all fields as touched to show validation errors
      this.customerForm.markAllAsTouched();
    }
  }

  get isFormValid(): boolean {
    return this.customerForm.valid;
  }

  isPrefixOthers(): boolean {
    return this.customerForm.get('prefix')?.value === 'others';
  }
}
