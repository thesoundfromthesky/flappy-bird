import { KeyboardEventTypes, Observable } from '@babylonjs/core';
import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { SceneService } from './scene.service';

export type AxisKeyboardEventCode =
  | 'KeyW'
  | 'KeyS'
  | 'KeyA'
  | 'KeyD'
  | 'KeyQ'
  | 'KeyE'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowRight'
  | 'ArrowLeft';

export type Movement = {
  moveForward: number;
  moveRight: number;
  moveUpward: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
};

export type Axis = { scale: number; axis: keyof Movement; isPressed?: boolean };
export type InputAxis = Record<AxisKeyboardEventCode, Axis>;

@injectable()
export class InputAxisService {
  public readonly inputAxisObservable = new Observable<Movement>();
  public readonly inputAxis: Partial<InputAxis> = {};

  private readonly sceneService = injectService(SceneService);

  public movement: Movement = {
    moveForward: 0,
    moveRight: 0,
    moveUpward: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
  };

  public constructor() {
    this.init();
  }

  private init(): void {
    this.initKeyboardEvent();
  }

  private initKeyboardEvent() {
    this.sceneService.scene.onKeyboardObservable.add(
      ({ type, event: { code } }) => {
        const axis = this.inputAxis[code as AxisKeyboardEventCode];
        if (!axis) {
          return;
        }

        switch (type) {
          case KeyboardEventTypes.KEYDOWN:
            axis.isPressed = true;
            break;
          case KeyboardEventTypes.KEYUP:
            axis.isPressed = false;
            break;
        }

        for (const movement in this.movement) {
          this.movement[movement as keyof Movement] = 0;
        }

        for (const code in this.inputAxis) {
          const input = this.inputAxis[code as AxisKeyboardEventCode];
          if (input && input.isPressed) {
            const { axis } = input;
            const movement = this.movement[axis];
            let newMovement = movement + input.scale;

            if (newMovement > 1) {
              newMovement = 1;
            } else if (newMovement < -1) {
              newMovement = -1;
            }

            this.movement[axis] = newMovement;
          }
        }

        this.inputAxisObservable.notifyObservers(this.movement);
      }
    );
  }

  public setInputAxis(inputAxis: Partial<InputAxis>) {
    Object.assign(this.inputAxis, inputAxis);
  }
}
