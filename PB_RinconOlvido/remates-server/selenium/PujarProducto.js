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
        await driver.wait(until.urlIs('http://localhost:3000/catalogo'), 10000);

        await sleep(1000);

        // Esperar hasta que al menos un producto esté visible (en este caso, usando la clase 'catalogo-card' que envuelve cada producto)
        await driver.wait(until.elementLocated(By.className('catalogo-card')), 10000);

        //Encuentra el producto "Producto de Prueba" (Intenta 3 veces antes de tirar error)
        let productLink;
        let retries = 0;
        while (retries < 3) {
        try {
            productLink = await driver.findElement(By.name("Producto de Prueba Editado"));
            break; // Si lo encuentra, salimos del bucle
        } catch (error) {
            console.log("Producto no encontrado, reintentando...");
            await driver.sleep(2000); // Espera 2 segundos antes de reintentar
            retries++;
        }
        }

        // Si despues de varios intentos no encuentra el producto, lanza un error
        if (!productLink) {
            throw new Error('Producto "Producto de Prueba" no encontrado después de 3 intentos.');
        }

        await productLink.click();

        await sleep(1000);
        
        // Espera hasta que la página cambie de URL
        await driver.wait(until.urlContains('/producto/'), 10000);

        // Obtener la URL actual
        let currentUrl = await driver.getCurrentUrl();
        console.log('URL actual:', currentUrl);

        let expectedUrlPattern = /^http:\/\/localhost:3000\/producto\/\d+$/;
        if (expectedUrlPattern.test(currentUrl)) {
            //Producto correcto
            let botonoferta = await driver.findElement(By.className('boton-oferta'));

            await botonoferta.click();

            await sleep(1000);

            //Encuentra los campos del formulario
            let nombreField = await driver.wait(until.elementLocated(By.name('input_oferta')), 5000);
            await driver.wait(until.elementIsVisible(nombreField), 5000);
            await nombreField.clear();
            await nombreField.sendKeys("7777");
            await sleep(1000);

            let enviar = await driver.wait(until.elementLocated(By.name('enviar_oferta')), 5000);
            await driver.wait(until.elementIsVisible(enviar), 5000);

            // clic en el boton de agregar del popUp
            await enviar.click();

            // Verificar el popup
            let successPopup = await driver.wait(until.elementLocated(By.className('success-popup')));
            await driver.wait(until.elementIsVisible(successPopup), 5000);
            if (successPopup) {
                console.log('Prueba exitosa: Nueva puja para el producto "Producto de Prueba Editado" realizada correctamente');
            }

        } else {
            throw new Error(`URL incorrecta: se esperaba una URL del tipo http://localhost:3000/producto/{id}, pero obtuvimos: ${currentUrl}`);
        }

    } catch (err) {
      console.error('Prueba fallida:', err);
    } finally {
        // Cierra el navegador
        await driver.quit();
    }
})();