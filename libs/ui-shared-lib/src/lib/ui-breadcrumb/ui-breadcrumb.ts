import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {CollectionBreadcrumb} from "@ewandr-workspace/data-access-graphql";
import {RoutesConstants} from "@ewandr-workspace/core";

@Component({
  selector: 'ui-breadcrumb',
  imports: [
    RouterLink
  ],
  templateUrl: './ui-breadcrumb.html',
  styleUrl: './ui-breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiBreadcrumb {
  breadcrumbs = input<CollectionBreadcrumb[]>();

  RoutesConstants = RoutesConstants;
}
