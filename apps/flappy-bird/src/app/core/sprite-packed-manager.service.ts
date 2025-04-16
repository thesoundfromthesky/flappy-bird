import { injectable } from 'inversify';
import { Sprite, SpritePackedManager } from '@babylonjs/core';

@injectable()
export class SpritePackedManagerService {
  private readonly spritePackedManagerByUrl = new Map<
    string,
    SpritePackedManager
  >();

  public setSpritePackedManager(
    name: string,
    spritePackedManager: SpritePackedManager
  ) {
    this.spritePackedManagerByUrl.set(name, spritePackedManager);
  }

  public getSpritePackedManager(name: string) {
    return this.spritePackedManagerByUrl.get(name);
  }

  public getSpritePackedManagerOrThrow(name: string) {
    const spritePackedManager = this.spritePackedManagerByUrl.get(name);

    if (spritePackedManager) {
      return spritePackedManager;
    }

    throw Error(`spritePackedManager is ${spritePackedManager}.`);
  }

  public createSprite(name: string, spritePackedManagerName: string) {
    const spritePackedManager = this.getSpritePackedManagerOrThrow(
      spritePackedManagerName
    );
    const sprite = new Sprite(name, spritePackedManager);
    return sprite;
  }
}
