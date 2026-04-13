import { Component, computed, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, ChevronDown, Eye } from 'lucide-angular';
import { DeliverableStatus } from '../../../recipient/models/submission.model';
import { AdminPanelComponent, AdminPanelState, AdminPanelDeliverable } from '../../components/admin-panel/admin-panel.component';

interface ProjectDeliverable {
  id: string;
  deliverable: string;
  dueDate: string;
  dateSubmitted: string | null;
  status: DeliverableStatus;
  aiSummary?: string;
  fileUrl?: string;
  submissionHistory?: { version: number; fileName: string; fileUrl: string; date: string; comment: string }[];
}

const mockAiSummary = 'This document is a completed Project Status Report submitted by the Operations team. All required form fields have been filled in, including project name, reporting period, team lead, budget allocation, and milestone tracking sections. The signature and date fields on the final page are also properly completed. However, the "Risk Mitigation Notes" field on page 3 appears to contain only a placeholder dash rather than a substantive entry, which may warrant a follow-up with the submitting team.\n\nContent-wise, the report outlines progress across three key workstreams: vendor onboarding, internal tooling upgrades, and compliance training rollout. The vendor onboarding track is reported at 85% completion with two contracts still pending legal review, while the tooling upgrades are flagged as behind schedule due to a staffing gap in engineering. Overall, the deliverable is well-structured and largely complete, though the missing risk notes and a lack of supporting data for the revised timeline estimates are areas that should be addressed before final sign-off.';

const mockSubmissionHistory = [
  {
    version: 2,
    fileName: 'Deliverable_Submitted_v2.pdf',
    fileUrl: '#',
    date: '04/11/2026',
    comment: 'Revised submission addressing reviewer comments on the budget allocation section and updated milestone tracking data.',
  },
  {
    version: 1,
    fileName: 'Deliverable_Submitted_v1.pdf',
    fileUrl: '#',
    date: '03/28/2026',
    comment: 'Initial submission of the deliverable for review.',
  },
];

interface AdminProjectSummary {
  id: string;
  projectName: string;
  controlNumber: string;
  office: string;
}

const mockProjects: AdminProjectSummary[] = [
  { id: '1',  projectName: 'Solar Array Installation – Phase 1', controlNumber: 'DE-0001-2026', office: 'Office of Solar Energy' },
  { id: '2',  projectName: 'Wind Turbine Expansion',             controlNumber: 'DE-0002-2026', office: 'Office of Wind Energy' },
  { id: '3',  projectName: 'Grid Modernization Initiative',      controlNumber: 'DE-0003-2026', office: 'Office of Electricity' },
  { id: '4',  projectName: 'Coastal Energy Resilience Program',  controlNumber: 'DE-0004-2025', office: 'Office of Solar Energy' },
  { id: '5',  projectName: 'Battery Storage Pilot',              controlNumber: 'DE-0005-2026', office: 'Office of Electricity' },
  { id: '6',  projectName: 'Rural Electrification Study',        controlNumber: 'DE-0006-2025', office: 'Office of Wind Energy' },
  { id: '7',  projectName: 'Hydrogen Fuel Cell Research',        controlNumber: 'DE-0007-2026', office: 'Office of Clean Energy' },
  { id: '8',  projectName: 'Carbon Capture Demonstration',       controlNumber: 'DE-0008-2025', office: 'Office of Fossil Energy' },
  { id: '9',  projectName: 'Nuclear Microreactor Study',         controlNumber: 'DE-0009-2026', office: 'Office of Nuclear Energy' },
  { id: '10', projectName: 'EV Charging Infrastructure Grant',   controlNumber: 'DE-0010-2026', office: 'Office of Clean Energy' },
  { id: '11', projectName: 'Offshore Wind Feasibility Study',    controlNumber: 'DE-0011-2025', office: 'Office of Wind Energy' },
  { id: '12', projectName: 'Smart Grid Analytics Platform',      controlNumber: 'DE-0012-2026', office: 'Office of Electricity' },
];

const mockDeliverablesByProject: Record<string, ProjectDeliverable[]> = {
  '1': [
    { id: '1-1', deliverable: 'Q1 Progress Report',         dueDate: '03/31/2026', dateSubmitted: '03/28/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
    { id: '1-2', deliverable: 'Community Outreach Summary', dueDate: '04/01/2026', dateSubmitted: '03/30/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
    { id: '1-3', deliverable: 'Energy Output Baseline Study', dueDate: '04/18/2026', dateSubmitted: '04/16/2026', status: 'Submitted' },
    { id: '1-4', deliverable: 'Site Safety Assessment',     dueDate: '04/25/2026', dateSubmitted: null,         status: 'Not Submitted' },
    { id: '1-5', deliverable: 'Financial Expenditure Report', dueDate: '03/15/2026', dateSubmitted: '03/20/2026', status: 'Needs Resubmission' },
  ],
  '2': [
    { id: '2-1', deliverable: 'Quarterly Equipment Log',        dueDate: '03/25/2026', dateSubmitted: '03/24/2026', status: 'Submitted' },
    { id: '2-2', deliverable: 'Stakeholder Engagement Summary', dueDate: '04/12/2026', dateSubmitted: '04/11/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
    { id: '2-3', deliverable: 'Environmental Impact Report',    dueDate: '04/10/2026', dateSubmitted: null,         status: 'Due Soon' },
    { id: '2-4', deliverable: 'Turbine Performance Metrics',   dueDate: '03/20/2026', dateSubmitted: null,         status: 'Overdue' },
  ],
  '3': [
    { id: '3-1', deliverable: 'Safety Compliance Checklist',  dueDate: '04/10/2026', dateSubmitted: '04/08/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
    { id: '3-2', deliverable: 'Site Assessment Report',       dueDate: '04/05/2026', dateSubmitted: '04/04/2026', status: 'Submitted' },
    { id: '3-3', deliverable: 'Grid Upgrade Technical Specs', dueDate: '04/20/2026', dateSubmitted: null,         status: 'Not Submitted' },
    { id: '3-4', deliverable: 'Q1 Budget Reconciliation',     dueDate: '03/31/2026', dateSubmitted: '03/29/2026', status: 'Needs Resubmission' },
  ],
  '4': [
    { id: '4-1', deliverable: 'Coastal Survey Final Report',  dueDate: '02/28/2026', dateSubmitted: '02/25/2026', status: 'Submitted' },
    { id: '4-2', deliverable: 'Resilience Framework Document', dueDate: '03/15/2026', dateSubmitted: '03/12/2026', status: 'Submitted' },
  ],
  '5': [
    { id: '5-1', deliverable: 'Battery Cycle Testing Report', dueDate: '04/15/2026', dateSubmitted: '04/14/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
    { id: '5-2', deliverable: 'Pilot Site Installation Log',  dueDate: '04/20/2026', dateSubmitted: null,         status: 'Due Soon' },
    { id: '5-3', deliverable: 'Vendor Agreement Summary',     dueDate: '03/28/2026', dateSubmitted: '03/27/2026', status: 'Submitted' },
  ],
  '6': [
    { id: '6-1', deliverable: 'Rural Access Feasibility Study', dueDate: '02/20/2026', dateSubmitted: '02/18/2026', status: 'Submitted' },
    { id: '6-2', deliverable: 'Community Needs Assessment',    dueDate: '03/10/2026', dateSubmitted: '03/08/2026', status: 'Submitted' },
  ],
  '7': [
    { id: '7-1', deliverable: 'Fuel Cell Prototype Report',    dueDate: '04/08/2026', dateSubmitted: '04/07/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
    { id: '7-2', deliverable: 'Lab Safety Compliance Form',    dueDate: '04/15/2026', dateSubmitted: null,         status: 'Not Submitted' },
    { id: '7-3', deliverable: 'Q1 Research Summary',           dueDate: '03/31/2026', dateSubmitted: '04/02/2026', status: 'Needs Resubmission' },
  ],
  '8': [
    { id: '8-1', deliverable: 'Carbon Capture Efficiency Report', dueDate: '02/15/2026', dateSubmitted: '02/12/2026', status: 'Submitted' },
    { id: '8-2', deliverable: 'Site Decommission Plan',           dueDate: '03/01/2026', dateSubmitted: '02/28/2026', status: 'Submitted' },
  ],
  '9': [
    { id: '9-1', deliverable: 'Microreactor Design Review',  dueDate: '04/12/2026', dateSubmitted: '04/10/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
    { id: '9-2', deliverable: 'Regulatory Compliance Brief', dueDate: '04/22/2026', dateSubmitted: null,         status: 'Due Soon' },
    { id: '9-3', deliverable: 'Q1 Safety Incident Log',      dueDate: '03/31/2026', dateSubmitted: '03/30/2026', status: 'Submitted' },
  ],
  '10': [
    { id: '10-1', deliverable: 'Charging Station Site Plan',   dueDate: '04/10/2026', dateSubmitted: '04/09/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
    { id: '10-2', deliverable: 'Contractor Selection Report',  dueDate: '04/18/2026', dateSubmitted: null,         status: 'Not Submitted' },
    { id: '10-3', deliverable: 'Community Engagement Log',     dueDate: '03/25/2026', dateSubmitted: '03/22/2026', status: 'Submitted' },
  ],
  '11': [
    { id: '11-1', deliverable: 'Offshore Survey Final Report', dueDate: '02/10/2026', dateSubmitted: '02/08/2026', status: 'Submitted' },
    { id: '11-2', deliverable: 'Environmental Baseline Study', dueDate: '03/05/2026', dateSubmitted: '03/03/2026', status: 'Submitted' },
  ],
  '12': [
    { id: '12-1', deliverable: 'Platform Architecture Document', dueDate: '04/14/2026', dateSubmitted: '04/13/2026', status: 'Needs Review', aiSummary: mockAiSummary, fileUrl: '#', submissionHistory: mockSubmissionHistory },
    { id: '12-2', deliverable: 'Data Security Assessment',      dueDate: '04/20/2026', dateSubmitted: null,         status: 'Due Soon' },
    { id: '12-3', deliverable: 'API Integration Test Results',  dueDate: '03/28/2026', dateSubmitted: '03/25/2026', status: 'Needs Resubmission' },
    { id: '12-4', deliverable: 'Q1 Milestone Summary',          dueDate: '03/31/2026', dateSubmitted: '03/30/2026', status: 'Submitted' },
  ],
};

@Component({
  selector: 'app-admin-project-detail',
  standalone: true,
  imports: [LucideAngularModule, RouterLink, AdminPanelComponent],
  templateUrl: './admin-project-detail.component.html',
})
export class AdminProjectDetailComponent {
  private route = inject(ActivatedRoute);

  readonly ArrowLeft = ArrowLeft;
  readonly ChevronDown = ChevronDown;
  readonly Eye = Eye;

  readonly statusOptions: ('All' | DeliverableStatus)[] = [
    'All', 'Needs Review', 'Submitted', 'Needs Resubmission', 'Overdue', 'Due Soon', 'Not Submitted',
  ];
  readonly dateSubmittedOptions = ['All', 'This Week', 'This Month', 'Not Yet Submitted'];

  statusFilter = signal<'All' | DeliverableStatus>('All');
  dateSubmittedFilter = signal<string>('All');
  statusOpen = signal(false);
  dateSubmittedOpen = signal(false);

  project = computed(() => {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    return mockProjects.find(p => p.id === id) ?? null;
  });

  filteredDeliverables = computed(() => {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    let items = [...(mockDeliverablesByProject[id] ?? [])];

    if (this.statusFilter() !== 'All') {
      items = items.filter(d => d.status === this.statusFilter());
    }

    if (this.dateSubmittedFilter() === 'Not Yet Submitted') {
      items = items.filter(d => d.dateSubmitted === null);
    }

    return items;
  });

  toggleStatus() { this.statusOpen.update(v => !v); this.dateSubmittedOpen.set(false); }
  toggleDateSubmitted() { this.dateSubmittedOpen.update(v => !v); this.statusOpen.set(false); }

  setStatusFilter(val: 'All' | DeliverableStatus) { this.statusFilter.set(val); this.statusOpen.set(false); }
  setDateSubmittedFilter(val: string) { this.dateSubmittedFilter.set(val); this.dateSubmittedOpen.set(false); }

  panelDeliverable = signal<AdminPanelDeliverable | null>(null);
  panelState = signal<AdminPanelState>('hidden');

  onViewClick(item: ProjectDeliverable) {
    this.panelDeliverable.set({
      deliverable: item.deliverable,
      project: this.project()?.projectName,
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

  hasSubmission(status: DeliverableStatus): boolean {
    return status === 'Submitted' || status === 'Needs Review' || status === 'Needs Resubmission';
  }

  getStatusBadgeStyle(status: DeliverableStatus): Record<string, string> {
    switch (status) {
      case 'Submitted':          return { background: '#dcfce7', color: '#166534' };
      case 'Needs Resubmission': return { background: '#fef9c3', color: '#854d0e' };
      case 'Overdue':            return { background: '#fee2e2', color: '#991b1b' };
      case 'Due Soon':           return { background: '#ffedd5', color: '#9a3412' };
      case 'Not Submitted':      return { background: '#dbeafe', color: '#1e40af' };
      case 'Needs Review':        return { background: '#f3e8ff', color: '#6b21a8' };
    }
  }
}
