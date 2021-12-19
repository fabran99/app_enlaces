// import selenium
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");
const ServiceBuilder = chrome.ServiceBuilder;
// chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
const chromedriverPath = require("chromedriver").path.replace(
  "app.asar",
  "app.asar.unpacked"
);
const serviceBuilder = new ServiceBuilder(chromedriverPath);

const ANIMEFLV_DOMAIN = "animeflv.net";

class SeleniumAutomation {
  // --------------------------------------------------
  // Constants
  // --------------------------------------------------
  ACTIONS = {
    GET_DOWNLOAD_LINKS: this.get_download_links,
    UPLOAD_LINKS: this.get_download_links,
  };

  ZS_BUTTON_CSS_PATH =
    "#DwsldCn > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > a";

  // --------------------------------------------------
  //   Initialize
  // --------------------------------------------------

  constructor(action, data) {
    this.action = action;
    this.data = data;
    this.driver = null;
  }

  initialize() {
    if (this.driver) {
      return null;
    }
    this.driver = new webdriver.Builder()
      // .setChromeOptions(new chrome.Options().headless())
      .setChromeService(serviceBuilder)
      .forBrowser("chrome")
      .build();
  }

  // --------------------------------------------------
  //   ANIMEFLV
  // --------------------------------------------------

  async get_zippyshare_link_from_animeflv_episode(link) {
    await this.driver.get(link);
    // get the <a> element following the xpath
    let zs_buttons = await this.driver.findElements(
      webdriver.By.css(".Button.Sm.fa-download")
    );
    // // get the href attribute of the button
    let zs_link = await zs_buttons[1].getAttribute("href");

    return zs_link;
  }

  async get_episode_links_from_animeflv(link) {
    // go to the url
    await this.driver.get(link);
    // episodes are inside an ul with id episodeList
    let episode_list = await this.driver.findElement(
      webdriver.By.id("episodeList")
    );
    // get all <a> and <p> elements inside the episode list
    let episode_links = await episode_list.findElements(webdriver.By.css("a"));
    let episode_texts = await episode_list.findElements(webdriver.By.css("p"));

    var episode_data = [];
    if (episode_texts.length != episode_links.length) {
      // ignore first episode_link
      episode_links.shift();
    }
    for (let index = 0; index < episode_links.length; index++) {
      let episode_link = episode_links[index];
      let current_link_text = await episode_texts[index].getText();
      let current_link = await episode_link.getAttribute("href");
      episode_data.push({
        link: current_link,
        episode: current_link_text,
      });
    }
    // reverse the order of episode_data
    episode_data.reverse();
    console.log(episode_data);
    let all_links = [];
    for (let i = 0; i < episode_data.length; i++) {
      let current_link = episode_data[i].link;
      let current_episode = episode_data[i].episode;
      let zs_link = await this.get_zippyshare_link_from_animeflv_episode(
        current_link
      );
      all_links.push({
        link: current_episode.link,
        episode: current_episode,
        zs_link,
      });
    }
    return all_links;
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  async get_download_links() {
    let linkList = this.data;
    this.initialize();
    var links = [];

    for (let i = 0; i < linkList.length; i++) {
      let link = linkList[i];
      // check if the link is from animeflv
      if (link.includes(ANIMEFLV_DOMAIN)) {
        console.log(`${link} is an animeflv link`);
        let episode_links = await this.get_episode_links_from_animeflv(link);
        links.push({
          link,
          episode_links,
        });
      }
    }

    return links;
  }
}

// var a = new SeleniumAutomation("GET_DOWNLOADS_LINKS", [
//   "https://www3.animeflv.net/anime/visual-prison",
// ]);
// a.get_download_links();
module.exports = { SeleniumAutomation };
