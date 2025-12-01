import {inject, Injectable} from "@angular/core";
import {PreloadingStrategy, Route} from "@angular/router";
import {EMPTY, Observable} from "rxjs";
import {WINDOW_TOKEN} from "../di-tokens";
import {CheckPlatformService} from "./check-platform.service";

export type CustomPreloadT = boolean | 'high' | 'low';

export interface PreloadConfig {
  preload: CustomPreloadT;
  delay?: number; // load delay with ms
  networkAware?: boolean; // Consider network conditions
}

interface QueueItem {
  route: Route;
  load: Function;
  priority: 'high' | 'low';
  config: PreloadConfig;
}

@Injectable({ providedIn: 'root' })
export class SmartIdlePreloadingStrategy implements PreloadingStrategy {
  private window = inject(WINDOW_TOKEN);
  private platformService = inject(CheckPlatformService);

  private highPriorityQueue: QueueItem[] = [];
  private lowPriorityQueue: QueueItem[] = [];
  private isProcessing = false;
  private loadedRoutes = new Set<string>();

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Skip preloading on server-side rendering
    if (this.platformService.isServer()) {
      return EMPTY;
    }

    const config = this.getPreloadConfig(route);

    if (!config || config.preload === false) {
      return EMPTY;
    }

    // Check if already loaded
    const routePath = route.path || '';
    if (this.loadedRoutes.has(routePath)) {
      return EMPTY;
    }

    const priority = config.preload === 'high' ? 'high' : 'low';
    const item: QueueItem = {
      route,
      load,
      priority,
      config
    };

    // Add to the corresponding queue
    if (priority === 'high') {
      this.highPriorityQueue.push(item);
    } else {
      this.lowPriorityQueue.push(item);
    }

    if (!this.isProcessing) {
      this.startProcessing();
    }

    return EMPTY;
  }

  private getPreloadConfig(route: Route): PreloadConfig | null {
    const data: CustomPreloadT = route.data?.['preload'];

    if (!data) return null;

    if (typeof data === 'boolean' || typeof data === 'string') {
      return { preload: data };
    }

    return data as PreloadConfig;
  }

  private startProcessing(): void {
    this.isProcessing = true;
    this.processNextInQueue();
  }

  private processNextInQueue(): void {
    // Check if we have something to load
    if (this.highPriorityQueue.length === 0 && this.lowPriorityQueue.length === 0) {
      this.isProcessing = false;
      console.log('[Preload] All routes loaded');
      return;
    }

    // Take the next element (priority - highPriorityQueue)
    const next = this.highPriorityQueue.length > 0
      ? this.highPriorityQueue.shift()
      : this.lowPriorityQueue.shift();

    if (!next) return;

    // check network conditions if specified
    if (next.config.networkAware && !this.isGoodNetwork()) {
      console.log(`[Preload] Skipping ${next.route.path} - poor network`);
      // Use setTimeout to avoid synchronous recursion stack overflow
      setTimeout(() => this.processNextInQueue(), 0);
      return;
    }

    // add delay if specified
    const delay = next.config.delay || 0;

    setTimeout(() => {
      this.loadRoute(next);
    }, delay);
  }

  private loadRoute(item: QueueItem): void {
    this.requestIdleCallback(() => {
      const routePath = item.route.path || '';

      console.log(
        `[${item.priority.toUpperCase()} Priority] Loading: ${routePath}`
      );

      item.load().subscribe({
        next: () => {
          this.loadedRoutes.add(routePath);
          console.log(`[Preload] ✓ Loaded: ${routePath}`);
          this.processNextInQueue();
        },
        error: (err: Error) => {
          console.error(`[Preload] ✗ Failed: ${routePath}`, err);
          this.processNextInQueue();
        }
      });
    });
  }

  private isGoodNetwork(): boolean {
    // Check if navigator is available (browser only)
    if (typeof navigator === 'undefined') {
      return true; // Assume good network on server
    }

    const connection = (navigator as any).connection;

    if (!connection) return true;

    // Data saver is turned on
    if (connection.saveData) return false;

    // slow connection
    const slowConnections = ['slow-2g', '2g', '3g'];
    if (slowConnections.includes(connection.effectiveType))
      return false;

    return true;
  }

  private requestIdleCallback(callback: () => void): void {
    if (this.window !== null && 'requestIdleCallback' in this.window) {
      this.window.requestIdleCallback(callback, { timeout: 5000 });
    } else {
      setTimeout(callback, 100);
    }
  }
}
