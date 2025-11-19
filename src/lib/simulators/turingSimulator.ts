import { Automaton, TuringTransition, SimulationState, SimulationStep } from '../../types/automata';

export class TuringSimulator {
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

    const tape = input.split('');
    if (tape.length === 0) {
      tape.push('_');
    }

    this.state = {
      currentState: initialState.id,
      input,
      position: 0,
      tape,
      tapePosition: 0,
      accepted: null,
      finished: false,
      history: [{
        state: initialState.id,
        input,
        position: 0,
        tape: [...tape],
        tapePosition: 0,
      }],
    };

    return this.state;
  }

  step(): SimulationState {
    if (!this.state || this.state.finished || !this.state.tape || this.state.tapePosition === undefined) {
      throw new Error('La simulación no está activa o ya terminó');
    }

    const currentSymbol = this.state.tape[this.state.tapePosition] || '_';

    const transition = (this.automaton.transitions as TuringTransition[]).find(
      t => t.from === this.state!.currentState && t.read === currentSymbol
    );

    if (!transition) {
      const currentStateObj = this.automaton.states.find(s => s.id === this.state!.currentState);
      this.state.accepted = currentStateObj?.isFinal || false;
      this.state.finished = true;
      return this.state;
    }

    this.state.tape[this.state.tapePosition] = transition.write;
    this.state.currentState = transition.to;

    if (transition.move === 'L') {
      this.state.tapePosition--;
      if (this.state.tapePosition < 0) {
        this.state.tape.unshift('_');
        this.state.tapePosition = 0;
      }
    } else if (transition.move === 'R') {
      this.state.tapePosition++;
      if (this.state.tapePosition >= this.state.tape.length) {
        this.state.tape.push('_');
      }
    }

    const step: SimulationStep = {
      state: this.state.currentState,
      input: this.state.input,
      position: this.state.position,
      tape: [...this.state.tape],
      tapePosition: this.state.tapePosition,
      transition,
    };

    this.state.history.push(step);

    const currentStateObj = this.automaton.states.find(s => s.id === this.state!.currentState);
    if (currentStateObj?.isFinal) {
      this.state.accepted = true;
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
