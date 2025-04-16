import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { Injector } from '../injector/injector';
import { WorldLifeCycleService } from '../core/world-life-cycle.service';
import { ArcRotateCameraEntity } from '../entities/cameras/arc-rotate-camera-entity';
import { HemisphericLightEntity } from '../entities/lights/hemispheric-light.entity';
import { SpritePackedManagerService } from '../core/sprite-packed-manager.service';
import { FlappyBird } from '../assets/flappy-bird.enum';
import { SpritePackedManager } from '@babylonjs/core';
import { SceneService } from '../core/scene.service';
import { BackgroundEntity } from '../entities/background.entity';
import { GroundEntity } from '../entities/ground.entity';
import { BirdEntity } from '../entities/bird.entity';
import { InputActionService } from '../core/input-action.service';
import { JumpSystem } from '../systems/jump.system';
import { PipeEntity } from '../entities/pipe.entity';
import { DeathCollisionSystem } from '../systems/death-collision.system';
import { PhysicsService } from '../core/physics.service';
import { StateSystem } from '../systems/state.system';

@injectable()
export class FlappyBirdWorld {
  private readonly injector = injectService(Injector);
  private readonly worldLifeCycleService = injectService(WorldLifeCycleService);
  private readonly spritePackedManagerService = injectService(
    SpritePackedManagerService
  );
  private readonly sceneService = injectService(SceneService);
  private readonly inputActionService = injectService(InputActionService);
  private readonly physicsService = injectService(PhysicsService);

  public constructor() {
    this.worldLifeCycleService.onInitObservable.add(async () => {
      await this.init();
    });
  }

  private async init() {
    await this.physicsService.init(this.sceneService.scene);
    this.initInputAction();
    this.initSpritePackedManager();
    this.initEntities();
  }

  private initInputAction() {
    this.inputActionService.setInputAxis({ Space: { action: 'jump' } });
  }

  private initSpritePackedManager() {
    const flappyBirdSpritePackedManager =
      this.createFlappyBirdSpritePackedManager();
    this.spritePackedManagerService.setSpritePackedManager(
      FlappyBird.SpritePackedManagerName,
      flappyBirdSpritePackedManager
    );
  }
  private createFlappyBirdSpritePackedManager() {
    const { scene } = this.sceneService;
    const spritePackedManager = new SpritePackedManager(
      FlappyBird.SpritePackedManagerName,
      FlappyBird.TextureUrl,
      FlappyBird.Capacity,
      scene
    );

    return spritePackedManager;
  }

  private initEntities() {
    this.injector.createInstances([
      ArcRotateCameraEntity,
      HemisphericLightEntity,
      BackgroundEntity,
      GroundEntity,
      BirdEntity,
      PipeEntity,
      JumpSystem,
      DeathCollisionSystem,
      StateSystem
    ]);
  }
}
