import { Plus, Trash2, Play, Square, SkipForward, Upload, Download } from 'lucide-react';
import { AutomataType } from '../types/automata';

interface ControlPanelProps {
  type: AutomataType;
  onTypeChange: (type: AutomataType) => void;
  onAddState: () => void;
  onDeleteState: () => void;
  onStartSimulation: () => void;
  onStopSimulation: () => void;
  onStepSimulation: () => void;
  onImport: (data: string) => void;
  onExport: () => void;
  selectedState: string | null;
  isSimulating: boolean;
}

export function ControlPanel({
  type,
  onTypeChange,
  onAddState,
  onDeleteState,
  onStartSimulation,
  onStopSimulation,
  onStepSimulation,
  onImport,
  onExport,
  selectedState,
  isSimulating,
}: ControlPanelProps) {
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onImport(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Autómata
        </label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as AutomataType)}
          disabled={isSimulating}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="dfa">Autómata Finito Determinista (AFD)</option>
          <option value="pda">Autómata con Pila (AP)</option>
          <option value="turing">Máquina de Turing</option>
        </select>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Estados</h3>
        <div className="flex gap-2">
          <button
            onClick={onAddState}
            disabled={isSimulating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={18} />
            Agregar Estado
          </button>
          <button
            onClick={onDeleteState}
            disabled={!selectedState || isSimulating}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Simulación</h3>
        <div className="flex gap-2">
          {!isSimulating ? (
            <button
              onClick={onStartSimulation}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Play size={18} />
              Iniciar
            </button>
          ) : (
            <>
              <button
                onClick={onStepSimulation}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <SkipForward size={18} />
                Paso
              </button>
              <button
                onClick={onStopSimulation}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Square size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Archivo</h3>
        <div className="flex gap-2">
          <button
            onClick={handleImport}
            disabled={isSimulating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Upload size={18} />
            Importar
          </button>
          <button
            onClick={onExport}
            disabled={isSimulating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}
