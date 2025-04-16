import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import type { BirdEntityArchetype } from '../entities/bird.entity';
import { SceneService } from '../core/scene.service';
import { Axis, Quaternion, Tools, Vector3 } from '@babylonjs/core';

@injectable()
export class StateSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  private readonly birdQuery = this.worldService
    .getWorld<BirdEntityArchetype>()
    .with('bird', 'collider', 'sprite', 'state');

  public constructor() {
    this.init();
  }

  private init() {
    const linearVelocity = Vector3.Zero();
    this.sceneService.scene.onBeforeStepObservable.add(() => {
      for (const { collider, state, sprite } of this.birdQuery) {
        collider.position.x = 0;
        collider.position.z = 0;
        const { rotationQuaternion, physicsBody } = collider;
        if (rotationQuaternion && physicsBody) {
          physicsBody.setAngularVelocity(Vector3.ZeroReadOnly);
          physicsBody.getLinearVelocityToRef(linearVelocity);
          if (state.isJumping) {
            const angle = Tools.ToRadians(30);
            Quaternion.RotationAxisToRef(Axis.Z, angle, rotationQuaternion);
            sprite.angle = angle;

            if (linearVelocity.y < -2) {
              state.isJumping = false;
              state.isFalling = true;
            }
          } else if (state.isFalling) {
            const angle = Tools.ToRadians(-30);
            Quaternion.RotationAxisToRef(Axis.Z, angle, rotationQuaternion);
            sprite.angle = angle;
          }
        }
      }
    });
  }
}
