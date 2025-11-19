import { useState } from 'react';
import { Plus } from 'lucide-react';
import { State, DFATransition, PDATransition, TuringTransition, AutomataType } from '../types/automata';

interface TransitionEditorProps {
  type: AutomataType;
  states: State[];
  onAddTransition: (transition: DFATransition | PDATransition | TuringTransition) => void;
}

export function TransitionEditor({ type, states, onAddTransition }: TransitionEditorProps) {
  const [fromState, setFromState] = useState('');
  const [toState, setToState] = useState('');
  const [symbol, setSymbol] = useState('');
  const [popSymbol, setPopSymbol] = useState('');
  const [pushSymbol, setPushSymbol] = useState('');
  const [read, setRead] = useState('');
  const [write, setWrite] = useState('');
  const [move, setMove] = useState<'L' | 'R' | 'S'>('R');

  const handleAdd = () => {
    if (!fromState || !toState) return;

    if (type === 'dfa') {
      if (!symbol) return;
      onAddTransition({
        from: fromState,
        to: toState,
        symbol,
      } as DFATransition);
      setSymbol('');
    } else if (type === 'pda') {
      if (!symbol) return;
      onAddTransition({
        from: fromState,
        to: toState,
        inputSymbol: symbol,
        popSymbol: popSymbol || 'ε',
        pushSymbol: pushSymbol || 'ε',
      } as PDATransition);
      setSymbol('');
      setPopSymbol('');
      setPushSymbol('');
    } else if (type === 'turing') {
      if (!read || !write) return;
      onAddTransition({
        from: fromState,
        to: toState,
        read,
        write,
        move,
      } as TuringTransition);
      setRead('');
      setWrite('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Agregar Transición</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado Origen
          </label>
          <select
            value={fromState}
            onChange={(e) => setFromState(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado Destino
          </label>
          <select
            value={toState}
            onChange={(e) => setToState(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {type === 'dfa' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Símbolo
          </label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="a, b, 0, 1..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {type === 'pda' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Símbolo de Entrada
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="a, b, ε..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pop (Pila)
              </label>
              <input
                type="text"
                value={popSymbol}
                onChange={(e) => setPopSymbol(e.target.value)}
                placeholder="ε, Z, A..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Push (Pila)
              </label>
              <input
                type="text"
                value={pushSymbol}
                onChange={(e) => setPushSymbol(e.target.value)}
                placeholder="ε, Z, A..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </>
      )}

      {type === 'turing' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leer
              </label>
              <input
                type="text"
                value={read}
                onChange={(e) => setRead(e.target.value)}
                placeholder="0, 1, _..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escribir
              </label>
              <input
                type="text"
                value={write}
                onChange={(e) => setWrite(e.target.value)}
                placeholder="0, 1, _..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Movimiento
            </label>
            <select
              value={move}
              onChange={(e) => setMove(e.target.value as 'L' | 'R' | 'S')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="L">Izquierda (L)</option>
              <option value="R">Derecha (R)</option>
              <option value="S">Sin movimiento (S)</option>
            </select>
          </div>
        </>
      )}

      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <Plus size={18} />
        Agregar Transición
      </button>
    </div>
  );
}
