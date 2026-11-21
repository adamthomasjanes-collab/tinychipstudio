import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser', timeout: 60000, expect: { timeout: 8000, toHaveScreenshot: { animations:'disabled', maxDiffPixelRatio:0.003 } },
  fullyParallel: true, workers: 3, retries: 0,
  outputDir: 'test-results/playwright',
  reporter: [['list'], ['html', { outputFolder:'playwright-report', open:'never' }], ['json', { outputFile:'test-results/qa-results.json' }]],
  snapshotPathTemplate: process.env.QA_CANDIDATES === '1' ? 'test-results/visual-candidates/{projectName}/{testFilePath}/{arg}{ext}' : '{testDir}/snapshots/{projectName}/{testFilePath}/{arg}{ext}',
  use: { baseURL:process.env.QA_BASE_URL || 'http://localhost:4294', reducedMotion:'reduce', trace:'retain-on-failure', screenshot:'only-on-failure', video:'off' },
  projects: [
    {name:'chromium-phone', use:{browserName:'chromium',viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}},
    {name:'webkit-phone', use:{browserName:'webkit',viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}},
    {name:'chromium-tablet', use:{browserName:'chromium',viewport:{width:820,height:1180},isMobile:true,hasTouch:true,deviceScaleFactor:2}},
    {name:'webkit-tablet', use:{browserName:'webkit',viewport:{width:820,height:1180},isMobile:true,hasTouch:true,deviceScaleFactor:2}},
    {name:'chromium-desktop', use:{browserName:'chromium',viewport:{width:1440,height:1000},deviceScaleFactor:1}},
  ],
  webServer:process.env.QA_BASE_URL ? undefined : {command:'node node_modules/vite/bin/vite.js preview --port 4294 --strictPort',url:'http://localhost:4294',reuseExistingServer:!process.env.CI,timeout:30000},
});
