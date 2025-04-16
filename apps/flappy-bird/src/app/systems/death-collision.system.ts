import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import type { BirdEntityArchetype } from '../entities/bird.entity';
import type { PipeEntityArchetype } from '../entities/pipe.entity';
import { SceneService } from '../core/scene.service';
import { GroundEntityArchetype } from '../entities/ground.entity';
import { PhysicsService } from '../core/physics.service';

@injectable()
export class DeathCollisionSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly birdQuery = this.worldService
    .getWorld<BirdEntityArchetype>()
    .with('collider');
  private readonly pipeQuery = this.worldService
    .getWorld<PipeEntityArchetype>()
    .with('pipe');
  private readonly groundQuery = this.worldService
    .getWorld<GroundEntityArchetype>()
    .with('ground');
  private readonly physicsService = injectService(PhysicsService);

  public constructor() {
    this.init();
  }

  private init() {
    this.physicsService.havokPlugin.onCollisionObservable.add(
      ({ collider, collidedAgainst }) => {
        for (const { collider: bird } of this.birdQuery) {
          for (const { pipe } of this.pipeQuery) {
            if (
              bird.physicsBody === collider &&
              collidedAgainst === pipe.physicsBody
            ) {
              this.sceneService.stopRenderLoop();
              return;
            }
          }

          for (const { ground } of this.groundQuery) {
            if (
              bird.physicsBody === collider &&
              collidedAgainst === ground.physicsBody
            ) {
              setTimeout(() => {
                this.sceneService.stopRenderLoop();
              }, 400);
              return;
            }
          }
        }
      }
    );
  }
}
