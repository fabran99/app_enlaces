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
const PELICULAMEGADRIVE_DOMAIN = "peliculasmegadrive.com";

class SeleniumAutomation {
  // --------------------------------------------------
  // Constants
  // --------------------------------------------------

  ZS_BUTTON_CSS_PATH =
    "#DwsldCn > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > a";

  // --------------------------------------------------
  //   Initialize
  // --------------------------------------------------

  constructor() {
    this.driver = null;
  }

  initialize(allow_headless = false) {
    if (this.driver) {
      return null;
    }
    if (allow_headless) {
      this.driver = new webdriver.Builder()
        .setChromeOptions(new chrome.Options().headless())
        .setChromeService(serviceBuilder)
        .forBrowser("chrome")
        .build();
    } else {
      this.driver = new webdriver.Builder()
        .setChromeOptions(
          new chrome.Options()
            .headless()
            .windowSize({ width: 1280, height: 720 })
            .addArguments(
              "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
            )
        )
        .setChromeService(serviceBuilder)
        .forBrowser("chrome")
        .build();
    }
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
    // get the title of the anime
    let anime_title = link;
    try {
      anime_title = await this.driver
        .findElement(webdriver.By.css("h1.Title"))
        .getText();
    } catch (e) {
      anime_title = link;
    }

    // get all <a> and <p> elements inside the episode list
    let episode_links = await episode_list.findElements(webdriver.By.css("a"));
    // take the first episode link if it doesn't end with "#", else take the second
    let episode_link = await episode_links[0].getAttribute("href");
    if (episode_link.includes("#")) {
      episode_link = await episode_links[1].getAttribute("href");
    }

    // go to the episode link
    var all_links = [];
    // get zippyshare link of the first page
    var zs_link = await this.get_zippyshare_link_from_animeflv_episode(
      episode_link
    );
    // get the title of the episode
    var episode_title = await this.driver
      .findElement(webdriver.By.css("h1.Title"))
      .getText();
    all_links.push({
      link: episode_link,
      episode: episode_title,
      zs_link,
    });
    // get the prev episode link that has the class "CapNvPv", if it does not exist, return all_links
    var prev_episode_link = null;
    try {
      prev_episode_link = await this.driver.findElement(
        webdriver.By.css(".CapNvPv")
      );
      if (prev_episode_link) {
        prev_episode_link = await prev_episode_link.getAttribute("href");
      }
    } catch (e) {
      prev_episode_link = null;
    }

    while (prev_episode_link) {
      // get zippyshare link of the page
      zs_link = await this.get_zippyshare_link_from_animeflv_episode(
        prev_episode_link
      );
      // get the title of the episode
      episode_title = await this.driver
        .findElement(webdriver.By.css("h1.Title"))
        .getText();
      all_links.push({
        link: prev_episode_link,
        episode: episode_title,
        zs_link,
      });
      console.log(prev_episode_link);
      // get the prev episode link that has the class "CapNvPv", if it does not exist, return all_links
      try {
        prev_episode_link = await this.driver.findElement(
          webdriver.By.css(".CapNvPv")
        );
        if (prev_episode_link) {
          prev_episode_link = await prev_episode_link.getAttribute("href");
        }
      } catch (e) {
        prev_episode_link = null;
      }
      console.log(prev_episode_link);
    }
    console.log(all_links);

    all_links.reverse();
    return {
      all_links,
      title: anime_title,
    };

    // let current_link = episode_data[i].link;
    // let current_episode = episode_data[i].episode;
    // let zs_link = await this.get_zippyshare_link_from_animeflv_episode(
    //   current_link
    // );
    // all_links.push({
    //   link: current_episode.link,
    //   episode: current_episode,
    //   zs_link,
    // });

    // let episode_texts = await episode_list.findElements(webdriver.By.css("p"));

    // var episode_data = [];
    // if (episode_texts.length != episode_links.length) {
    //   // ignore first episode_link
    //   episode_links.shift();
    // }
    // for (let index = 0; index < episode_links.length; index++) {
    //   let episode_link = episode_links[index];
    //   let current_link_text = await episode_texts[index].getText();
    //   let current_link = await episode_link.getAttribute("href");
    //   episode_data.push({
    //     link: current_link,
    //     episode: current_link_text,
    //   });
    // }
    // // reverse the order of episode_data
    // episode_data.reverse();
    // let all_links = [];
    // for (let i = 0; i < episode_data.length; i++) {
    // let current_link = episode_data[i].link;
    // let current_episode = episode_data[i].episode;
    // let zs_link = await this.get_zippyshare_link_from_animeflv_episode(
    //   current_link
    // );
    // all_links.push({
    //   link: current_episode.link,
    //   episode: current_episode,
    //   zs_link,
    // });
    // }
    // return all_links;
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  async get_download_links(
    linkList,
    onLinkCompleted,
    onLinkFailed,
    onLinkStart
  ) {
    // let animeflv_link = linkList.find((e) => e.includes(ANIMEFLV_DOMAIN));

    this.initialize();
    var links = [];

    for (let i = 0; i < linkList.length; i++) {
      let link = linkList[i];
      // check if the link is from animeflv
      if (onLinkStart) {
        onLinkStart(link);
      }
      if (link.includes(ANIMEFLV_DOMAIN)) {
        try {
          let episode_links = await this.get_episode_links_from_animeflv(link);
          let link_data = {
            link,
            episode_links: episode_links.all_links,
            title: episode_links.title,
          };
          links.push(link_data);
          if (onLinkCompleted) {
            onLinkCompleted(link);
          }
        } catch (e) {
          console.log(e);
          if (onLinkFailed) {
            onLinkFailed(link);
          }
        }
      } else if (link.includes(PELICULAMEGADRIVE_DOMAIN)) {
        try {
          let movie_link = await this.get_pelicula_mega_drive_links(link);
          let link_data = {
            link,
            movie_link: movie_link.zs_links,
            title: movie_link.title,
          };
          links.push(link_data);
          if (onLinkCompleted) {
            onLinkCompleted(link);
          }
        } catch {
          if (onLinkFailed) {
            onLinkFailed(link);
          }
        }
      }
    }
    await this.driver.quit();
    return links;
  }

  // --------------------------------------------------
  //   MOVIE PELICULA MEGA DRIVE MOVIE
  // --------------------------------------------------
  async get_pelicula_mega_drive_links(link) {
    await this.driver.get(link);
    // get the title of the movie
    let title = link;
    try {
      title = await this.driver
        .findElement(webdriver.By.css("h2.titulo a"))
        .getText();
      title = title.split("[")[0];
      console.log(title);
    } catch (e) {
      console.log(e);
      title = link;
    }

    let download_div = await this.driver.findElement(webdriver.By.id("mmedia"));
    let zs_link = await download_div.findElement(webdriver.By.css(".ext-link"));
    //*[@id="mmedia"]/div/fieldset[2]/div[2]/a
    let link_list = await zs_link.getAttribute("href");
    await this.driver.get(link_list);
    let list_of_links = await this.driver.findElement(webdriver.By.id("tab1"));
    let zs_links = [];
    let list_of_a = await list_of_links.findElements(webdriver.By.css("a"));

    for (let i = 0; list_of_a.length > i; i++) {
      let current_link = await list_of_a[i].getAttribute("href");
      if (current_link.includes("zippyshare.com")) {
        zs_links.push(current_link);
      }
    }
    return {
      zs_links,
      title,
    };
  }

  // async get_episode_links_from_peliculasmegadrive(link) {
  //   // go to the url
  //   await this.driver.get(link);
  //   //*[@id="marco-post"]/h2/a
  //   // movie are inside an h2 with id marco-post in an 'a'
  //   let movie = await this.driver.findElement(
  //     webdriver.By.id("marco-post")
  //   );

  //   let movie_link = await movie.findElement(webdriver.By.xpath('/html/body/div[3]/div/div[1]/h2/a'));
  //     let movie_name= await movie.findElement(webdriver.By.css('a'))
  //     let name_data = await movie_name.getText();
  //     let link_data= await movie_link.getAttribute("href")
  //     let movie_data={
  //       nombre:name_data,
  //       link: link_data

  //     }
  //     console.log(movie_data)

  //   }
  //   async get_download_links_movies() {
  //     let linkList = this.data;
  //     this.initialize();

  //     for (let i = 0; i < linkList.length; i++) {
  //       let link = linkList[i];
  //       // check if the link is from animeflv
  //       if (link.includes(PELICULAMEGADRIVE_DOMAIN)) {
  //         console.log(`${link} is a movie link`);
  //         let movie_name = await this.get_episode_links_from_peliculasmegadrive(link);

  //       }
  //     }

  //   }
  //   async get_zippyshare_link_from_movie(link) {
  //     await this.driver.get(link);
  //     // get the <a> element following the xpath
  //     this.initialize();
  //     let zs_buttons = await this.driver.findElements(
  //       webdriver.By.xpath('/html/body/div[3]/div/div[1]/div[1]/div[1]/div/div[3]/div/div/fieldset/p/a')
  //     );
  //     // // get the href attribute of the button
  //     let zs_link = await zs_buttons[1].getAttribute("href");

  //     return zs_link;
  //   }
}

// var a = new SeleniumAutomation("GET_DOWNLOADS_LINKS", [
//   "https://peliculasmegadrive.com/globo-las-maravillas-del-arrecife-2021-hd-1080p-latino-gd-mg-md-fl-up-1f-levellhd/",
//   'https://www3.animeflv.net/anime/jahysama-wa-kujikenai'
// ]);
// a.get_download_links().then(response=>console.log(response))
// var a = new SeleniumAutomation("GET_DOWNLOADS_LINKS_MOVIES", [
//   "https://peliculasmegadrive.com/globo-las-maravillas-del-arrecife-2021-hd-1080p-latino-gd-mg-md-fl-up-1f-levellhd/",
// ]);
// a.get_download_links_movies();

module.exports = { SeleniumAutomation };
