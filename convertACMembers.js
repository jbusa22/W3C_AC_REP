const cheerio = require("cheerio");
const request = require("request-promise");
const puppeteer = require('puppeteer');
var stringSimilarity = require('string-similarity');
let mysql  = require('promise-mysql');
const createContact = require("./createContact.js");
var config = {
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'w3c'
  };
  // auth
const token = 'MmYyMzUwN2M2OGYxOGZiOTBjNzQ4NGUxYTJjNDc5N2NkNzQwMzk0NmM5ZjcyYjg2ZTNmOWY3MGViZTAxMDJkNQ';
  const url = 'https://app.bigcontacts.com/#/reports/search';
  const processSQL = async () =>
  {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 900
    });
    await page.goto(url, {"waitUntil" : "networkidle0"});
    var connection = await mysql.createConnection(config);
    // logging in
    let username = await page.evaluate((user) => {
        document.querySelector('#username').value = '';
        document.querySelector('#username').value = user;
        return "good";
    }, "jbusa@w3.org");
    let password = await page.evaluate((pass) => {
        document.querySelector('#password').value = '';
        document.querySelector('#password').value = pass;
        return "good";
    }, "w3cisthebest!");
    await page.click(".cc-allow");
    await page.click("#app > div > div > div.m-b-lg > form > input");
    await page.waitForSelector('#contact_name_nav', {
        visible: true,
      });
    const memberdb = 'https://jbusa:w3cisthebest!@www.w3.org/Systems/db/advancedSearch?disp_fields%5B%5D=name&disp_fields%5B%5D=last&disp_fields%5B%5D=acEmail&disp_fields%5B%5D=host&delimeter=&name=&alphaname=&url=&mPhone=&mFax=&category=&interests=&address1=&address2=&address3=&city=&state=&postalCode=&country=&mitCustNum=&mrm=&currentMember=1&at_risk=&contractReceived=&acForum=&feeTier=&currency=&host=&vat=&worldRegion=&contractBegan=&contractBeganMod=%3D&office=&dateJoined=&dateJoinedMod=%3D&termDate=&termDateMod=%3D&termAction=&termActionMod=%3D&termCode=&lastModi=&lastModiMod=%3D&paidThruDate=&paidThruDateMod=%3D&billCheckDate=&billCheckDateMod=%3D&invoiceQuarter=&comments=&first=&last=&suCity=&suState=&suCountry=&phone=&fax=&email=&action=Search';
    const page2 = await browser.newPage();
    await page2.goto(memberdb, {"waitUntil" : "networkidle0"});
    // users with AC in from member db
    let html = await page2.content();
    let AC_users = getMatches(html, /<tr[\s\S]*?<td[\s\S]*?<td[\s\S]*?<a[\s\S]*?>([\S\s]*?)</g);
    
    await page2.close();
    // get users with relationship ac in bigcontacts
    await page.waitForFunction(() => document.querySelector('.spinner').style.display === "none");
    await page.waitFor(3000);
    await page.goto(url, {"waitUntil" : "networkidle0"});
    await page.waitFor(3000);
    await page.waitForFunction(() => document.querySelector('.spinner').style.display === "none");
    await page.evaluate(() => { document.querySelector('#header').style.display = 'none'; });
    
    const contactGroup = await page.$x("//a[text() = 'Contact Groups']");
    await contactGroup[0].click();
    await page.click(".include-field-checkbox[data-label = 'Relationship']");
    await page.click("#reports-table-contact_groups > div > div.search-fields > div:nth-child(2) > div.col-sm-6.field-row.active-field-row > div:nth-child(4) > select");
    await (await page.$('#reports-table-contact_groups > div > div.search-fields > div:nth-child(2) > div.col-sm-6.field-row.active-field-row > div:nth-child(4) > select')).press('ArrowDown');
    await (await page.$('#reports-table-contact_groups > div > div.search-fields > div:nth-child(2) > div.col-sm-6.field-row.active-field-row > div:nth-child(4) > select')).press('Enter');
    await page.click("#tab_advanced_search > div > div.row.m-b-md > div.col-sm-4.text-right.text-left-xs > div > a.btn.btn-primary");
    await page.waitFor(3000);
    var go = true;
    let BC_AC = [];
    let first = true;
    while(go) 
    {
        
        // add the pages of data into one array
        var regex = new RegExp(/<tr[\s\S]*?<td[\s\S]*?<td[\S\s]*?id=(\d*?)"[\S\s]*?>[\s]+([\S ]*)[\S\s]*?<td>[\S\s]*?>[\s]+([\S ]*)/g);
        await page.waitForFunction(() => document.querySelector('.spinner').style.display === "none");
        await page.waitFor(1000);
        let pageData = await page.content();
        let onePage = pageData.match(/tbody>[\S\s]*?<\/tbody/);
        let diff = getAllMatches(onePage, regex);
        BC_AC = BC_AC.concat(diff);
        let arrow = await page.$(".next > a");
        go = arrow === null ? false : true;
        if(first)
        {
            await autoScrollDown(page);
            first = false;
        }
        if(go)
        {
            
            await arrow.click();
            await page.waitFor(3000);
        }
        
    }


    // loop through the memberdb checking each one against each person with the same first letter in bigcontacts
    // for example check all every a and then once you get to the end you log that index
    // then you do that for every a and once you get to b use the index above as the starting point

    // check if the next one is the same as this one
    // if it is delete all of the ones with that name from both arrays

    // if you find one that matches delete it from the array and keep going
    // if it is the same as the next one, check to see 
    // don't do anything with people who have 2 
    // if you don't find one then add one
    // take the remaining array and remove all of their ac rep titles
    

    // get rid of the white space entries
    for(let i = 0; i < AC_users.length; i++)
    {
      let element = AC_users[i];
      element = element.trim();
      AC_users[i] = element.toLowerCase();
      if(!element || !element.trim())
      {
        AC_users.splice(i, 1);
        i--;
      }
    }
    // sort both alphabetically 
    AC_users.sort();
    // need to change to lowercase before sorting
    for(let z = 0; z < BC_AC.length; z++)
    {
        BC_AC[z] = BC_AC[z].toLowerCase();
        
    }
    BC_AC.sort();
    // if there are more than one in the member db
      // check the previous one
    let BC_AC_info = [];
    BC_AC.forEach(function(element) {
        element = element.toLowerCase();
        BC_AC_info.push(element.split("|"));
    });
    // loop through member
    // if both are correct then remove and add one to both indexes
    // if not equal don't add one to the bc index
    // loop through until you find it if not add a new one

    let j = 0;
    let c = 0;
    for(let i = 0; i < AC_users.length; i++)
    {
        j = i - c;
        // check for a match
        
        if(BC_AC_info[j].length == 2 && stringSimilarity.compareTwoStrings(AC_users[i], BC_AC_info[j][0]) > .8)
        {
            // remove the id so that we don't add it later
            BC_AC_info[j].pop();
            continue;
        }
        c += 1;
        let sim = 0;
        let checkindex = 0;
        
        while(j < BC_AC_info.length)
        {   
            let multisim = 0;
            if(BC_AC_info[j].length == 2)
            {
             multisim = stringSimilarity.compareTwoStrings(AC_users[i], BC_AC_info[j][0]);
            }
            if(multisim > sim)
            {
                sim = multisim;
                checkindex = j;
            }
            j++;
        }
        if(sim > .8)
        {
                // remove the id so that we don't add it later
                BC_AC_info[checkindex].pop();
                nomatch = false;
        }
        else
        {
            //////////
            // Add a new ac rep with the name BC_AC_info[j]
            const page3 = await browser.newPage();
            await page3.goto("https://app.bigcontacts.com/contacts/typeahead?term=" + AC_users[i], {"waitUntil" : "networkidle0"});
            // users with AC in from member db
            let gettingjson = await page3.content();
            gettingjson = gettingjson.match(/{[\s\S]*}/);
            let parsing = JSON.parse(gettingjson);
            
            await page3.close();
            let noexist = true;
            if(parsing !== null)
            {
                let keys = Object.keys(parsing);
                
                for(let k = 0; k < keys.length; k++)
                {
                    // if the member db user matches the bc user then promote ac
                    let BCuser = keys[k].match(/^[0-9a-zA-Z\s]*/);
                    BCuser = BCuser[0].match(/[a-zA-Z\s]+$/);
                    if(BCuser[0].trim() === AC_users[i])
                    {
                        await promoteACRep(keys[k].match(/^[0-9]*/));
                        noexist = false;
                        break;
                    }
                }
            }
            if(noexist)
            {
                await createContact.newContact(AC_users[i], token);
            }
            // two cases they either don't exist or exist without ac rep
        }
    }
    for(let j = 0; j < BC_AC_info.length; j++)
    {
        if(BC_AC_info[j].length === 2)
        {
            //////////
            // remove ac rep with the name BC_AC_info[j][0] and id BC_AC_info[j][1]
            await removeACRep(BC_AC_info[j][1]);
        }
    }
    connection.end();
}
processSQL();

async function removeACRep(id)
{
    let testurl = "https://app.bigcontacts.com/api/contact/"+ id +".json";
    let tested = await getId(testurl, token);
    tested = JSON.parse(tested.body);
    tested = tested.payload.categories;
    for(let i = 0; i < tested.length; i++)
    {
        if(tested[i].name === "Relationship")
        {
            tested.splice(i, 1);
            break;
        }
    }
    tested = {"categories" : tested};
    let removed = await updateRelationship(testurl, token, tested);
    if(removed.statusCode !== 200)
    {
        console.log("Error! Id: " + id);
        console.log("Code: " + removed.statusCode);
        console.log("Message: " + removed.statusMessage);
    }
}
async function promoteACRep(id)
{
    let testurl = "https://app.bigcontacts.com/api/contact/"+ id +".json";
    let tested = await getId(testurl, token);
    tested = JSON.parse(tested.body);
    tested = tested.payload.categories;
    let AC_Rep = {id: 61544, name: "Relationship", value: "AC Rep"};
    tested.push(AC_Rep);
    tested = {"categories" : tested};
    let added = await updateRelationship(testurl, token, tested);
    if(added.statusCode !== 200)
    {
        console.log("Error! Id: " + id);
        console.log("Code: " + added.statusCode);
        console.log("Message: " + added.statusMessage);
    }
}
 async function checkUnique(name, connection) 
 {
    let selectFalse = "SELECT id FROM false_ac_reps WHERE name = '"+ name +"'";
    let dupe = await connection.query(selectFalse);
    return dupe.length === 0;
 }
 function getMatches(string, regex, index) 
 {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
      matches.push(match[index]);
    }
    return matches;
}
function getAllMatches(string, regex) 
{
   var matches = [];
   var match;
   while (match = regex.exec(string)) {
     matches.push(match[2].trim() + " " + match[3].trim() + "|" + match[1].trim());
   }
   return matches;
}
const updateRelationship = async ( url, token, tag ) => new Promise((resolve, reject) => {
    request.put({
      headers: {
          'content-type': 'application/json',
          "Authorization" : "Bearer " + token
      },
      json: tag,
      url: url
      }, (error, response, body) => {
        resolve(response);
      }
    );
  });
  const getId = async ( url, token ) => new Promise((resolve, reject) => {
    request.get({
      headers: {
          'content-type': 'application/json',
          "Authorization" : "Bearer " + token
      },
      url: url
      }, (error, response, body) => {
        resolve(response);
      }
    );
});
async function autoScrollDown(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}