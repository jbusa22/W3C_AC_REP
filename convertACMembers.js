const cheerio = require("cheerio");
const request = require("request-promise");
const puppeteer = require('puppeteer');
let mysql  = require('promise-mysql');
var config = {
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'w3c'
  };
  const url = 'https://app.bigcontacts.com/#/contacts/';
  const processSQL = async () =>
  {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 900
    });
    await page.goto(url, {"waitUntil" : "networkidle0"})
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
      // users with AC in from member db
      var AC_users = ["Achille Zappa","Adam Boyet","Adam Hyde","Adrian Hope-Bailie","Adrian Pohl","Ahmed Hindawi","Ai bo Ai","Akihisa Ushirokawa","Alan Stearns","Alanna Gombert","Alastair Campbell","Alberto Pace","Alec Mulinder","Alessio Postiglione","Alex Bernier","Alex Momot","Alex Ortiz","Alexander Falk","Alexandre Gouaillard","Alois Reitbauer","Andreas Rossberg","Andreas Stahl","Andreas Tai","Andrei Lobov","Andrei Sambra","Andrew Pace","Andrew Sudbury","Andrew Watson","Andy Seaborne","Anish Karmarkar","Anne Thyme Nørregaard","Annette Greiner","Armin Haller","Arnaud Le Hors","Arne Kyrkjebø","Ash Harris","Atanas Kiryakov","Avneesh Singh","Axel Polleres","Baoping Yan","Bartek Kozlowski","Benfeng Chen","Bernardo Magnini","Bill Kasdorf","Bill Roberts","Bill Rogers","Björn Levin","Bob Bailey","Bob DeHoff","Boris Maurer","Brian Kardell","Brian Pech","Brian Ross","Brian Ulicny","Brian Weber","Brian Wilson","Bruce Levis","Bruno Marchesson","Can Wang","Carlos A. Velasco","Carmen Suárez","Caroline Boyd","Chang Hwa Lyou",
     "Changlin Yao","Charles LaPierre","Charles McHardie","Cheryl Mish","Chiaki Fujimon","Chongping Wang","Chris Marconi","Chris Michael","Chris Needham","Chris O'Brien","Chris Tse","Christian Bromann","Christian Liebel","Christopher Casey","Christopher Mueller","Chunming Hu","Claudio Celeghin","Claus Christensen","Colin Meerveld","Colin Whorlow","Cristina Mussinelli","Cullen Jennings","Daihei Shiohama","Daisuke Ajitomi","Dan Druta","Dan Jones","Dan Lieberman","Dan Robbins","Dan Whaley","Daniel Burnett","Daniel Glazman","Daniel Glazman","Daniel Marques","Daniel Schutzer","Danny Aerts","Dave Fortney","David Baron","David Benoit","David Ezell","David Herr","David Hughes","David Rogers","David Singer","David Stroup","David Waite","David Zanoletty García","Dean Allemang","Deepesh Banerji","Deian Stefan","Dennis Buchheim","Dickson Lukose","Diego Ferreiro Val","Dmitry Barinov","Dmitry Markushevich","Dominik Riemer","Dominique Guinard","Don Brutzman","Donald Evans","Drummond Reed","DUK KI HONG","Eduardo Oliva","Edward Bice","Eli Yaacoby","Emilia Ojala","Eric Duffy","Eric Leandri","Eric Siow","Eric Velleman","Erich Bremer","Erich Karl Clauer","Erik Mannens","Erika Verenice Quezada","Evan Prodromou","Evan Schwartz","Fabien Gandon","Fei Peng","Fons Kuijk","Frank Hoffman","Frode Kileng","Furkan KAMACI","Futomi Hatano","Garenne Bigby","Garry Grant","Gavin Walker","Geoff Jukes","Georg Rehm","George Bina","George Fletcher","Geunhyung Kim","Gian Wild","Gil Yehuda","Glenn Adams","GLENN ATKINSON","Harold Solbrig","Hartmut Richard Glaser","HEATHER PRICE","Henricus Cabanier","Henrik Svensson","Henry Thompson","Hiroki Yamada","Hiroshi Fujisawa","Hiroshi Fujiwara","Hiroshi Sakakibara","Hitoshi Komori","Hongru (Judy) Zhu","Huai Bo Yan","Hugh McGuire","Hyojin Song","HyukHoon SHIM","Ian Horrocks","Ibrahima NGOM","Ichiya Nakamura","Inaki Velez de Guevara Rodriguez","Ingo Simonis","Irini Fundulaki","J.B. Domingue","Jaesig Kang","Jake Benson","Jalpesh Chitalia","James Helman","James MacWhyte","James Tauber","Jamie Clark","Jamie Pitts","Jan Pilbauer","Janne Saarela","Jason Proctor","Javier Bikandi","Jean-Luc Bouthemy","Jean-Pierre EVAIN","Jean-Yves ROSSI","Jeff Waters","Jeffrey Riedmiller","Jeong-Hun Oh","Jeremy Tandy","Jet Yu","Jie Bao","Joe Winograd","Joenggeun Lee","Johan Rempel","John Best","John Bruce","John Foliot","John Fontana","John Kirkwood","John Luther","Jon Vazquez","Jonathan Avila","Joost de Valk","Jordana Burson","Jörg Heuer","Jose Luis Martínez","Joseph Hall","Juan Carlos Cruellas","Juan Carlos Rodríguez Rodríguez","Juan Jose Sanchez Penas","Juejia Zhou","Julian Harriott","Jun Murai","Junichi Sakamoto","Junichi Yoshii","Junko Kamata","Kangchan Lee","Kasar Masood","Katie Haritos-Shea","Kazuhito Kidachi","Kazuo Hikawa","Kenneth Mealey","Kevin Fleming","Kingsley Idehen","Klaus-Peter Hoeckner","Kris Ketels","Kris McGlinn","Krystian Czesak","Kumanan Yogaratnam","Larry Skutchan","Laszlo Kovacs","Laura Townsend","Laurent Bernardin","Laurent Flory","Laurent Le Meur","Lawrence Cheng","Léonie Watson","Linda van den Brink","Loc Dao","Luc Audrain","Luis Guzman","Mahesh Kulkarni","Manisha Amin","Manu Sporny","Manuel Lavín Delgado","Marc van Hilvoorde","Marcelo Zuffo","Maria Jesus Fernandez Ruiz","Mario Como","Mark Sadecki","Mark Shapiro","Mark Vickers","Mark Watson","Markku Hakkinen","Markus Meister","Martin Klein","Mary Brady","Masashi Suzuki","Mateus Teixeira","Mateusz Przepiorkowski","Matt Goonan","Matt Saxon","Matt Stone","Matthew Horridge","Matthew Triner","Maurice York","Mi-soo Kwon","Michael Bergman","Michael Champion","Michael Cokus","Michael Koster","Michael Markevich","Michael McCaffrey","Michael Moran","Michael Tiffany","Michallis Pashidis","Michel Buffa","Michel Leger","Michel Weksler","Michelle Bu","Michiel Schok","Michimasa Uematsu","Mickael Schneider","Miguel Amutio","Mike O'Neill","Mingjie Chen","Mohamed ZERGAOUI","Mohammed DADAS","Motoi Suzuki","MOTOI SUZUKI","Mountie Lee","muhammad saleem","Najib Tounsi","Nathan George","Nathan Schloss","Neil King","Nell Waliczek","Nelson Piedra","Neven Vrček","Nic Jansma","Nicholas Gibbins","Nick Leake","Nicky Yick","Nishant Shukla","Norma Palomino","Norman Walsh","Nurit Sprecher","OH SAEYONG","Orie Steele","Pablo COCA","Patrick Adler","Patrick Johnston","Patrick Lünnemann","Paul Ferris","Paul Lipton","Peter Bruhn Andersen","Peter Leinen","Peter Parslow","Peter Snyder","Peter Virk","Peter Winstanley","Petr Peterka","Petri Vuorimaa","Phil Archer","Phil Ritchie","Prasad Yendluri","Qamar Zaman Hussain","Quentin Williams","Rachel Andrew","Rachel Comerford","Rahul Ramachandran","Raj Tumuluri","Ralph Brown","Ralph Hodgson","Ralph Swick","Ram Mohan","Rang-Hyuck Lee","Raphaël Troncy","Raúl García Castro","Ravinder Singh","Ray Denenberg","Rebeca Ruiz S","Reto Gmür","Richard Martelli","Rick Johnson","Rob Manson","Rob Trainer","Robert Reany","Robert Sanderson","Rolf Lindemann","Roman Kagarlitsky","Rowan Smith","rui liu","Russell Kendall","Ryan Cho","Sandro Hawke","Sangchul Ahn","Sangho Lee","Sarah Pulis","Satoru Kanno","Satoru Takagi","Sebastian Käbisch","Sebastian Schnitzenbaumer","Shane McCarron","Shay Dotan","Shilpi Kapoor","Shinichi Yoshizawa","Shuning Pang","Shuyuan Jiang","Shwetank Dixit","Simon-Pierre Marion","Siva Narendra","Siyang Liu","So Vang","Sogo Wakasugi","Song Li","Songfeng Li","Soosung Chun","Stefan Håkansson","Steve Battle","Steve Faulkner","Steve Wagendorp","Steven Crumb","Steven Pemberton","Steven Sarsfield","Sumio Noda","Swaran Lata","T.V. Raman","Taehyun Kim","Takashi Minamii","Takeaki Endo","Takeshi Horiuchi","Takeshi Mitamura","Takuya Horiki","Tatsuya Ida","Tatsuya Igarashi","Tetsuhiko Hirata","Thomas Baker","Thomas D'Haenens","Tianqi Han","Tim Smith","Timothy Cole","Tobias Kuhn","Tomofumi Okubo","Udana Bandara","Ulrich Keil","Varun Singh","Victor Soares","Vivienne Conway","Vlad Trifa","Vladimir Levantovsky","Wei Hu","William Vanobberghen","Wilson Wilson","WOOGLAE KIM","Yadong Wu","Yancy Ribbens","Yang Liu","YANG Xiaoyu","Yang-Juh Lai","Yaron Sheffer","yi zhou","Yike Guo","Yinfeng Wang","Yoshiaki Ohsumi","Yoshiaki Tanaka","Young Gi Kim","Youngmin Ji","Youngsun Ryu","Yukinori Endo","Yumiko Matsuura","Zachary Townsend","Zhiqiang Yu"];


      // loop through the users
        // if the ui-autocomplete is display none then log the person in an array of people who are not in the BigContacts list
        // else click the first ui-menu-item
            // figure out how to make sure that puppeteer doesn't stop due to page change
            // click id="dropdownMenuActions"
            // click class="edit-contact"
            // figure out how to make sure that puppeteer doesn't stop due to page change
            // click class = "active"
            // click id="bigcontacts_contact_form_group_relationship"
            // click #bigcontacts_contact_form_group_relationship > option:nth-child(2)
            // .contact-submit
            // bigcontacts_contact_form_comments
      // todo
      // put into a different database when the names don't match exactly
      // give the name of the actual one and the name of the incorrect one 
    for(let i = 0; i < AC_users.length; i++)
    {
        try 
        {
            //await page.waitFor(3000);
            await page.waitForFunction(() => document.querySelector('.spinner').style.display === "none");
            let check = await page.evaluate((user) => 
            {
                document.querySelector('#contact_name_nav').value = '';
                document.querySelector('#contact_name_nav').value = user;
                return "good";
            }, AC_users[i]);
            await (await page.$('#contact_name_nav')).press('ArrowLeft');
            await page.waitForFunction(() => document.querySelector('.spinner').style.display === "none");
            await page.waitFor(3000);
            const selector_child  = `#ui-id-1 > li:nth-child(2)`;
            let arrow = await page.$(selector_child);
            if(!arrow)
            {
                if(await checkUnique(AC_users[i], connection))
                {
                    let sql = `INSERT INTO false_ac_reps(name)
                        VALUES(?)`;
                    let sqlValues = [AC_users[i]];
                    let res1 = await connection.query(sql, sqlValues);
                }
            }
            else
            {
                let arrowtext = await page.evaluate(arrow => arrow.textContent, arrow);
                let checked = arrowtext.replace(/\s*\([\S\s]*\)\s*/, "");
                if(checked !== AC_users[i])
                {
                    if(await checkUnique(AC_users[i], connection))
                    {
                        let sql = `INSERT INTO false_ac_reps(name, result)
                        VALUES(?,?)`;
                        let sqlValues = [AC_users[i], checked];
                        let res1 = await connection.query(sql, sqlValues);
                    }
                }
                else
                {
                    // if there are two people with the same name just add the name to the database
                    const checktwins  = `#ui-id-1 > li:nth-child(3)`;
                    let twin = await page.$(checktwins);
                    let twinname = twin ? await page.evaluate(twin => twin.textContent, twin) : "";
                    let twintrim = twinname.replace(/\s*\([\S\s]*\)\s*/, "");
                    if(twintrim === AC_users[i] && await checkUnique(AC_users[i], connection))
                    {
                        let sql = `INSERT INTO false_ac_reps(name, result)
                        VALUES(?,?)`;
                        let sqlValues = [AC_users[i], twintrim];
                        let res1 = await connection.query(sql, sqlValues);
                    }
                    else 
                    {
                        await page.click(".ui-menu-item");
                        await page.waitForFunction(() => document.querySelector('.spinner').style.display === "none");
                        await page.click(".contact-view:not(.hidden) > .actions > .btn-group");
                        await page.click(".contact-view:not(.hidden) > div.actions.clearfix.no-print.pull-right.pull-none-xs > div.btn-group.open > ul > li.edit-contact");
                        await page.waitForFunction(() => document.querySelector('.spinner').style.display === "none");
                        await autoScrollUp(page);
                        await page.waitFor(2000);
                        await page.click("#addContactForm > div.row > div.col-sm-8 > div > ul > li:nth-child(2)");
                        await autoScrollDown(page);
                        await page.waitFor(500);
                        await page.click("#bigcontacts_contact_form_group_relationship");
                        await (await page.$('#bigcontacts_contact_form_group_relationship')).press('ArrowUp');
                        await (await page.$('#bigcontacts_contact_form_group_relationship')).press('ArrowUp');
                        await (await page.$('#bigcontacts_contact_form_group_relationship')).press('ArrowUp');
                        await (await page.$('#bigcontacts_contact_form_group_relationship')).press('ArrowUp');
                        await (await page.$('#bigcontacts_contact_form_group_relationship')).press('ArrowDown');
                        await (await page.$('#bigcontacts_contact_form_group_relationship')).press('Enter');
                        await page.waitFor(1000);
                        await autoScrollUp(page);
                        await page.waitFor(1000);
                        await page.click(".contact-submit");
                        await page.waitForSelector('#contact_name_nav', {
                            visible: true,
                        });
                        await page.waitForFunction(() => document.querySelector('.spinner').style.display === "none");
                    }
                }
            }
        }
        catch(e)
        {
            console.log("Connection Error:" + e);
        }
    }
    connection.end();
}
processSQL();
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
async function autoScrollUp(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = -100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight -= distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
 async function checkUnique(name, connection) {
    let selectFalse = "SELECT id FROM false_ac_reps WHERE name = '"+ name +"'";
    let dupe = await connection.query(selectFalse);
    return dupe.length === 0;
 }
