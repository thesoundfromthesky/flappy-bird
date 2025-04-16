import { PointerDragBehavior, Vector3 } from '@babylonjs/core';
import { injectable } from 'inversify';

@injectable()
export class PointerDragBehaviorService {
  public createPointerDragBehavior() {
    const pointerDragBehavior = new PointerDragBehavior({
      dragPlaneNormal: Vector3.UpReadOnly,
    });

    pointerDragBehavior.dragDeltaRatio = 1;
    pointerDragBehavior.updateDragPlane = false;
    pointerDragBehavior.useObjectOrientationForDragging = false;

    return pointerDragBehavior;
  }
}
