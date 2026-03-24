'use strict';
// Simple ETL pipeline — chain transform, filter, and reduce steps

class Pipeline {
  constructor() {
    this.steps = [];
    this.errors = [];
  }

  transform(fn) {
    if (typeof fn !== 'function') throw new TypeError('Step must be a function');
    this.steps.push({ type: 'transform', fn });
    return this;
  }

  filter(predicate) {
    if (typeof predicate !== 'function') throw new TypeError('Predicate must be a function');
    this.steps.push({ type: 'filter', fn: predicate });
    return this;
  }

  async run(data) {
    if (!Array.isArray(data)) throw new TypeError('Input must be an array');
    let result = [...data];
    for (const step of this.steps) {
      try {
        if (step.type === 'filter') {
          result = result.filter(step.fn);
        } else {
          result = await Promise.all(result.map(step.fn));
        }
      } catch (err) {
        this.errors.push({ step: step.type, message: err.message });
      }
    }
    return result;
  }

  stats(input, output) {
    return {
      input: input.length,
      output: output.length,
      dropped: input.length - output.length,
      steps: this.steps.length,
      errors: this.errors.length,
    };
  }

  reset() {
    this.steps = [];
    this.errors = [];
    return this;
  }
}

module.exports = Pipeline;
