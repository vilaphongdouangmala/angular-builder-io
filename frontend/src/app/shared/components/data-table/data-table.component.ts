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
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() columns: Column[] = [];
  @Input() data: TableData[] = [];

  getRowValue(row: TableData, key: string): any {
    return row[key] || '';
  }
}
