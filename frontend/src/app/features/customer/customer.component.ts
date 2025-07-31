import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, type Column, type TableData } from '../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

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
  imports: [CommonModule, DataTableComponent, PaginationComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  searchText = '';

  // Table configuration
  tableColumns: Column[] = [
    { key: 'displayName', label: 'Name', width: 'lg' },
    { key: 'contactInfo', label: 'Email', width: 'lg' },
    { key: 'residentType', label: 'Resident type', width: 'sm' },
    { key: 'actions', label: 'Action', width: 'xs', align: 'center' }
  ];
  
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
    console.log('Create new customer');
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

  onCustomerAction(customer: CustomerData, action: string) {
    console.log(`${action} customer:`, customer);
  }

  get displayedCustomers(): TableData[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    return this.customers.slice(startIndex, endIndex).map(customer => ({
      id: customer.id,
      displayName: `${customer.name}<br><small class="text-neutrals-300 text-xs">Room number: ${customer.roomNumber}</small>`,
      contactInfo: `${customer.email}<br><small class="text-neutrals-300 text-xs">${customer.phone}</small>`,
      residentType: customer.residentType,
      actions: `<button class="w-5 h-5 hover:bg-gray-100 rounded" onclick="this.onCustomerAction('${customer.id}', 'more')">
        <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none">
          <path d="M10.0002 10.4167C10.2303 10.4167 10.4168 10.2301 10.4168 10C10.4168 9.76988 10.2303 9.58333 10.0002 9.58333C9.77004 9.58333 9.5835 9.76988 9.5835 10C9.5835 10.2301 9.77004 10.4167 10.0002 10.4167Z" fill="#55596D" stroke="#55596D" stroke-width="1.5"/>
          <path d="M10.0002 15.4167C10.2303 15.4167 10.4168 15.2301 10.4168 15C10.4168 14.7699 10.2303 14.5833 10.0002 14.5833C9.77004 14.5833 9.5835 14.7699 9.5835 15C9.5835 15.2301 9.77004 15.4167 10.0002 15.4167Z" fill="#55596D" stroke="#55596D" stroke-width="1.5"/>
          <path d="M10.0002 5.41666C10.2303 5.41666 10.4168 5.23011 10.4168 4.99999C10.4168 4.76988 10.2303 4.58333 10.0002 4.58333C9.77004 4.58333 9.5835 4.76988 9.5835 4.99999C9.5835 5.23011 9.77004 5.41666 10.0002 5.41666Z" fill="#55596D" stroke="#55596D" stroke-width="1.5"/>
        </svg>
      </button>`
    }));
  }
}
