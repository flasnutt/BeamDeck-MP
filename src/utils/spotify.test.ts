import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDurationMs,
  clampSeekProgress,
  clampVolume,
  getNextRepeatMode
} from './spotify';

test('formatDurationMs formats mm:ss correctly', () => {
  assert.equal(formatDurationMs(0), '0:00');
  assert.equal(formatDurationMs(45000), '0:45');
  assert.equal(formatDurationMs(65000), '1:05');
  assert.equal(formatDurationMs(292000), '4:52');
  assert.equal(formatDurationMs(-500), '0:00');
});

test('clampSeekProgress restricts within 0 and durationMs', () => {
  const duration = 200000;
  assert.equal(clampSeekProgress(-50, duration), 0);
  assert.equal(clampSeekProgress(50000, duration), 50000);
  assert.equal(clampSeekProgress(250000, duration), 200000);
});

test('clampVolume clamps volume between 0 and 100', () => {
  assert.equal(clampVolume(-10), 0);
  assert.equal(clampVolume(75.4), 75);
  assert.equal(clampVolume(140), 100);
});

test('getNextRepeatMode cycles properly: off -> context -> track -> off', () => {
  assert.equal(getNextRepeatMode('off'), 'context');
  assert.equal(getNextRepeatMode('context'), 'track');
  assert.equal(getNextRepeatMode('track'), 'off');
});
