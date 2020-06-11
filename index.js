const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const getUrls = require("get-urls");
const recipeScraper = require("recipe-scraper");
const cors = require("cors");

const app = express();

app.use(cors());

var avalWeb = [
  "101cookbooks.com/",
  "allrecipes.com/rec",
  "ambitiouskitchen.com/",
  "averiecooks.com/",
  "bbc.co.uk/",
  "bbcgoodfood.com/",
  "bonappetit.com/rec",
  "budgetbytes.com/",
  "closetcooking.com/",
  "cookieandkate.com/",
  //"damndelicious.net/",
  "eatingwell.com/",
  "epicurious.com/",
  "finecooking.com/",
  //"food.com/",
  "foodandwine.com/res",
  //'foodnetwork.com/',
  "gimmesomeoven.com/",
  "kitchenstories.com/",
  "myrecipes.com/",
  "nomnompaleo.com/",
  "seriouseats.com/",
  //    'simplyrecipes.com/',
  "smittenkitchen.com/",
  "thepioneerwoman.com/coo",
  "therealfoodrds.com/",
  //"thespruceeats.com/",
  "whatsgabycooking.com/",
  "woolworths.com.au/",
  "yummly.com/",
];

const url = "https://www.google.com/search?q=";

function getRecipeFromUrl(url) {
  var recUrl = "";
  for (var i = 0; i < avalWeb.length; i++) {
    if (url.includes(avalWeb[i])) {
      recUrl = url.substring(0, url.indexOf("&"));
      break;
    }
  }
  return recUrl;
}

app.get("/:food/:num", (req, res) => {
  var searchurl = url + req.params.food + " recipe" + "&start=" + req.params.num;
  (async () => {
    const response = await fetch(searchurl);
    const body = await response.text();
    var urls = getUrls(body);
    var urlsStrings = Array.from(urls);

    let ur = '';
    let num = 0;
    for (var i = 0; i < urlsStrings.length; i++) {
      if (getRecipeFromUrl(urlsStrings[i])) {
        ur = getRecipeFromUrl(urlsStrings[i]);
        num = i;
        break;
      }
    }
    console.log(ur);
    if(ur == '') {
      console.log("No link found");
      return;
    }
    recipeScraper(ur).then(recipe => {
      recipe.url = ur;
      recipe.num = num;
      res.send(recipe)
    }).catch(err => {
      console.log(ur);
      console.log(err.message);
    })
  })();
});

app.listen(8000, () => {});
