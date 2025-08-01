import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil, switchMap, BehaviorSubject, combineLatest, EMPTY, catchError } from 'rxjs';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { CustomerActionDialogComponent } from '../../shared/components/customer-action-dialog/customer-action-dialog.component';
import { CustomerDataService, CustomerData, CustomerFilters, PaginatedResponse } from '../../core/services/customer-data.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, PaginationComponent, CustomerActionDialogComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit, OnDestroy {
  private customerDataService = inject(CustomerDataService);
  private destroy$ = new Subject<void>();
  
  // Search and filter state
  private searchSubject = new BehaviorSubject<string>('');
  private pageSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(10);
  
  // Component state
  searchText = '';
  customers = signal<CustomerData[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  totalItems = signal<number>(0);
  totalPages = signal<number>(0);
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(10);

  // Action dialog state
  actionDialogVisible = signal(false);
  actionDialogPosition = signal({ x: 0, y: 0 });
  selectedCustomer = signal<CustomerData | null>(null);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setupCustomerData();
    this.setupLoadingAndError();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupCustomerData(): void {
    // Combine search, page, and pageSize changes to fetch data
    combineLatest([
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.pageSubject,
      this.pageSizeSubject
    ]).pipe(
      switchMap(([searchText, page, pageSize]) => {
        const filters: CustomerFilters = {
          searchText: searchText || undefined,
          page,
          pageSize
        };
        return this.customerDataService.getCustomers(filters).pipe(
          catchError(error => {
            console.error('Error loading customers:', error);
            return EMPTY;
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe((response: PaginatedResponse<CustomerData>) => {
      this.customers.set(response.data);
      this.totalItems.set(response.total);
      this.totalPages.set(response.totalPages);
      this.currentPage.set(response.page);
      this.itemsPerPage.set(response.pageSize);
    });
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
      this.error.set(error);
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchText = target.value;
    this.searchSubject.next(target.value);
    this.pageSubject.next(1); // Reset to first page when searching
  }

  onCreate(): void {
    this.router.navigate(['/customer/create']);
  }

  onFilter(): void {
    console.log('Open filter');
  }

  onDownload(): void {
    console.log('Download customer data');
  }

  onSort(sortBy: string): void {
    console.log('Sort by:', sortBy);
  }

  onPageChange(page: number): void {
    this.pageSubject.next(page);
  }

  onItemsPerPageChange(items: number): void {
    this.pageSizeSubject.next(items);
    this.pageSubject.next(1); // Reset to first page when changing page size
  }

  onCustomerAction(customer: CustomerData, action: string, event?: Event): void {
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

  onCustomerRowClick(customer: CustomerData): void {
    this.router.navigate(['/customer', customer.id]);
  }

  onActionDialogClose(): void {
    this.actionDialogVisible.set(false);
    this.selectedCustomer.set(null);
  }

  onEditCustomer(): void {
    const customer = this.selectedCustomer();
    if (customer) {
      console.log('Edit customer:', customer);
      // Navigate to edit page or open edit dialog
      this.router.navigate(['/customer/edit', customer.id]);
    }
  }

  onDeleteCustomer(): void {
    const customer = this.selectedCustomer();
    if (customer) {
      console.log('Delete customer:', customer);
      // Show confirmation dialog and delete customer
      if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
        this.customerDataService.deleteCustomer(customer.id).pipe(
          takeUntil(this.destroy$),
          catchError(error => {
            console.error('Error deleting customer:', error);
            return EMPTY;
          })
        ).subscribe(() => {
          this.onActionDialogClose();
          // Refresh current page
          this.pageSubject.next(this.currentPage());
        });
      }
    }
  }

  get displayedCustomers(): CustomerData[] {
    // Data is already paginated from the service
    return this.customers();
  }

  trackByCustomerId(index: number, customer: CustomerData): number {
    return customer.id;
  }
}
