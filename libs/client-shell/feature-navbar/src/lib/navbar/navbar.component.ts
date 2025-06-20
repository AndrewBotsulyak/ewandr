import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonUI} from "@ewandr-workspace/ui-shared-lib";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'lib-navbar',
  imports: [CommonModule, MatButtonUI, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {}
