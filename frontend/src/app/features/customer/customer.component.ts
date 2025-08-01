import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { CustomerActionDialogComponent } from '../../shared/components/customer-action-dialog/customer-action-dialog.component';

export interface CustomerData {
  id: number;
  name: string;
  roomNumber: string;
  email: string;
  phone: string;
  residentType: 'Owner' | 'Tenant';
}

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, PaginationComponent, CustomerActionDialogComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  searchText = '';

  // Action dialog state
  actionDialogVisible = signal(false);
  actionDialogPosition = signal({ x: 0, y: 0 });
  selectedCustomer = signal<CustomerData | null>(null);

  constructor(private router: Router) {}

  customers: CustomerData[] = [
    {
      id: 1,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Owner'
    },
    {
      id: 2,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Owner'
    },
    {
      id: 3,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Owner'
    },
    {
      id: 4,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Owner'
    },
    {
      id: 5,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Tenant'
    },
    {
      id: 6,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Tenant'
    },
    {
      id: 7,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Tenant'
    },
    {
      id: 8,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Tenant'
    },
    {
      id: 9,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Tenant'
    },
    {
      id: 10,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Tenant'
    },
    {
      id: 11,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Tenant'
    },
    {
      id: 12,
      name: 'Khemika Issarapharb',
      roomNumber: '12345',
      email: 'email@codium.co',
      phone: '066-555-5555',
      residentType: 'Tenant'
    }
  ];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = this.customers.length;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchText = target.value;
  }

  onCreate() {
    this.router.navigate(['/customer/create']);
  }

  onFilter() {
    console.log('Open filter');
  }

  onDownload() {
    console.log('Download customer data');
  }

  onSort(sortBy: string) {
    console.log('Sort by:', sortBy);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }

  onCustomerAction(customer: CustomerData, action: string, event?: Event) {
    if (action === 'more' && event) {
      event.stopPropagation();
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();

      // Position the dialog near the clicked button
      const x = rect.left - 110 + rect.width; // Align right edge of dialog with button
      const y = rect.bottom + 4; // Position below the button with small gap

      this.selectedCustomer.set(customer);
      this.actionDialogPosition.set({ x, y });
      this.actionDialogVisible.set(true);
    } else {
      console.log(`${action} customer:`, customer);
    }
  }

  onCustomerRowClick(customer: CustomerData) {
    this.router.navigate(['/customer', customer.id]);
  }

  onActionDialogClose() {
    this.actionDialogVisible.set(false);
    this.selectedCustomer.set(null);
  }

  onEditCustomer() {
    const customer = this.selectedCustomer();
    if (customer) {
      console.log('Edit customer:', customer);
      // Navigate to edit page or open edit dialog
      this.router.navigate(['/customer/edit', customer.id]);
    }
  }

  onDeleteCustomer() {
    const customer = this.selectedCustomer();
    if (customer) {
      console.log('Delete customer:', customer);
      // Show confirmation dialog and delete customer
      if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
        this.customers = this.customers.filter(c => c.id !== customer.id);
        this.totalItems = this.customers.length;
      }
    }
  }

  get displayedCustomers(): CustomerData[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.customers.slice(startIndex, endIndex);
  }

  trackByCustomerId(index: number, customer: CustomerData): number {
    return customer.id;
  }
}
