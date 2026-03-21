/* START Timer Class */
class Timer {
  constructor() {
	this.seconds = 0;
	this.interval = null;
	this.timeUpdateCallback = null;
  }

  start() {
	if (this.interval) {
	  console.warn('Timer is already running.');
	  return;
	}
	this.interval = setInterval(() => {
	  this.seconds++;
	  if (this.timeUpdateCallback) {
		this.timeUpdateCallback(this.seconds);
	  }
	}, 1000);
  }

  stop() {
	if (!this.interval) {
	  console.warn('Timer is not running.');
	  return;
	}
	clearInterval(this.interval);
	this.interval = null;
  }

  reset() {
	this.stop();
	this.seconds = 0;
  }

  value() {
	return this.seconds;
  }

  setTimeUpdateCallback(callback) {
	if (typeof callback === 'function') {
	  this.timeUpdateCallback = callback;
	} else {
	  console.error('Provided callback is not a function.');
	}
  }

  clearTimeUpdateCallback() {
	this.timeUpdateCallback = null;
  }
}
/* END Timer Class */

const timer = new Timer();
timer.setTimeUpdateCallback(() => {
	updateGoldDisplay();
	saveGame();
});
