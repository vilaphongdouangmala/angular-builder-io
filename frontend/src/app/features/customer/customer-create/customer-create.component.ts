import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface ContactPerson {
  contactName: string;
  email: string;
  remarks: string;
}

export interface CompanyContactPerson {
  contactName: string;
  email: string;
  remarks: string;
  withholdingTax?: number;
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

  companyTypes = [
    { value: 'limited', label: 'Limited Company' },
    { value: 'public', label: 'Public Limited Company' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'others', label: 'Others' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      customerType: ['individual', Validators.required],
      taxId: [''],
      // Individual fields
      prefix: [''],
      customPrefix: [''],
      firstName: [''],
      lastName: [''],
      // Company fields
      companyType: [''],
      companyTypeOther: [''],
      companyName: [''],
      // Common fields
      email: [''],
      phoneNo: [''],
      contactPersons: this.fb.array([
        this.createContactPersonGroup()
      ])
    });

    // Update validators when customer type changes
    this.customerForm.get('customerType')?.valueChanges.subscribe(type => {
      this.updateValidators(type);
    });

    // Initialize validators for default type
    this.updateValidators('individual');
  }

  createContactPersonGroup(): FormGroup {
    const isCompany = this.customerForm?.get('customerType')?.value === 'company';
    const group = this.fb.group({
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      remarks: ['']
    });

    // Add withholding tax field only for company customers
    if (isCompany) {
      group.addControl('withholdingTax', this.fb.control(0));
    }

    return group;
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

  isCompanyTypeOthers(): boolean {
    return this.customerForm.get('companyType')?.value === 'others';
  }

  isCompanyType(): boolean {
    return this.customerForm.get('customerType')?.value === 'company';
  }

  isIndividualType(): boolean {
    return this.customerForm.get('customerType')?.value === 'individual';
  }

  private updateValidators(customerType: string) {
    const controls = this.customerForm.controls;

    // Clear all validators first
    Object.keys(controls).forEach(key => {
      if (key !== 'customerType' && key !== 'contactPersons') {
        controls[key].clearValidators();
        controls[key].setValue(''); // Clear values when switching types
      }
    });

    // Add validators based on customer type
    if (customerType === 'individual') {
      controls['prefix'].setValidators([Validators.required]);
      controls['firstName'].setValidators([Validators.required]);
      controls['lastName'].setValidators([Validators.required]);
      controls['email'].setValidators([Validators.required, Validators.email]);
    } else if (customerType === 'company') {
      controls['companyType'].setValidators([Validators.required]);
      controls['companyName'].setValidators([Validators.required]);
      controls['email'].setValidators([Validators.required, Validators.email]);
      controls['phoneNo'].setValidators([Validators.required]);
    }

    // Update form control validation status
    Object.keys(controls).forEach(key => {
      controls[key].updateValueAndValidity();
    });
  }
}
