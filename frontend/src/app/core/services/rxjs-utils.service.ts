import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, ReplaySubject, timer, EMPTY, throwError, of, fromEvent, merge, combineLatest, race, forkJoin, concat, defer } from 'rxjs';
import { map, filter, switchMap, mergeMap, concatMap, exhaustMap, debounceTime, throttleTime, distinctUntilChanged, takeUntil, takeWhile, skip, take, startWith, catchError, retry, retryWhen, delay, timeout, share, shareReplay, tap, finalize, scan, reduce, withLatestFrom, pairwise, sample, auditTime, bufferTime, bufferCount } from 'rxjs';

export interface PollingConfig {
  interval: number;
  maxAttempts?: number;
  stopCondition?: (data: any) => boolean;
}

export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier?: number;
  maxDelay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RxJSUtilsService {

  /**
   * Create a loading state observable that emits true when any of the source observables are active
   */
  createLoadingState(...sources: Observable<any>[]): Observable<boolean> {
    const loadingSubjects = sources.map(() => new BehaviorSubject<boolean>(false));
    
    sources.forEach((source, index) => {
      source.pipe(
        tap(() => loadingSubjects[index].next(true)),
        finalize(() => loadingSubjects[index].next(false))
      ).subscribe();
    });

    return combineLatest(loadingSubjects).pipe(
      map(loadingStates => loadingStates.some(loading => loading)),
      distinctUntilChanged()
    );
  }

  /**
   * Create a search observable with debouncing and distinct values
   */
  createSearchObservable(
    searchSubject: Subject<string>,
    debounceMs: number = 300,
    minLength: number = 0
  ): Observable<string> {
    return searchSubject.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      filter(term => term.length >= minLength)
    );
  }

  /**
   * Create a polling observable that emits at regular intervals
   */
  createPollingObservable<T>(
    source: () => Observable<T>,
    config: PollingConfig
  ): Observable<T> {
    return timer(0, config.interval).pipe(
      take(config.maxAttempts || Number.MAX_SAFE_INTEGER),
      switchMap(() => source()),
      takeWhile(data => config.stopCondition ? !config.stopCondition(data) : true, true)
    );
  }

  /**
   * Create a retry observable with exponential backoff
   */
  createRetryWithBackoff<T>(
    source: Observable<T>,
    config: RetryConfig
  ): Observable<T> {
    return source.pipe(
      retryWhen(errors =>
        errors.pipe(
          scan((retryCount, error) => {
            if (retryCount >= config.maxAttempts) {
              throw error;
            }
            return retryCount + 1;
          }, 0),
          mergeMap(retryCount => {
            const delayTime = Math.min(
              config.delay * Math.pow(config.backoffMultiplier || 2, retryCount - 1),
              config.maxDelay || 30000
            );
            return timer(delayTime);
          })
        )
      )
    );
  }

  /**
   * Create a cache observable that shares and replays the last emission
   */
  createCacheObservable<T>(
    source: Observable<T>,
    bufferSize: number = 1,
    windowTime?: number
  ): Observable<T> {
    return source.pipe(
      shareReplay({ bufferSize, windowTime, refCount: true })
    );
  }

  /**
   * Create an optimistic update observable
   */
  createOptimisticUpdate<T>(
    optimisticValue: T,
    actualOperation: Observable<T>,
    rollbackValue?: T
  ): Observable<T> {
    return of(optimisticValue).pipe(
      switchMap(() =>
        actualOperation.pipe(
          catchError(error => {
            if (rollbackValue !== undefined) {
              return of(rollbackValue);
            }
            return throwError(() => error);
          })
        )
      )
    );
  }

  /**
   * Create a type-ahead search observable
   */
  createTypeAhead<T>(
    searchInput: Observable<string>,
    searchFn: (term: string) => Observable<T[]>,
    debounceMs: number = 300,
    minLength: number = 2
  ): Observable<T[]> {
    return searchInput.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length < minLength) {
          return of([]);
        }
        return searchFn(term).pipe(
          catchError(() => of([]))
        );
      })
    );
  }

  /**
   * Create a form field validation observable
   */
  createFieldValidation<T>(
    valueObservable: Observable<T>,
    validator: (value: T) => Observable<{ valid: boolean; errors: string[] }>,
    debounceMs: number = 500
  ): Observable<{ valid: boolean; errors: string[] }> {
    return valueObservable.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      switchMap(value => validator(value))
    );
  }

  /**
   * Create a rate-limited observable
   */
  createRateLimited<T>(
    source: Observable<T>,
    rateMs: number,
    strategy: 'throttle' | 'debounce' | 'audit' = 'throttle'
  ): Observable<T> {
    switch (strategy) {
      case 'throttle':
        return source.pipe(throttleTime(rateMs));
      case 'debounce':
        return source.pipe(debounceTime(rateMs));
      case 'audit':
        return source.pipe(auditTime(rateMs));
      default:
        return source.pipe(throttleTime(rateMs));
    }
  }

  /**
   * Create a batched observable that collects emissions
   */
  createBatchedObservable<T>(
    source: Observable<T>,
    batchSize: number,
    timeWindowMs?: number
  ): Observable<T[]> {
    if (timeWindowMs) {
      return source.pipe(bufferTime(timeWindowMs, null, batchSize));
    } else {
      return source.pipe(bufferCount(batchSize));
    }
  }

  /**
   * Create a conditional observable that switches based on a condition
   */
  createConditionalObservable<T>(
    condition: Observable<boolean>,
    trueSource: Observable<T>,
    falseSource: Observable<T>
  ): Observable<T> {
    return condition.pipe(
      distinctUntilChanged(),
      switchMap(isTrue => isTrue ? trueSource : falseSource)
    );
  }

  /**
   * Create a heartbeat observable for keep-alive functionality
   */
  createHeartbeat(intervalMs: number): Observable<number> {
    return timer(0, intervalMs).pipe(
      map(tick => tick + 1)
    );
  }

  /**
   * Create a timeout observable with custom error
   */
  createTimeoutObservable<T>(
    source: Observable<T>,
    timeoutMs: number,
    timeoutError?: Error
  ): Observable<T> {
    return source.pipe(
      timeout({
        each: timeoutMs,
        with: () => throwError(() => timeoutError || new Error(`Operation timed out after ${timeoutMs}ms`))
      })
    );
  }

  /**
   * Create a circuit breaker observable
   */
  createCircuitBreaker<T>(
    source: Observable<T>,
    failureThreshold: number = 5,
    recoveryTimeMs: number = 60000
  ): Observable<T> {
    let failureCount = 0;
    let lastFailureTime = 0;
    let isOpen = false;

    return defer(() => {
      const now = Date.now();
      
      // Check if circuit should be reset
      if (isOpen && (now - lastFailureTime) > recoveryTimeMs) {
        isOpen = false;
        failureCount = 0;
      }
      
      // If circuit is open, fail fast
      if (isOpen) {
        return throwError(() => new Error('Circuit breaker is open'));
      }
      
      return source.pipe(
        tap(() => {
          // Reset on success
          failureCount = 0;
        }),
        catchError(error => {
          failureCount++;
          lastFailureTime = now;
          
          if (failureCount >= failureThreshold) {
            isOpen = true;
          }
          
          return throwError(() => error);
        })
      );
    });
  }

  /**
   * Create a progress tracking observable
   */
  createProgressTracker<T>(
    operations: Observable<T>[],
    onProgress?: (completed: number, total: number) => void
  ): Observable<T[]> {
    let completed = 0;
    const total = operations.length;
    
    const wrappedOperations = operations.map(op => 
      op.pipe(
        tap(() => {
          completed++;
          if (onProgress) {
            onProgress(completed, total);
          }
        })
      )
    );
    
    return forkJoin(wrappedOperations);
  }

  /**
   * Create an auto-refresh observable
   */
  createAutoRefresh<T>(
    source: () => Observable<T>,
    refreshIntervalMs: number,
    destroy$: Observable<any>
  ): Observable<T> {
    return timer(0, refreshIntervalMs).pipe(
      switchMap(() => source()),
      takeUntil(destroy$)
    );
  }

  /**
   * Create a comparison observable that emits when values change
   */
  createComparisonObservable<T>(
    source: Observable<T>,
    compareFn?: (previous: T, current: T) => boolean
  ): Observable<{ previous: T; current: T }> {
    return source.pipe(
      pairwise(),
      filter(([previous, current]) => 
        compareFn ? !compareFn(previous, current) : previous !== current
      ),
      map(([previous, current]) => ({ previous, current }))
    );
  }

  /**
   * Create a state machine observable
   */
  createStateMachine<TState, TEvent>(
    initialState: TState,
    transitions: Map<TState, Map<TEvent, TState>>,
    events$: Observable<TEvent>
  ): Observable<TState> {
    return events$.pipe(
      scan((currentState, event) => {
        const stateTransitions = transitions.get(currentState);
        if (stateTransitions) {
          const nextState = stateTransitions.get(event);
          return nextState !== undefined ? nextState : currentState;
        }
        return currentState;
      }, initialState),
      startWith(initialState),
      distinctUntilChanged()
    );
  }
}
