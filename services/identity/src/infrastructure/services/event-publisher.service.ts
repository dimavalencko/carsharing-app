import { Injectable } from '@nestjs/common';
import { IEventPublisher } from '@domain/interfaces/services';

@Injectable()
export class EventPublisherService implements IEventPublisher {
  async publish<T>(event: T): Promise<void> {
    console.log('Event published:', event); // Пока заглушка
  }

  async publishAll(events: any[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}