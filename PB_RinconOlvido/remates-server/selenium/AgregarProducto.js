import { Builder, By, until, Browser } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

// Función para pausar entre acciones
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async function agregarProducto() {
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu'); // Ejecutar en modo visible

    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

    try {
        await driver.manage().window().maximize();
        await driver.get('http://localhost:3000/');
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
        await driver.wait(until.urlIs('http://localhost:3000/catalogo'), 10000);

        // Encuentra el boton de agregar producto
        let agregarField = await driver.findElement(By.className('boton-agregar'));

        // clic en el boton de agegar de catalogo
        await agregarField.click();

        await sleep(1000); //Esperar 1 segundo para que se abra el popup

        //Encuentra los campos del formulario
        let nombreField = await driver.wait(until.elementLocated(By.name('nombre_producto')), 5000);
        await driver.wait(until.elementIsVisible(nombreField), 5000);
        await nombreField.sendKeys("Producto de Prueba");
        await sleep(1000);

        let precioField = await driver.wait(until.elementLocated(By.name("precio_producto")), 5000);
        await driver.wait(until.elementIsVisible(precioField), 5000);
        await precioField.sendKeys("5000");
        await sleep(1000);

        let fechaField = await driver.wait(until.elementLocated(By.name("fecha_producto")), 5000);
        await driver.wait(until.elementIsVisible(fechaField), 5000);
        await fechaField.sendKeys('31-12-2024');
        await sleep(1000);

        let urlField = await driver.wait(until.elementLocated(By.name("url_producto")), 5000);
        await driver.wait(until.elementIsVisible(urlField), 5000);
        await urlField.sendKeys('https://cdn-icons-png.freepik.com/256/1312/1312307.png?semt=ais_hybrid');
        await sleep(1000);

        let descField = await driver.wait(until.elementLocated(By.name("desc_producto")), 5000);
        await driver.wait(until.elementIsVisible(descField), 5000);
        await descField.sendKeys("Descripcion de prueba");
        await sleep(1000);

        let agregarBoton = await driver.wait(until.elementLocated(By.className('agregar-boton-aplicar')), 5000);
        await driver.wait(until.elementIsVisible(agregarBoton), 5000);

        // clic en el boton de agregar del popUp
        await agregarBoton.click();

        // Verificar el popup
        let successPopup = await driver.wait(until.elementLocated(By.className('success-popup')));
        await driver.wait(until.elementIsVisible(successPopup), 5000);
        if (successPopup) {
            console.log('Prueba exitosa: Producto agregado correctamente');
        }

    } catch (err) {
      console.error('Prueba fallida:', err);
    } finally {
        // Cierra el navegador
        await driver.quit();
    }
})();