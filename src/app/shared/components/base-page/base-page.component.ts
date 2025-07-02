import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-base-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './base-page.component.html',
  styleUrl: './base-page.component.scss'
})
export class BasePageComponent {
  @Input() headerTitle: string = '';
  @Input() infoText: string = '';
  @Input() contentTitle: string = '';
  @Input() contentInfo: string = '';

  @Input() showBackButton: boolean = false;
  @Input() backButtonText: string = 'Volver';
  @Input() backButtonRoute: string = '';
  @Input() backButtonTooltip: string = 'Volver';

  @Input() showHeader: boolean = true;
  @Input() showInfo: boolean = true;
  @Input() showActions: boolean = true;
  @Input() showContentTitle: boolean = false;
  @Input() showContentInfo: boolean = false;
  @Input() showBorder: boolean = true;
}
