import { Automaton } from '../types/automata';

export function exportAutomaton(automaton: Automaton): string {
  const exportData = {
    name: automaton.name,
    type: automaton.type,
    states: automaton.states,
    transitions: automaton.transitions,
    alphabet: automaton.alphabet,
    version: '1.0',
    exportDate: new Date().toISOString(),
  };

  return JSON.stringify(exportData, null, 2);
}

export function importAutomaton(jsonData: string): Automaton {
  try {
    const data = JSON.parse(jsonData);

    if (!data.type || !data.states || !data.transitions) {
      throw new Error('Formato de archivo inválido');
    }

    const automaton: Automaton = {
      name: data.name || 'Autómata Importado',
      type: data.type,
      states: data.states,
      transitions: data.transitions,
      alphabet: data.alphabet || [],
    };

    return automaton;
  } catch (error) {
    throw new Error('Error al importar el autómata: ' + (error as Error).message);
  }
}

export function downloadJSON(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
