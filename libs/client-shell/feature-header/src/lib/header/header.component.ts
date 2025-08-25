import {Component, DOCUMENT, inject, OnInit, Renderer2, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatMiniFabButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {CheckPlatformService} from "@ewandr-workspace/client-core";

@Component({
  selector: 'lib-header',
  imports: [
    CommonModule,
    MatMiniFabButton,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private checkPlatform = inject(CheckPlatformService);
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  private defaultTheme = 'ocean';
  public themes = signal(['light', 'dark', 'ocean', 'forest', 'sunset', 'neon']);

  ngOnInit() {
    if (this.checkPlatform.isServer()) {
      return;
    }

    this.renderer.addClass(this.document.body, this.defaultTheme);
  }

  public handleThemeClick(theme: string) {
    if (this.checkPlatform.isServer()) {
      return;
    }

    const bodyClasses = Array.from(this.document.body.classList);
    const currentClass = bodyClasses
      .find((item) =>
        this.themes().find((theme) => theme === item)) ?? this.defaultTheme;

    this.renderer.removeClass(this.document.body, currentClass);
    this.renderer.addClass(this.document.body, theme);
  }

}
