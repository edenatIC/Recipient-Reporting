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
  aiSummary?: string;
  fileUrl?: string;
  submissionHistory?: { version: number; fileName: string; fileUrl: string; date: string; comment: string }[];
}

const mockAiSummary = 'This document is a completed Project Status Report submitted by the Operations team. All required form fields have been filled in, including project name, reporting period, team lead, budget allocation, and milestone tracking sections. The signature and date fields on the final page are also properly completed. However, the "Risk Mitigation Notes" field on page 3 appears to contain only a placeholder dash rather than a substantive entry, which may warrant a follow-up with the submitting team.\n\nContent-wise, the report outlines progress across three key workstreams: vendor onboarding, internal tooling upgrades, and compliance training rollout. The vendor onboarding track is reported at 85% completion with two contracts still pending legal review, while the tooling upgrades are flagged as behind schedule due to a staffing gap in engineering. Overall, the deliverable is well-structured and largely complete, though the missing risk notes and a lack of supporting data for the revised timeline estimates are areas that should be addressed before final sign-off.';

const mockSubmissionHistory = [
  { version: 2, fileName: 'Deliverable_Submitted_v2.pdf', fileUrl: '#', date: '04/11/2026', comment: 'Revised submission addressing reviewer comments on the budget allocation section and updated milestone tracking data.' },
  { version: 1, fileName: 'Deliverable_Submitted_v1.pdf', fileUrl: '#', date: '03/28/2026', comment: 'Initial submission of the deliverable for review.' },
];

const mockAdminDeliverables: AdminDeliverable[] = [
  { id: '1', deliverable: 'Performance Report - Narrative',          project: 'Solar Array Installation – Phase 1', dueDate: '03/31/2026', dateSubmitted: '03/28/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
  { id: '2', deliverable: 'SF-425 Federal Financial Report',         project: 'Solar Array Installation – Phase 1', dueDate: '04/01/2026', dateSubmitted: '03/30/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
  { id: '3', deliverable: 'Technical Progress Report',               project: 'Grid Modernization Initiative',      dueDate: '04/10/2026', dateSubmitted: '04/08/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
  { id: '4', deliverable: 'Research Performance Progress Report',    project: 'Wind Turbine Expansion',             dueDate: '03/25/2026', dateSubmitted: '03/24/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
  { id: '5', deliverable: 'Performance Report - Quantative',         project: 'Grid Modernization Initiative',      dueDate: '04/05/2026', dateSubmitted: '04/04/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
  { id: '6', deliverable: 'SF-425 Federal Financial Report',         project: 'Wind Turbine Expansion',             dueDate: '04/12/2026', dateSubmitted: '04/11/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
  { id: '7', deliverable: 'Technical Progress Report',               project: 'Solar Array Installation – Phase 1', dueDate: '04/18/2026', dateSubmitted: '04/16/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
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
      aiSummary: item.aiSummary,
      fileUrl: item.fileUrl,
      submissionHistory: item.submissionHistory,
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
