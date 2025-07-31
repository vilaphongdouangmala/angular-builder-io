# Master Data Module

This module implements the Master Data interface based on the provided Figma design, located at `/master-data` route.

## Features Implemented

### Layout & Navigation
- ✅ Complete header bar with logo, notification, language selector, and user profile
- ✅ Comprehensive sidebar navigation matching the design
- ✅ Active state highlighting for "Master data" menu item
- ✅ Badge indicators for notifications and alerts

### Master Data Interface
- ✅ Tabbed interface with Building, Floor, Room, and Billing tabs
- ✅ Building tab is active by default
- ✅ Search functionality with building name input
- ✅ Filter button for advanced filtering
- ✅ Add button for creating new buildings

### Data Table
- ✅ Complete building data table with columns:
  - No. (sequential numbering)
  - Building name
  - Building address (TH) - Thai language
  - Building address (EN) - English language
  - Action (placeholder for future actions)
- ✅ Sample data with 12 building entries
- ✅ Responsive table design

### Pagination
- ✅ Full pagination controls with:
  - Items per page selector (10, 25, 50)
  - First/Previous/Next/Last navigation buttons
  - Page number buttons (1, 2, 3, 4)
  - Page selector dropdown
  - Total pages indicator
- ✅ Current page highlighting

## Technical Implementation

### Architecture
- **Standalone Angular Component**: `MasterDataComponent`
- **Routing**: Configured at `/master-data` route
- **Styling**: SCSS with design system variables
- **Responsive Design**: Mobile-first approach with breakpoints

### Design System
- **Colors**: Matching Figma color palette with CSS custom properties
- **Typography**: Bai Jamjuree font family
- **Spacing**: Consistent padding and margins
- **Components**: Reusable button, input, and table styles

### Key Components
1. **Header Bar**: Logo, navigation controls, user profile
2. **Sidebar**: Multi-level navigation with active states
3. **Tab Navigation**: Building, Floor, Room, Billing tabs
4. **Search & Filter**: Input field and filter controls
5. **Data Table**: Building listings with responsive columns
6. **Pagination**: Complete navigation and page controls

## Usage

Navigate to `/master-data` to access the master data interface. The application automatically redirects to this route from the root path.

### Interactive Features
- Click on tab items to switch between Building, Floor, Room, and Billing
- Use the search input to filter building names
- Click the filter button to access advanced filtering (placeholder)
- Click the Add button to create new buildings (placeholder)
- Navigate through pages using pagination controls

## Responsive Behavior

The interface adapts to different screen sizes:
- **Desktop (1440px+)**: Full layout with sidebar and main content
- **Tablet (1024px-1439px)**: Adjusted spacing and condensed layout
- **Mobile (768px and below)**: Stacked layout with horizontal navigation

## Future Enhancements

The current implementation provides the complete UI structure. Future enhancements could include:
- Backend API integration for real data
- CRUD operations for building management
- Advanced filtering functionality
- Export capabilities
- User permission management
- Multi-language support
