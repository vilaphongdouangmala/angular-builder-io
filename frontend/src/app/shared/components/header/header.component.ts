import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex w-full px-8 pl-6 justify-between items-center bg-white shadow-header h-20 relative z-10">
      <!-- Logo and Menu -->
      <div class="flex w-66 h-20 items-center gap-4 bg-white">
        <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M19 21L5 21C3.89543 21 3 20.1046 3 19L3 5C3 3.89543 3.89543 3 5 3L19 3C20.1046 3 21 3.89543 21 5L21 19C21 20.1046 20.1046 21 19 21Z" stroke="#707485" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7.25 10L5.5 12L7.25 14" stroke="#707485" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.5 21V3" stroke="#707485" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="flex items-center gap-6">
          <img class="w-21 h-15" src="https://api.builder.io/api/v1/image/assets/TEMP/bbc1f569c98ed02309a0ec4603c8ac3da66ae232?width=171" alt="Logo" />
        </div>
      </div>

      <!-- Right Content -->
      <div class="flex h-20 items-center gap-4 bg-white">
        <!-- Language Controls -->
        <div class="flex items-center gap-2">
          <button class="flex p-2.5 items-center gap-2 rounded-lg border border-neutrals-50 bg-white h-11 hover:bg-gray-50">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M15 7C15 5.58551 14.4732 4.22896 13.5355 3.22876C12.5979 2.22857 11.3261 1.66666 10 1.66666C8.67392 1.66666 7.40215 2.22857 6.46447 3.22876C5.52678 4.22896 5 5.58551 5 7C5 13.2222 2.5 15 2.5 15H17.5C17.5 15 15 13.2222 15 7Z" stroke="#55596D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="flex px-4 py-2.5 items-center gap-2 rounded-lg border border-neutrals-50 bg-white h-11 hover:bg-gray-50">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" fill="#F1F2F2" stroke="#ccc"/>
            </svg>
            <span class="text-neutrals-300 font-bold text-base">EN</span>
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#707485" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- User Info -->
        <div class="flex items-center gap-2 h-11">
          <div class="flex flex-col justify-center items-end gap-0.5">
            <div class="text-neutrals-900 font-bold text-base">Khemika I</div>
            <div class="text-neutrals-400 text-xs">Logout</div>
          </div>
          <div class="flex flex-col items-end relative">
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span class="text-white font-bold text-base">KI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HeaderComponent {
}
