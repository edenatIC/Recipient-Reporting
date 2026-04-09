import { Component, signal, input, output, OnInit } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { Deliverable, DeliverableStatus } from '../../models/submission.model';

export type PanelState = 'hidden' | 'normal';

@Component({
  selector: 'app-deliverable-panel',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './deliverable-panel.component.html',
})
export class DeliverablePanelComponent implements OnInit {
  readonly X = X;

  deliverable = input.required<Deliverable>();
  panelState = input.required<PanelState>();
  close = output<void>();

  panelAnimating = signal(true);

  ngOnInit() {
    setTimeout(() => this.panelAnimating.set(false), 400);
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
