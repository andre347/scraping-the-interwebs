import puppeteer from "puppeteer";
import writeFileFunc from "./writeFile";
import { cookie } from "./cookie";

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setViewport({ width: 0, height: 0 });
    const url = "https://www.olimerca.com/precios/tipoInforme/2";
    await page.setCookie(...cookie);

    await page.goto(url, { waitUntil: "networkidle0" });
    const cookies = await page.cookies();
    console.log(cookies);

    //accept cookies if we need to
    // await page.click("#modalCookies > div > div > div.modal-footer > button", { clickCount: 1 });
    await page.waitFor(3000);
    //wait 3 secs and then click the first arrow
    let tableData = [];
    for (let index = 0; index < 20; index++) {
      await page.click("#ctl00_MainContent_ctrlTablaPreciosAceite13_lnkFechaAnt", { clickCount: 1 });
      await page.waitFor(1000);
      // if (index == 0) {
      // await page.click("#modalNewsletter > div > div > div.modal-header > button");
      const res = await page.evaluate(() => {
        let price1 = document.getElementById(
          "ctl00_MainContent_ctrlTablaPreciosAceite13_gvInformeTipo3_Subcategorias_ctrl0_ctl00_gvInformeTipo3_ProductosPrecios2_ctrl0_ctl00_lbPrecio"
        ).innerHTML;
        let price2 = document.getElementById(
          "ctl00_MainContent_ctrlTablaPreciosAceite13_gvInformeTipo3_Subcategorias_ctrl0_ctl00_gvInformeTipo3_ProductosPrecios2_ctrl1_ctl00_lbPrecio"
        ).innerHTML;
        let price3 = document.getElementById(
          "ctl00_MainContent_ctrlTablaPreciosAceite13_gvInformeTipo3_Subcategorias_ctrl0_ctl00_gvInformeTipo3_ProductosPrecios2_ctrl2_ctl00_lbPrecio"
        ).innerHTML;
        let dateFrom = document.getElementById("ctl00_MainContent_ctrlTablaPreciosAceite13_lbFecha2_InformeTipo3")
          .innerHTML;
        let dateTo = document.getElementById("ctl00_MainContent_ctrlTablaPreciosAceite13_lbFecha1_InformeTipo3")
          .innerHTML;
        return {
          from: dateFrom,
          to: dateTo,
          price1,
          price2,
          price3
        };
      });
      tableData.push(res);
    }
    console.log(tableData);
    writeFileFunc(`items.json`, JSON.stringify(tableData));
    await browser.close();
    await console.log("Done!");
  } catch (err) {
    console.log(err);
  }
})();
