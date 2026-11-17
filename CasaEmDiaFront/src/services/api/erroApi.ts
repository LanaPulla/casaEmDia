// Tratamento padronizado dos erros vindos da API.
//
// O backend responde todo erro no formato:
//   { status, erro, mensagem, caminho, campos? }
// Aqui lemos a "mensagem" tratada e a exibimos ao usuário em um alert.

interface ErroResposta {
  status?: number;
  erro?: string;
  mensagem?: string;
  message?: string;
  campos?: Record<string, string>;
}

export class ErroHttp extends Error {
  readonly status: number;
  readonly campos?: Record<string, string>;

  constructor(status: number, message: string, campos?: Record<string, string>) {
    super(message);
    this.status = status;
    this.campos = campos;
    this.name = "ErroHttp";
  }
}

function mensagemPadraoParaStatus(status: number, padrao: string): string {
  if (status === 401) return "Sua sessão expirou. Faça login novamente.";
  if (status === 403) return "Você não tem permissão para realizar esta ação.";
  if (status >= 500) return "O servidor encontrou um erro. Tente novamente mais tarde.";
  return padrao;
}

/**
 * Se a resposta não for 2xx, lança um ErroHttp com a mensagem enviada pelo backend
 * (ou uma mensagem padrão, caso o corpo não traga uma).
 */
export async function lancarSeErro(
  response: Response,
  padrao = "Não foi possível concluir a solicitação."
): Promise<void> {
  if (response.ok) return;

  let mensagem = "";
  let campos: Record<string, string> | undefined;

  try {
    const texto = await response.text();
    if (texto) {
      const corpo = JSON.parse(texto) as ErroResposta;
      mensagem = corpo.mensagem ?? corpo.message ?? "";
      campos = corpo.campos;
    }
  } catch {
    // corpo vazio ou não-JSON: usa a mensagem padrão
  }

  throw new ErroHttp(
    response.status,
    mensagem || mensagemPadraoParaStatus(response.status, padrao),
    campos
  );
}

function ehFalhaDeConexao(error: unknown): boolean {
  return (
    error instanceof TypeError &&
    /fetch|network|load failed/i.test(error.message)
  );
}

/** Converte qualquer erro capturado em um texto amigável. */
export function mensagemDeErro(
  error: unknown,
  padrao = "Ocorreu um erro inesperado."
): string {
  if (error instanceof ErroHttp) return error.message;
  if (ehFalhaDeConexao(error)) {
    return "Não foi possível conectar ao servidor. Verifique se a API está em execução e tente novamente.";
  }
  // Erros de código (bugs) não são mostrados crus ao usuário; ficam no console.
  return padrao;
}

/** Registra o erro no console, exibe a mensagem em alert e a retorna. */
export function exibirErro(error: unknown, padrao?: string): string {
  console.error(error);
  const mensagem = mensagemDeErro(error, padrao);
  alert(mensagem);
  return mensagem;
}
