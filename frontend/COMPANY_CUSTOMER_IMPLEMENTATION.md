# Company Customer Type Implementation

## Overview
This implementation extends the existing Create New Customer page to support both Individual and Company customer types, as specified in the Figma design.

## Features Implemented

### 1. Customer Type Selection
- Radio button selection between "Individual" and "Company"
- Dynamic form fields based on selection
- Form validation updates automatically when switching types

### 2. Individual Customer Fields
- Customer type: Individual (radio button)
- Tax ID (optional)
- Prefix: Mr./Mrs./Ms./Others with custom text field
- First Name* (required)
- Last Name* (required)
- Email* (required)
- Phone No. (optional)
- Contact persons table

### 3. Company Customer Fields
- Customer type: Company (radio button)
- Tax ID (optional)
- Company type*: Limited Company/Public Limited Company/Partnership/Others with custom text field
- Company name* (required)
- Email* (required)
- Phone no.* (required for companies)
- Contact persons table with withholding tax column

### 4. Contact Persons Table
- Dynamic table structure based on customer type
- For Individual customers: No., Contact name*, Email*, Remarks, Action
- For Company customers: No., Contact name*, Email*, Remarks, Withholding Tax (%), Action
- Add/remove functionality
- Drag handle icons for reordering (visual only)
- Alternating row colors for better readability

### 5. Responsive Design
- Fully responsive layout using Tailwind CSS
- Mobile-friendly table layout
- Proper spacing and typography matching the design system

## Technical Implementation

### Components Updated
- `customer-create.component.ts` - Added company type logic and dynamic form validation
- `customer-create.component.html` - Conditional rendering based on customer type
- `customer-create.component.scss` - Enhanced styling for company-specific elements

### Key Features
- **Dynamic Form Validation**: Validators change based on customer type selection
- **Type-Safe Forms**: Proper TypeScript typing for form controls
- **Conditional Rendering**: Fields show/hide based on customer type
- **Responsive Table**: Contact persons table adapts to customer type
- **Form State Management**: Proper form reset when switching customer types

### Form Structure
```typescript
Individual Customer:
- customerType, taxId, prefix, customPrefix, firstName, lastName, email, phoneNo
- contactPersons: [{ contactName, email, remarks }]

Company Customer:
- customerType, taxId, companyType, companyTypeOther, companyName, email, phoneNo
- contactPersons: [{ contactName, email, remarks, withholdingTax }]
```

## Design Compliance
- ✅ Pixel-perfect implementation matching Figma design
- ✅ Proper color scheme using design system colors
- ✅ Consistent typography (Bai Jamjuree font)
- ✅ Responsive layout for all screen sizes
- ✅ Proper form validation and error states
- ✅ Accessibility considerations (proper labels, focus states)

## Usage
1. Navigate to `/customer/create`
2. Select customer type (Individual or Company)
3. Fill in required fields based on customer type
4. Add contact persons as needed
5. Save the customer information

The form automatically validates required fields and updates the UI based on the selected customer type, providing a seamless user experience for both individual and company customer creation.
