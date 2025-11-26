/**
 * Teste End-to-End com Selenium
 * Testa a funcionalidade de Login no sistema
 *
 * Este teste automatiza o navegador Chrome para verificar:
 * 1. Login bem-sucedido com credenciais válidas
 * 2. Login falhado com credenciais inválidas
 */

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// Importar chromedriver para garantir que está instalado e configurado
require("chromedriver");

// Configurações
const FRONTEND_URL = "http://localhost:5173/login";
const TIMEOUT = 10000;

// Credenciais para teste
const VALID_CREDENTIALS = {
  email: "usuario@ifrs.edu.br",
  password: "senha123",
};

const INVALID_CREDENTIALS = {
  email: "invalido@test.com",
  password: "senhaerrada",
};

/**
 * Função auxiliar para aguardar um elemento
 */
async function waitForElement(driver, locator, timeout = TIMEOUT) {
  try {
    const element = await driver.wait(until.elementLocated(locator), timeout);
    await driver.wait(until.elementIsVisible(element), timeout);
    return element;
  } catch (error) {
    console.error(`Erro ao aguardar elemento: ${error.message}`);
    throw error;
  }
}

/**
 * Teste 1: Login bem-sucedido
 */
async function testSuccessfulLogin() {
  console.log("\nIniciando teste de login");
  let driver;

  try {
    const options = new chrome.Options();
    driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

    await driver.get(FRONTEND_URL);

    const emailInput = await waitForElement(driver, By.css('input[type="email"]'));
    await emailInput.clear();
    await emailInput.sendKeys(VALID_CREDENTIALS.email);

    const passwordInput = await waitForElement(driver, By.css('input[type="password"]'));
    await passwordInput.clear();
    await passwordInput.sendKeys(VALID_CREDENTIALS.password);

    const submitButton = await waitForElement(driver, By.css('button[type="submit"]'));
    await submitButton.click();

    await driver.wait(until.urlContains("/dashboard"), TIMEOUT);
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("/dashboard")) {
      console.log("LOGIN BEM-SUCEDIDO: Usuário autenticado e redirecionado para o dashboard");
      return true;
    } else {
      console.error('Falha na URL');
      return false;
    }
  } catch (error) {
    console.error("ERRO no teste de login bem-sucedido:");
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
    return false;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

/**
 * Teste 2: Login com credenciais inválidas
 */
async function testFailedLogin() {
  console.log("\nIniciando teste de login com credenciais inválidas");
  let driver;

  try {
    const options = new chrome.Options();
    driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

    await driver.get(FRONTEND_URL);

    const emailInput = await waitForElement(driver, By.css('input[type="email"]'));
    await emailInput.clear();
    await emailInput.sendKeys(INVALID_CREDENTIALS.email);

    const passwordInput = await waitForElement(driver, By.css('input[type="password"]'));
    await passwordInput.clear();
    await passwordInput.sendKeys(INVALID_CREDENTIALS.password);

    const submitButton = await waitForElement(driver, By.css('button[type="submit"]'));
    await submitButton.click();

    await driver.sleep(2000);
    const errorMessages = await driver.findElements(By.css('.alert, [class*="error"], [class*="alert"]'));

    if (errorMessages.length > 0) {
      const errorText = await errorMessages[0].getText();
    }

    const currentUrl = await driver.getCurrentUrl();

    if (!currentUrl.includes("/dashboard")) {
      console.log("Login falhou corretamente");
      return true;
    } else {
      console.error("Falha: Foi redirecionado para dashboard com credenciais inválidas");
      return false;
    }
  } catch (error) {
    console.error("Erro no teste de login com credenciais inválidas:");
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
    return false;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

async function runAllTests() {
  console.log("INICIANDO TESTES E2E - FUNCIONALIDADE DE LOGIN");

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  // Executar Teste 1: Login bem-sucedido
  results.total++;
  const test1Result = await testSuccessfulLogin();
  if (test1Result) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Executar Teste 2: Login com credenciais inválidas
  results.total++;
  const test2Result = await testFailedLogin();
  if (test2Result) {
    results.passed++;
  } else {
    results.failed++;
  }

  console.log("\nRelatório final dos testes E2E:");
  console.log(`Total de testes: ${results.total}`);
  console.log(`Testes bem-sucedidos: ${results.passed}`);
  console.log(`Testes falhados: ${results.failed}`);

  process.exit(results.failed > 0 ? 1 : 0);
}

runAllTests().catch((error) => {
  console.error("Erro ao executar testes:", error);
  process.exit(1);
});
