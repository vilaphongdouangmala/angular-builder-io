import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.scss'
})
export class MasterDataComponent {
  selectedTab = 'building';
  searchText = '';
  
  tabs = [
    { id: 'building', label: 'Building', icon: 'building', active: true },
    { id: 'floor', label: 'Floor', icon: 'elevator', active: false },
    { id: 'room', label: 'Room', icon: 'planimetry', active: false },
    { id: 'billing', label: 'Billing', icon: 'piggy-bank', active: false }
  ];

  buildingData = [
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

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 20;

  selectTab(tabId: string) {
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
  }
}
