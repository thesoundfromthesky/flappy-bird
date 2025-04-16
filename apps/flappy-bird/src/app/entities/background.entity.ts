import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { SpritePackedManagerService } from '../core/sprite-packed-manager.service';
import { FlappyBird } from '../assets/flappy-bird.enum';

@injectable()
export class BackgroundEntity {
  private readonly spritePackedManagerService = injectService(
    SpritePackedManagerService
  );

  public constructor() {
    this.init();
  }

  private init() {
    this.initEntity();
  }

  private initEntity() {
    const sprite = this.spritePackedManagerService.createSprite(
      'background_day',
      FlappyBird.SpritePackedManagerName
    );
    sprite.cellRef = FlappyBird.BackgroundDay;
    sprite.width = 2.038;
    sprite.height = 2.04;
  }
}
