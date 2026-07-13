#!/usr/bin/env node
import { execSync } from 'node:child_process';

// Compile TypeScript to build/
execSync('npx tsc', { stdio: 'inherit' });
