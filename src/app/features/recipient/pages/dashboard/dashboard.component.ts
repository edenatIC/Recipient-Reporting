import { Component, computed, signal, inject } from '@angular/core';
import { LucideAngularModule, Upload, Eye, ChevronDown, X, CloudUpload } from 'lucide-angular';
import { AuthService } from '../../../../core/auth/auth.service';
import { UserRole } from '../../../../core/auth/auth.model';
import { mockDeliverables, Deliverable, DeliverableStatus } from '../../models/submission.model';
import { DeliverablePanelComponent, PanelState } from '../../components/deliverable-panel/deliverable-panel.component';

type StatusFilter = 'All' | DeliverableStatus;
type ProjectFilter = 'All Projects' | string;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LucideAngularModule, DeliverablePanelComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private authService = inject(AuthService);

  readonly Upload = Upload;
  readonly Eye = Eye;
  readonly ChevronDown = ChevronDown;
  readonly X = X;
  readonly CloudUpload = CloudUpload;

  isAdmin = computed(() => this.authService.currentUser()?.role === UserRole.Admin);

  welcomeTitle = computed(() =>
    this.isAdmin() ? 'Welcome Admin User.' : 'Welcome, Recipient.'
  );

  welcomeSubtext = computed(() =>
    this.isAdmin()
      ? 'Manage Deliverables for submitted projects and leave comments'
      : 'Upload your deliverables to your projects'
  );

  uploadTarget = signal<Deliverable | null>(null);
  isReupload = signal(false);
  selectedFile = signal<File | null>(null);
  isDragOver = signal(false);

  panelDeliverable = signal<Deliverable | null>(null);
  panelState = signal<PanelState>('hidden');

  selectedDeliverable = computed(() =>
    this.panelState() !== 'hidden' ? this.panelDeliverable() : null
  );

  statusFilter = signal<StatusFilter>('All');
  projectFilter = signal<ProjectFilter>('All Projects');
  dueDateFilter = signal('All');
  dateSubmittedFilter = signal('All');

  statusOpen = signal(false);
  projectOpen = signal(false);
  dueDateOpen = signal(false);
  dateSubmittedOpen = signal(false);

  readonly statusOptions: StatusFilter[] = [
    'All',
    'Submitted',
    'Needs Resubmission',
    'Overdue',
    'Due Soon',
    'Not Submitted',
  ];

  private readonly priorityOrder: Record<DeliverableStatus, number> = {
    'Overdue': 0,
    'Due Soon': 1,
    'Needs Resubmission': 2,
    'Needs Review': 3,
    'Not Submitted': 4,
    'Submitted': 5,
  };

  readonly projectOptions: ProjectFilter[] = [
    'All Projects',
    'Solar Array Installation – Phase 1',
    'Wind Turbine Expansion',
    'Grid Modernization Initiative',
  ];

  readonly dueDateOptions = ['All', 'This Week', 'This Month', 'Next Month', 'Overdue'];
  readonly dateSubmittedOptions = ['All', 'This Week', 'This Month', 'Not Yet Submitted'];

  filteredDeliverables = computed(() => {
    let items = [...mockDeliverables];

    if (this.statusFilter() !== 'All') {
      items = items.filter(d => d.status === this.statusFilter());
    }

    if (this.projectFilter() !== 'All Projects') {
      items = items.filter(d => d.project === this.projectFilter());
    }

    return items.sort((a, b) => this.priorityOrder[a.status] - this.priorityOrder[b.status]);
  });

  setStatusFilter(value: StatusFilter) {
    this.statusFilter.set(value);
    this.statusOpen.set(false);
  }

  setProjectFilter(value: ProjectFilter) {
    this.projectFilter.set(value);
    this.projectOpen.set(false);
  }

  setDueDateFilter(value: string) {
    this.dueDateFilter.set(value);
    this.dueDateOpen.set(false);
  }

  setDateSubmittedFilter(value: string) {
    this.dateSubmittedFilter.set(value);
    this.dateSubmittedOpen.set(false);
  }

  closeAll() {
    this.statusOpen.set(false);
    this.projectOpen.set(false);
    this.dueDateOpen.set(false);
    this.dateSubmittedOpen.set(false);
  }

  toggleStatus() { this.statusOpen.update(v => !v); this.projectOpen.set(false); this.dueDateOpen.set(false); this.dateSubmittedOpen.set(false); }
  toggleProject() { this.projectOpen.update(v => !v); this.statusOpen.set(false); this.dueDateOpen.set(false); this.dateSubmittedOpen.set(false); }
  toggleDueDate() { this.dueDateOpen.update(v => !v); this.statusOpen.set(false); this.projectOpen.set(false); this.dateSubmittedOpen.set(false); }
  toggleDateSubmitted() { this.dateSubmittedOpen.update(v => !v); this.statusOpen.set(false); this.projectOpen.set(false); this.dueDateOpen.set(false); }

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

  isUploadStatus(status: DeliverableStatus): boolean {
    return status === 'Not Submitted' || status === 'Overdue' || status === 'Due Soon';
  }

  onActionClick(deliverable: Deliverable) {
    if (this.isUploadStatus(deliverable.status)) {
      this.uploadTarget.set(deliverable);
      this.selectedFile.set(null);
    } else {
      this.panelDeliverable.set(deliverable);
      this.panelState.set('normal');
    }
  }

  onPanelClose() {
    this.panelState.set('hidden');
    this.panelDeliverable.set(null);
  }


  onReupload() {
    this.uploadTarget.set(this.panelDeliverable());
    this.isReupload.set(true);
    this.selectedFile.set(null);
  }

  closeModal() {
    this.uploadTarget.set(null);
    this.isReupload.set(false);
    this.selectedFile.set(null);
    this.isDragOver.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.selectedFile.set(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave() {
    this.isDragOver.set(false);
  }

  submitUpload() {
    if (!this.selectedFile()) return;
    console.log('Uploading:', this.selectedFile()?.name, 'for', this.uploadTarget()?.deliverable);
    this.closeModal();
  }
}
