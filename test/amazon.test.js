import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('test', function () {
  this.timeout(30000); 

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
      // Navegar a Forever 21 
      await page.goto('https://forever21.com.mx/', { timeout: 30000 });

      // Esperar a que los productos destacados aparezcan
      await page.waitForSelector('.image__img');

      // Seleccionar un producto aleatorio y obtener su precio
      const productos = await page.$$('.featured-collection-slider__product .product-item__image img');
      const productoAleatorio = productos[Math.floor(Math.random() * productos.length)];
      await productoAleatorio.click();
      await page.waitForNavigation();
      precioProducto = await productoAleatorio.evaluate(el => {
        const precioElement = el.closest('.product__chip selected dynamic-variant-button').querySelector('.data-price');
        return parseFloat(precioElement.textContent.replace(/[^0-9.,]/g, '').replace(',', '.'));
      });

      // Agregar al carrito y navegar al carrito
      await page.click('.button.product-form__cart-submit');
      await page.click('a.header__icon-touch.header__icon-touch--cart');

      // Obtener el precio del carrito y comparar
      const precioCarrito = await page.$eval('#shopify-section-sections--16036153262262__quick-cart .quick-cart__footer-subtotal span', el =>
        parseFloat(el.textContent.replace(/[^0-9.,]/g, '').replace(',', '.'))
      );
      expect(precioCarrito).to.equal(precioProducto);
    });
  });
});
