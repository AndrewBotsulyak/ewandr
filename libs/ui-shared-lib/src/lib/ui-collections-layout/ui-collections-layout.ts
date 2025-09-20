import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {UiCollectionItemComponent} from "../ui-collection-item/ui-collection-item.component";
import {GetCollectionQuery} from "@ewandr-workspace/data-access-graphql";

@Component({
  selector: 'ui-collections-layout',
    imports: [
        UiCollectionItemComponent
    ],
  templateUrl: './ui-collections-layout.html',
  styleUrl: './ui-collections-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCollectionsLayout {
  collection = input<GetCollectionQuery['collection']>()
}
