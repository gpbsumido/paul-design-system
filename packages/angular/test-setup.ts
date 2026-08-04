// Angular components in this package are compiled by plain `tsc` (see
// tsconfig.json), so they are JIT-compiled at runtime — which means the tests
// need @angular/compiler loaded before any component class is touched.
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach } from 'vitest';

TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

// Every spec builds its own module through `renderComponent`; resetting here
// keeps a fixture's providers (and its rAF loops) from leaking into the next.
afterEach(() => {
  TestBed.resetTestingModule();
});
