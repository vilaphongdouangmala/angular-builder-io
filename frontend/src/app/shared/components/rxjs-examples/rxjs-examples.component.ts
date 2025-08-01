import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { 
  Subject, 
  BehaviorSubject, 
  interval, 
  timer, 
  fromEvent, 
  combineLatest, 
  merge, 
  forkJoin,
  of,
  EMPTY,
  throwError
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  concatMap,
  exhaustMap,
  map,
  filter,
  tap,
  catchError,
  retry,
  takeUntil,
  startWith,
  scan,
  share,
  shareReplay,
  throttleTime,
  auditTime,
  sample,
  withLatestFrom,
  pairwise,
  bufferTime,
  bufferCount,
  delay,
  timeout,
  finalize
} from 'rxjs/operators';
import { RxJSUtilsService } from '../../../core/services/rxjs-utils.service';

interface SearchResult {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-rxjs-examples',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6 bg-white rounded-lg shadow-panel">
      <h2 class="text-2xl font-bold mb-6 text-neutrals-900">RxJS Patterns Examples</h2>
      
      <!-- Search Example -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">1. Debounced Search with TypeAhead</h3>
        <input
          [formControl]="searchControl"
          type="text"
          placeholder="Search for items..."
          class="w-full px-3 py-2 border border-neutrals-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
        />
        <div class="mt-2">
          @if (searchLoading()) {
            <p class="text-neutrals-400">Searching...</p>
          }
          @if (searchResults().length > 0) {
            <ul class="space-y-1">
              @for (result of searchResults(); track result.id) {
                <li class="p-2 bg-neutrals-50 rounded">{{ result.name }} - {{ result.description }}</li>
              }
            </ul>
          }
          @if (searchQuery() && searchResults().length === 0 && !searchLoading()) {
            <p class="text-neutrals-400">No results found</p>
          }
        </div>
      </div>

      <!-- Counter Examples -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">2. Counter with Different RxJS Patterns</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <p class="font-medium">Interval</p>
            <p class="text-2xl text-blue-500">{{ intervalCounter() }}</p>
          </div>
          <div class="text-center">
            <p class="font-medium">Timer</p>
            <p class="text-2xl text-green-500">{{ timerCounter() }}</p>
          </div>
          <div class="text-center">
            <p class="font-medium">Manual</p>
            <p class="text-2xl text-purple-500">{{ manualCounter() }}</p>
            <button 
              (click)="incrementManual()"
              class="mt-2 px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
            >
              Increment
            </button>
          </div>
          <div class="text-center">
            <p class="font-medium">Combined</p>
            <p class="text-2xl text-red-500">{{ combinedCounter() }}</p>
          </div>
        </div>
      </div>

      <!-- Loading States -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">3. Loading States Management</h3>
        <div class="space-y-2">
          <button
            (click)="simulateApiCall()"
            [disabled]="isLoading()"
            class="px-4 py-2 bg-primary-teal text-white rounded hover:bg-primary-teal/90 disabled:opacity-50"
          >
            @if (isLoading()) {
              Loading...
            } @else {
              Simulate API Call
            }
          </button>
          
          @if (apiResult()) {
            <p class="text-green-600">{{ apiResult() }}</p>
          }
          
          @if (apiError()) {
            <p class="text-red-500">{{ apiError() }}</p>
          }
        </div>
      </div>

      <!-- Form Validation -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">4. Real-time Form Validation</h3>
        <div class="space-y-4">
          <div>
            <input
              [formControl]="emailControl"
              type="email"
              placeholder="Enter email address"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              [class.border-red-500]="emailValidation().errors.length > 0"
              [class.border-green-500]="emailValidation().valid"
            />
            @if (emailValidation().errors.length > 0) {
              <ul class="mt-1 text-sm text-red-500">
                @for (error of emailValidation().errors; track error) {
                  <li>{{ error }}</li>
                }
              </ul>
            }
            @if (emailValidation().valid && emailControl.value) {
              <p class="mt-1 text-sm text-green-500">Email is valid!</p>
            }
          </div>
        </div>
      </div>

      <!-- Real-time Data -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">5. Real-time Data Streaming</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded">
            <p class="font-medium">Stock Price</p>
            <p class="text-xl font-bold text-blue-600">\${{ stockPrice() }}</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded">
            <p class="font-medium">Users Online</p>
            <p class="text-xl font-bold text-green-600">{{ usersOnline() }}</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded">
            <p class="font-medium">Messages</p>
            <p class="text-xl font-bold text-purple-600">{{ messageCount() }}</p>
          </div>
        </div>
      </div>

      <!-- Progress Tracking -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">6. Progress Tracking</h3>
        <button
          (click)="startBatchOperation()"
          [disabled]="batchProgress() > 0 && batchProgress() < 100"
          class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          @if (batchProgress() > 0 && batchProgress() < 100) {
            Processing... ({{ batchProgress() }}%)
          } @else {
            Start Batch Operation
          }
        </button>
        
        @if (batchProgress() > 0) {
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-orange-500 h-2 rounded-full transition-all duration-300"
                [style.width.%]="batchProgress()"
              ></div>
            </div>
            <p class="mt-2 text-sm text-gray-600">{{ batchProgress() }}% complete</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class RxJSExamplesComponent implements OnInit, OnDestroy {
  private rxjsUtils = inject(RxJSUtilsService);
  private destroy$ = new Subject<void>();

  // Search functionality
  searchControl = new FormControl('');
  searchQuery = signal<string>('');
  searchResults = signal<SearchResult[]>([]);
  searchLoading = signal<boolean>(false);

  // Counters
  intervalCounter = signal<number>(0);
  timerCounter = signal<number>(0);
  manualCounter = signal<number>(0);
  combinedCounter = signal<number>(0);
  private manualSubject = new Subject<number>();

  // Loading states
  isLoading = signal<boolean>(false);
  apiResult = signal<string>('');
  apiError = signal<string>('');

  // Form validation
  emailControl = new FormControl('');
  emailValidation = signal<{ valid: boolean; errors: string[] }>({ valid: false, errors: [] });

  // Real-time data
  stockPrice = signal<number>(100.00);
  usersOnline = signal<number>(0);
  messageCount = signal<number>(0);

  // Progress tracking
  batchProgress = signal<number>(0);

  ngOnInit(): void {
    this.setupSearchExample();
    this.setupCounterExamples();
    this.setupLoadingExample();
    this.setupFormValidation();
    this.setupRealTimeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchExample(): void {
    // Debounced search with loading state
    this.searchControl.valueChanges.pipe(
      startWith(''),
      tap(query => {
        this.searchQuery.set(query || '');
        if (query && query.length >= 2) {
          this.searchLoading.set(true);
        }
      }),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.length < 2) {
          this.searchLoading.set(false);
          return of([]);
        }
        
        // Simulate search API call
        return this.simulateSearch(query).pipe(
          finalize(() => this.searchLoading.set(false))
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.searchResults.set(results);
    });
  }

  private setupCounterExamples(): void {
    // Interval counter
    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(count => {
      this.intervalCounter.set(count);
    });

    // Timer counter (starts after 2 seconds, then every 1.5 seconds)
    timer(2000, 1500).pipe(
      takeUntil(this.destroy$)
    ).subscribe(count => {
      this.timerCounter.set(count);
    });

    // Manual counter with scan
    this.manualSubject.pipe(
      scan((acc, value) => acc + value, 0),
      takeUntil(this.destroy$)
    ).subscribe(count => {
      this.manualCounter.set(count);
    });

    // Combined counter
    combineLatest([
      interval(1000),
      timer(2000, 1500),
      this.manualSubject.pipe(startWith(0), scan((acc, value) => acc + value, 0))
    ]).pipe(
      map(([intervalCount, timerCount, manualCount]) => intervalCount + timerCount + manualCount),
      takeUntil(this.destroy$)
    ).subscribe(combined => {
      this.combinedCounter.set(combined);
    });
  }

  private setupLoadingExample(): void {
    // Loading state will be managed by individual API calls
  }

  private setupFormValidation(): void {
    this.rxjsUtils.createFieldValidation(
      this.emailControl.valueChanges.pipe(startWith('')),
      (value: string) => {
        const errors: string[] = [];
        
        if (!value) {
          return of({ valid: false, errors: ['Email is required'] });
        }
        
        if (!value.includes('@')) {
          errors.push('Email must contain @');
        }
        
        if (!value.includes('.')) {
          errors.push('Email must contain a domain');
        }
        
        if (value.length < 5) {
          errors.push('Email is too short');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push('Invalid email format');
        }
        
        return of({ valid: errors.length === 0, errors });
      }
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe(validation => {
      this.emailValidation.set(validation);
    });
  }

  private setupRealTimeData(): void {
    // Stock price simulation
    interval(2000).pipe(
      map(() => this.stockPrice() + (Math.random() - 0.5) * 10),
      map(price => Math.max(0, Math.round(price * 100) / 100)),
      takeUntil(this.destroy$)
    ).subscribe(price => {
      this.stockPrice.set(price);
    });

    // Users online simulation
    interval(3000).pipe(
      map(() => Math.floor(Math.random() * 100) + 50),
      takeUntil(this.destroy$)
    ).subscribe(users => {
      this.usersOnline.set(users);
    });

    // Message count with buffer
    interval(500).pipe(
      bufferTime(2000),
      map(buffer => buffer.length),
      scan((acc, newMessages) => acc + newMessages, 0),
      takeUntil(this.destroy$)
    ).subscribe(count => {
      this.messageCount.set(count);
    });
  }

  private simulateSearch(query: string): Subject<SearchResult[]> {
    const results$ = new Subject<SearchResult[]>();
    
    // Simulate network delay
    timer(500).pipe(
      map(() => {
        const mockResults: SearchResult[] = [
          { id: 1, name: `${query} Item 1`, description: 'First result' },
          { id: 2, name: `${query} Item 2`, description: 'Second result' },
          { id: 3, name: `${query} Item 3`, description: 'Third result' }
        ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        
        return mockResults;
      })
    ).subscribe(results => {
      results$.next(results);
      results$.complete();
    });
    
    return results$;
  }

  incrementManual(): void {
    this.manualSubject.next(1);
  }

  simulateApiCall(): void {
    this.isLoading.set(true);
    this.apiResult.set('');
    this.apiError.set('');

    // Simulate API call with potential failure
    const shouldFail = Math.random() < 0.3; // 30% chance of failure
    
    timer(2000).pipe(
      switchMap(() => {
        if (shouldFail) {
          return throwError(() => new Error('API call failed'));
        }
        return of('API call successful!');
      }),
      retry(2), // Retry up to 2 times on failure
      catchError(error => {
        this.apiError.set(error.message);
        return EMPTY;
      }),
      finalize(() => this.isLoading.set(false)),
      takeUntil(this.destroy$)
    ).subscribe(result => {
      this.apiResult.set(result);
    });
  }

  startBatchOperation(): void {
    this.batchProgress.set(0);
    
    // Create 10 mock operations
    const operations = Array.from({ length: 10 }, (_, i) => 
      timer(Math.random() * 2000 + 500).pipe(
        map(() => ({ id: i, status: 'completed' }))
      )
    );

    this.rxjsUtils.createProgressTracker(
      operations,
      (completed, total) => {
        const progress = Math.round((completed / total) * 100);
        this.batchProgress.set(progress);
      }
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      console.log('All operations completed!');
    });
  }
}
