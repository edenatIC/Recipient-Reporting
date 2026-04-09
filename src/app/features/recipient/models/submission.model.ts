export type DeliverableStatus =
  | 'Submitted'
  | 'Needs Resubmission'
  | 'Overdue'
  | 'Due Soon'
  | 'Not Submitted'
  | 'Need Review';

export interface Deliverable {
  id: string;
  deliverable: string;
  project: string;
  dueDate: string;
  dateSubmitted: string | null;
  status: DeliverableStatus;
}

export const mockDeliverables: Deliverable[] = [
  {
    id: '1',
    deliverable: 'Q1 Progress Report',
    project: 'Solar Array Installation – Phase 1',
    dueDate: '03/31/2026',
    dateSubmitted: '03/28/2026',
    status: 'Submitted',
  },
  {
    id: '2',
    deliverable: 'Environmental Impact Assessment',
    project: 'Wind Turbine Expansion',
    dueDate: '04/15/2026',
    dateSubmitted: null,
    status: 'Due Soon',
  },
  {
    id: '3',
    deliverable: 'Budget Justification Memo',
    project: 'Grid Modernization Initiative',
    dueDate: '03/15/2026',
    dateSubmitted: null,
    status: 'Overdue',
  },
  {
    id: '4',
    deliverable: 'Community Outreach Summary',
    project: 'Solar Array Installation – Phase 1',
    dueDate: '04/01/2026',
    dateSubmitted: '03/30/2026',
    status: 'Needs Resubmission',
  },
  {
    id: '5',
    deliverable: 'Final Technical Report',
    project: 'Wind Turbine Expansion',
    dueDate: '05/01/2026',
    dateSubmitted: null,
    status: 'Not Submitted',
  },
  {
    id: '6',
    deliverable: 'Safety Compliance Checklist',
    project: 'Grid Modernization Initiative',
    dueDate: '04/10/2026',
    dateSubmitted: '04/08/2026',
    status: 'Submitted',
  },
  {
    id: '7',
    deliverable: 'Mid-Year Financial Statement',
    project: 'Solar Array Installation – Phase 1',
    dueDate: '04/20/2026',
    dateSubmitted: null,
    status: 'Due Soon',
  },
];
