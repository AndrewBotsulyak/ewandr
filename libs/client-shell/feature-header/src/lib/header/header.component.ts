import {Component, DOCUMENT, inject, OnInit, Renderer2, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {CheckPlatformService} from "@ewandr-workspace/client-core";
import {RouterLink} from "@angular/router";
import {GqlDataService} from "@ewandr-workspace/data-access-graphql";

@Component({
  selector: 'lib-header',
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private checkPlatform = inject(CheckPlatformService);
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  private gqlService = inject(GqlDataService);

  private defaultTheme = 'light';
  public themes = signal(['light', 'dark']);

  ngOnInit() {
    if (this.checkPlatform.isServer()) {
      return;
    }

    this.renderer.addClass(this.document.body, this.defaultTheme);
  }
}
