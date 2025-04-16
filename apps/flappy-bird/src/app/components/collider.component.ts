import type { AbstractMesh } from '@babylonjs/core';

export class ColliderComponent {
  public constructor(public readonly collider: AbstractMesh) {}
}
