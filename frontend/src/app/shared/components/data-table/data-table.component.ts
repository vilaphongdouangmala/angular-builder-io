import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Column {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableData {
  [key: string]: any;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-start self-stretch rounded-xl shadow-lg overflow-hidden">
      <table class="w-full border-collapse">
        <thead class="bg-white">
          <tr>
            <th *ngFor="let column of columns"
                class="py-3.5 px-4 text-left border-b border-gray-200 text-gray-900 text-sm font-bold bg-white"
                [class.w-12]="column.width === 'xs'"
                [class.w-72]="column.width === 'lg'"
                [class.w-20]="column.width === 'sm'"
                [class.text-center]="column.align === 'center'">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data; let i = index" 
              class="bg-white hover:bg-gray-50 cursor-pointer">
            <td *ngFor="let column of columns"
                class="py-2 px-4 border-b border-gray-200 text-gray-900 text-sm font-normal align-middle"
                [class.text-center]="column.align === 'center'">
              {{ getRowValue(row, column.key) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DataTableComponent {
  @Input() columns: Column[] = [];
  @Input() data: TableData[] = [];

  getRowValue(row: TableData, key: string): any {
    return row[key] || '';
  }
}
