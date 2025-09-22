# CLAUDE.md - Memória de Longo Prazo

## 📋 Informações do Projeto 'Sharebook Frontend'

Sharebook é nosso app livre e gratuito para doação de livros. Nosso backend é feito em .NET 8, com arquitetura limpa e testes unitários. O frontend é em Angular.

### Sobre o Desenvolvedor Raffa

- Clean Code + Clean Architecture: modular, coeso, com separação clara de responsabilidades.
- Valoriza boa organização do projeto, com bons nomes de pastas e arquivos. Vale a pena investir tempo nisso.
- Valoriza nomes significativos e expressivos para componentes, hooks e funções. Vale a pena investir tempo nisso.
- Odeia retrabalho — antes de criar, sempre verifica se já não existe pronto e gratuito.
- Preza por segurança — validação e autorização bem feitas não são opcionais.
- Gosta de impressionar — seja o cliente, o time ou a diretoria, sempre com um toque extra.
- Não gosta de bajulação. Prefere uma personalidade confiante e levemente sarcástica e irônica.
- Caso a tarefa não seja trivial, explique o seu plano antes de colocar a mão na massa.

### Dicas de ouro

- Leve em consideração que o claude está rodando no powershell
- Quando o usuário falar pra olhar a colinha, analise o arquivo "colinha.txt" na raíz.
- Quando o usuário falar pra olhar o print 142, olhe o arquivo "C:\Users\brnra019\Documents\Lightshot\Screenshot_142.png"

### 🚨 IMPORTANTE: Filosofia de Debugging e Transparência

**O Sharebook é um projeto open source, livre e gratuito. NÃO temos segredos comerciais para proteger.**

**SEMPRE exiba erros detalhados do backend para ajudar no debugging:**
- Mostre todas as `messages[]` do backend nos toasts de erro
- Use `console.error()` para logging detalhado
- Capture e exiba erros HTTP completos quando possível
- Exemplo de resposta de erro do backend:
```json
{
    "value": null,
    "messages": ["Entidade não encontrada. Por favor, verifique."],
    "successMessage": null,
    "success": false
}
```

**Lógica padrão para tratamento de erros:**
```typescript
.subscribe(
  (resp) => {
    if (resp['success']) {
      this._toastr.success(resp['successMessage'] || 'Operação realizada com sucesso!');
    } else {
      const errorMessages = resp['messages']?.join(' ') || 'Erro inesperado.';
      this._toastr.error(errorMessages);
    }
  },
  (error) => {
    console.error('Erro detalhado:', error);
    const errorMessage = error?.error?.messages?.join(' ') || error?.message || 'Erro inesperado.';
    this._toastr.error(errorMessage);
  }
);
```

Esta transparência ajuda a comunidade a entender e contribuir com o projeto!
