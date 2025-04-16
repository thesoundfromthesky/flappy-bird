import { Container, type Newable, type ServiceIdentifier } from 'inversify';
import { UpdateInjector } from './update-injector.method-decorator';

export class Injector {
  public container = new Container({
    defaultScope: 'Singleton',
    autobind: import.meta.env.VITE_AUTO_BIND as true | undefined,
  });

  @UpdateInjector()
  public createInstance<T>(newableClasses: Newable<T>): T {
    const isBound = this.container.isBound(newableClasses);
    if (!isBound) {
      this.container.bind(newableClasses).toSelf().inTransientScope();
    }
    
    const instance = this.container.get(newableClasses);

    return instance;
  }

  public createInstances(newableClass: Newable<object>[]): void {
    newableClass.forEach((newableClass) => {
      this.createInstance(newableClass);
    });
  }

  public getService<T>(serviceIdentifier: ServiceIdentifier<T>): T {
    return this.container.get(serviceIdentifier);
  }
}
