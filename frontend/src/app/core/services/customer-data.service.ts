import { Injectable, signal } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError, delay, map, tap, catchError, switchMap, filter } from 'rxjs';

export interface CustomerData {
  id: number;
  name: string;
  roomNumber: string;
  email: string;
  phone: string;
  residentType: 'Owner' | 'Tenant';
}

export interface CustomerFilters {
  searchText?: string;
  residentType?: 'Owner' | 'Tenant' | 'all';
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
export class CustomerDataService {
  private customersSubject = new BehaviorSubject<CustomerData[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Observables for components to subscribe to
  public customers$ = this.customersSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  // Initial mock data
  private mockCustomers: CustomerData[] = [
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

  constructor() {
    // Initialize with mock data
    this.customersSubject.next(this.mockCustomers);
  }

  /**
   * Get customers with pagination and filtering
   */
  getCustomers(filters: CustomerFilters = {}): Observable<PaginatedResponse<CustomerData>> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return of(this.mockCustomers).pipe(
      delay(300), // Simulate network delay
      map(customers => this.applyFilters(customers, filters)),
      map(filteredCustomers => this.applyPagination(filteredCustomers, filters)),
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Failed to load customers');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a single customer by ID
   */
  getCustomerById(id: number): Observable<CustomerData> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return of(this.mockCustomers).pipe(
      delay(200),
      map(customers => customers.find(c => c.id === id)),
      tap(() => this.loadingSubject.next(false)),
      switchMap(customer => {
        if (!customer) {
          const error = `Customer with ID ${id} not found`;
          this.errorSubject.next(error);
          return throwError(() => new Error(error));
        }
        return of(customer);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Failed to load customer');
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new customer
   */
  createCustomer(customer: Omit<CustomerData, 'id'>): Observable<CustomerData> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const newCustomer: CustomerData = {
      ...customer,
      id: Math.max(...this.customersSubject.value.map(c => c.id)) + 1
    };

    return of(newCustomer).pipe(
      delay(500), // Simulate network delay
      tap(createdCustomer => {
        const currentCustomers = this.customersSubject.value;
        this.customersSubject.next([...currentCustomers, createdCustomer]);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Failed to create customer');
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing customer
   */
  updateCustomer(id: number, updates: Partial<CustomerData>): Observable<CustomerData> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return of(this.customersSubject.value).pipe(
      delay(400),
      map(customers => {
        const customerIndex = customers.findIndex(c => c.id === id);
        if (customerIndex === -1) {
          throw new Error(`Customer with ID ${id} not found`);
        }
        return { customerIndex, customers };
      }),
      tap(({ customerIndex, customers }) => {
        const updatedCustomer = { ...customers[customerIndex], ...updates };
        const updatedCustomers = [...customers];
        updatedCustomers[customerIndex] = updatedCustomer;
        this.customersSubject.next(updatedCustomers);
        this.loadingSubject.next(false);
      }),
      map(({ customers, customerIndex }) => ({ ...customers[customerIndex], ...updates })),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Failed to update customer');
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a customer
   */
  deleteCustomer(id: number): Observable<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return of(this.customersSubject.value).pipe(
      delay(300),
      map(customers => customers.filter(c => c.id !== id)),
      tap(filteredCustomers => {
        this.customersSubject.next(filteredCustomers);
        this.loadingSubject.next(false);
      }),
      map(() => void 0),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Failed to delete customer');
        return throwError(() => error);
      })
    );
  }

  /**
   * Search customers by text
   */
  searchCustomers(searchText: string): Observable<CustomerData[]> {
    if (!searchText.trim()) {
      return this.customers$;
    }

    return this.customers$.pipe(
      map(customers => 
        customers.filter(customer =>
          customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
          customer.roomNumber.includes(searchText) ||
          customer.phone.includes(searchText)
        )
      )
    );
  }

  /**
   * Clear any error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  private applyFilters(customers: CustomerData[], filters: CustomerFilters): CustomerData[] {
    let filtered = [...customers];

    if (filters.searchText) {
      const searchText = filters.searchText.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchText) ||
        customer.email.toLowerCase().includes(searchText) ||
        customer.roomNumber.includes(searchText) ||
        customer.phone.includes(searchText)
      );
    }

    if (filters.residentType && filters.residentType !== 'all') {
      filtered = filtered.filter(customer => customer.residentType === filters.residentType);
    }

    return filtered;
  }

  private applyPagination(customers: CustomerData[], filters: CustomerFilters): PaginatedResponse<CustomerData> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const total = customers.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = customers.slice(startIndex, endIndex);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages
    };
  }
}
