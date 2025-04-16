import { HavokPlugin, type Scene, Vector3 } from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';
import { injectable } from 'inversify';

/* 
Add following to the vite.config
optimizeDeps: {
    exclude: ['@babylonjs/havok'],
    },     
*/

@injectable()
export class PhysicsService {
  #havokPlugin?: HavokPlugin;
  public get havokPlugin() {
    if (!this.#havokPlugin) {
      throw Error(`havokPlugin is ${this.#havokPlugin}`);
    }
    return this.#havokPlugin;
  }

  public async init(scene: Scene) {
    const havokPhysics = await HavokPhysics(/* {
            locateFile: () => {
              const url = new URL(
                `../../../../node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm`,
                import.meta.url
              );
              return url.href;
            },
          } */);
    const gravityVector = new Vector3(0, -9.80665, 0);
    const havokPlugin = new HavokPlugin(true, havokPhysics);
    this.#havokPlugin = havokPlugin;
    scene.enablePhysics(gravityVector, havokPlugin);
    if (import.meta.env.VITE_DETERMINISTIC_LOCK_STEP) {
      havokPlugin.setTimeStep(1 / 60);
    }
  }
}
