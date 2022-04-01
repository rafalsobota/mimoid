// https://maxwellforbes.com/posts/typescript-ecs-implementation/

export type Entity = number;

export abstract class Component { };

export abstract class System {
  public abstract componentsRequired: Set<Function>;
  public abstract update(entities: Set<Entity>): void;
  public ecs?: ECS;
}

export type ComponentClass<T extends Component> = new (...args: any[]) => T;

export class ComponentContainer {
  private map = new Map<Function, Component>();

  public add(component: Component): void {
    this.map.set(component.constructor, component);
  }

  public get<T extends Component>(componentClass: ComponentClass<T>): T {
    return this.map.get(componentClass) as T;
  }

  public has(componentClass: ComponentClass<Component>): boolean {
    return this.map.has(componentClass);
  }

  public hasAll(componentClasses: Iterable<Function>): boolean {
    // let iter = componentClasses[Symbol.iterator]().next();
    // while (true) {
    //   if (!iter.done && !this.has(iter.value())) {
    //     return false;
    //   }
    //   iter = componentClasses[Symbol.iterator]().next();
    //   if (iter.done) {
    //     return true;
    //   }
    // }

    for (const componentClass of Array.from(componentClasses)) {
      if (!this.map.has(componentClass)) {
        return false;
      }
    }
    return true;
  }

  public delete(componentClass: Function): void {
    this.map.delete(componentClass);
  }
}

export class ECS {
  // Main state
  private entities: Map<Entity, ComponentContainer>;
  private systems: Map<System, Set<Entity>>;

  // Bookkeeping for entities.
  private nextEntityID: number;
  private entitiesToDestroy: Array<Entity>;

  constructor() {
    this.entities = new Map<Entity, ComponentContainer>();
    this.systems = new Map<System, Set<Entity>>();
    this.nextEntityID = 0;
    this.entitiesToDestroy = new Array<Entity>();
  }

  // API: Entities

  public addEntity(): Entity {
    let entity = this.nextEntityID;
    this.nextEntityID++;
    this.entities.set(entity, new ComponentContainer());
    return entity;
  }

  /**
   * Marks `entity` for removal. The actual removal happens at the end
   * of the next `update()`. This way we avoid subtle bugs where an
   * Entity is removed mid-`update()`, with some Systems seeing it and
   * others not.
   */
  public removeEntity(entity: Entity): void {
    this.entitiesToDestroy.push(entity);
  }

  // API: Components

  public addComponent(entity: Entity, component: Component): void {
    this.entities.get(entity)?.add(component);
    this.checkE(entity);
  }

  public getComponents(entity: Entity): ComponentContainer {
    return this.entities.get(entity)!;
  }

  public removeComponent(
    entity: Entity, componentClass: Function
  ): void {
    this.entities.get(entity)?.delete(componentClass);
    this.checkE(entity);
  }

  // API: Systems

  public addSystem(system: System): void {
    if (system.componentsRequired.size === 0) {
      console.warn("System not added: empty Components list.");
      console.warn(system);
      return;
    }

    // Give system a reference to the ECS so it can actually do
    // anything.
    system.ecs = this;

    // Save system and set who it should track immediately.
    this.systems.set(system, new Set());
    for (let entity of Array.from(this.entities.keys())) {
      this.checkES(entity, system);
    }
  }

  public removeSystem(system: System): void {
    this.systems.delete(system);
  }

  /**
   * This is ordinarily called once per tick (e.g., every frame). It
   * updates all Systems, then destroys any Entities that were marked
   * for removal.
   */
  public update(): void {
    for (let [system, entities] of this.systems.entries()) {
      system.update(entities)
    }

    // Remove any entities that were marked for deletion during the
    // update.
    while (this.entitiesToDestroy.length > 0) {
      this.destroyEntity(this.entitiesToDestroy.pop()!);
    }
  }

  // Private methods for doing internal state checks and mutations.

  private destroyEntity(entity: Entity): void {
    this.entities.delete(entity);
    for (let entities of this.systems.values()) {
      entities.delete(entity);
    }
  }

  private checkE(entity: Entity): void {
    for (let system of this.systems.keys()) {
      this.checkES(entity, system);
    }
  }

  private checkES(entity: Entity, system: System): void {
    let have = this.entities.get(entity);
    let need = system.componentsRequired;
    if (have?.hasAll(need)) {
      // should be in system
      this.systems.get(system)?.add(entity); // no-op if in
    } else {
      // should not be in system
      this.systems.get(system)?.delete(entity); // no-op if out
    }
  }
}