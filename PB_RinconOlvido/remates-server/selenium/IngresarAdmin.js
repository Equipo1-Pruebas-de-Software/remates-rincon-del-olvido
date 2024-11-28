import { Builder, By, until, Browser } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import dotenv from 'dotenv';
dotenv.config();

// Función para pausar entre acciones
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CLIENT_URL = process.env.CLIENT_URL;

(async function agregarProducto() {
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu'); // Ejecutar en modo visible

    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

    try {
        await driver.manage().window().maximize();
        await driver.get(CLIENT_URL);
        await sleep(1000);

        // Encuentra el botón "Ingresar como Administrador" usando su clase
        let adminButton = await driver.findElement(By.css('.admin-log'));

        //clic en el boton de admin
        await adminButton.click();
        await sleep(1000);

        // Espera hasta que la URL cambie a la pagina de administrador
        await driver.wait(until.urlContains('/loginAdmin'), 10000);

        // Encuentra los campos de email y contraseña
        let emailField = await driver.findElement(By.name('email'));
        let passwordField = await driver.findElement(By.name('password'));
        let loginButton = await driver.findElement(By.css('.loginto-button-admin'));

        // Campos a probar
        await emailField.sendKeys("admin@admin.cl");
        await sleep(1000);
        await passwordField.sendKeys("asd123");
        await sleep(1000);

        // clic en el boton de login
        await loginButton.click();
        await sleep(1000);

        // Espera hasta que la página cambie de URL
        await driver.wait(until.urlIs(`${CLIENT_URL}/catalogo`), 10000);

        console.log('Prueba exitosa: Inicio de sesión como Administrador correcto');

        await sleep(3000);

    } catch (err) {
      console.error('Prueba fallida:', err);
    } finally {
        // Cierra el navegador
        await driver.quit();
    }
})();