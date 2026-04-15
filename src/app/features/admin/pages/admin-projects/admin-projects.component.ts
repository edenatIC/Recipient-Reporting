import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

type ProjectStatus = 'Active' | 'Closed';
type FaLab = 'FA' | 'Lab';

interface AdminProject {
  id: string;
  projectName: string;
  controlNumber: string;
  status: ProjectStatus;
  office: string;
  faLab: FaLab;
}

const mockAdminProjects: AdminProject[] = [
  { id: '1',  projectName: 'Solar Array Installation – Phase 1', controlNumber: 'DE-0001-2026', status: 'Active', office: 'Office of Solar Energy',   faLab: 'FA'  },
  { id: '2',  projectName: 'Wind Turbine Expansion',             controlNumber: 'DE-0002-2026', status: 'Active', office: 'Office of Wind Energy',     faLab: 'Lab' },
  { id: '3',  projectName: 'Grid Modernization Initiative',      controlNumber: 'DE-0003-2026', status: 'Active', office: 'Office of Electricity',     faLab: 'FA'  },
  { id: '4',  projectName: 'Coastal Energy Resilience Program',  controlNumber: 'DE-0004-2025', status: 'Closed', office: 'Office of Solar Energy',   faLab: 'Lab' },
  { id: '5',  projectName: 'Battery Storage Pilot',              controlNumber: 'DE-0005-2026', status: 'Active', office: 'Office of Electricity',     faLab: 'Lab' },
  { id: '6',  projectName: 'Rural Electrification Study',        controlNumber: 'DE-0006-2025', status: 'Closed', office: 'Office of Wind Energy',     faLab: 'FA'  },
  { id: '7',  projectName: 'Hydrogen Fuel Cell Research',        controlNumber: 'DE-0007-2026', status: 'Active', office: 'Office of Clean Energy',    faLab: 'Lab' },
  { id: '8',  projectName: 'Carbon Capture Demonstration',       controlNumber: 'DE-0008-2025', status: 'Closed', office: 'Office of Fossil Energy',   faLab: 'FA'  },
  { id: '9',  projectName: 'Nuclear Microreactor Study',         controlNumber: 'DE-0009-2026', status: 'Active', office: 'Office of Nuclear Energy',  faLab: 'Lab' },
  { id: '10', projectName: 'EV Charging Infrastructure Grant',   controlNumber: 'DE-0010-2026', status: 'Active', office: 'Office of Clean Energy',    faLab: 'FA'  },
  { id: '11', projectName: 'Offshore Wind Feasibility Study',    controlNumber: 'DE-0011-2025', status: 'Closed', office: 'Office of Wind Energy',     faLab: 'Lab' },
  { id: '12', projectName: 'Smart Grid Analytics Platform',      controlNumber: 'DE-0012-2026', status: 'Active', office: 'Office of Electricity',     faLab: 'FA'  },
];

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './admin-projects.component.html',
})
export class AdminProjectsComponent {
  private router = inject(Router);
  readonly ChevronDown = ChevronDown;

  readonly statusOptions: ('All' | ProjectStatus)[] = ['All', 'Active', 'Closed'];
  readonly officeOptions = [
    'All Offices',
    'Office of Solar Energy',
    'Office of Wind Energy',
    'Office of Electricity',
    'Office of Clean Energy',
    'Office of Fossil Energy',
    'Office of Nuclear Energy',
  ];

  statusFilter = signal<'All' | ProjectStatus>('All');
  officeFilter = signal<string>('All Offices');

  statusOpen = signal(false);
  officeOpen = signal(false);

  filteredProjects = computed(() => {
    let items = [...mockAdminProjects];
    if (this.statusFilter() !== 'All') {
      items = items.filter(p => p.status === this.statusFilter());
    }
    if (this.officeFilter() !== 'All Offices') {
      items = items.filter(p => p.office === this.officeFilter());
    }
    return items;
  });

  toggleStatus() { this.statusOpen.update(v => !v); this.officeOpen.set(false); }
  toggleOffice() { this.officeOpen.update(v => !v); this.statusOpen.set(false); }

  setStatusFilter(val: 'All' | ProjectStatus) { this.statusFilter.set(val); this.statusOpen.set(false); }
  setOfficeFilter(val: string) { this.officeFilter.set(val); this.officeOpen.set(false); }

  goToProject(id: string) { this.router.navigate(['/admin/projects', id]); }

  getBadgeStyle(status: ProjectStatus): Record<string, string> {
    return status === 'Active'
      ? { background: '#ecfdf3', color: '#027a48' }
      : { background: '#f9fafb', color: '#344054' };
  }

  getDotStyle(status: ProjectStatus): Record<string, string> {
    return status === 'Active'
      ? { background: '#12b76a' }
      : { background: '#667085' };
  }
}
