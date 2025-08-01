import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent, Tab } from '../../shared/components/tabs/tabs.component';
import { DataTableComponent, Column, TableData } from '../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

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
export class MasterDataComponent {
  selectedTab = 'building';
  searchText = '';
  
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

  buildingData: TableData[] = [
    {
      id: 1,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    },
    {
      id: 2,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นท��่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    },
    {
      id: 3,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    },
    {
      id: 4,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    },
    {
      id: 5,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    },
    {
      id: 6,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    },
    {
      id: 7,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    },
    {
      id: 8,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    },
    {
      id: 9,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    },
    {
      id: 10,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ��ั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    },
    {
      id: 11,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    },
    {
      id: 12,
      name: 'Lorem Isum',
      addressTH: '898 อาคารเพลินจิตทาวเวอร์ ชั้นที่ 20',
      addressEN: '898 Ploenchit Tower, 20th Floor',
      action: ''
    }
  ];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 20;
  totalItems = 100;

  onTabChange(tabId: string) {
    this.selectedTab = tabId;
    this.tabs = this.tabs.map(tab => ({
      ...tab,
      active: tab.id === tabId
    }));
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchText = target.value;
  }

  onAdd() {
    console.log('Add new building');
  }

  onFilter() {
    console.log('Open filter');
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1; // Reset to first page
  }
}
