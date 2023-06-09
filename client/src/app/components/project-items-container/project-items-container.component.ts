import { Component, OnInit } from '@angular/core';
import { ProjectModel, ProjectService } from '@app/core';
import { first } from 'rxjs';

@Component({
  selector: 'app-project-items-container',
  templateUrl: './project-items-container.component.html',
  styleUrls: ['./project-items-container.component.css']
})
export class ProjectItemsContainerComponent implements OnInit {
  projects: ProjectModel[] = [];
  projectInvitations: ProjectModel[] = [];
  loading = true;

  constructor(
    private projectApi: ProjectService
  ) { }

  ngOnInit(): void {
    this.getProjects();
  }

  private getProjects(): void {
    this.projectApi.getAllProjects().pipe(first()).subscribe(() => {
      this.loading = false;
    });
    this.projectApi.projects$.
      subscribe(res => {
        if (res.length > 0) {
          this.projects = res.sort((a: ProjectModel, b: ProjectModel) => {
            if (a.createdAt && b.createdAt
              && b.createdAt > a.createdAt) {
              return 1;
            } else return 0;
          });
        }
        this.getProjectInvitations()
      });
  }

  private getProjectInvitations(): void {
    this.projectApi.getProjectInvitations().pipe(first()).subscribe();
    this.projectApi.projectInvitations$.
      subscribe(projects => {
        this.projectInvitations = projects;
      });
  }
}
