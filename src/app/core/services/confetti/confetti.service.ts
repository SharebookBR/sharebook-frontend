import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({ providedIn: 'root' })
export class ConfettiService {
  private _interval: any;

  start(): void {
    this.stop();
    this._interval = setInterval(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        angle: 60,
        origin: { x: 0, y: 0.65 },
        startVelocity: 55,
      });
      confetti({
        particleCount: 80,
        spread: 100,
        angle: 120,
        origin: { x: 1, y: 0.65 },
        startVelocity: 55,
      });
    }, 600);
  }

  stop(): void {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }
}
