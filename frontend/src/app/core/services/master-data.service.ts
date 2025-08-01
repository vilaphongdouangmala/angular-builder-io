import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError, delay, map, tap, catchError, switchMap } from 'rxjs';

export interface BuildingData {
  id: number;
  name: string;
  addressTH: string;
  addressEN: string;
}

export interface FloorData {
  id: number;
  buildingId: number;
  floorNumber: string;
  description: string;
}

export interface RoomData {
  id: number;
  floorId: number;
  roomNumber: string;
  roomType: string;
  area: number;
}

export interface BillingData {
  id: number;
  customerId: number;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
}

export type MasterDataType = 'building' | 'floor' | 'room' | 'billing';
export type MasterDataItem = BuildingData | FloorData | RoomData | BillingData;

export interface MasterDataFilters {
  searchText?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private buildingsSubject = new BehaviorSubject<BuildingData[]>([]);
  private floorsSubject = new BehaviorSubject<FloorData[]>([]);
  private roomsSubject = new BehaviorSubject<RoomData[]>([]);
  private billingSubject = new BehaviorSubject<BillingData[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Observables for components to subscribe to
  public buildings$ = this.buildingsSubject.asObservable();
  public floors$ = this.floorsSubject.asObservable();
  public rooms$ = this.roomsSubject.asObservable();
  public billing$ = this.billingSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  // Mock data
  private mockBuildings: BuildingData[] = [
    {
      id: 1,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    },
    {
      id: 2,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    },
    {
      id: 3,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    },
    {
      id: 4,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    },
    {
      id: 5,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    },
    {
      id: 6,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    },
    {
      id: 7,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    },
    {
      id: 8,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    },
    {
      id: 9,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    },
    {
      id: 10,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    },
    {
      id: 11,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    },
    {
      id: 12,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor'
    }
  ];

  private mockFloors: FloorData[] = [
    { id: 1, buildingId: 1, floorNumber: 'G', description: 'Ground Floor' },
    { id: 2, buildingId: 1, floorNumber: '1', description: 'First Floor' },
    { id: 3, buildingId: 1, floorNumber: '2', description: 'Second Floor' },
  ];

  private mockRooms: RoomData[] = [
    { id: 1, floorId: 1, roomNumber: '101', roomType: 'Office', area: 25.5 },
    { id: 2, floorId: 1, roomNumber: '102', roomType: 'Office', area: 30.0 },
    { id: 3, floorId: 2, roomNumber: '201', roomType: 'Meeting Room', area: 15.0 },
  ];

  private mockBilling: BillingData[] = [
    { id: 1, customerId: 1, amount: 1500.00, dueDate: new Date('2024-01-15'), status: 'pending' },
    { id: 2, customerId: 2, amount: 2000.00, dueDate: new Date('2024-01-20'), status: 'paid' },
    { id: 3, customerId: 3, amount: 1750.00, dueDate: new Date('2024-01-10'), status: 'overdue' },
  ];

  constructor() {
    // Initialize with mock data
    this.buildingsSubject.next(this.mockBuildings);
    this.floorsSubject.next(this.mockFloors);
    this.roomsSubject.next(this.mockRooms);
    this.billingSubject.next(this.mockBilling);
  }

  /**
   * Get data by type with pagination and filtering
   */
  getData<T extends MasterDataItem>(
    type: MasterDataType,
    filters: MasterDataFilters = {}
  ): Observable<PaginatedResponse<T>> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.getDataSource<T>(type).pipe(
      delay(300), // Simulate network delay
      map(data => this.applyFilters(data, filters)),
      map(filteredData => this.applyPagination(filteredData, filters)),
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(`Failed to load ${type} data`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a single item by ID and type
   */
  getItemById<T extends MasterDataItem>(type: MasterDataType, id: number): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.getDataSource<T>(type).pipe(
      delay(200),
      map(data => data.find(item => item.id === id)),
      tap(() => this.loadingSubject.next(false)),
      switchMap(item => {
        if (!item) {
          const error = `${type} item with ID ${id} not found`;
          this.errorSubject.next(error);
          return throwError(() => new Error(error));
        }
        return of(item);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(`Failed to load ${type} item`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new item
   */
  createItem<T extends MasterDataItem>(type: MasterDataType, item: Omit<T, 'id'>): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.getDataSource<T>(type).pipe(
      delay(500),
      map(data => {
        const newItem = {
          ...item,
          id: Math.max(...data.map(d => d.id)) + 1
        } as T;
        return newItem;
      }),
      tap(newItem => {
        this.updateDataSource(type, currentData => [...currentData, newItem]);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(`Failed to create ${type} item`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing item
   */
  updateItem<T extends MasterDataItem>(
    type: MasterDataType,
    id: number,
    updates: Partial<T>
  ): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.getDataSource<T>(type).pipe(
      delay(400),
      map(data => {
        const itemIndex = data.findIndex(item => item.id === id);
        if (itemIndex === -1) {
          throw new Error(`${type} item with ID ${id} not found`);
        }
        return { itemIndex, data };
      }),
      tap(({ itemIndex, data }) => {
        const updatedItem = { ...data[itemIndex], ...updates } as T;
        this.updateDataSource(type, currentData => {
          const updated = [...currentData];
          updated[itemIndex] = updatedItem;
          return updated;
        });
        this.loadingSubject.next(false);
      }),
      map(({ data, itemIndex }) => ({ ...data[itemIndex], ...updates } as T)),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(`Failed to update ${type} item`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete an item
   */
  deleteItem(type: MasterDataType, id: number): Observable<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.getDataSource(type).pipe(
      delay(300),
      tap(data => {
        const filteredData = data.filter(item => item.id !== id);
        this.updateDataSource(type, () => filteredData);
        this.loadingSubject.next(false);
      }),
      map(() => void 0),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(`Failed to delete ${type} item`);
        return throwError(() => error);
      })
    );
  }

  /**
   * Search items by text
   */
  searchItems<T extends MasterDataItem>(type: MasterDataType, searchText: string): Observable<T[]> {
    if (!searchText.trim()) {
      return this.getDataSource<T>(type);
    }

    return this.getDataSource<T>(type).pipe(
      map(data => 
        data.filter(item => {
          const searchLower = searchText.toLowerCase();
          return Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchLower)
          );
        })
      )
    );
  }

  /**
   * Clear any error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  private getDataSource<T extends MasterDataItem>(type: MasterDataType): Observable<T[]> {
    switch (type) {
      case 'building':
        return this.buildings$ as Observable<T[]>;
      case 'floor':
        return this.floors$ as Observable<T[]>;
      case 'room':
        return this.rooms$ as Observable<T[]>;
      case 'billing':
        return this.billing$ as Observable<T[]>;
      default:
        return throwError(() => new Error(`Unknown data type: ${type}`));
    }
  }

  private updateDataSource<T extends MasterDataItem>(
    type: MasterDataType,
    updateFn: (currentData: T[]) => T[]
  ): void {
    switch (type) {
      case 'building':
        this.buildingsSubject.next(updateFn(this.buildingsSubject.value as T[]));
        break;
      case 'floor':
        this.floorsSubject.next(updateFn(this.floorsSubject.value as T[]));
        break;
      case 'room':
        this.roomsSubject.next(updateFn(this.roomsSubject.value as T[]));
        break;
      case 'billing':
        this.billingSubject.next(updateFn(this.billingSubject.value as T[]));
        break;
    }
  }

  private applyFilters<T extends MasterDataItem>(data: T[], filters: MasterDataFilters): T[] {
    let filtered = [...data];

    if (filters.searchText) {
      const searchText = filters.searchText.toLowerCase();
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchText)
        )
      );
    }

    return filtered;
  }

  private applyPagination<T extends MasterDataItem>(
    data: T[],
    filters: MasterDataFilters
  ): PaginatedResponse<T> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages
    };
  }
}
