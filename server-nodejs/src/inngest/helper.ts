import { Inngest } from 'inngest';
import {
  StandardEventSchemas,
  StandardEventSchema,
} from 'inngest/components/EventSchemas';

export function createInngestEventTrigger<
  Schemas extends StandardEventSchemas,
>() {
  return function trigger<EventName extends Extract<keyof Schemas, string>>(
    inngest: Inngest,
    eventName: EventName,
    eventData: Schemas[EventName]['data'],
  ): ReturnType<Inngest['send']> {
    return inngest.send({
      name: eventName,
      data: eventData,
    });
  };
}

export function createInngestEventTriggers<
  Schemas extends StandardEventSchemas,
>(
  eventNames: Extract<keyof Schemas, string>[],
): {
  [EventName in keyof Schemas]: {
    trigger: (
      inngest: Inngest,
      data: Schemas[EventName]['data'],
    ) => ReturnType<Inngest['send']>;
  };
} {
  return Object.fromEntries(
    eventNames.map((eventName) => [
      eventName,
      {
        trigger: (inngest, eventData) =>
          inngest.send({
            name: eventName,
            data: eventData,
          }),
      },
    ]),
  ) as ReturnType<typeof createInngestEventTriggers<Schemas>>;
}

export function matchEventNames<
  EventSchema extends Pick<StandardEventSchema, 'data'> = Pick<
    StandardEventSchema,
    'data'
  >,
>(
  event: Pick<StandardEventSchema, 'name' | 'data'>,
  eventNames: string[],
): event is EventSchema & Pick<StandardEventSchema, 'name'> {
  return eventNames.includes(event.name);
}
