import { useState, useEffect } from 'react';
import { AutomataCanvas } from './components/AutomataCanvas';
import { ControlPanel } from './components/ControlPanel';
import { StateEditor } from './components/StateEditor';
import { TransitionEditor } from './components/TransitionEditor';
import { SimulationPanel } from './components/SimulationPanel';
import {
  Automaton,
  State,
  Transition,
  AutomataType,
  SimulationState,
  DFATransition,
  PDATransition,
  TuringTransition
} from './types/automata';
import { DFASimulator } from './lib/simulators/dfaSimulator';
import { PDASimulator } from './lib/simulators/pdaSimulator';
import { TuringSimulator } from './lib/simulators/turingSimulator';
import { exportAutomaton, importAutomaton, downloadJSON } from './lib/importExport';
import { supabase } from './lib/supabase';

function App() {
  const [automaton, setAutomaton] = useState<Automaton>({
    name: 'Nuevo Autómata',
    type: 'dfa',
    states: [],
    transitions: [],
    alphabet: [],
  });

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [simulator, setSimulator] = useState<DFASimulator | PDASimulator | TuringSimulator | null>(null);
  const [simulation, setSimulation] = useState<SimulationState | null>(null);
  const [inputString, setInputString] = useState('');

  useEffect(() => {
    document.title = 'Simulador de Autómatas';
  }, []);

  const handleTypeChange = (type: AutomataType) => {
    setAutomaton({
      ...automaton,
      type,
      states: [],
      transitions: [],
    });
    setSelectedState(null);
    setSimulator(null);
    setSimulation(null);
  };

  const handleAddState = () => {
    const newState: State = {
      id: `q${automaton.states.length}`,
      label: `q${automaton.states.length}`,
      position: { x: 300 + automaton.states.length * 100, y: 300 },
      isInitial: automaton.states.length === 0,
      isFinal: false,
    };
    setAutomaton({
      ...automaton,
      states: [...automaton.states, newState],
    });
  };

  const handleDeleteState = () => {
    if (!selectedState) return;

    setAutomaton({
      ...automaton,
      states: automaton.states.filter(s => s.id !== selectedState),
      transitions: automaton.transitions.filter(
        t => t.from !== selectedState && t.to !== selectedState
      ),
    });
    setSelectedState(null);
  };

  const handleStateClick = (stateId: string) => {
    setSelectedState(stateId);
  };

  const handleCanvasClick = (x: number, y: number) => {
    setSelectedState(null);
  };

  const handleUpdateState = (updatedState: State) => {
    const hasInitial = automaton.states.some(s => s.isInitial && s.id !== updatedState.id);

    if (updatedState.isInitial && hasInitial) {
      setAutomaton({
        ...automaton,
        states: automaton.states.map(s =>
          s.id === updatedState.id
            ? updatedState
            : { ...s, isInitial: false }
        ),
      });
    } else {
      setAutomaton({
        ...automaton,
        states: automaton.states.map(s => s.id === updatedState.id ? updatedState : s),
      });
    }
  };

  const handleAddTransition = (transition: DFATransition | PDATransition | TuringTransition) => {
    setAutomaton({
      ...automaton,
      transitions: [...automaton.transitions, transition],
    });
  };

  const handleStartSimulation = () => {
    if (inputString === '') return;

    let newSimulator;
    if (automaton.type === 'dfa') {
      newSimulator = new DFASimulator(automaton);
    } else if (automaton.type === 'pda') {
      newSimulator = new PDASimulator(automaton);
    } else {
      newSimulator = new TuringSimulator(automaton);
    }

    const initialState = newSimulator.start(inputString);
    setSimulator(newSimulator);
    setSimulation(initialState);
  };

  const handleStepSimulation = () => {
    if (!simulator) return;

    const nextState = simulator.step();
    setSimulation({ ...nextState });
  };

  const handleStopSimulation = () => {
    setSimulator(null);
    setSimulation(null);
  };

  const handleExport = () => {
    const json = exportAutomaton(automaton);
    downloadJSON(json, `${automaton.name || 'automaton'}.json`);
  };

  const handleImport = (jsonData: string) => {
    try {
      const imported = importAutomaton(jsonData);
      setAutomaton(imported);
      setSelectedState(null);
      setSimulator(null);
      setSimulation(null);
      alert('Autómata importado exitosamente');
    } catch (error) {
      alert('Error al importar: ' + (error as Error).message);
    }
  };

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('automata')
        .insert({
          name: automaton.name,
          type: automaton.type,
          states: automaton.states,
          transitions: automaton.transitions,
          alphabet: automaton.alphabet,
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAutomaton({ ...automaton, id: data.id });
        alert('Autómata guardado exitosamente');
      }
    } catch (error) {
      alert('Error al guardar: ' + (error as Error).message);
    }
  };

  const selectedStateObj = automaton.states.find(s => s.id === selectedState);
  const activeTransition = simulation?.history[simulation.history.length - 1]?.transition;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <header className="bg-white shadow-md border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Simulador Visual de Autómatas
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            AFD, Autómata con Pila y Máquina de Turing
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-6">
            <ControlPanel
              type={automaton.type}
              onTypeChange={handleTypeChange}
              onAddState={handleAddState}
              onDeleteState={handleDeleteState}
              onStartSimulation={handleStartSimulation}
              onStopSimulation={handleStopSimulation}
              onStepSimulation={handleStepSimulation}
              onImport={handleImport}
              onExport={handleExport}
              selectedState={selectedState}
              isSimulating={simulation !== null}
            />

            {selectedStateObj && (
              <StateEditor
                state={selectedStateObj}
                onUpdate={handleUpdateState}
              />
            )}

            {!simulation && (
              <TransitionEditor
                type={automaton.type}
                states={automaton.states}
                onAddTransition={handleAddTransition}
              />
            )}

            <button
              onClick={handleSave}
              disabled={simulation !== null}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Guardar en Base de Datos
            </button>
          </div>

          <div className="col-span-6">
            <AutomataCanvas
              states={automaton.states}
              transitions={automaton.transitions}
              type={automaton.type}
              onStateClick={handleStateClick}
              onCanvasClick={handleCanvasClick}
              selectedState={selectedState}
              currentState={simulation?.currentState}
              activeTransition={activeTransition}
            />
          </div>

          <div className="col-span-3">
            <SimulationPanel
              type={automaton.type}
              input={inputString}
              onInputChange={setInputString}
              simulation={simulation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
