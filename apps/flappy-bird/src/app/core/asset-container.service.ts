import { LoadAssetContainerAsync, type AssetContainer } from '@babylonjs/core';
import { injectable } from 'inversify';
import { SceneService } from './scene.service';
import { injectService } from '../injector/inject-service.function';

@injectable()
export class AssetContainerService {
  private readonly assetContainerByUrl = new Map<string, AssetContainer>();
  private readonly sceneService = injectService(SceneService);

  public async getAssetContainer(url: string): Promise<AssetContainer> {
    const cachedAssetContainer = this.assetContainerByUrl.get(url);
    if (cachedAssetContainer) {
      return cachedAssetContainer;
    }

    const assetContainer = await LoadAssetContainerAsync(
      url,
      this.sceneService.scene
    );
    assetContainer.addAllToScene();
    this.assetContainerByUrl.set(url, assetContainer);
    return assetContainer;
  }
}
