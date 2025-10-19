import { Directive, Input, OnInit } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

/**
 * Custom tooltip directive that wraps Material's matTooltip with custom styling.
 * Uses the same API as matTooltip but applies custom CSS classes.
 *
 * @example
 * <button uiTooltip="Clear search">Clear</button>
 * <button uiTooltip="Delete item" uiTooltipPosition="below">Delete</button>
 */
@Directive({
  selector: '[uiTooltip]',
  standalone: true,
  hostDirectives: [
    {
      directive: MatTooltip,
      inputs: ['matTooltipPosition: uiTooltipPosition', 'matTooltipDisabled: uiTooltipDisabled']
    }
  ]
})
export class UiTooltipDirective implements OnInit {
  @Input() uiTooltip = '';

  constructor(private matTooltip: MatTooltip) {}

  ngOnInit(): void {
    // Set the tooltip message
    this.matTooltip.message = this.uiTooltip;

    // Apply custom CSS class for styling
    this.matTooltip.tooltipClass = 'ui-custom-tooltip';
  }
}