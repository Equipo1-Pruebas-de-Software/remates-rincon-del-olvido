import { Builder, By, until, Browser } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import dotenv from 'dotenv';
dotenv.config();

// Función para pausar entre acciones
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CLIENT_URL = process.env.CLIENT_URL;

(async function agregarProducto() {
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu', '--no-sandbox'); // Ejecutar en modo visible

    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

    try {
        await driver.manage().window().maximize();
        await driver.get(CLIENT_URL);
        await sleep(1000);

        // Encuentra los campos de email y contraseña
        let emailField = await driver.findElement(By.name('email'));
        let passwordField = await driver.findElement(By.name('password'));
        let loginButton = await driver.findElement(By.css('.loginto-button'));

        // Campos a probar
        await emailField.sendKeys("user@user.cl");
        await sleep(1000);
        await passwordField.sendKeys("asd123");
        await sleep(1000);

        // clic en el boton de login
        await loginButton.click();
        await sleep(1000);

        // Espera hasta que la página cambie de URL
        await driver.wait(until.urlIs(`${CLIENT_URL}/catalogo`), 10000);

        console.log('Prueba exitosa: Inicio de sesión como usuario correcto');

        await sleep(3000);

    } catch (err) {
      console.error('Prueba fallida:', err);
    } finally {
        // Cierra el navegador
        await driver.quit();
    }
})();
