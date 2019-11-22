var Discord = require('discord.io');
var logger = require('winston');
var auth = require('../auth.json');
var redditor = require('../redditAuth.json');
// import { getPosts } from 'fetch-reddit'


const snoowrap = require('snoowrap');

// NOTE: The following examples illustrate how to use snoowrap. However, hardcoding
// credentials directly into your source code is generally a bad idea in practice (especially
// if you're also making your source code public). Instead, it's better to either (a) use a separate
// config file that isn't committed into version control, or (b) use environment variables.

// Create a new snoowrap requester with OAuth credentials.
// For more information on getting credentials, see here: https://github.com/not-an-aardvark/reddit-oauth-helper
const r = new snoowrap({
  userAgent: 'UserAgent',
  clientId: 'PaDjFEA9-2rGBw',
  clientSecret: 'Q2XrZquofAasjm0X3zlE0yBedIM',
  refreshToken: 'put your refresh token here'
});

// Alternatively, just pass in a username and password for script-type apps.
const otherRequester = new snoowrap({
  userAgent: 'UserAgent',
  clientId: redditor.clientId,
  clientSecret: redditor.clientSecret,
  username: redditor.username,
  password: redditor.password
});

// otherRequester.getSubreddit('dankmemes').getHot().map(post => post.preview.images[0].source.url).then(console.log);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});
bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

// //sleeping fn
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

function meme(post) {
  // Do something with the extracted posts
  console.log(post.title);
  if (post.preview)
    console.log(post.preview.images[0].source.url);
  var st = "lolamp;lol"
  console.log(st.replace('amp;', ''));

}




var post = 1;
var min = 0;
var max = 3;

bot.on('message', async function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `yo`
  // logger.info(user);
  // logger.info("lololololololo");
  // logger.info(userID);
  if (message.substring(0, 3) == 'yo ') {
    var args = message.substring(3).split(' ');
    // console.log("args = " + args);
    var cmd = args[0];
    // console.log("cmd = " + cmd);
    var rest = args[1];
    // console.log("rest = " + rest);
    switch (cmd) {
      // yo ping
      case 'ping':
        bot.sendMessage({
          to: channelID,
          message: 'pong'
        });
        //await sleep(2000);
        break;
      // yo pick
      case 'pick':
        min = 0;
        max = args.length - 1;
        var random = Math.floor(Math.random() * (+max - +min)) + +min;
        random += 1;
        console.log(random);
        bot.sendMessage({
          to: channelID,
          message: args[random]
        });
        break;
      // yo fuck
      case 'fuck':
        var min = 0;
        var max = 3;
        var words = ["yeah, FUCK EM", "Amen, Brother", "Sure Thing"];
        var random = Math.floor(Math.random() * (+max - +min)) + +min;
        console.log(random);
        bot.sendMessage({
          to: channelID,
          message: words[random]
        });
        break;
      case 'meme':
        otherRequester.getSubreddit('dankmemes').getHot().map(post => post).then((data) => {
          if (post > data.length)
            post = 1;
          var meme = data[post++];
          // console.log("promise", meme.preview);
          bot.sendMessage({
            to: channelID,
            message: '',
            embed: {
              color: 6826080,
              footer: { 
                text: meme.ups,
                icon_url: 'https://discordemoji.com/assets/emoji/googlethumb.gif'
              },
              thumbnail:
              {
                url: ''
              },
              title: meme.title,
              url: meme.url,
              image: {
                url: meme.preview.images[0].source.url.replace('amp;s', 's'),
                
              }
            }
          });
          console.log("message sent");
        });
        // getPosts(subreddit).then(data => {
        //     // Array of extracted posts
        //     processPosts(data.posts)
        // post.title+"\n"+post.preview.images[0].source.url
        //     // Easy pagination
        //     data.loadMore().then(processPosts)
        //   })

        break;
    }
  }
});

