import type { AbstractMesh } from '@babylonjs/core';

export class MeshComponent {
  public constructor(public readonly mesh: AbstractMesh) {}
}
