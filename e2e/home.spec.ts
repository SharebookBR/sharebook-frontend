import { test, expect } from '@playwright/test';

test('home page carrega com o título e o header do ShareBook', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/ShareBook/);
  await expect(page.locator('app-header')).toBeVisible();
  await expect(page.locator('app-footer')).toBeVisible();
});

test('rota inexistente mostra a página de não encontrado', async ({ page }) => {
  // ng serve (dev server client-side) sempre responde 200 e deixa o router
  // do Angular decidir o conteúdo - o 404 HTTP real só existe no SSR
  // (validado à parte via curl contra o servidor Node). Aqui validamos
  // o conteúdo renderizado, não o status HTTP.
  await page.goto('/rota-que-nao-existe-xyz');

  await expect(page.locator('body')).toContainText(/não encontrada/i);
});

test('página de registro renderiza o formulário com reCAPTCHA', async ({ page }) => {
  await page.goto('/register');

  await expect(page.locator('app-form form')).toBeVisible();
  // Verifica presença, não visibilidade: o widget do reCAPTCHA só ganha
  // tamanho depois que o script externo do Google carrega e chama
  // grecaptcha.render() - fora do nosso controle e pode estar bloqueado
  // em ambientes de rede restrita (sandboxes de CI, por exemplo).
  await expect(page.locator('re-captcha')).toBeAttached();
});
