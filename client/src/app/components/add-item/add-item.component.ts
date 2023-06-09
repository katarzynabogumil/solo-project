import { Component, Input, OnInit } from '@angular/core';
import { EmptyProject, ExpenseService, ProjectModel } from '@app/core';
import { OpenAiService } from 'src/app/core/services/openai.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  @Input() item = '';
  @Input() project: ProjectModel = EmptyProject;
  @Input() link = '';
  compareMode = false;
  categories = '';

  constructor(
    private expenseApi: ExpenseService,
    private aiApi: OpenAiService
  ) { }

  ngOnInit(): void {
    this.expenseApi.compareMode$.subscribe((isTrue: boolean) => this.compareMode = isTrue);
    if (this.item === 'an expense' && this.project.id) {
      this.aiApi.missingCategories$.subscribe((cats: { [key: number]: string }) => {
        const id = this.project.id;
        if (cats[id]) this.categories = cats[id];
      });
    }
  }
}
