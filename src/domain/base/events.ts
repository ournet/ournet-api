/* eslint-disable @typescript-eslint/no-explicit-any */
import Emittery from "emittery";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Events {}

type UnsubscribeFn = () => void;

export interface IEmitter<EventDataMap extends Events> {
  on<Name extends keyof EventDataMap>(
    eventName: Name,
    listener: (eventData: EventDataMap[Name]) => void
  ): UnsubscribeFn;

  once<Name extends keyof EventDataMap>(
    eventName: Name
  ): Promise<EventDataMap[Name]>;

  off<Name extends keyof EventDataMap>(
    eventName: Name,
    listener: (eventData: EventDataMap[Name]) => void
  ): void;

  onAny(
    listener: (
      eventName: keyof EventDataMap,
      eventData?: EventDataMap[keyof EventDataMap]
    ) => void
  ): UnsubscribeFn;
  offAny(
    listener: (
      eventName: keyof EventDataMap,
      eventData?: EventDataMap[keyof EventDataMap]
    ) => void
  ): void;

  emit<Name extends keyof EventDataMap>(
    eventName: Name,
    eventData: EventDataMap[Name]
  ): Promise<void>;

  emitSerial<Name extends keyof EventDataMap>(
    eventName: Name,
    eventData: EventDataMap[Name]
  ): Promise<void>;
}

/**
 * Base events emitter
 */
export class Emitter<EventDataMap extends Events>
  implements IEmitter<EventDataMap>
{
  private _emitter: Emittery<EventDataMap>;

  public constructor() {
    this._emitter = new Emittery<EventDataMap>();
  }

  public on<Name extends keyof EventDataMap>(
    eventName: Name,
    listener: (eventData: EventDataMap[Name]) => void
  ): UnsubscribeFn {
    return this._emitter.on(eventName, listener);
  }

  public once<Name extends keyof EventDataMap>(
    eventName: Name
  ): Promise<EventDataMap[Name]> {
    return this._emitter.once(eventName);
  }

  public off<Name extends keyof EventDataMap>(
    eventName: Name,
    listener: (eventData: EventDataMap[Name]) => void
  ): void {
    return this._emitter.off(eventName, listener);
  }

  public onAny(
    listener: (
      eventName: keyof EventDataMap,
      eventData?: EventDataMap[keyof EventDataMap]
    ) => void
  ): UnsubscribeFn {
    return this._emitter.onAny(listener);
  }

  public offAny(
    listener: (
      eventName: keyof EventDataMap,
      eventData?: EventDataMap[keyof EventDataMap]
    ) => void
  ): void {
    return this._emitter.offAny(listener);
  }

  public emit<Name extends keyof EventDataMap>(
    eventName: Name,
    eventData: EventDataMap[Name]
  ): Promise<void> {
    return this._emitter.emit(eventName, eventData);
  }

  public emitSerial<Name extends keyof EventDataMap>(
    eventName: Name,
    eventData: EventDataMap[Name]
  ): Promise<void> {
    return this._emitter.emitSerial(eventName, eventData);
  }
}
