
class Profiler {
  constructor(label) {
    this.label = label;
    this.lastTime = null;
  }

  start() {
    this.lastTime = process.hrtime();
  }

  end() {
    const diff = process.hrtime(this.lastTime);

    console.log(`
    timer ${this.label} took ${diff[0]} seconds and ${diff[1]}
      nano seconds
    `)
  }
}