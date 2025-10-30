export interface IEventPublisher {
  publish<T>(event: T): Promise<void>;
  publishAll(events: any[]): Promise<void>;
}
