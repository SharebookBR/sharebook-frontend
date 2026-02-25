import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  private _interval: any;

  start(): void {
    this.stop();
    this._interval = setInterval(() => {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0 },
        startVelocity: 35,
      });
    }, 400);
  }

  stop(): void {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }
}
