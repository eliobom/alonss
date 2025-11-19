import { useRef, useEffect, useState } from 'react';
import { State, Transition, AutomataType } from '../types/automata';
import { ArrowRight } from 'lucide-react';

interface AutomataCanvasProps {
  states: State[];
  transitions: Transition[];
  type: AutomataType;
  onStateClick: (stateId: string) => void;
  onCanvasClick: (x: number, y: number) => void;
  selectedState: string | null;
  currentState?: string;
  activeTransition?: Transition;
}

export function AutomataCanvas({
  states,
  transitions,
  type,
  onStateClick,
  onCanvasClick,
  selectedState,
  currentState,
  activeTransition,
}: AutomataCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingState, setDraggingState] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    transitions.forEach((transition) => {
      const fromState = states.find((s) => s.id === transition.from);
      const toState = states.find((s) => s.id === transition.to);

      if (!fromState || !toState) return;

      const isActive = activeTransition &&
        activeTransition.from === transition.from &&
        activeTransition.to === transition.to;

      ctx.strokeStyle = isActive ? '#ef4444' : '#6b7280';
      ctx.lineWidth = isActive ? 3 : 2;
      ctx.fillStyle = '#374151';
      ctx.font = '14px sans-serif';

      const dx = toState.position.x - fromState.position.x;
      const dy = toState.position.y - fromState.position.y;
      const angle = Math.atan2(dy, dx);
      const distance = Math.sqrt(dx * dx + dy * dy);

      const fromX = fromState.position.x + Math.cos(angle) * 30;
      const fromY = fromState.position.y + Math.sin(angle) * 30;
      const toX = toState.position.x - Math.cos(angle) * 30;
      const toY = toState.position.y - Math.sin(angle) * 30;

      if (fromState.id === toState.id) {
        const centerX = fromState.position.x;
        const centerY = fromState.position.y - 50;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + 25, centerY - 15);
        ctx.lineTo(centerX + 30, centerY - 10);
        ctx.lineTo(centerX + 20, centerY - 10);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        const headlen = 10;
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - headlen * Math.cos(angle - Math.PI / 6),
          toY - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          toX - headlen * Math.cos(angle + Math.PI / 6),
          toY - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }

      let label = '';
      if (type === 'dfa' && 'symbol' in transition) {
        label = transition.symbol;
      } else if (type === 'pda' && 'inputSymbol' in transition) {
        label = `${transition.inputSymbol}, ${transition.popSymbol} → ${transition.pushSymbol}`;
      } else if (type === 'turing' && 'read' in transition) {
        label = `${transition.read} → ${transition.write}, ${transition.move}`;
      }

      if (fromState.id === toState.id) {
        ctx.fillText(label, fromState.position.x - 20, fromState.position.y - 80);
      } else {
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        const offsetX = -Math.sin(angle) * 15;
        const offsetY = Math.cos(angle) * 15;
        ctx.fillText(label, midX + offsetX, midY + offsetY);
      }
    });

    states.forEach((state) => {
      const isCurrent = currentState === state.id;
      const isSelected = selectedState === state.id;

      ctx.fillStyle = isCurrent ? '#3b82f6' : state.isFinal ? '#10b981' : '#fff';
      ctx.strokeStyle = isSelected ? '#f59e0b' : '#374151';
      ctx.lineWidth = isSelected ? 3 : 2;

      ctx.beginPath();
      ctx.arc(state.position.x, state.position.y, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (state.isFinal) {
        ctx.beginPath();
        ctx.arc(state.position.x, state.position.y, 24, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (state.isInitial) {
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(state.position.x - 50, state.position.y);
        ctx.lineTo(state.position.x - 30, state.position.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(state.position.x - 30, state.position.y);
        ctx.lineTo(state.position.x - 40, state.position.y - 5);
        ctx.lineTo(state.position.x - 40, state.position.y + 5);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = isCurrent ? '#fff' : '#374151';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(state.label, state.position.x, state.position.y);
    });
  }, [states, transitions, type, selectedState, currentState, activeTransition]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedState = states.find((state) => {
      const dx = x - state.position.x;
      const dy = y - state.position.y;
      return Math.sqrt(dx * dx + dy * dy) <= 30;
    });

    if (clickedState) {
      setDraggingState(clickedState.id);
      setOffset({ x: x - clickedState.position.x, y: y - clickedState.position.y });
      onStateClick(clickedState.id);
    } else {
      onCanvasClick(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingState) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const state = states.find((s) => s.id === draggingState);
    if (state) {
      state.position.x = x - offset.x;
      state.position.y = y - offset.y;
    }
  };

  const handleMouseUp = () => {
    setDraggingState(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={600}
      className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}
