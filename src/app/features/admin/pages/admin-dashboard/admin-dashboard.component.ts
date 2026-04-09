import { Component, signal } from '@angular/core';
import { LucideAngularModule, Eye, ChevronDown } from 'lucide-angular';
import { DeliverableStatus } from '../../../recipient/models/submission.model';
import { AdminPanelComponent, AdminPanelState, AdminPanelDeliverable } from '../../components/admin-panel/admin-panel.component';

interface AdminDeliverable {
  id: string;
  deliverable: string;
  project: string;
  dueDate: string;
  dateSubmitted: string;
  status: DeliverableStatus;
}

const mockAdminDeliverables: AdminDeliverable[] = [
  {
    id: '1',
    deliverable: 'Q1 Progress Report',
    project: 'Solar Array Installation – Phase 1',
    dueDate: '03/31/2026',
    dateSubmitted: '03/28/2026',
    status: 'Need Review',
  },
  {
    id: '2',
    deliverable: 'Community Outreach Summary',
    project: 'Solar Array Installation – Phase 1',
    dueDate: '04/01/2026',
    dateSubmitted: '03/30/2026',
    status: 'Need Review',
  },
  {
    id: '3',
    deliverable: 'Safety Compliance Checklist',
    project: 'Grid Modernization Initiative',
    dueDate: '04/10/2026',
    dateSubmitted: '04/08/2026',
    status: 'Need Review',
  },
  {
    id: '4',
    deliverable: 'Quarterly Equipment Log',
    project: 'Wind Turbine Expansion',
    dueDate: '03/25/2026',
    dateSubmitted: '03/24/2026',
    status: 'Need Review',
  },
  {
    id: '5',
    deliverable: 'Site Assessment Report',
    project: 'Grid Modernization Initiative',
    dueDate: '04/05/2026',
    dateSubmitted: '04/04/2026',
    status: 'Need Review',
  },
  {
    id: '6',
    deliverable: 'Stakeholder Engagement Summary',
    project: 'Wind Turbine Expansion',
    dueDate: '04/12/2026',
    dateSubmitted: '04/11/2026',
    status: 'Need Review',
  },
  {
    id: '7',
    deliverable: 'Energy Output Baseline Study',
    project: 'Solar Array Installation – Phase 1',
    dueDate: '04/18/2026',
    dateSubmitted: '04/16/2026',
    status: 'Need Review',
  },
];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [LucideAngularModule, AdminPanelComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  readonly Eye = Eye;
  readonly ChevronDown = ChevronDown;

  deliverables = mockAdminDeliverables;

  readonly needReviewBadgeStyle: Record<string, string> = { background: '#f3e8ff', color: '#6b21a8' };

  panelDeliverable = signal<AdminPanelDeliverable | null>(null);
  panelState = signal<AdminPanelState>('hidden');

  onViewClick(item: AdminDeliverable) {
    this.panelDeliverable.set({
      deliverable: item.deliverable,
      project: item.project,
      dueDate: item.dueDate,
      dateSubmitted: item.dateSubmitted,
      status: item.status,
    });
    this.panelState.set('normal');
  }

  onPanelClose() {
    this.panelState.set('hidden');
    this.panelDeliverable.set(null);
  }

  onPanelStateChange(state: AdminPanelState) {
    this.panelState.set(state);
  }
}
