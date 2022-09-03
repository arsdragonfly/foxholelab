import { Directive, Input, OnInit, Self, TemplateRef } from '@angular/core';
import { Dropdown } from 'primeng/dropdown';
import { combineLatest, filter, first } from 'rxjs';

import { IdType } from '~/models';
import { ContentService } from '~/services';

@Directive({
  selector: '[labDropdownIconText]',
})
export class DropdownIconTextDirective implements OnInit {
  @Input() labDropdownIconText: IdType | '' | undefined;

  constructor(
    @Self() private readonly pDropdown: Dropdown,
    private contentSvc: ContentService
  ) {}

  ngOnInit(): void {
    this.pDropdown.appendTo = 'body';
    this.pDropdown.filter = true;
    this.pDropdown.scrollHeight = '40vh';
    const templates$ =
      this.labDropdownIconText === 'recipe'
        ? [
            this.contentSvc.iconTextSelectedRecipe$.pipe(
              filter((t): t is TemplateRef<any> => t != null)
            ),
            this.contentSvc.iconTextRecipe$.pipe(
              filter((t): t is TemplateRef<any> => t != null)
            ),
          ]
        : [
            this.contentSvc.iconTextSelectedItem$.pipe(
              filter((t): t is TemplateRef<any> => t != null)
            ),
            this.contentSvc.iconTextItem$.pipe(
              filter((t): t is TemplateRef<any> => t != null)
            ),
          ];
    combineLatest(templates$)
      .pipe(first())
      .subscribe(([selectedItemTemplate, itemTemplate]) => {
        this.pDropdown.selectedItemTemplate = selectedItemTemplate;
        this.pDropdown.itemTemplate = itemTemplate;
      });
  }
}