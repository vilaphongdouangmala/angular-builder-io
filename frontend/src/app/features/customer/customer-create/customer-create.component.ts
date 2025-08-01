import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { LocalizationService } from '../../../core/services/localization.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { CustomerDataService, CustomerData } from '../../../core/services/customer-data.service';

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
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss'
})
export class CustomerCreateComponent implements OnDestroy {
  customerForm: FormGroup;
  private isUpdatingValidators = false;
  private destroy$ = new Subject<void>();
  private customerDataService = inject(CustomerDataService);

  localizationService = inject(LocalizationService);

  companyTypes = [
    { value: 'limited', label: 'customer.companyTypes.limited' },
    { value: 'public', label: 'customer.companyTypes.public' },
    { value: 'partnership', label: 'customer.companyTypes.partnership' },
    { value: 'others', label: 'customer.companyTypes.others' }
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
      email: ['', [Validators.required, Validators.email]],
      phoneNo: [''],
      contactPersons: this.fb.array([
        this.createContactPersonGroup(false)
      ])
    });

    // Update validators when customer type changes
    this.customerForm.get('customerType')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(type => {
      if (!this.isUpdatingValidators) {
        this.updateValidators(type);
        this.updateContactPersonsForCustomerType(type);
      }
    });

    // Initialize validators for default type
    this.updateValidators('individual');
  }

  createContactPersonGroup(isCompany: boolean = false): FormGroup {
    const baseControls: any = {
      contactName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      remarks: ['']
    };

    // Add withholding tax field only for company customers
    if (isCompany) {
      baseControls.withholdingTax = [0];
    }

    return this.fb.group(baseControls);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get contactPersons(): FormArray {
    return this.customerForm.get('contactPersons') as FormArray;
  }

  addContactPerson() {
    const isCompany = this.isCompanyType();
    this.contactPersons.push(this.createContactPersonGroup(isCompany));
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
    this.isUpdatingValidators = true;
    const controls = this.customerForm.controls;

    // Clear all validators first
    Object.keys(controls).forEach(key => {
      if (key !== 'customerType' && key !== 'contactPersons' && key !== 'email') {
        controls[key].clearValidators();
        controls[key].setValue('', { emitEvent: false }); // Prevent triggering events
        controls[key].markAsUntouched(); // Clear touched state
        controls[key].markAsPristine(); // Clear dirty state
        controls[key].setErrors(null); // Clear any existing errors
      }
    });

    // Always keep email validation but clear its state
    controls['email'].setValidators([Validators.required, Validators.email]);
    controls['email'].markAsUntouched();
    controls['email'].markAsPristine();
    controls['email'].setErrors(null);

    // Add validators based on customer type
    if (customerType === 'individual') {
      controls['prefix'].setValidators([Validators.required]);
      controls['firstName'].setValidators([Validators.required]);
      controls['lastName'].setValidators([Validators.required]);
    } else if (customerType === 'company') {
      controls['companyType'].setValidators([Validators.required]);
      controls['companyName'].setValidators([Validators.required]);
      controls['phoneNo'].setValidators([Validators.required]);
    }

    // Update form control validation status
    Object.keys(controls).forEach(key => {
      if (key !== 'customerType') { // Don't update customerType to avoid triggering valueChanges
        controls[key].updateValueAndValidity({ emitEvent: false });
      }
    });

    this.isUpdatingValidators = false;
  }

  hasWithholdingTax(index: number): boolean {
    return this.contactPersons.at(index)?.get('withholdingTax') !== null;
  }

  private updateContactPersonsForCustomerType(customerType: string) {
    const isCompany = customerType === 'company';

    // Use clear() method instead of removeAt() to avoid triggering updates for each removal
    this.contactPersons.clear();

    // Add at least one contact person with appropriate structure
    this.contactPersons.push(this.createContactPersonGroup(isCompany));
  }
}
