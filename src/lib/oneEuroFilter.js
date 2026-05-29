class LowPassFilter {
  constructor(alpha) {
    this.alpha = alpha;
    this.y = null;
  }

  filter(value) {
    if (this.y === null) {
      this.y = value;
    } else {
      this.y = this.alpha * value + (1.0 - this.alpha) * this.y;
    }
    return this.y;
  }

  reset() {
    this.y = null;
  }
}

export class OneEuroFilter {
  constructor(minCutoff = 1.0, beta = 0.007, dCutoff = 1.0) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this.xFilter = new LowPassFilter(0);
    this.dxFilter = new LowPassFilter(0);
    this.lastTime = null;
  }

  filter(value, timestamp) {
    if (this.lastTime === null || !timestamp) {
      this.lastTime = timestamp || Date.now();
      return this.xFilter.filter(value);
    }

    const dt = (timestamp - this.lastTime) / 1000.0;
    this.lastTime = timestamp;

    if (dt <= 0) {
      return this.xFilter.filter(value);
    }

    // Calculate rate of change (derivative)
    const prevX = this.xFilter.y;
    const dx = prevX !== null ? (value - prevX) / dt : 0;

    // Filter rate of change
    const dAlpha = 1.0 / (1.0 + this.dCutoff / (2.0 * Math.PI * dt));
    this.dxFilter.alpha = dAlpha;
    const filteredDx = this.dxFilter.filter(dx);

    // Calculate adaptive cutoff frequency based on rate of change
    const cutoff = this.minCutoff + this.beta * Math.abs(filteredDx);

    // Calculate alpha for filtering coordinates
    const alpha = 1.0 / (1.0 + cutoff / (2.0 * Math.PI * dt));
    this.xFilter.alpha = alpha;

    return this.xFilter.filter(value);
  }

  reset() {
    this.xFilter.reset();
    this.dxFilter.reset();
    this.lastTime = null;
  }
}

export class LandmarkFilterSet {
  constructor(count = 33, minCutoff = 1.0, beta = 0.007, dCutoff = 1.0) {
    this.filters = Array.from({ length: count }, () => ({
      x: new OneEuroFilter(minCutoff, beta, dCutoff),
      y: new OneEuroFilter(minCutoff, beta, dCutoff),
      z: new OneEuroFilter(minCutoff, beta, dCutoff),
      visibility: new OneEuroFilter(minCutoff, beta, dCutoff)
    }));
  }

  filter(landmarks, timestamp) {
    if (!landmarks) return null;
    const ts = timestamp || Date.now();
    return landmarks.map((lm, idx) => {
      const f = this.filters[idx];
      return {
        x: f.x.filter(lm.x, ts),
        y: f.y.filter(lm.y, ts),
        z: f.z.filter(lm.z, ts),
        visibility: lm.visibility !== undefined ? f.visibility.filter(lm.visibility, ts) : lm.visibility
      };
    });
  }

  reset() {
    this.filters.forEach(f => {
      f.x.reset();
      f.y.reset();
      f.z.reset();
      f.visibility.reset();
    });
  }
}

export function createLandmarkFilters(count = 33) {
  // Balanced default coefficients for human skeleton tracking
  return new LandmarkFilterSet(count, 0.5, 0.005, 1.0);
}
