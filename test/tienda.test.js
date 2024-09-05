import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('test', function () {
  this.timeout(30000); // Aumenta el tiempo global para pruebas lentas

  describe('Prueba de compra en Forever 21', () => {
    let browser;
    let page;
    let precioProducto;

    before(async () => {
      browser = await puppeteer.launch({ headless: false });
      page = await browser.newPage();
    });

    after(async () => {
      await browser.close();
    });

    it('Debe agregar un producto al carrito y verificar el precio', async () => {
      try {
        // Navegar a Forever 21 
        console.log('1. Navegando a Forever 21');
        await page.goto('https://forever21.com.mx/', { timeout: 60000 });

        // Esperar a que los productos destacados aparezcan
        console.log('2. Esperando productos destacados');
        await page.waitForSelector('.featured-collection-slider__product', { timeout: 60000 });

        // Seleccionar un producto aleatorio y obtener su precio
        console.log('3. Seleccionando un producto aleatorio');
        const productos = await page.$$('.featured-collection-slider__product .product-item__image img');
        if (productos.length === 0) {
          throw new Error('No se encontraron productos');
        }
        const productoAleatorio = productos[Math.floor(Math.random() * productos.length)];
        await productoAleatorio.click();
        console.log('4. Producto clickeado, esperando navegación');
        await page.waitForSelector('.product__price-and-ratings > div > span:nth-child(3)', { timeout: 10000 });

        // Extraer el precio del producto
        console.log('5. Extrayendo el precio del producto');
        precioProducto = await page.$eval('.product__price-and-ratings > div > span:nth-child(3)', el => {
          return parseFloat(el.textContent.replace(/[^0-9.,]/g, '').replace(',', '.'));
        });
        console.log('6. Precio del producto obtenido:', precioProducto);

        // Agregar al carrito
        console.log('7. Agregando producto al carrito');
        await page.waitForSelector('button.product-form__cart-submit', { visible: true, timeout: 60000 });
        await page.click('button.product-form__cart-submit');
        console.log('8. Producto añadido al carrito');

        // Navegar al carrito
        console.log('9. Navegando al carrito');
        await page.waitForSelector('span.icon-header-shopping-cart');
        const carrito = await page.$$('span.icon-header-shopping-cart');
        const carritobutton = carrito[1];
        await carritobutton.click();
        console.log('10. Carrito abierto');

        // Asegurarse de que el precio del carrito esté presente
        console.log('11. Esperando que el precio del carrito esté disponible');
        await page.waitForSelector('.quick-cart__footer-subtotal span', { visible: true, timeout: 60000 });

        // Obtener el precio del carrito y comparar
        console.log('12. Extrayendo el precio del carrito');
        const precioCarrito = await page.$eval('.quick-cart__footer-subtotal span', el =>
          parseFloat(el.textContent.replace(/[^0-9.,]/g, '').replace(',', '.'))
        );
        console.log('13. Precio del carrito obtenido:', precioCarrito);

        // Verificar si el precio del carrito es igual al del producto
        expect(precioCarrito).to.equal(precioProducto);
        console.log('14. Verificación del precio completada: el precio es correcto.');

      } catch (error) {
        console.error('Error durante la prueba:', error);
        throw error; // Re-lanzar el error para que Mocha lo registre como un fallo
      }
    });
  });
});
