import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  imports: [CommonModule, PaginationComponent],
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

  get displayedCustomers(): CustomerData[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.customers.slice(startIndex, endIndex);
  }

  trackByCustomerId(index: number, customer: CustomerData): number {
    return customer.id;
  }
}
