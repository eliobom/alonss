import { State } from '../types/automata';

interface StateEditorProps {
  state: State;
  onUpdate: (state: State) => void;
}

export function StateEditor({ state, onUpdate }: StateEditorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Editar Estado</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Etiqueta
        </label>
        <input
          type="text"
          value={state.label}
          onChange={(e) => onUpdate({ ...state, label: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={state.isInitial}
            onChange={(e) => onUpdate({ ...state, isInitial: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Estado Inicial</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={state.isFinal}
            onChange={(e) => onUpdate({ ...state, isFinal: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Estado Final</span>
        </label>
      </div>
    </div>
  );
}
