export type AutomataType = 'dfa' | 'pda' | 'turing';

export interface Position {
  x: number;
  y: number;
}

export interface State {
  id: string;
  label: string;
  position: Position;
  isInitial: boolean;
  isFinal: boolean;
}

export interface DFATransition {
  from: string;
  to: string;
  symbol: string;
}

export interface PDATransition {
  from: string;
  to: string;
  inputSymbol: string;
  popSymbol: string;
  pushSymbol: string;
}

export interface TuringTransition {
  from: string;
  to: string;
  read: string;
  write: string;
  move: 'L' | 'R' | 'S';
}

export type Transition = DFATransition | PDATransition | TuringTransition;

export interface Automaton {
  id?: string;
  name: string;
  type: AutomataType;
  states: State[];
  transitions: Transition[];
  alphabet: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SimulationState {
  currentState: string;
  input: string;
  position: number;
  stack?: string[];
  tape?: string[];
  tapePosition?: number;
  accepted: boolean | null;
  finished: boolean;
  history: SimulationStep[];
}

export interface SimulationStep {
  state: string;
  input: string;
  position: number;
  stack?: string[];
  tape?: string[];
  tapePosition?: number;
  transition?: Transition;
}
