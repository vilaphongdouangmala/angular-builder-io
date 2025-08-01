import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, BehaviorSubject, combineLatest, takeUntil, switchMap, debounceTime, distinctUntilChanged, EMPTY, catchError } from 'rxjs';
import { TabsComponent, Tab } from '../../shared/components/tabs/tabs.component';
import { DataTableComponent, Column, TableData } from '../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { MasterDataService, MasterDataType, MasterDataItem, MasterDataFilters, PaginatedResponse, BuildingData } from '../../core/services/master-data.service';

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [
    CommonModule,
    TabsComponent,
    DataTableComponent,
    PaginationComponent
  ],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.scss'
})
export class MasterDataComponent implements OnInit, OnDestroy {
  private masterDataService = inject(MasterDataService);
  private destroy$ = new Subject<void>();

  // State management with BehaviorSubjects
  private selectedTabSubject = new BehaviorSubject<MasterDataType>('building');
  private searchSubject = new BehaviorSubject<string>('');
  private pageSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(10);

  // Component state signals
  selectedTab = signal<MasterDataType>('building');
  searchText = signal<string>('');
  data = signal<MasterDataItem[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  totalItems = signal<number>(0);
  totalPages = signal<number>(0);
  currentPage = signal<number>(1);
  itemsPerPage = signal<number>(10);

  tabs: Tab[] = [
    { id: 'building', label: 'Building', icon: 'building', active: true },
    { id: 'floor', label: 'Floor', icon: 'elevator', active: false },
    { id: 'room', label: 'Room', icon: 'planimetry', active: false },
    { id: 'billing', label: 'Billing', icon: 'piggy-bank', active: false }
  ];

  columns: Column[] = [
    { key: 'id', label: 'No.', width: 'xs' },
    { key: 'name', label: 'Building name' },
    { key: 'addressTH', label: 'Building address (TH)', width: 'lg' },
    { key: 'addressEN', label: 'Building address (EN)', width: 'lg' },
    { key: 'action', label: 'Action', width: 'sm', align: 'center' }
  ];

  ngOnInit(): void {
    this.setupDataSubscription();
    this.setupLoadingAndError();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupDataSubscription(): void {
    // Combine tab selection, search, pagination to fetch data
    combineLatest([
      this.selectedTabSubject,
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.pageSubject,
      this.pageSizeSubject
    ]).pipe(
      switchMap(([selectedTab, searchText, page, pageSize]) => {
        this.updateColumnsForTab(selectedTab);
        
        const filters: MasterDataFilters = {
          searchText: searchText || undefined,
          page,
          pageSize
        };
        
        return this.masterDataService.getData(selectedTab, filters).pipe(
          catchError(error => {
            console.error('Error loading master data:', error);
            return EMPTY;
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe((response: PaginatedResponse<MasterDataItem>) => {
      this.data.set(response.data);
      this.totalItems.set(response.total);
      this.totalPages.set(response.totalPages);
      this.currentPage.set(response.page);
      this.itemsPerPage.set(response.pageSize);
    });
  }

  private setupLoadingAndError(): void {
    // Subscribe to loading state
    this.masterDataService.loading$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      this.loading.set(loading);
    });

    // Subscribe to error state
    this.masterDataService.error$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(error => {
      this.error.set(error);
    });
  }

  private updateColumnsForTab(tabId: MasterDataType): void {
    switch (tabId) {
      case 'building':
        this.columns = [
          { key: 'id', label: 'No.', width: 'xs' },
          { key: 'name', label: 'Building name' },
          { key: 'addressTH', label: 'Building address (TH)', width: 'lg' },
          { key: 'addressEN', label: 'Building address (EN)', width: 'lg' },
          { key: 'action', label: 'Action', width: 'sm', align: 'center' }
        ];
        break;
      case 'floor':
        this.columns = [
          { key: 'id', label: 'No.', width: 'xs' },
          { key: 'floorNumber', label: 'Floor Number' },
          { key: 'description', label: 'Description' },
          { key: 'buildingId', label: 'Building ID', width: 'sm' },
          { key: 'action', label: 'Action', width: 'sm', align: 'center' }
        ];
        break;
      case 'room':
        this.columns = [
          { key: 'id', label: 'No.', width: 'xs' },
          { key: 'roomNumber', label: 'Room Number' },
          { key: 'roomType', label: 'Room Type' },
          { key: 'area', label: 'Area (sqm)' },
          { key: 'action', label: 'Action', width: 'sm', align: 'center' }
        ];
        break;
      case 'billing':
        this.columns = [
          { key: 'id', label: 'No.', width: 'xs' },
          { key: 'customerId', label: 'Customer ID' },
          { key: 'amount', label: 'Amount' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: 'Action', width: 'sm', align: 'center' }
        ];
        break;
    }
  }

  onTabChange(tabId: string): void {
    const masterDataType = tabId as MasterDataType;
    this.selectedTab.set(masterDataType);
    this.selectedTabSubject.next(masterDataType);
    this.pageSubject.next(1); // Reset to first page when changing tabs
    
    // Update tab state
    this.tabs = this.tabs.map(tab => ({
      ...tab,
      active: tab.id === tabId
    }));
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchText = target.value;
    this.searchText.set(searchText);
    this.searchSubject.next(searchText);
    this.pageSubject.next(1); // Reset to first page when searching
  }

  onAdd(): void {
    const currentTab = this.selectedTab();
    console.log(`Add new ${currentTab}`);
    // Here you would typically open a create dialog or navigate to create page
  }

  onFilter(): void {
    console.log('Open filter');
  }

  onPageChange(page: number): void {
    this.pageSubject.next(page);
  }

  onItemsPerPageChange(items: number): void {
    this.pageSizeSubject.next(items);
    this.pageSubject.next(1); // Reset to first page when changing page size
  }

  onEdit(item: MasterDataItem): void {
    console.log('Edit item:', item);
    // Here you would typically open an edit dialog or navigate to edit page
  }

  onDelete(item: MasterDataItem): void {
    const currentTab = this.selectedTab();
    if (confirm(`Are you sure you want to delete this ${currentTab}?`)) {
      this.masterDataService.deleteItem(currentTab, item.id).pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error deleting item:', error);
          return EMPTY;
        })
      ).subscribe(() => {
        // Refresh current page
        this.pageSubject.next(this.currentPage());
      });
    }
  }

  get displayedData(): TableData[] {
    // Convert MasterDataItem to TableData format for the data table
    return this.data().map(item => {
      const tableData: TableData = { ...item };
      
      // Format specific fields based on data type
      if ('dueDate' in item && item.dueDate instanceof Date) {
        tableData.dueDate = item.dueDate.toLocaleDateString();
      }
      
      return tableData;
    });
  }

  trackByItemId(index: number, item: MasterDataItem): number {
    return item.id;
  }
}
