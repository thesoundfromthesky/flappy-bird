import { injectable } from 'inversify';
import { SceneService } from './scene.service';
import { injectService } from '../injector/inject-service.function';
import type { Observable, Scene } from '@babylonjs/core';

@injectable()
export class DelayService {
  private readonly sceneService = injectService(SceneService);

  public delay(delayTime: number, cb: () => void) {
    let observable: Observable<Scene>;
    if (import.meta.env.VITE_DETERMINISTIC_LOCK_STEP) {
      observable = this.sceneService.scene.onBeforeStepObservable;
    } else {
      observable = this.sceneService.scene.onBeforeAnimationsObservable;
    }
    
    let acc = 0;
    const observer = observable.add(({ deltaTime }) => {
      if (deltaTime === undefined) {
        return;
      }

      acc += deltaTime;
      if (acc >= delayTime) {
        cb();
        observable.remove(observer);
      }
    });
  }
}
