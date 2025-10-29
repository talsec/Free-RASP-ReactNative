export class RaspExecutionState {
  value: number;

  static AllChecksFinished = new RaspExecutionState(0);

  constructor(value: number) {
    this.value = value;
  }

  static getValues(): RaspExecutionState[] {
    return [this.AllChecksFinished];
  }
}
