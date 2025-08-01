import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TabsComponent } from '../../../shared/components/tabs/tabs.component';

export interface CustomerDetails {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  prefix: string;
  customerType: 'Individual' | 'Company';
  taxId: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface ContactPerson {
  id: number;
  contractName: string;
  email: string;
  remarks: string;
}

export interface RoomHistory {
  id: number;
  room: string;
  floor: string;
  building: string;
  period: string;
  status: 'Active' | 'Inactive';
}

export interface InvoiceLog {
  id: number;
  building: string;
  floor: string;
  room: string;
  period: string;
  memoDetail: string;
}

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, PaginationComponent, TabsComponent],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent implements OnInit {
  customerId = signal<number | null>(null);
  customer = signal<CustomerDetails | null>(null);
  
  // Contact persons data
  contactPersons = signal<ContactPerson[]>([
    { id: 1, contractName: 'Khemika', email: 'khemmika.i@codium.co', remarks: 'Header' },
    { id: 2, contractName: 'Khemika', email: 'khemmika.i@codium.co', remarks: 'Finance' },
    { id: 3, contractName: 'Khemika', email: 'khemmika.i@codium.co', remarks: 'CEO' }
  ]);

  // Room history data
  roomHistory = signal<RoomHistory[]>([
    { id: 1, room: '1202', floor: '2 st Floor', building: 'Four seasons residence', period: '27/12/2024-Present', status: 'Active' },
    { id: 2, room: '1202', floor: '2 st Floor', building: 'Four seasons residence', period: '27/12/2024-Present', status: 'Active' },
    { id: 3, room: '1202', floor: '2 st Floor', building: 'Four seasons residence', period: '27/12/2024-31/03/2025', status: 'Inactive' },
    { id: 4, room: '1202', floor: '2 st Floor', building: 'Four seasons residence', period: '27/12/2024-31/03/2025', status: 'Inactive' }
  ]);

  // Invoice log data
  invoiceLog = signal<InvoiceLog[]>([
    { id: 1, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' },
    { id: 2, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' },
    { id: 3, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' },
    { id: 4, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' },
    { id: 5, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' },
    { id: 6, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' },
    { id: 7, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' },
    { id: 8, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' },
    { id: 9, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' },
    { id: 10, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' },
    { id: 11, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' },
    { id: 12, building: 'Four seasons residence', floor: '2 st Floor', room: '1202', period: '27/12/2024-31/03/2025', memoDetail: 'Memo number detail' }
  ]);

  // Room history tab state
  roomHistoryActiveTab = signal<'Owner' | 'Tenant'>('Owner');
  roomHistoryOwnerCount = signal(4);
  roomHistoryTenantCount = signal(1);

  // Invoice log tab state
  invoiceLogActiveTab = signal<'Invoice log' | 'Advance deposit'>('Invoice log');

  // Room history pagination
  roomHistoryCurrentPage = signal(1);
  roomHistoryItemsPerPage = signal(10);

  // Invoice log pagination
  invoiceLogCurrentPage = signal(1);
  invoiceLogItemsPerPage = signal(10);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.customerId.set(id);
      this.loadCustomer(id);
    });
  }

  loadCustomer(id: number) {
    // Mock customer data - in real app, this would come from a service
    const mockCustomer: CustomerDetails = {
      id,
      name: 'Khemika Issarapharb',
      firstName: 'Khemika',
      lastName: 'Isaraphap',
      prefix: 'Miss',
      customerType: 'Individual',
      taxId: '1-2340-56789-12-3',
      email: 'khemmika.i@codium.co',
      phone: '064-445-4565',
      avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/5152d03586dd9cd285089719752cf2ff60ea8be7?width=64'
    };
    
    this.customer.set(mockCustomer);
  }

  onBack() {
    this.router.navigate(['/customer']);
  }

  onEdit() {
    console.log('Edit customer:', this.customer());
  }

  onMoreActions() {
    console.log('More actions for customer:', this.customer());
  }

  // Room history methods
  onRoomHistoryTabChange(tab: 'Owner' | 'Tenant') {
    this.roomHistoryActiveTab.set(tab);
    this.roomHistoryCurrentPage.set(1);
  }

  onRoomHistoryPageChange(page: number) {
    this.roomHistoryCurrentPage.set(page);
  }

  onRoomHistoryItemsPerPageChange(items: number) {
    this.roomHistoryItemsPerPage.set(items);
    this.roomHistoryCurrentPage.set(1);
  }

  get roomHistoryDisplayedItems(): RoomHistory[] {
    const startIndex = (this.roomHistoryCurrentPage() - 1) * this.roomHistoryItemsPerPage();
    const endIndex = startIndex + this.roomHistoryItemsPerPage();
    return this.roomHistory().slice(startIndex, endIndex);
  }

  get roomHistoryTotalPages(): number {
    return Math.ceil(this.roomHistory().length / this.roomHistoryItemsPerPage());
  }

  // Invoice log methods
  onInvoiceLogTabChange(tab: 'Invoice log' | 'Advance deposit') {
    this.invoiceLogActiveTab.set(tab);
    this.invoiceLogCurrentPage.set(1);
  }

  onInvoiceLogPageChange(page: number) {
    this.invoiceLogCurrentPage.set(page);
  }

  onInvoiceLogItemsPerPageChange(items: number) {
    this.invoiceLogItemsPerPage.set(items);
    this.invoiceLogCurrentPage.set(1);
  }

  get invoiceLogDisplayedItems(): InvoiceLog[] {
    const startIndex = (this.invoiceLogCurrentPage() - 1) * this.invoiceLogItemsPerPage();
    const endIndex = startIndex + this.invoiceLogItemsPerPage();
    return this.invoiceLog().slice(startIndex, endIndex);
  }

  get invoiceLogTotalPages(): number {
    return Math.ceil(this.invoiceLog().length / this.invoiceLogItemsPerPage());
  }

  onMemoDetailClick(item: InvoiceLog) {
    console.log('View memo detail:', item);
  }
}
