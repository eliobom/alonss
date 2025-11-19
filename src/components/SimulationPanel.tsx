import { SimulationState, AutomataType } from '../types/automata';

interface SimulationPanelProps {
  type: AutomataType;
  input: string;
  onInputChange: (value: string) => void;
  simulation: SimulationState | null;
}

export function SimulationPanel({ type, input, onInputChange, simulation }: SimulationPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Simulación</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cadena de Entrada
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={simulation !== null}
          placeholder="Ingrese la cadena a probar..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 font-mono"
        />
      </div>

      {simulation && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Estado Actual:</span>
              <span className="text-sm font-semibold text-blue-600">{simulation.currentState}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Posición:</span>
              <span className="text-sm font-semibold text-blue-600">{simulation.position}</span>
            </div>
          </div>

          {type === 'dfa' && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm font-medium text-gray-700 mb-2">Entrada:</div>
              <div className="font-mono text-lg flex items-center gap-1">
                {simulation.input.split('').map((char, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded ${
                      idx === simulation.position
                        ? 'bg-blue-500 text-white'
                        : idx < simulation.position
                        ? 'bg-green-200 text-green-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}

          {type === 'pda' && simulation.stack && (
            <>
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm font-medium text-gray-700 mb-2">Entrada:</div>
                <div className="font-mono text-lg flex items-center gap-1">
                  {simulation.input.split('').map((char, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded ${
                        idx === simulation.position
                          ? 'bg-blue-500 text-white'
                          : idx < simulation.position
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <div className="text-sm font-medium text-gray-700 mb-2">Pila:</div>
                <div className="flex flex-col-reverse gap-1">
                  {simulation.stack.length === 0 ? (
                    <div className="text-sm text-gray-500 italic">Vacía</div>
                  ) : (
                    simulation.stack.map((symbol, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 bg-blue-100 text-blue-800 font-mono text-center rounded border-2 border-blue-300"
                      >
                        {symbol}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {type === 'turing' && simulation.tape && simulation.tapePosition !== undefined && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm font-medium text-gray-700 mb-2">Cinta:</div>
              <div className="font-mono text-lg flex items-center gap-1 overflow-x-auto">
                {simulation.tape.map((char, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-2 rounded border-2 ${
                      idx === simulation.tapePosition
                        ? 'bg-blue-500 text-white border-blue-700'
                        : 'bg-gray-200 text-gray-800 border-gray-400'
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}

          {simulation.finished && (
            <div
              className={`p-4 rounded-md text-center font-semibold ${
                simulation.accepted
                  ? 'bg-green-100 text-green-800 border-2 border-green-500'
                  : 'bg-red-100 text-red-800 border-2 border-red-500'
              }`}
            >
              {simulation.accepted ? '✓ Cadena Aceptada' : '✗ Cadena Rechazada'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
