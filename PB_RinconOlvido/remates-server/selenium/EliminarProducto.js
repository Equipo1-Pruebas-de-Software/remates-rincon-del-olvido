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
            throw new Error('Producto "Producto de Prueba Editado" no encontrado después de 3 intentos.');
        }

        await productLink.click();

        await sleep(1000);
        
        // Espera hasta que la página cambie de URL
        await driver.wait(until.urlContains('/producto/'), 10000);

        // Obtener la URL actual
        let currentUrl = await driver.getCurrentUrl();
        console.log('URL actual:', currentUrl);

        let expectedUrlPattern = new RegExp(`^${CLIENT_URL}/producto/\\d+$`);
        if (expectedUrlPattern.test(currentUrl)) {
            //Producto correcto, procedemos a eliminarlo
            let botoneliminar = await driver.findElement(By.className('boton-editar-eliminar'));

            await botoneliminar.click();

            await sleep(1000);

            let eliminar = await driver.wait(until.elementLocated(By.className('Eliminarbutton')), 5000);
            await driver.wait(until.elementIsVisible(eliminar), 5000);

            await eliminar.click();

            await sleep(1000);

            // Verificar el popup
            let successPopup = await driver.wait(until.elementLocated(By.className('success-popup')));
            await driver.wait(until.elementIsVisible(successPopup), 5000);
            if (successPopup) {
                console.log('Prueba exitosa: Producto eliminado correctamente');
            }

        } else {
            throw new Error(`URL incorrecta: se esperaba una URL del tipo ${CLIENT_URL}/producto/{id}, pero obtuvimos: ${currentUrl}`);
        }

    } catch (err) {
      console.error('Prueba fallida:', err);
    } finally {
        // Cierra el navegador
        await driver.quit();
    }
})();