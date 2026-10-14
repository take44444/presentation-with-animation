# Production motion review

Status: **PASS for recorded engineering scenarios**. Participant comfort is deferred.

Environment: headless Linux; Node 24.17.0; Playwright 1.64.0; Next 16.4.0 production
build; GSAP 3.15.0. Actual Chromium, Firefox and WebKit run at 1280×720, 1920×1080
and 390×844. Normal motion remains enabled; traces and successful videos are retained.

## Opening frame measurements

Times are milliseconds after the first enhanced frame. First appearance uses computed
opacity >0.02; every project shows title before attribution before cue. A stalled
interval is an actual adjacent animation-frame gap >100 ms; its whole interval counts
against continuity. The threshold remains ≥95% without such a stall.

| Project          | First title | First attribution | First cue | Observed ms | Stalled ms | Continuity |
| ---------------- | ----------- | ----------------- | --------- | ----------- | ---------- | ---------- |
| chromium-desktop | 300.0       | 950.0             | 1350.0    | 3516.6      | 0.0        | 100.00%    |
| chromium-large   | 300.0       | 933.3             | 1333.3    | 3516.5      | 0.0        | 100.00%    |
| chromium-mobile  | 283.4       | 933.3             | 1333.3    | 3516.6      | 0.0        | 100.00%    |
| firefox-desktop  | 300.1       | 950.8             | 1350.3    | 3500.2      | 0.0        | 100.00%    |
| firefox-large    | 300.1       | 949.6             | 1350.2    | 3500.1      | 0.0        | 100.00%    |
| firefox-mobile   | 299.8       | 950.0             | 1350.1    | 3500.1      | 0.0        | 100.00%    |
| webkit-desktop   | 266.0       | 910.0             | 1296.0    | 3505.0      | 0.0        | 100.00%    |
| webkit-large     | 261.0       | 889.0             | 1300.0    | 3508.0      | 0.0        | 100.00%    |
| webkit-mobile    | 266.0       | 910.0             | 1316.0    | 3509.0      | 0.0        | 100.00%    |

## Transition/frame review

Six native adjacent paths were sampled in each of six desktop browser/viewport
projects (36 path recordings). Every forward outgoing wrapper moved
upward while fading; every backward wrapper moved downward while fading. Shared
parent opacity remained exactly 1 throughout both explanation/principles directions.
The largest adjacent displacement while both outgoing samples were visibly active
was 40.12 px. Pose-preservation assertions cover real input during
opening, and repeated round trips verify settled restoration without relative drift.

Opening and transition observation total: **47.849 seconds**.
Intervals over 100 ms total: **1.650 seconds**.
SC-004 continuity calculation: `100 × (1 − 1650.0 / 47849.2)`
= **96.55%**, above the required 95%.

Reviewed captured opening, principles and tips frames: exact content remains readable;
examples retain their arrangement; cards fit within both desktop viewports; cue is
outside teaching text and absent on the final slide. The recorded transform sequence
has bounded travel and no initialization reset or accumulated resting rotation.

## Retained artifacts and reproduction

- Full report: `playwright-report/index.html`, `test-results/results.json`.
- Opening clips: `test-results/motion-opening-*/video.webm`, `trace.zip`, `opening.png`;
  `motion-frames.json` is attached within the JSON/HTML report and trace archive.
- Transition clips: `test-results/motion-six-*/video.webm`, `trace.zip`,
  `transition-frames.json`, `scene-1.png` through `scene-6.png` for desktop projects;
  mobile projects retain `flow-tips.png`.
- Permanent measured summary: [motion-summary.json](motion-summary.json).
- Reproduce: `npm run test:e2e`; config builds production first and owns its server.

An earlier concurrent-work sample narrowly missed the threshold; it is recorded in
implementation evidence and was not accepted. The final isolated matrix passes all
117 scenarios, with zero skips or retries. Human SC-002/SC-005 studies remain deferred
and are not inferred from these recordings.
