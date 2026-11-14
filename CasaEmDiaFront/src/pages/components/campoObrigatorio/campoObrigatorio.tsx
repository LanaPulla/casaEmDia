import type { ReactNode } from 'react';
import './campoObrigatorio.css';

/**
 * Rótulo de campo obrigatório: exibe o texto seguido de um asterisco vermelho.
 * Uso: <label><RotuloObrigatorio>Nome</RotuloObrigatorio><input required /></label>
 */
export function RotuloObrigatorio({ children }: { children: ReactNode }) {
  return (
    <span className="rotulo-obrigatorio">
      {children}
      <span className="asterisco-obrigatorio" aria-hidden="true">*</span>
    </span>
  );
}

/** Legenda exibida no topo do formulário explicando o asterisco. */
export function LegendaObrigatorio({ className = '' }: { className?: string }) {
  return (
    <p className={`legenda-obrigatorio ${className}`.trim()}>
      <span className="asterisco-obrigatorio" aria-hidden="true">*</span> Campo obrigatório
    </p>
  );
}
