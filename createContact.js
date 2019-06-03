const createContact = () => {
const request = require("request");
const puppeteer = require('puppeteer');

// not an ideal solution but gets past the pesky popup to login which can't
// be accessed through puppeteer
// this link gets all of the ac rep names from the member database
const url = 'https://jbusa:w3cisthebest!@www.w3.org/Systems/db/advancedSearch?disp_fields%5B%5D=name&disp_fields%5B%5D=last&disp_fields%5B%5D=acEmail&disp_fields%5B%5D=host&delimeter=&name=&alphaname=&url=&mPhone=&mFax=&category=&interests=&address1=&address2=&address3=&city=&state=&postalCode=&country=&mitCustNum=&mrm=&currentMember=1&at_risk=&contractReceived=&acForum=&feeTier=&currency=&host=&vat=&worldRegion=&contractBegan=&contractBeganMod=%3D&office=&dateJoined=&dateJoinedMod=%3D&termDate=&termDateMod=%3D&termAction=&termActionMod=%3D&termCode=&lastModi=&lastModiMod=%3D&paidThruDate=&paidThruDateMod=%3D&billCheckDate=&billCheckDateMod=%3D&invoiceQuarter=&comments=&first=&last=&suCity=&suState=&suCountry=&phone=&fax=&email=&action=Search';
const newContact = async (name, token) =>
{
  const browser = await puppeteer.launch({headless : false});
  const page = await browser.newPage();
  await page.setViewport({
      width: 1200,
      height: 900
  });
  // log in to blue contacts
  await page.goto(url, {"waitUntil" : "networkidle0"});
  try 
  {
    name = toTitleCase(name);
    // find the the link to the persons profile on the memberDB
    const tagname = await page.$x('//a[contains(text(), "'+ name +'")]/../..');
    await page.waitFor(1000);
    // split up their name into first and the rest
    const label = await page.evaluate(el => el.innerText, tagname[0]);
    const fullname = label.split("\t");
    let first = fullname[1].split(" ");
    let other = "";
    for(let j = 1; j < first.length; j++)
    {
        other += first[j] + " ";
    }
    // creating json structure that includes name emails business and ac rep
    let newcontact = {"is_business" : false, "first_name" : first[0], "last_name" : other, "emails": [{"email" : fullname[2]}], "custom_fields": [{"name" : "Host", "value" : fullname[3]}], "categories" : [{"name" : "Relationship", "value" : "AC Rep"}], "business" : {"first_name" : fullname[0]}};
    let updateurl = "https://app.bigcontacts.com/api/contacts.json";
    // use the api to create it
    let updateResponse = await createBigContact(updateurl, token, newcontact);
    if(updateResponse.statusCode !== 200)
    {
        console.log("Error! Id: ");
        console.log("Code: " + updateResponse.statusCode);
        console.log("Message: " + updateResponse.statusMessage);
    }
  }
  catch(e)
  {
    console.log(e);
  }
}
const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
const createBigContact = async ( url, token, tag ) => new Promise((resolve, reject) => {
  request.post({
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
return {
  newContact : newContact
}

}

module.exports = createContact();