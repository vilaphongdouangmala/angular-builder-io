# Theming & Localization Implementation

## Overview
This document outlines the comprehensive theming and localization systems implemented for the Angular application, providing both dark/light mode support and multi-language capabilities.

## 🎨 Theming System

### Features Implemented
- **Multiple Theme Support**: Light, Dark, and Auto (system preference)
- **CSS Custom Properties**: Dynamic theme switching using CSS variables
- **Theme Persistence**: User preferences saved in localStorage
- **Smooth Transitions**: 0.3s transition animations for theme changes
- **Theme Switcher Component**: Easy-to-use UI component for theme selection

### Theme Configuration
```typescript
// Available themes
- Light Theme: Traditional light mode with existing color palette
- Dark Theme: High contrast dark mode with accessibility in mind
- Auto Theme: Follows system preference (prefers-color-scheme)
```

### Theme Service Usage
```typescript
// Inject the service
themeService = inject(ThemeService);

// Set a theme
this.themeService.setTheme('dark');

// Toggle between light/dark
this.themeService.toggleTheme();

// Check if current theme is dark
this.themeService.isDarkTheme();

// Get current theme config
this.themeService.currentThemeConfig();
```

### CSS Custom Properties
All colors are available as CSS custom properties:
```css
:root {
  --color-primary: #175252;
  --color-secondary: #1958D3;
  --color-background: #F9F9FC;
  --color-surface: #FFFFFF;
  --color-text: #12141F;
  --color-text-secondary: #55596D;
  /* ... more properties */
}
```

### Theme Utility Classes
```css
.bg-theme-primary { background-color: var(--color-primary); }
.text-theme-primary { color: var(--color-primary); }
.border-theme-border { border-color: var(--color-border); }
/* ... more utilities */
```

## 🌍 Localization System

### Features Implemented
- **Multi-language Support**: English (default), Thai, Chinese, Japanese
- **Translation Service**: Reactive Angular service with signal-based state
- **Translation Pipe**: Easy-to-use pipe for templates (`{{ 'key' | translate }}`)
- **Parameter Interpolation**: Support for dynamic values in translations
- **Language Persistence**: User preferences saved in localStorage
- **Language Switcher Component**: Dropdown UI for language selection
- **Auto Language Detection**: Detects browser language on first visit

### Supported Languages
```typescript
- en: English (default)
- th: Thai (ไทย)
- zh: Chinese (中文)
- ja: Japanese (日本語)
```

### Localization Service Usage
```typescript
// Inject the service
localizationService = inject(LocalizationService);

// Set language
await this.localizationService.setLanguage('th');

// Get translation
this.localizationService.translate('customer.title');
this.localizationService.t('customer.title'); // Short alias

// Translation with parameters
this.localizationService.translate('validation.minLength', { min: 5 });
```

### Translation Keys Structure
```typescript
{
  common: {
    save: 'Save',
    cancel: 'Cancel',
    // ... more common keys
  },
  customer: {
    title: 'Create New Customer',
    customerType: 'Customer type',
    // ... more customer keys
  },
  navigation: {
    // ... navigation keys
  },
  validation: {
    required: 'This field is required',
    // ... more validation keys
  }
}
```

### Using Translations in Templates
```html
<!-- Simple translation -->
<h1>{{ 'customer.title' | translate }}</h1>

<!-- Translation with parameters -->
<span>{{ 'validation.minLength' | translate: {min: 5} }}</span>

<!-- Short pipe alias -->
<button>{{ 'common.save' | t }}</button>
```

## 🔧 Components Added

### Theme Switcher Component
```html
<app-theme-switcher></app-theme-switcher>
```
- Provides buttons for Light, Dark, and Auto themes
- Shows active state with visual feedback
- Accessible with proper ARIA labels

### Language Switcher Component
```html
<app-language-switcher></app-language-switcher>
```
- Dropdown interface showing flag, language code, and native name
- Current language highlighted
- Checkmark indicator for selected language

## 📁 File Structure

### Core Services
```
src/app/core/services/
├── theme.service.ts           # Theme management service
└── localization.service.ts    # Translation and language service
```

### Shared Components
```
src/app/shared/
├── components/
│   ├── theme-switcher/        # Theme switching component
│   └── language-switcher/     # Language switching component
└── pipes/
    └── translate.pipe.ts      # Translation pipe
```

### Styles
```
src/styles/
└── themes.scss               # Theme CSS variables and classes
```

## 🎯 Integration Points

### Header Component
The header has been updated to include both theme and language switchers:
```html
<!-- Theme Switcher -->
<app-theme-switcher></app-theme-switcher>

<!-- Language Switcher -->
<app-language-switcher></app-language-switcher>
```

### Customer Create Component
Updated with translation keys for:
- Form labels and placeholders
- Button text
- Validation messages
- Company type options

## 🚀 Usage Examples

### Adding New Translations
```typescript
// In your component or service
this.localizationService.updateTranslations('en', {
  myModule: {
    title: 'My Module Title',
    description: 'Module description here'
  }
});
```

### Theme-aware Styling
```css
/* Use CSS custom properties */
.my-component {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

/* Or use utility classes */
.my-component {
  @apply bg-theme-surface text-theme-text border-theme-border;
}
```

### Reactive Theme/Language Changes
```typescript
export class MyComponent {
  private themeService = inject(ThemeService);
  private localizationService = inject(LocalizationService);
  
  // React to theme changes
  currentTheme = this.themeService.currentThemeConfig;
  
  // React to language changes
  currentLanguage = this.localizationService.currentLanguageConfig;
}
```

## 🔮 Future Enhancements

### Planned Features
1. **Additional Languages**: Arabic, Spanish, French support
2. **RTL Support**: Right-to-left language support
3. **Theme Customization**: Custom color theme creation
4. **Translation Management**: Admin interface for managing translations
5. **Lazy Loading**: Load translations on demand for better performance

### Extending the System

#### Adding a New Language
1. Add language to `SupportedLanguage` type
2. Add language config to `languages` object
3. Create translation files
4. Update language switcher if needed

#### Creating Custom Themes
1. Define new theme in `ThemeService.themes`
2. Add CSS custom properties in `themes.scss`
3. Update theme switcher component

## 📋 Best Practices

### Translation Keys
- Use dot notation for nested keys: `module.section.key`
- Keep keys descriptive and consistent
- Group related translations together
- Use parameters for dynamic content

### Theme Development
- Always use CSS custom properties for colors
- Test both light and dark themes
- Ensure proper contrast ratios for accessibility
- Use theme utility classes where possible

### Performance Considerations
- Translation service uses signals for reactivity
- Themes use CSS custom properties for instant switching
- User preferences cached in localStorage
- Lazy load translations for large applications

This implementation provides a solid foundation for both theming and localization that can scale with the application's growth and support future internationalization needs.
