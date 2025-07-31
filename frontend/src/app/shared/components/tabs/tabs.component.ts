import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex py-4 px-2.5 flex-col items-center gap-6 self-stretch rounded-xl border border-gray-200 bg-white">
      <div class="flex flex-col items-start gap-2 self-stretch">
        <div *ngFor="let tab of tabs" 
             class="flex h-11 py-1.5 px-4 items-center gap-2 self-stretch rounded-lg cursor-pointer"
             [class.bg-teal-50]="tab.active"
             [class.bg-white]="!tab.active"
             [class.hover:bg-gray-50]="!tab.active"
             (click)="onTabClick(tab.id)">
          
          <!-- Building Icon -->
          <svg *ngIf="tab.icon === 'building'" class="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M8.33337 7.50833L8.34171 7.49907" [attr.stroke]="tab.active ? '#175252' : '#707485'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.6666 7.50833L11.675 7.49907" [attr.stroke]="tab.active ? '#175252' : '#707485'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 16.9V4.76667C5 4.4353 5.26863 4.16667 5.6 4.16667H10V3.1C10 2.76863 10.2686 2.5 10.6 2.5H14.4C14.7314 2.5 15 2.76863 15 3.1V16.9C15 17.2314 14.7314 17.5 14.4 17.5H5.6C5.26863 17.5 5 17.2314 5 16.9Z" [attr.stroke]="tab.active ? '#175252' : '#707485'" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <!-- Floor Icon -->
          <svg *ngIf="tab.icon === 'elevator'" class="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M10 2.5L10 17.5" stroke="#707485" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 3.1V16.9C17.5 17.2314 17.2314 17.5 16.9 17.5H3.1C2.76863 17.5 2.5 17.2314 2.5 16.9V3.1C2.5 2.76863 2.76863 2.5 3.1 2.5H16.9C17.2314 2.5 17.5 2.76863 17.5 3.1Z" stroke="#707485" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <!-- Room Icon -->
          <svg *ngIf="tab.icon === 'planimetry'" class="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M9.16667 13.3333L9.16667 9.16666L2.5 9.16666" stroke="#707485" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 6.66667H12.5V8.33334" stroke="#707485" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <!-- Billing Icon -->
          <svg *ngIf="tab.icon === 'piggy-bank'" class="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M12.0834 7.08334C11.4328 6.91468 10.5287 6.66667 9.80393 6.66667C6.23034 6.66667 3.33337 8.8897 3.33337 11.6319" stroke="#707485" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <span class="flex-1 text-sm font-normal"
                [class.text-teal-700]="tab.active"
                [class.font-semibold]="tab.active"
                [class.text-gray-600]="!tab.active">{{ tab.label }}</span>
          
          <span *ngIf="tab.active && tab.id === 'building'" 
                class="flex h-4 px-1 items-center rounded-full bg-red-500">
            <span class="text-white text-xs font-bold">_</span>
          </span>
        </div>
      </div>
    </div>
  `
})
export class TabsComponent {
  @Input() tabs: Tab[] = [];
  @Output() tabChange = new EventEmitter<string>();

  onTabClick(tabId: string) {
    this.tabChange.emit(tabId);
  }
}
