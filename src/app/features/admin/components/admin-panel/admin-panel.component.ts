import { Component, signal, input, output, OnInit } from '@angular/core';
import { LucideAngularModule, X, ChevronsLeft, ChevronsRight } from 'lucide-angular';
import { DeliverableStatus } from '../../../recipient/models/submission.model';

export type AdminPanelState = 'hidden' | 'normal' | 'expanded';

export interface AdminPanelDeliverable {
  deliverable: string;
  project?: string;
  dueDate: string;
  dateSubmitted: string | null;
  status: DeliverableStatus;
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

  deliverable = input.required<AdminPanelDeliverable>();
  panelState = input.required<AdminPanelState>();
  close = output<void>();
  panelStateChange = output<AdminPanelState>();

  panelAnimating = signal(true);

  ngOnInit() {
    setTimeout(() => this.panelAnimating.set(false), 400);
  }

  onToggleExpand() {
    this.panelStateChange.emit(
      this.panelState() === 'expanded' ? 'normal' : 'expanded'
    );
  }

  getStatusBadgeStyle(status: DeliverableStatus): Record<string, string> {
    switch (status) {
      case 'Submitted':          return { background: '#dcfce7', color: '#166534' };
      case 'Needs Resubmission': return { background: '#fef9c3', color: '#854d0e' };
      case 'Overdue':            return { background: '#fee2e2', color: '#991b1b' };
      case 'Due Soon':           return { background: '#ffedd5', color: '#9a3412' };
      case 'Not Submitted':      return { background: '#dbeafe', color: '#1e40af' };
      case 'Need Review':        return { background: '#f3e8ff', color: '#6b21a8' };
    }
  }
}
