import { injectable } from 'inversify';
import {
  CreateBox,
  StandardMaterial,
  Texture,
  Tools,
  Animation,
  TransformNode,
  PhysicsAggregate,
  PhysicsShapeType,
  PhysicsMotionType,
} from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';
import { DelayService } from '../core/delay.service';
import { PipeComponent } from '../components/pipe.component';
import { WorldService } from '../core/world.service';
import { SceneService } from '../core/scene.service';

export type PipeEntityArchetype = PipeComponent;

@injectable()
export class PipeEntity {
  private readonly delayService = injectService(DelayService);
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.init();
  }

  private init() {
    const pipeTexture = new Texture('textures/pipe-green.png');
    pipeTexture.hasAlpha = true;

    const pipeMaterial = new StandardMaterial('pipe');
    pipeMaterial.emissiveTexture = pipeTexture;
    pipeMaterial.opacityTexture = pipeTexture;
    pipeMaterial.disableLighting = true;
    const pipeMesh = CreateBox('pipe');
    pipeMesh.material = pipeMaterial;

    pipeMesh.scaling.x = 0.2;
    pipeMesh.setEnabled(false);

    const totalInstances = 6;
    const step = 2;
    const framePerSecond = 60;
    const time = 4;
    const totalFrame = framePerSecond * time;
    let parent: TransformNode;

    Array.from({ length: totalInstances }, (_, i) => {
      const column = Math.floor(i / step);
      const isOdd = (i & 1) === 1;
      if (!isOdd) {
        parent = new TransformNode(`pipe_${i + 1}`);
        parent.position.x = 1.099;
      }
      const pipeInstance = pipeMesh.createInstance(`pipe_${i + 1}`);
      pipeInstance.parent = parent;

      this.worldService.getWorld<PipeEntityArchetype>().add({
        pipe: pipeInstance,
      });

      if (isOdd) {
        pipeInstance.rotation.z = Tools.ToRadians(180);
        pipeInstance.position.y = 0.75;
      } else {
        pipeInstance.position.y = -0.75;
      }

      const physicsAggregate = new PhysicsAggregate(
        pipeInstance,
        PhysicsShapeType.BOX,
        {
          mass: 0,
          restitution: 0,
        },
        this.sceneService.scene
      );
      physicsAggregate.body.disablePreStep = false;
      physicsAggregate.body.setMotionType(PhysicsMotionType.ANIMATED);

      if (!isOdd) {
        const target = parent;
 
        const delayTime = (time / (totalInstances / step)) * column * 1000;
        this.delayService.delay(delayTime, () => {
          const animatable = Animation.CreateAndStartAnimation(
            'xSlide',
            target,
            'position.x',
            framePerSecond,
            totalFrame,
            1.099,
            -1.099,
            Animation.ANIMATIONLOOPMODE_CYCLE
          );

          if (!animatable) {
            return;
          }

          function getRandomFloat(min: number, max: number) {
            return Math.random() * (max - min) + min;
          }
          target.position.y = getRandomFloat(-0.2, 0.4);
          animatable.onAnimationLoopObservable.add(() => {
            target.position.y = getRandomFloat(-0.2, 0.4);
          });
        });
      }
    });
  }
}
