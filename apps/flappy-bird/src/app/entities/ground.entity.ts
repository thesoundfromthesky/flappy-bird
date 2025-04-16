import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import {
  CreateBox,
  StandardMaterial,
  Texture,
  Animation,
  PhysicsAggregate,
  PhysicsShapeType,
} from '@babylonjs/core';
import { SceneService } from '../core/scene.service';
import { GroundComponent } from '../components/ground.component';
import { WorldService } from '../core/world.service';

export type GroundEntityArchetype = GroundComponent;

@injectable()
export class GroundEntity {
  private readonly sceneService = injectService(SceneService);
  private readonly worldService = injectService(WorldService);

  public constructor() {
    this.init();
  }

  private init() {
    this.initEntity();
  }

  private initEntity() {
    const { ground } = this.createGroundComponent();
    this.worldService.getWorld<GroundEntityArchetype>().add({
      ground,
    });
  }

  private createGroundComponent() {
    const { scene } = this.sceneService;
    const groundTexture = new Texture('textures/base.png', scene);

    const groundMaterial = new StandardMaterial('ground', scene);
    groundMaterial.zOffsetUnits = -1;
    groundMaterial.disableLighting = true;
    groundMaterial.emissiveTexture = groundTexture;

    const groundMesh = CreateBox(
      'ground',
      { width: 2, height: 0.3, depth: 1 },
      scene
    );
    groundMesh.material = groundMaterial;
    groundMesh.position.y = -0.85;

    new PhysicsAggregate(
      groundMesh,
      PhysicsShapeType.BOX,
      { mass: 0, restitution: 0 },
      this.sceneService.scene
    );

    Animation.CreateAndStartAnimation(
      'u',
      groundTexture,
      'uOffset',
      6,
      6 * 3,
      0,
      1,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    scene.onBeforeAnimationsObservable.add(() => {
      groundMaterial.markDirty(true);
    });

    const groundComponent = new GroundComponent(groundMesh);
    return groundComponent;
  }
}
