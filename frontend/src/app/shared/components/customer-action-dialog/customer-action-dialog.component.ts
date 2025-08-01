import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

export interface ActionDialogOption {
  id: string;
  label: string;
  icon: string;
  action: () => void;
}

@Component({
  selector: 'app-customer-action-dialog',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    @if (isVisible()) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-40" (click)="onClose()"></div>
      
      <!-- Dialog -->
      <div class="fixed z-50 bg-white rounded-xl shadow-header"
           [ngStyle]="{
             left: position().x + 'px',
             top: position().y + 'px',
             width: '110px',
             height: '92px'
           }">
        <div class="flex flex-col p-2.5">
          <!-- Edit Option -->
          <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
               (click)="onEdit()">
            <svg class="w-4 h-4 text-neutrals-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5756 3.7677L10.0909 3.25244C10.8719 2.47139 12.1382 2.47139 12.9193 3.25244V3.25244C13.7003 4.03349 13.7003 5.29982 12.9193 6.08087L12.404 6.59613M9.5756 3.7677L3.33651 10.0068C3.00444 10.3389 2.79981 10.7772 2.75848 11.245L2.65343 12.4342C2.59866 13.0542 3.11754 13.5731 3.73755 13.5183L4.92672 13.4132C5.39452 13.3719 5.83286 13.1673 6.16494 12.8352L12.404 6.59613M9.5756 3.7677L12.404 6.59613" 
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-sm font-normal text-neutrals-400 font-bai-jamjuree">{{ 'customer.actions.edit' | translate }}</span>
          </div>
          
          <!-- Delete Option -->
          <div class="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
               (click)="onDelete()">
            <svg class="w-4 h-4 text-neutrals-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3332 6L12.0032 13.5642C11.8911 14.2017 11.3373 14.6667 10.69 14.6667H5.30966C4.66236 14.6667 4.10857 14.2017 3.99648 13.5642L2.6665 6" 
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 4.00001H10.25M2 4.00001H5.75M5.75 4.00001V2.66668C5.75 1.9303 6.34695 1.33334 7.08333 1.33334H8.91667C9.65307 1.33334 10.25 1.9303 10.25 2.66668V4.00001M5.75 4.00001H10.25" 
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-sm font-normal text-neutrals-400 font-bai-jamjuree">{{ 'customer.actions.delete' | translate }}</span>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './customer-action-dialog.component.scss'
})
export class CustomerActionDialogComponent {
  isVisible = input<boolean>(false);
  position = input<{ x: number; y: number }>({ x: 0, y: 0 });
  
  close = output<void>();
  edit = output<void>();
  delete = output<void>();

  onClose() {
    this.close.emit();
  }

  onEdit() {
    this.edit.emit();
    this.close.emit();
  }

  onDelete() {
    this.delete.emit();
    this.close.emit();
  }
}
