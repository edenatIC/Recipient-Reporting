import { Component, signal, input, output, OnInit } from '@angular/core';
import { LucideAngularModule, X, ChevronsLeft, ChevronsRight, ExternalLink, Sparkles } from 'lucide-angular';
import { SubmissionHistoryEntry } from '../../../recipient/models/submission.model';

export type AdminDeliverableStatus = 'Needs Review' | 'Approved' | 'Resubmission Requested';
export type AdminPanelState = 'hidden' | 'normal' | 'expanded';
type PanelTab = 'summary' | 'history';

export interface AdminPanelDeliverable {
  deliverable: string;
  project?: string;
  dueDate: string;
  dateSubmitted: string | null;
  status: AdminDeliverableStatus;
  approvedDate?: string;
  aiSummary?: string;
  fileUrl?: string;
  submissionHistory?: SubmissionHistoryEntry[];
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent implements OnInit {
  readonly X = X;
  readonly ChevronsLeft = ChevronsLeft;
  readonly ChevronsRight = ChevronsRight;
  readonly ExternalLink = ExternalLink;
  readonly Sparkles = Sparkles;

  deliverable = input.required<AdminPanelDeliverable>();
  panelState = input.required<AdminPanelState>();
  close = output<void>();
  panelStateChange = output<AdminPanelState>();
  approve = output<void>();
  reject = output<string>();

  panelAnimating = signal(true);
  activeTab = signal<PanelTab>('summary');
  showRejectModal = signal(false);
  rejectComment = signal('');

  ngOnInit() {
    setTimeout(() => this.panelAnimating.set(false), 400);
    this.activeTab.set('summary');
  }

  onToggleExpand() {
    this.panelStateChange.emit(
      this.panelState() === 'expanded' ? 'normal' : 'expanded'
    );
  }

  setTab(tab: PanelTab) {
    this.activeTab.set(tab);
  }

  openRejectModal() {
    this.rejectComment.set('');
    this.showRejectModal.set(true);
  }

  cancelReject() {
    this.showRejectModal.set(false);
    this.rejectComment.set('');
  }

  submitReject() {
    this.reject.emit(this.rejectComment());
    this.showRejectModal.set(false);
    this.rejectComment.set('');
  }

  getStatusBadgeStyle(status: AdminDeliverableStatus): Record<string, string> {
    switch (status) {
      case 'Needs Review':           return { background: '#f3e8ff', color: '#6b21a8' };
      case 'Approved':               return { background: '#dcfce7', color: '#166534' };
      case 'Resubmission Requested': return { background: '#fef9c3', color: '#854d0e' };
    }
  }
}
