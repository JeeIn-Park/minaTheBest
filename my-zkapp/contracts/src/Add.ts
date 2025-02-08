import { SmartContract, state, State, method, Field } from 'o1js';

export class Add extends SmartContract {
  @state(Field) num = State<Field>();

  @method async update() {
    this.num.set(this.num.get().add(1));
  }
}
