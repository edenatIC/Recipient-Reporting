export type DeliverableStatus =
  | 'Submitted'
  | 'Needs Resubmission'
  | 'Overdue'
  | 'Due Soon'
  | 'Not Submitted'
  | 'Needs Review';

export interface SubmissionHistoryEntry {
  version: number;
  fileName: string;
  fileUrl: string;
  date: string;
  comment: string;
}

export interface Deliverable {
  id: string;
  deliverable: string;
  project: string;
  dueDate: string;
  dateSubmitted: string | null;
  status: DeliverableStatus;
  reviewedBy?: string;
  reviewedDate?: string;
  fileUrl?: string;
  rejectionComment?: string;
  submissionHistory?: SubmissionHistoryEntry[];
}

const loremComment = '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."';

export const mockDeliverables: Deliverable[] = [
  {
    id: '1',
    deliverable: 'Q1 Progress Report',
    project: 'Solar Array Installation – Phase 1',
    dueDate: '03/31/2026',
    dateSubmitted: '03/28/2026',
    status: 'Submitted',
    reviewedBy: 'Sarah Johnson',
    reviewedDate: '03/30/2026',
    fileUrl: '#',
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
    reviewedBy: 'Sarah Johnson',
    reviewedDate: '05/04/2026',
    rejectionComment: loremComment,
    submissionHistory: [
      {
        version: 2,
        fileName: 'Deliverable_Submitted.pdf',
        fileUrl: '#',
        date: '05/01/2026',
        comment: loremComment,
      },
      {
        version: 1,
        fileName: 'Deliverable_Submitted.pdf',
        fileUrl: '#',
        date: '04/20/2026',
        comment: loremComment,
      },
    ],
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
    reviewedBy: 'Sarah Johnson',
    reviewedDate: '04/09/2026',
    fileUrl: '#',
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
