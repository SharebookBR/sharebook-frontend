# CLAUDE.md - Memória de Longo Prazo

## 📋 Informações do Projeto 'Sharebook Frontend'

Sharebook é nosso app livre e gratuito para doação de livros. Nosso backend é feito em .NET 10, com arquitetura limpa e testes unitários. O frontend é em Angular.

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
- Ao final de cada sessão, atualize o CLAUDE.md com seu aprendizado. Evite ser muito específico com coisas que vc facilemente lê no código. Tente entender o espírito e escrever boas práticas genéricas. Exceção é quando vc tiver uma dificuldade técnica vale a penas colocar uma colinha de comandos usados aqui.

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

## 📚 Aprendizados e Boas Práticas

### Environment Switcher Pattern
Quando precisar alternar entre múltiplos ambientes (dev/prod/local) em runtime:
- Use **localStorage** para persistir a escolha do usuário entre reloads
- Crie um **service dedicado** que centralize a lógica de ambientes
- Use **factory providers** no Angular para injeção dinâmica de configuração
- Adicione **indicador visual claro** quando não estiver em produção (banner, cor diferente, etc)
- Mantenha **página de configurações** acessível mas não invasiva (footer é bom lugar)

### Validação Visual com Chrome DevTools MCP
- O Chrome DevTools MCP permite validar UI sem abrir o browser manualmente
- Útil para verificar se implementações visuais estão corretas (banners, modais, etc)
- Pode tirar screenshots e fazer assertions programaticamente

### Go-Horse Pragmático
- **Emojis Unicode** funcionam em todos os browsers sem dependências
- Quando Font Awesome não carrega ou adiciona peso desnecessário, use: ⚙️ ✓ ⚠️ ℹ️ ←
- Priorize simplicidade sobre "fazer do jeito certo" quando o resultado é o mesmo

### Busca e Replace em Massa
- Sempre use **Grep** para encontrar todas ocorrências antes de atualizar
- Não esqueça: SEO meta tags, documentação, services injetados
- Exemplo: ao atualizar versão de framework, busque em index.html, CLAUDE.md, services, etc
