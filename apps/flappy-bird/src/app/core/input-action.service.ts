import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { SceneService } from './scene.service';
import { KeyboardEventTypes, Observable } from '@babylonjs/core';

export type Action = {
  jump: boolean;
};

export type ActionKeyboardEventCode = 'Space' | 'Escape';

export type ActionState = {
  action: keyof Action;
  isPressed?: boolean;
};
export type InputAction = Record<ActionKeyboardEventCode, ActionState>;

@injectable()
export class InputActionService {
  public readonly inputAction: Partial<InputAction> = {};
  public readonly inputActionObservable = new Observable<Action>();
  public readonly action: Action = {
    jump: false,
  };

  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.init();
  }

  private init(): void {
    this.initKeyboardEvent();
  }

  private initKeyboardEvent() {
    this.sceneService.scene.onKeyboardObservable.add(
      ({ type, event: { code } }) => {
        const actionState = this.inputAction[code as ActionKeyboardEventCode];
        if (!actionState) {
          return;
        }

        switch (type) {
          case KeyboardEventTypes.KEYDOWN:
            actionState['isPressed'] = true;
            break;
          case KeyboardEventTypes.KEYUP:
            actionState['isPressed'] = false;
            this.action[actionState.action] = false;
            break;
        }

        for (const code in this.inputAction) {
          const input = this.inputAction[code as ActionKeyboardEventCode];
          if (input && input.isPressed) {
            const { action } = input;
            this.action[action] = true;
          }
        }

        this.inputActionObservable.notifyObservers(this.action);
      }
    );
  }

  public setInputAxis(inputAction: Partial<InputAction>) {
    Object.assign(this.inputAction, inputAction);
  }
}
