/**
 * Perfis com permissão de exclusão (DELETAR_TAREFA e DELETAR_EVENTO),
 * espelhando o que está configurado no data.sql da API.
 */
const PERFIS_QUE_PODEM_EXCLUIR = ['ADMINISTRADOR_CASA', 'DEV'];

/** Lê o perfil do usuário logado salvo no localStorage. */
export function obterPerfilUsuario(): string | null {
  let perfilSalvo = localStorage.getItem('perfilUsuario');

  // Tratamento para caso tenha sido salvo como objeto JSON no localStorage
  if (perfilSalvo && perfilSalvo.startsWith('{')) {
    try {
      const parsed = JSON.parse(perfilSalvo);
      perfilSalvo = parsed.nome ?? parsed;
    } catch {
      // Mantém o valor original caso falhe o parse
    }
  }

  return perfilSalvo;
}

/** true se o usuário logado pode excluir tarefas e eventos da agenda. */
export function podeExcluir(): boolean {
  const perfil = obterPerfilUsuario();
  return perfil !== null && PERFIS_QUE_PODEM_EXCLUIR.includes(perfil);
}
