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
  ACTIONS = {
    GET_DOWNLOAD_LINKS: this.get_download_links,
    UPLOAD_LINKS: this.get_download_links,
    GET_DOWNLOAD_LINKS_TEST:this.get_download_links_movies
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

  initialize(allow_headless=false) {
    if (this.driver) {
      return null;
    }
    if(allow_headless){
      this.driver = new webdriver.Builder()
      .setChromeOptions(new chrome.Options().headless())
     .setChromeService(serviceBuilder)
     .forBrowser("chrome")
     .build();
    }
    else{
      this.driver = new webdriver.Builder()
      // .setChromeOptions(new chrome.Options().headless())
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
    let animeflv_link= linkList.find((e)=>e.includes(ANIMEFLV_DOMAIN))

    this.initialize(!animeflv_link);
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
      else if (link.includes(PELICULAMEGADRIVE_DOMAIN)){
        let movie_link=await this.get_pelicula_mega_drive_links(link);
        links.push({
          link,movie_link
        })
      }
    }
    await this.driver.quit() 
    return links;
  }




  // --------------------------------------------------
  //   MOVIE PELICULA MEGA DRIVE MOVIE
  // --------------------------------------------------
  async get_pelicula_mega_drive_links(link){
    await this.driver.get(link)
    let zs_button= await this.driver.findElement(
      webdriver.By.xpath('/html/body/div[3]/div/div[1]/div[1]/div[1]/div/div[3]/div/div/fieldset/p/a')
    );
    let link_list=await zs_button.getAttribute('href')
    await this.driver.get(link_list)
    let list_of_links= await this.driver.findElement(webdriver.By.id('tab1'))
    let zs_link= [];
    let list_of_a= await list_of_links.findElements(webdriver.By.css('a')) 
    
    for(let i=0; list_of_a.length>i; i++ ){
      let current_link=await list_of_a[i].getAttribute('href')
      if(current_link.includes('zippyshare.com')){
        zs_link.push(current_link)
      }
    }
    return zs_link
    
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