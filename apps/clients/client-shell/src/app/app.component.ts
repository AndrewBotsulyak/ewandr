import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@ewandr-workspace/header';
import { NavbarComponent } from '@ewandr-workspace/navbar';

@Component({
  imports: [RouterModule, HeaderComponent, NavbarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client-shell';
}
