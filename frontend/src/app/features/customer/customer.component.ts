import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  searchText = '';
  
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
  totalPages = 20;
  totalItems = 100;

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
}
