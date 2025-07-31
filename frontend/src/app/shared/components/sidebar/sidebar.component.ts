import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  icon?: string;
  badge?: string;
  badgeType?: 'default' | 'alert';
  active?: boolean;
  isSubItem?: boolean;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  mainNavItems: NavItem[] = [
    { label: 'Newsfeed', badge: '99+', badgeType: 'default' },
    { label: 'Announcement', badge: '3', badgeType: 'alert' },
    { label: 'Approval Request' },
    { label: 'Memo List' },
    { label: 'Folder' }
  ];

  managementItems: NavItem[] = [
    { label: 'Level of Hierarchy' },
    { label: 'Department Level' },
    { label: 'Department' },
    { label: 'User' },
    { label: 'Approval' },
    { label: 'Customer' },
    { label: 'CC Group' },
    { label: 'All Memos' },
    { label: 'Upload Memo Type' },
    { label: 'Master data', icon: 'database', active: true },
    { label: 'Invoice' },
    { label: 'Others' }
  ];

  dashboardItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', badge: '3', badgeType: 'alert' },
    { label: 'Office Dashboard', isSubItem: true },
    { label: 'Package Usage', badge: '3', badgeType: 'alert' },
    { label: 'Operation Log', badge: '3', badgeType: 'alert' },
    { label: 'Configuration', badge: '3', badgeType: 'alert' }
  ];
}
