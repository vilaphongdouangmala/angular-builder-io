import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TabsComponent } from '../../../shared/components/tabs/tabs.component';
import { CustomerDataService, CustomerData } from '../../../core/services/customer-data.service';

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
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  private customerDataService = inject(CustomerDataService);
  private destroy$ = new Subject<void>();

  customerId = signal<number | null>(null);
  customer = signal<CustomerDetails | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
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

  ngOnInit(): void {
    this.setupCustomerData();
    this.setupLoadingAndError();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupCustomerData(): void {
    this.route.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        this.customerId.set(id);
        return this.customerDataService.getCustomerById(id).pipe(
          tap(customerData => {
            // Transform CustomerData to CustomerDetails
            const customerDetails: CustomerDetails = {
              id: customerData.id,
              name: customerData.name,
              firstName: customerData.name.split(' ')[0] || '',
              lastName: customerData.name.split(' ').slice(1).join(' ') || '',
              prefix: 'Miss', // Default value
              customerType: 'Individual', // Default value
              taxId: '1-2340-56789-12-3', // Mock value
              email: customerData.email,
              phone: customerData.phone,
              avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/5152d03586dd9cd285089719752cf2ff60ea8be7?width=64'
            };
            this.customer.set(customerDetails);
          }),
          catchError(error => {
            console.error('Error loading customer:', error);
            this.error.set('Failed to load customer details');
            return EMPTY;
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private setupLoadingAndError(): void {
    // Subscribe to loading state
    this.customerDataService.loading$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      this.loading.set(loading);
    });

    // Subscribe to error state
    this.customerDataService.error$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(error => {
      if (error) {
        this.error.set(error);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/customer']);
  }

  onEdit(): void {
    const customer = this.customer();
    if (customer) {
      console.log('Edit customer:', customer);
      // Navigate to edit page
      this.router.navigate(['/customer/edit', customer.id]);
    }
  }

  onMoreActions(): void {
    console.log('More actions for customer:', this.customer());
  }

  // Room history methods
  onRoomHistoryTabChange(tab: 'Owner' | 'Tenant'): void {
    this.roomHistoryActiveTab.set(tab);
    this.roomHistoryCurrentPage.set(1);
  }

  onRoomHistoryPageChange(page: number): void {
    this.roomHistoryCurrentPage.set(page);
  }

  onRoomHistoryItemsPerPageChange(items: number): void {
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
  onInvoiceLogTabChange(tab: 'Invoice log' | 'Advance deposit'): void {
    this.invoiceLogActiveTab.set(tab);
    this.invoiceLogCurrentPage.set(1);
  }

  onInvoiceLogPageChange(page: number): void {
    this.invoiceLogCurrentPage.set(page);
  }

  onInvoiceLogItemsPerPageChange(items: number): void {
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

  onMemoDetailClick(item: InvoiceLog): void {
    console.log('View memo detail:', item);
  }
}
