import { injectable } from 'inversify';
import { World } from 'miniplex';
import type { AbstractMesh } from '@babylonjs/core';

@injectable()
export class WorldService {
  #world = new World();

  public subscribeUpdateEntityId<T extends object>(
    componentName: Extract<keyof T, string>
  ) {
    const query = (this.#world as World<{ [key: string]: AbstractMesh }>).with(
      componentName
    );

    query.onEntityAdded.subscribe((entity) => {
      const id = this.#world.id(entity);
      if (id === undefined || id === null) {
        throw Error(`id is ${id}.`);
      } else {
        entity[componentName].id = id.toString();
      }
    });
  }

  public getWorld<T extends object>(): World<T> {
    return this.#world;
  }

  public getEntityById<T extends object>(id: number): T | undefined {
    return this.#world.entity(id);
  }

  public getEntityByIdOrThrow<T extends object>(id: number): T {
    const entity = this.getEntityById(id);
    if (!entity) {
      throw Error(`entity is ${entity}`);
    }
    return entity as T;
  }
}
