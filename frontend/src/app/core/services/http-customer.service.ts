import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, delay, map, catchError, retry, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  timestamp: Date;
}

export interface CustomerApiData {
  id: number;
  name: string;
  roomNumber: string;
  email: string;
  phone: string;
  residentType: 'Owner' | 'Tenant';
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message: string;
  timestamp: Date;
}

export interface CustomerFiltersApi {
  search?: string;
  residentType?: 'Owner' | 'Tenant' | 'all';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class HttpCustomerService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/customers`;
  private readonly defaultTimeout = 10000; // 10 seconds

  /**
   * Get customers with pagination and filtering using HTTP
   */
  getCustomers(filters: CustomerFiltersApi = {}): Observable<PaginatedApiResponse<CustomerApiData>> {
    let params = new HttpParams();

    // Add query parameters
    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.residentType && filters.residentType !== 'all') {
      params = params.set('residentType', filters.residentType);
    }
    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.sortOrder) {
      params = params.set('sortOrder', filters.sortOrder);
    }

    return this.http.get<PaginatedApiResponse<CustomerApiData>>(this.apiUrl, { params }).pipe(
      timeout(this.defaultTimeout),
      retry(2), // Retry failed requests up to 2 times
      catchError(this.handleError)
    );
  }

  /**
   * Get a single customer by ID using HTTP
   */
  getCustomerById(id: number): Observable<ApiResponse<CustomerApiData>> {
    return this.http.get<ApiResponse<CustomerApiData>>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * Create a new customer using HTTP
   */
  createCustomer(customer: Omit<CustomerApiData, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<CustomerApiData>> {
    return this.http.post<ApiResponse<CustomerApiData>>(this.apiUrl, customer).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing customer using HTTP
   */
  updateCustomer(id: number, updates: Partial<CustomerApiData>): Observable<ApiResponse<CustomerApiData>> {
    return this.http.patch<ApiResponse<CustomerApiData>>(`${this.apiUrl}/${id}`, updates).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * Delete a customer using HTTP
   */
  deleteCustomer(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * Bulk delete customers using HTTP
   */
  bulkDeleteCustomers(ids: number[]): Observable<ApiResponse<void>> {
    return this.http.request<ApiResponse<void>>('delete', this.apiUrl, {
      body: { ids }
    }).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * Search customers by text using HTTP
   */
  searchCustomers(searchTerm: string, filters: Omit<CustomerFiltersApi, 'search'> = {}): Observable<PaginatedApiResponse<CustomerApiData>> {
    return this.getCustomers({ ...filters, search: searchTerm });
  }

  /**
   * Export customers data using HTTP
   */
  exportCustomers(format: 'csv' | 'xlsx' | 'pdf', filters: CustomerFiltersApi = {}): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('format', format);

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    }).pipe(
      timeout(30000), // Longer timeout for export operations
      catchError(this.handleError)
    );
  }

  /**
   * Upload customers from file using HTTP
   */
  uploadCustomers(file: File): Observable<ApiResponse<{ imported: number; failed: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<{ imported: number; failed: number; errors: string[] }>>(
      `${this.apiUrl}/upload`,
      formData
    ).pipe(
      timeout(60000), // Longer timeout for upload operations
      catchError(this.handleError)
    );
  }

  /**
   * Get customer statistics using HTTP
   */
  getCustomerStats(): Observable<ApiResponse<{
    total: number;
    owners: number;
    tenants: number;
    activeThisMonth: number;
    growth: number;
  }>> {
    return this.http.get<ApiResponse<{
      total: number;
      owners: number;
      tenants: number;
      activeThisMonth: number;
      growth: number;
    }>>(`${this.apiUrl}/stats`).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * Validate customer data using HTTP
   */
  validateCustomer(customerData: Partial<CustomerApiData>): Observable<ApiResponse<{
    valid: boolean;
    errors: { field: string; message: string }[];
  }>> {
    return this.http.post<ApiResponse<{
      valid: boolean;
      errors: { field: string; message: string }[];
    }>>(`${this.apiUrl}/validate`, customerData).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors in a consistent way
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} - ${error.message}`;
      
      // Handle specific error codes
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 409:
          errorMessage = 'Conflict. Resource already exists.';
          break;
        case 422:
          errorMessage = 'Validation error. Please check your input.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
      }
    }

    console.error('HTTP Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Create a mock response for development (when backend is not available)
   */
  createMockResponse<T>(data: T, delay: number = 500): Observable<ApiResponse<T>> {
    return of({
      data,
      success: true,
      message: 'Success',
      timestamp: new Date()
    }).pipe(
      delay(delay)
    );
  }

  /**
   * Create a mock paginated response for development
   */
  createMockPaginatedResponse<T>(
    data: T[],
    page: number = 1,
    pageSize: number = 10,
    total: number = data.length,
    delay: number = 500
  ): Observable<PaginatedApiResponse<T>> {
    return of({
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      },
      success: true,
      message: 'Success',
      timestamp: new Date()
    }).pipe(
      delay(delay)
    );
  }
}
