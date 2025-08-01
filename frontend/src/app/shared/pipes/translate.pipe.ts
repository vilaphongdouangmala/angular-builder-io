import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocalizationService } from '../../core/services/localization.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure to react to language changes
})
export class TranslatePipe implements PipeTransform {
  private localizationService = inject(LocalizationService);

  transform(key: string, params?: Record<string, string | number>): string {
    return this.localizationService.translate(key, params);
  }
}

// Shorter alias
@Pipe({
  name: 't',
  standalone: true,
  pure: false
})
export class TPipe implements PipeTransform {
  private localizationService = inject(LocalizationService);

  transform(key: string, params?: Record<string, string | number>): string {
    return this.localizationService.translate(key, params);
  }
}
