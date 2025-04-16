import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic';
import { Injector } from './injector/injector';
import { injectable } from 'inversify';
import { injectService } from './injector/inject-service.function';
import type { Class } from 'type-fest';
import { WorldLifeCycleService } from './core/world-life-cycle.service';
import { SceneService } from './core/scene.service';
import { FlappyBirdWorld } from './worlds/flappy-bird.world';

registerBuiltInLoaders();

const injector = new Injector();
injector.container.bind(Injector).toConstantValue(injector);

@injectable()
class App {
  private readonly injector = injectService(Injector);

  public createWorld<T extends object>(world: Class<T>) {
    this.injector.createInstance(world);
  }

  public createWorlds<T extends object>(worlds: Class<T>[]) {
    worlds.forEach((world) => {
      this.createWorld(world);
    });
  }
}

async function start<T extends object>(worlds: Class<T>[]) {
  const isEmpty = worlds.length < 1;
  if (isEmpty) {
    throw Error(`worlds have length ${worlds.length}.`);
  }

  const app = injector.createInstance(App);
  app.createWorlds(worlds);
  const worldLifeCycleService = injector.getService(WorldLifeCycleService);
  await worldLifeCycleService.notifyOnInitParallel();
  const sceneService = injector.getService(SceneService);
  sceneService.runRenderLoop();

  if (import.meta.env.DEV) {
    const imports = await Promise.all([
      import('@babylonjs/core/Helpers/sceneHelpers'),
      import('@babylonjs/core/Debug/debugLayer'),
      import('@babylonjs/inspector'),
    ]);

    const { Inspector } = imports[2];
    Inspector.Show(sceneService.scene, { embedMode: true });
  }
  sceneService.focusCanvas();
}

start([FlappyBirdWorld]);
