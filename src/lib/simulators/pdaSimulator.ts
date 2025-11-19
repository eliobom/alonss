import { Automaton, PDATransition, SimulationState, SimulationStep } from '../../types/automata';

export class PDASimulator {
  private automaton: Automaton;
  private state: SimulationState | null = null;

  constructor(automaton: Automaton) {
    this.automaton = automaton;
  }

  start(input: string): SimulationState {
    const initialState = this.automaton.states.find(s => s.isInitial);
    if (!initialState) {
      throw new Error('No se encontró estado inicial');
    }

    this.state = {
      currentState: initialState.id,
      input,
      position: 0,
      stack: ['Z'],
      accepted: null,
      finished: false,
      history: [{
        state: initialState.id,
        input,
        position: 0,
        stack: ['Z'],
      }],
    };

    return this.state;
  }

  step(): SimulationState {
    if (!this.state || this.state.finished) {
      throw new Error('La simulación no está activa o ya terminó');
    }

    const currentSymbol = this.state.position < this.state.input.length
      ? this.state.input[this.state.position]
      : 'ε';
    const topStack = this.state.stack && this.state.stack.length > 0
      ? this.state.stack[this.state.stack.length - 1]
      : 'ε';

    const possibleTransitions = (this.automaton.transitions as PDATransition[]).filter(
      t => t.from === this.state!.currentState &&
           (t.inputSymbol === currentSymbol || t.inputSymbol === 'ε') &&
           (t.popSymbol === topStack || t.popSymbol === 'ε')
    );

    const epsilonTransition = possibleTransitions.find(t => t.inputSymbol === 'ε');
    const symbolTransition = possibleTransitions.find(t => t.inputSymbol === currentSymbol);

    const transition = symbolTransition || epsilonTransition;

    if (!transition) {
      const currentStateObj = this.automaton.states.find(s => s.id === this.state!.currentState);
      const stackEmpty = !this.state.stack || this.state.stack.length === 0;
      const inputConsumed = this.state.position >= this.state.input.length;

      this.state.accepted = (currentStateObj?.isFinal || stackEmpty) && inputConsumed;
      this.state.finished = true;
      return this.state;
    }

    if (transition.popSymbol !== 'ε' && this.state.stack && this.state.stack.length > 0) {
      this.state.stack.pop();
    }

    if (transition.pushSymbol !== 'ε') {
      if (!this.state.stack) this.state.stack = [];
      const symbols = transition.pushSymbol.split('').reverse();
      this.state.stack.push(...symbols);
    }

    this.state.currentState = transition.to;

    if (transition.inputSymbol !== 'ε') {
      this.state.position++;
    }

    const step: SimulationStep = {
      state: this.state.currentState,
      input: this.state.input,
      position: this.state.position,
      stack: [...(this.state.stack || [])],
      transition,
    };

    this.state.history.push(step);

    return this.state;
  }

  getState(): SimulationState | null {
    return this.state;
  }

  reset(): void {
    this.state = null;
  }
}
