import type { Plane, BoundingBox, AbstractMesh } from '@babylonjs/core';
import { injectable } from 'inversify';

// https://forum.babylonjs.com/t/plane-intersectmesh-mesh/37761/2
@injectable()
export class IntersectionService {
  private doesPlanIntersectBbox(plane: Plane, bbox: BoundingBox): boolean {
    const e = bbox.maximum.subtract(bbox.center);
    const r =
      e.x * Math.abs(plane.normal.x) +
      e.y * Math.abs(plane.normal.y) +
      e.z * Math.abs(plane.normal.z);
    const s = plane.signedDistanceTo(bbox.center);
    return Math.abs(s) <= r;
  }

  public doesPlanIntersectMesh(plane: Plane, mesh: AbstractMesh): boolean {
    return this.doesPlanIntersectBbox(
      plane,
      mesh.getBoundingInfo().boundingBox
    );
  }
}
