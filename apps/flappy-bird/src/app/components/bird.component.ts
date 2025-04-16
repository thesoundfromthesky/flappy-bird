import type { BirdEntity } from '../entities/bird.entity';

export class BirdComponent {
  public constructor(public readonly bird: BirdEntity) {}
}
