import { Component, OnInit } from '@angular/core';
import { EmptyProject, ProjectModel, ProjectService, ExpenseService, ApiResponseProjectModel } from '@app/core';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css']
})
export class ProjectDashboardComponent implements OnInit {
  id: number = -1;
  project: ProjectModel = EmptyProject;

  constructor(
    private auth: AuthService, 
    public expenseApi: ExpenseService,
    public projectApi: ProjectService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.params['id']);
    this.getProject(this.id);
  }

  getProject(id: number) {
    this.projectApi.getProject(id).subscribe();
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      this.project = p;
    });
  }
}
