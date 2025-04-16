import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { SpritePackedManagerService } from '../core/sprite-packed-manager.service';
import { FlappyBird } from '../assets/flappy-bird.enum';
import {
  CreateSphere,
  PhysicsAggregate,
  PhysicsMotionType,
  PhysicsShapeType,
  StandardMaterial,
  type Sprite,
} from '@babylonjs/core';
import { WorldService } from '../core/world.service';
import { BirdComponent } from '../components/bird.component';
import { ColliderComponent } from '../components/collider.component';
import { SpriteComponent } from '../components/sprite.component';
import { StateComponent } from '../components/state.component';
import { SceneService } from '../core/scene.service';

export type BirdEntityArchetype = BirdComponent &
  ColliderComponent &
  StateComponent &
  SpriteComponent;

@injectable()
export class BirdEntity {
  private readonly spritePackedManagerService = injectService(
    SpritePackedManagerService
  );
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  #entity?: BirdEntityArchetype;
  public get entity() {
    if (this.#entity) {
      return this.#entity;
    }
    throw Error(`this.#entity is ${this.#entity}`);
  }
  public set entity(value) {
    this.#entity = value;
  }

  public constructor() {
    this.init();
  }

  private init() {
    this.initEntity();
  }

  private initEntity() {
    const { bird } = this.createBirdComponent();
    const { sprite } = this.createSpriteComponent();
    const { collider } = this.createColliderComponent(sprite);
    const { state } = this.createStateComponent();

    this.entity = this.worldService.getWorld<BirdEntityArchetype>().add({
      bird,
      sprite,
      collider,
      state,
    });
  }

  private createBirdComponent() {
    return new BirdComponent(this);
  }

  private createColliderComponent(sprite: Sprite) {
    const yellowBirdColliderMaterial = new StandardMaterial(
      'yellow_bird_collider'
    );

    yellowBirdColliderMaterial.alpha = import.meta.env.DEV ? 0.3 : 0;

    const yellowBirdCollider = CreateSphere('yellow_bird_collider', {
      diameterX: sprite.width,
      diameterY: sprite.height,
      diameterZ: sprite.height,
    });
    yellowBirdCollider.material = yellowBirdColliderMaterial;
    yellowBirdCollider.position = sprite.position;

    const physicsAggregate = new PhysicsAggregate(
      yellowBirdCollider,
      PhysicsShapeType.CONVEX_HULL,
      {
        mass: 1,
        restitution: 0,
      },
      this.sceneService.scene
    );
    physicsAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
    physicsAggregate.body.disablePreStep = false;
    physicsAggregate.body.setCollisionCallbackEnabled(true);
    return new ColliderComponent(yellowBirdCollider);
  }

  private createSpriteComponent() {
    const yellowBirdSprite = this.spritePackedManagerService.createSprite(
      'yellow_bird',
      FlappyBird.SpritePackedManagerName
    );
    yellowBirdSprite.cellRef = FlappyBird.yellowBird;
    yellowBirdSprite.width = 0.34 * 0.5;
    yellowBirdSprite.height = 0.24 * 0.5;
    yellowBirdSprite.playAnimation(3, 5, true, 100);

    return new SpriteComponent(yellowBirdSprite);
  }

  private createStateComponent() {
    return new StateComponent({ isJumping: false, isFalling: false });
  }

  public rotate(angle: number) {
    const { collider, sprite } = this.entity;
    collider.rotation.z = angle;
    sprite.angle = angle;
  }
}
