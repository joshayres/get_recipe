const express = require('express');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const getUrls = require('get-urls');
const recipeScraper = require('recipe-scraper');
const cors = require('cors');

const app = express();

app.use(cors());

var avalWeb = [
    '101cookbooks.com/',
    'allrecipes.com/rec',
    'ambitiouskitchen.com/',
    'averiecooks.com/',
    'bbc.co.uk/',
    'bbcgoodfood.com/',
    'bonappetit.com/rec',
    'budgetbytes.com/',
    'closetcooking.com/',
    'cookieandkate.com/',
    'damndelicious.net/',
    'eatingwell.com/',
    'epicurious.com/',
    'finecooking.com/',
    'food.com/',
    'foodandwine.com/res',
//    'foodnetwork.com/',
    'gimmesomeoven.com/',
    'kitchenstories.com/',
    'myrecipes.com/',
    'nomnompaleo.com/',
    'seriouseats.com/',
//    'simplyrecipes.com/',
    'smittenkitchen.com/',
    'thepioneerwoman.com/',
    'therealfoodrds.com/',
    'thespruceeats.com/',
    'whatsgabycooking.com/',
    'woolworths.com.au/',
    'yummly.com/',
];

const url = "https://www.google.com/search?q=";

app.get('/:food', (req, res) => {
    var searchurl = url + req.params.food + "recipe";
    (async () => {
        const response = await fetch(searchurl);
        const body = await response.text();
        var urls = getUrls(body);
        var urlsStrings = Array.from(urls);
        urlsStrings.every((element, index) => {
            var length = avalWeb.length;
            var i = 0;
            while (i <= length) {
                if (element.includes(avalWeb[i])) {
                    var recUrl = element.substring(0, element.indexOf('&'));
                    recipeScraper(recUrl).then(recipe => {
                        res.send(recipe);
                    }).catch(err => {
                        console.log(err);
                        res.send(err);
                    });
                    return false;
                }
                i++;
            }
            return true;
        });
    })();
})

app.listen(8000, () => {

});
