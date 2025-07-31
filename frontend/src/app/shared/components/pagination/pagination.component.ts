import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex py-4 px-6 items-center gap-3 self-stretch border-t border-gray-200 bg-white">
      <!-- Pagination Info -->
      <div class="flex items-center gap-2 flex-1">
        <span class="text-gray-500 text-xs font-bold">Showing</span>
        <select class="h-8 py-1.5 px-4 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-bold"
                [value]="itemsPerPage" 
                (change)="onItemsPerPageChange($event)">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <span class="text-gray-500 text-xs font-bold">from {{ totalItems }}</span>
      </div>

      <!-- Pagination Controls -->
      <div class="flex items-center gap-2 w-114.25">
        <!-- First Page -->
        <button class="flex h-8 p-2 items-center rounded-lg border border-gray-200 bg-white cursor-pointer disabled:opacity-50"
                [disabled]="currentPage === 1"
                (click)="onPageChange(1)">
          <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M7.33334 4L3.33334 8L7.33334 12" stroke="#55596D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12.6667 4L8.66666 8L12.6667 12" stroke="#55596D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Previous Page -->
        <button class="flex h-8 p-2 items-center rounded-lg border border-gray-200 bg-white cursor-pointer disabled:opacity-50"
                [disabled]="currentPage === 1"
                (click)="onPageChange(currentPage - 1)">
          <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8L10 12" stroke="#55596D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Page Numbers -->
        <button *ngFor="let page of getVisiblePages()" 
                class="flex w-8 h-8 py-1.5 px-4 justify-center items-center rounded-lg border cursor-pointer text-xs font-bold"
                [class.border-black]="page === currentPage"
                [class.bg-gray-200]="page === currentPage"
                [class.text-black]="page === currentPage"
                [class.border-gray-200]="page !== currentPage"
                [class.bg-white]="page !== currentPage"
                [class.text-gray-600]="page !== currentPage"
                (click)="onPageChange(page)">
          {{ page }}
        </button>

        <!-- Next Page -->
        <button class="flex h-8 p-2 items-center rounded-lg border border-gray-200 bg-white cursor-pointer disabled:opacity-50"
                [disabled]="currentPage === totalPages"
                (click)="onPageChange(currentPage + 1)">
          <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="#55596D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Last Page -->
        <button class="flex h-8 p-2 items-center rounded-lg border border-gray-200 bg-white cursor-pointer disabled:opacity-50"
                [disabled]="currentPage === totalPages"
                (click)="onPageChange(totalPages)">
          <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M8.66667 4L12.6667 8L8.66667 12" stroke="#55596D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.33333 4L7.33333 8L3.33333 12" stroke="#55596D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Page Selector -->
        <select class="flex h-8 py-1.5 px-4 justify-between items-center flex-1 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-bold"
                [value]="currentPage"
                (change)="onPageChange(+$any($event.target).value)">
          <option *ngFor="let page of getAllPages()" [value]="page">{{ page }}</option>
        </select>

        <span class="text-gray-500 text-xs font-bold">of {{ totalPages }} pages</span>
      </div>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Input() itemsPerPage = 10;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPageChange.emit(parseInt(target.value));
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 3);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getAllPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
