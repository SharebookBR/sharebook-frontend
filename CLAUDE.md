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

### Validação Visual com Chrome DevTools MCP
- O Chrome DevTools MCP permite validar UI sem abrir o browser manualmente
- Útil para verificar se implementações visuais estão corretas (banners, modais, etc)
- Pode tirar screenshots e fazer assertions programaticamente

### Busca e Replace em Massa
- Sempre use **Grep** para encontrar todas ocorrências antes de atualizar
- Não esqueça: SEO meta tags, documentação, services injetados
- Exemplo: ao atualizar versão de framework, busque em index.html, CLAUDE.md, services, etc

### O que persistir no CLAUDE.md
- **Não registrar coisas que se lêem facilmente no código** — nomes de endpoints, estrutura de ViewModel, etc.
- **Registrar boas práticas gerais** aprendidas na prática, que valem para qualquer feature futura
- **Registrar armadilhas não óbvias** — comportamentos inesperados de libs, CSS, Angular, que custariam tempo redescobrir

### Armadilhas com Form Controls e inputs customizados
- `setValue()` em form controls ligados a `<input type="file">` com `ControlValueAccessor` customizado pode não persistir até o submit — quando isso acontecer, corrigir o valor na camada de submit, não no form control

### Armadilhas com CSS genérico em containers
- Seletores como `.container div` afetam todos os descendentes — ao adicionar novos elementos dentro de containers existentes, verificar se há regras CSS genéricas que possam impactar o layout do novo elemento

### Compatibilidade de libs com versão do Angular
- Antes de instalar qualquer lib, verificar compatibilidade com a versão do Angular do projeto (13)
- Libs modernas tendem a exigir Angular 14+ e usar standalone components sem NgModule

### Backlog Técnico
- **Upgrade Angular 13 → 18** — projeto tem vulnerabilidades de segurança (XSS, XSRF) que só se resolvem com upgrade. Fazer de forma incremental: 13→14→15→16→17→18
