import { Component, computed, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, ChevronDown, Eye } from 'lucide-angular';
import { AdminPanelComponent, AdminPanelState, AdminPanelDeliverable } from '../../components/admin-panel/admin-panel.component';

type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';
type FiscalYear = 'FY25' | 'FY26';

interface ProjectDeliverable {
  id: string;
  deliverable: string;
  dueDate: string;
  dateSubmitted: string;
  quarter: Quarter;
  fiscalYear: FiscalYear;
  aiSummary: string;
  fileUrl: string;
  submissionHistory: { version: number; fileName: string; fileUrl: string; date: string; comment: string }[];
}

// ── AI Summaries ────────────────────────────────────────────────────────────

const summaryProgressReport = 'This Q1 Progress Report covers project activities from January through March 2026. All required sections are complete, including milestone status, staffing updates, and budget utilization. The report indicates that two of the four planned milestones have been achieved on schedule, while a third is running approximately two weeks behind due to permitting delays.\n\nThe narrative sections are well-written and supported by data. One gap identified: the risk register on page 4 lists three open risks without assigned mitigation owners. Recommend requesting clarification on ownership before final approval.';

const summaryOutreachSummary = 'The Community Outreach Summary documents engagement activities conducted between February and March 2026 across five community sites. Attendance figures, feedback forms, and sign-in sheets are referenced but only partially included as attachments — two of the five site records appear to be missing.\n\nThe written summary is thorough and reflects genuine community participation. The submitter notes scheduling challenges that affected two planned sessions, which were rescheduled and completed. Overall the deliverable is largely complete; a follow-up on the missing site attachments is advised before approval.';

const summaryComplianceChecklist = 'This Safety Compliance Checklist covers 42 inspection items across equipment handling, personnel certification, and site access protocols. All items are marked as compliant, with signatures from the site lead and safety officer on each page.\n\nThree items in Section C (emergency egress) reference a separate Site Safety Plan that was not included with this submission. The checklist itself is fully filled out and appears accurate based on the project scope. Recommend requesting the referenced Safety Plan as a supporting document before approving.';

const summaryEquipmentLog = 'The Quarterly Equipment Log records all equipment procurement, deployment, and maintenance events for Q1 2026. A total of 23 line items are logged with serial numbers, acquisition dates, and responsible personnel. The log format matches the required template.\n\nOne inconsistency was flagged: equipment item #17 shows a deployment date that precedes its recorded acquisition date by four days, which may indicate a data entry error. All other entries appear consistent and well-documented. Minor clarification on item #17 is recommended before final sign-off.';

const summaryAssessmentReport = 'This Site Assessment Report presents findings from field surveys conducted in late March 2026. The report includes topographic data, soil classification results, and environmental baseline readings. Supporting maps and photo documentation are included as appendices.\n\nThe methodology section is thorough and the findings are clearly presented. The executive summary, however, omits reference to the two sites where surveys were paused due to weather — these are covered later in the report but the omission in the summary could cause confusion for reviewers unfamiliar with the project. Flagging for minor revision or a clarifying note.';

const summaryStakeholderSummary = 'The Stakeholder Engagement Summary covers formal and informal engagement activities for Q1 2026, including two public meetings, four bilateral conversations with agency partners, and one technical working group session. Meeting minutes and attendance records are appended.\n\nThe document is well-organized and the engagement activities described align with the approved project engagement plan. One item to note: the summary references commitments made during the February 12 bilateral that are not yet reflected in the project schedule. Recommend confirming these are tracked before approval.';

const summaryBaselineStudy = 'This Energy Output Baseline Study establishes pre-project energy generation and consumption baselines for the project site. The methodology follows the approved measurement and verification protocol, and all data collection periods are accounted for.\n\nThe statistical analysis in Section 3 is sound, though the confidence intervals reported are notably wide due to the short data collection window (6 weeks). The report acknowledges this limitation and recommends a supplementary data collection phase. The deliverable is complete and the limitation is appropriately disclosed — no blocking issues identified.';

const summaryTechReport = 'The submitted Technical Report covers system design specifications, testing protocols, and integration results for the pilot phase. The report is 48 pages and includes annotated diagrams and test output tables.\n\nAll required sections are present. A few figures appear to be low-resolution exports and may not reproduce well in print, but the underlying data is clearly communicated. Section 5 references an appendix that is not included in this submission — this may be an oversight or the appendix may have been inadvertently excluded. Recommend confirming with the submitter before approving.';

const summaryBudgetReport = 'This Budget Reconciliation Report documents Q1 expenditures against the approved budget. Total spend for the quarter is reported at $1.24M against a budget of $1.31M, representing a favorable variance of approximately 5.3%.\n\nAll line items are supported by transaction references, and the variance is explained in the narrative. Two budget reallocations made during the quarter are disclosed and appear consistent with the approved modification submitted in February. The report is thorough and well-supported — no significant issues identified.';

// ── Submission Histories ─────────────────────────────────────────────────────

const historyV2Only = [
  { version: 2, fileName: 'Deliverable_v2.pdf', fileUrl: '#', date: '04/11/2026', comment: 'Revised submission incorporating reviewer feedback on the milestone tracking table and updated staffing numbers.' },
  { version: 1, fileName: 'Deliverable_v1.pdf', fileUrl: '#', date: '03/28/2026', comment: 'Initial submission.' },
];

const historyV1Only = [
  { version: 1, fileName: 'Deliverable_v1.pdf', fileUrl: '#', date: '03/30/2026', comment: 'First and only submission. No prior versions.' },
];

const historyV3 = [
  { version: 3, fileName: 'Deliverable_v3.pdf', fileUrl: '#', date: '04/09/2026', comment: 'Third submission. Addressed missing site attachments noted in second review cycle.' },
  { version: 2, fileName: 'Deliverable_v2.pdf', fileUrl: '#', date: '03/22/2026', comment: 'Resubmission following initial review. Updated risk register and added two missing appendices.' },
  { version: 1, fileName: 'Deliverable_v1.pdf', fileUrl: '#', date: '03/10/2026', comment: 'Initial submission.' },
];

const historyV2B = [
  { version: 2, fileName: 'Deliverable_v2.pdf', fileUrl: '#', date: '04/14/2026', comment: 'Corrected data entry error on item #17 and added clarifying note in the summary section.' },
  { version: 1, fileName: 'Deliverable_v1.pdf', fileUrl: '#', date: '04/02/2026', comment: 'Initial submission.' },
];

// ── Mock Projects ─────────────────────────────────────────────────────────────

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

// ── Mock Deliverables ─────────────────────────────────────────────────────────

// Federal fiscal year: Q1=Oct–Dec, Q2=Jan–Mar, Q3=Apr–Jun, Q4=Jul–Sep
const mockDeliverablesByProject: Record<string, ProjectDeliverable[]> = {
  '1': [
    { id: '1-1', deliverable: 'SF-425 Federal Financial Report',       dueDate: '03/31/2026', dateSubmitted: '03/28/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryProgressReport,    fileUrl: '#', submissionHistory: historyV2Only },
    { id: '1-2', deliverable: 'Performance Report - Narrative',        dueDate: '03/15/2026', dateSubmitted: '03/14/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryOutreachSummary,    fileUrl: '#', submissionHistory: historyV1Only },
    { id: '1-3', deliverable: 'Performance Report - Quantative',       dueDate: '04/18/2026', dateSubmitted: '04/16/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryBaselineStudy,      fileUrl: '#', submissionHistory: historyV2B   },
    { id: '1-4', deliverable: 'Technical Progress Report',             dueDate: '04/25/2026', dateSubmitted: '04/22/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryAssessmentReport,   fileUrl: '#', submissionHistory: historyV1Only },
    { id: '1-5', deliverable: 'Research Performance Progress Report',  dueDate: '12/15/2025', dateSubmitted: '12/18/2025', quarter: 'Q1', fiscalYear: 'FY26', aiSummary: summaryBudgetReport,       fileUrl: '#', submissionHistory: historyV3    },
  ],
  '2': [
    { id: '2-1', deliverable: 'SF-425 Federal Financial Report',       dueDate: '03/25/2026', dateSubmitted: '03/24/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryEquipmentLog,       fileUrl: '#', submissionHistory: historyV2B   },
    { id: '2-2', deliverable: 'Performance Report - Narrative',        dueDate: '04/12/2026', dateSubmitted: '04/11/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryStakeholderSummary,  fileUrl: '#', submissionHistory: historyV1Only },
    { id: '2-3', deliverable: 'Technical Progress Report',             dueDate: '04/10/2026', dateSubmitted: '04/08/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryAssessmentReport,   fileUrl: '#', submissionHistory: historyV2Only },
    { id: '2-4', deliverable: 'Research Performance Progress Report',  dueDate: '12/20/2025', dateSubmitted: '12/18/2025', quarter: 'Q1', fiscalYear: 'FY26', aiSummary: summaryBaselineStudy,      fileUrl: '#', submissionHistory: historyV1Only },
  ],
  '3': [
    { id: '3-1', deliverable: 'Performance Report - Quantative',       dueDate: '04/10/2026', dateSubmitted: '04/08/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryComplianceChecklist, fileUrl: '#', submissionHistory: historyV3    },
    { id: '3-2', deliverable: 'SF-425 Federal Financial Report',       dueDate: '03/31/2026', dateSubmitted: '03/29/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryAssessmentReport,   fileUrl: '#', submissionHistory: historyV1Only },
    { id: '3-3', deliverable: 'Technical Progress Report',             dueDate: '04/20/2026', dateSubmitted: '04/18/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryTechReport,          fileUrl: '#', submissionHistory: historyV2Only },
    { id: '3-4', deliverable: 'Performance Report - Narrative',        dueDate: '03/15/2026', dateSubmitted: '03/13/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryBudgetReport,        fileUrl: '#', submissionHistory: historyV2B   },
  ],
  '4': [
    { id: '4-1', deliverable: 'Research Performance Progress Report',  dueDate: '06/30/2025', dateSubmitted: '06/27/2025', quarter: 'Q3', fiscalYear: 'FY25', aiSummary: summaryAssessmentReport,   fileUrl: '#', submissionHistory: historyV1Only },
    { id: '4-2', deliverable: 'SF-425 Federal Financial Report',       dueDate: '06/15/2025', dateSubmitted: '06/12/2025', quarter: 'Q3', fiscalYear: 'FY25', aiSummary: summaryTechReport,          fileUrl: '#', submissionHistory: historyV2Only },
  ],
  '5': [
    { id: '5-1', deliverable: 'Performance Report - Narrative',        dueDate: '04/15/2026', dateSubmitted: '04/14/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryTechReport,          fileUrl: '#', submissionHistory: historyV2B   },
    { id: '5-2', deliverable: 'Technical Progress Report',             dueDate: '04/20/2026', dateSubmitted: '04/17/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryEquipmentLog,        fileUrl: '#', submissionHistory: historyV1Only },
    { id: '5-3', deliverable: 'Performance Report - Quantative',       dueDate: '03/28/2026', dateSubmitted: '03/27/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryStakeholderSummary,  fileUrl: '#', submissionHistory: historyV2Only },
  ],
  '6': [
    { id: '6-1', deliverable: 'Research Performance Progress Report',  dueDate: '02/20/2025', dateSubmitted: '02/18/2025', quarter: 'Q2', fiscalYear: 'FY25', aiSummary: summaryBaselineStudy,      fileUrl: '#', submissionHistory: historyV1Only },
    { id: '6-2', deliverable: 'SF-425 Federal Financial Report',       dueDate: '03/10/2025', dateSubmitted: '03/08/2025', quarter: 'Q2', fiscalYear: 'FY25', aiSummary: summaryOutreachSummary,    fileUrl: '#', submissionHistory: historyV2Only },
  ],
  '7': [
    { id: '7-1', deliverable: 'Technical Progress Report',             dueDate: '04/08/2026', dateSubmitted: '04/07/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryTechReport,          fileUrl: '#', submissionHistory: historyV2Only },
    { id: '7-2', deliverable: 'Performance Report - Narrative',        dueDate: '04/15/2026', dateSubmitted: '04/13/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryComplianceChecklist, fileUrl: '#', submissionHistory: historyV1Only },
    { id: '7-3', deliverable: 'Research Performance Progress Report',  dueDate: '03/31/2026', dateSubmitted: '04/02/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryProgressReport,     fileUrl: '#', submissionHistory: historyV3    },
  ],
  '8': [
    { id: '8-1', deliverable: 'SF-425 Federal Financial Report',       dueDate: '02/15/2025', dateSubmitted: '02/12/2025', quarter: 'Q2', fiscalYear: 'FY25', aiSummary: summaryBaselineStudy,      fileUrl: '#', submissionHistory: historyV2Only },
    { id: '8-2', deliverable: 'Performance Report - Quantative',       dueDate: '03/01/2025', dateSubmitted: '02/28/2025', quarter: 'Q2', fiscalYear: 'FY25', aiSummary: summaryAssessmentReport,   fileUrl: '#', submissionHistory: historyV1Only },
  ],
  '9': [
    { id: '9-1', deliverable: 'Technical Progress Report',             dueDate: '04/12/2026', dateSubmitted: '04/10/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryTechReport,          fileUrl: '#', submissionHistory: historyV2B   },
    { id: '9-2', deliverable: 'Performance Report - Narrative',        dueDate: '04/22/2026', dateSubmitted: '04/20/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryComplianceChecklist, fileUrl: '#', submissionHistory: historyV1Only },
    { id: '9-3', deliverable: 'SF-425 Federal Financial Report',       dueDate: '03/31/2026', dateSubmitted: '03/30/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryProgressReport,     fileUrl: '#', submissionHistory: historyV2Only },
  ],
  '10': [
    { id: '10-1', deliverable: 'Research Performance Progress Report', dueDate: '03/10/2026', dateSubmitted: '03/09/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryAssessmentReport,   fileUrl: '#', submissionHistory: historyV2Only },
    { id: '10-2', deliverable: 'Performance Report - Quantative',      dueDate: '04/18/2026', dateSubmitted: '04/15/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryStakeholderSummary,  fileUrl: '#', submissionHistory: historyV3    },
    { id: '10-3', deliverable: 'Performance Report - Narrative',       dueDate: '03/25/2026', dateSubmitted: '03/22/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryOutreachSummary,    fileUrl: '#', submissionHistory: historyV1Only },
  ],
  '11': [
    { id: '11-1', deliverable: 'Technical Progress Report',            dueDate: '02/10/2025', dateSubmitted: '02/08/2025', quarter: 'Q2', fiscalYear: 'FY25', aiSummary: summaryAssessmentReport,   fileUrl: '#', submissionHistory: historyV2Only },
    { id: '11-2', deliverable: 'SF-425 Federal Financial Report',      dueDate: '03/05/2025', dateSubmitted: '03/03/2025', quarter: 'Q2', fiscalYear: 'FY25', aiSummary: summaryBaselineStudy,      fileUrl: '#', submissionHistory: historyV1Only },
  ],
  '12': [
    { id: '12-1', deliverable: 'Research Performance Progress Report', dueDate: '04/14/2026', dateSubmitted: '04/13/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryTechReport,          fileUrl: '#', submissionHistory: historyV2B   },
    { id: '12-2', deliverable: 'Performance Report - Narrative',       dueDate: '04/20/2026', dateSubmitted: '04/18/2026', quarter: 'Q3', fiscalYear: 'FY26', aiSummary: summaryComplianceChecklist, fileUrl: '#', submissionHistory: historyV1Only },
    { id: '12-3', deliverable: 'Technical Progress Report',            dueDate: '03/28/2026', dateSubmitted: '03/25/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryTechReport,          fileUrl: '#', submissionHistory: historyV3    },
    { id: '12-4', deliverable: 'SF-425 Federal Financial Report',      dueDate: '03/31/2026', dateSubmitted: '03/30/2026', quarter: 'Q2', fiscalYear: 'FY26', aiSummary: summaryProgressReport,     fileUrl: '#', submissionHistory: historyV2Only },
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

  readonly quarterOptions = ['All', 'Q1', 'Q2', 'Q3', 'Q4'];
  readonly deliverableTypeOptions = [
    'All',
    'SF-425 Federal Financial Report',
    'Performance Report - Narrative',
    'Performance Report - Quantative',
    'Technical Progress Report',
    'Research Performance Progress Report',
  ];
  readonly statusOptions = ['All', 'Needs Review'];
  readonly dueDateOptions = ['All', 'This Week', 'This Month', 'Next Month'];
  readonly dateSubmittedOptions = ['All', 'This Week', 'This Month'];

  quarterFilter = signal<string>('All');
  deliverableTypeFilter = signal<string>('All');
  statusFilter = signal<string>('All');
  dueDateFilter = signal<string>('All');
  dateSubmittedFilter = signal<string>('All');

  quarterOpen = signal(false);
  deliverableTypeOpen = signal(false);
  statusOpen = signal(false);
  dueDateOpen = signal(false);
  dateSubmittedOpen = signal(false);

  project = computed(() => {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    return mockProjects.find(p => p.id === id) ?? null;
  });

  filteredDeliverables = computed(() => {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    let items = [...(mockDeliverablesByProject[id] ?? [])];

    if (this.quarterFilter() !== 'All') {
      items = items.filter(d => d.quarter === this.quarterFilter());
    }
    if (this.deliverableTypeFilter() !== 'All') {
      items = items.filter(d => d.deliverable === this.deliverableTypeFilter());
    }
    if (this.statusFilter() !== 'All') {
      items = items.filter(() => this.statusFilter() === 'Needs Review');
    }

    return items;
  });

  closeAll() {
    this.quarterOpen.set(false);
    this.deliverableTypeOpen.set(false);
    this.statusOpen.set(false);
    this.dueDateOpen.set(false);
    this.dateSubmittedOpen.set(false);
  }

  toggleQuarter()          { const o = this.quarterOpen(); this.closeAll(); this.quarterOpen.set(!o); }
  toggleDeliverableType()  { const o = this.deliverableTypeOpen(); this.closeAll(); this.deliverableTypeOpen.set(!o); }
  toggleStatus()           { const o = this.statusOpen(); this.closeAll(); this.statusOpen.set(!o); }
  toggleDueDate()          { const o = this.dueDateOpen(); this.closeAll(); this.dueDateOpen.set(!o); }
  toggleDateSubmitted()    { const o = this.dateSubmittedOpen(); this.closeAll(); this.dateSubmittedOpen.set(!o); }

  setQuarterFilter(val: string)         { this.quarterFilter.set(val); this.quarterOpen.set(false); }
  setDeliverableTypeFilter(val: string) { this.deliverableTypeFilter.set(val); this.deliverableTypeOpen.set(false); }
  setStatusFilter(val: string)          { this.statusFilter.set(val); this.statusOpen.set(false); }
  setDueDateFilter(val: string)         { this.dueDateFilter.set(val); this.dueDateOpen.set(false); }
  setDateSubmittedFilter(val: string)   { this.dateSubmittedFilter.set(val); this.dateSubmittedOpen.set(false); }

  panelDeliverable = signal<AdminPanelDeliverable | null>(null);
  panelState = signal<AdminPanelState>('hidden');

  onViewClick(item: ProjectDeliverable) {
    this.panelDeliverable.set({
      deliverable: item.deliverable,
      project: this.project()?.projectName,
      dueDate: item.dueDate,
      dateSubmitted: item.dateSubmitted,
      status: 'Needs Review',
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
