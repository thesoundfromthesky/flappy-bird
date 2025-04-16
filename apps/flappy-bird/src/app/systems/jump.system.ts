import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { InputActionService } from '../core/input-action.service';
import { WorldService } from '../core/world.service';
import type { BirdEntityArchetype } from '../entities/bird.entity';
import { Vector3 } from '@babylonjs/core';

@injectable()
export class JumpSystem {
  private readonly inputActionService = injectService(InputActionService);
  private readonly worldService = injectService(WorldService);
  private readonly birdQuery = this.worldService
    .getWorld<BirdEntityArchetype>()
    .with('bird', 'collider', 'sprite', 'state');

  public constructor() {
    this.init();
  }

  private init() {
    const force = new Vector3(0, 2, 0);
    this.inputActionService.inputActionObservable.add(({ jump }) => {
      if (jump) {
        for (const { collider, state } of this.birdQuery) {
          state.isJumping = true;
          if (collider.physicsBody) {
            collider.physicsBody.setLinearVelocity(force);
          }
        }
      }
    });
  }
}
