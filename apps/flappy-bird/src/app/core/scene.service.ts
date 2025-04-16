import { injectable } from 'inversify';
import { EngineService } from './engine.service';
import { Scene, ScenePerformancePriority } from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';

@injectable()
export class SceneService {
  private readonly engineService = injectService(EngineService);
  public readonly scene = this.createScene();

  public constructor() {
    this.render = this.render.bind(this);
  }

  private createScene() {
    const scene = new Scene(this.engineService.engine);
    scene.performancePriority = ScenePerformancePriority.Intermediate;
    scene.freezeActiveMeshes(true);
    return scene;
  }

  private render(): void {
    this.scene.render();
  }

  public runRenderLoop(): void {
    this.engineService.engine.runRenderLoop(this.render);
  }

  public stopRenderLoop(): void {
    this.engineService.engine.stopRenderLoop(this.render);
  }

  public focusCanvas() {
    this.engineService.engine.getRenderingCanvas()?.focus();
  }
}
