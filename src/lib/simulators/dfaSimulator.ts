import { Automaton, DFATransition, SimulationState, SimulationStep } from '../../types/automata';

export class DFASimulator {
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
      accepted: null,
      finished: false,
      history: [{
        state: initialState.id,
        input,
        position: 0,
      }],
    };

    return this.state;
  }

  step(): SimulationState {
    if (!this.state || this.state.finished) {
      throw new Error('La simulación no está activa o ya terminó');
    }

    if (this.state.position >= this.state.input.length) {
      const currentStateObj = this.automaton.states.find(s => s.id === this.state!.currentState);
      this.state.accepted = currentStateObj?.isFinal || false;
      this.state.finished = true;
      return this.state;
    }

    const currentSymbol = this.state.input[this.state.position];
    const transition = (this.automaton.transitions as DFATransition[]).find(
      t => t.from === this.state!.currentState && t.symbol === currentSymbol
    );

    if (!transition) {
      this.state.accepted = false;
      this.state.finished = true;
      return this.state;
    }

    this.state.currentState = transition.to;
    this.state.position++;

    const step: SimulationStep = {
      state: this.state.currentState,
      input: this.state.input,
      position: this.state.position,
      transition,
    };

    this.state.history.push(step);

    if (this.state.position >= this.state.input.length) {
      const currentStateObj = this.automaton.states.find(s => s.id === this.state.currentState);
      this.state.accepted = currentStateObj?.isFinal || false;
      this.state.finished = true;
    }

    return this.state;
  }

  getState(): SimulationState | null {
    return this.state;
  }

  reset(): void {
    this.state = null;
  }
}
