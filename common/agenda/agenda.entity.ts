export enum Day {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
}

export type Hour = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;

export class Agenda {
  #schedule : Map<Day, Map<Hour, string>>;

  constructor() {
    this.#schedule = new Map<Day, Map<Hour, string>>();
  }

  get(day: Day, hour: Hour): string | undefined {
    return this.#schedule.get(day)?.get(hour);
  }

  getDay(day: Day): Map<Hour, string> | undefined {
    return this.#schedule.get(day);
  }

  set(day: Day, hour: Hour, label: string) {
    let daySchedule = this.#schedule.get(day);
    if(!daySchedule) {
      daySchedule = new Map<Hour, string>();
      this.#schedule.set(day, daySchedule);
    }
    daySchedule.set(hour, label);
  }
}
