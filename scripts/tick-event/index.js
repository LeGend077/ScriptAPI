// Script example for ScriptAPI
// Author: Jayly#1397 <Jayly Discord>
// Project: https://github.com/JaylyDev/ScriptAPI
import { system, TickEvent } from "@minecraft/server";

let lastTick = NaN;
/**
 * @type {((event: TickEvent) => void)[]}
 */
const callbacks = [];

system.runInterval(() => {
  const { currentTick } = system;
  const deltaTime = (Date.now() - lastTick) / 1000;
  lastTick = Date.now();

  for (const callback of callbacks) {
    callback({ deltaTime, currentTick });
  };
});

export class TickEventSignal {
  /**
   * @param {(event: TickEvent) => void} callback
   */
  subscribe (callback) {
    callbacks.push(callback);
    return callback;
  }
  /**
   * @param {(event: TickEvent) => void} callback
   */
  unsubscribe (callback) {
    const index = callbacks.indexOf(callback);
    callbacks.splice(index, 1);
  }
};

export const tick = new TickEventSignal();
