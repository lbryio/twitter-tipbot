// This file helps with moving over accounts from the old username system to the id system.
// It uses the same configuration files as index.js
// Checks for the old format, gets their id from twitter, creates new acc, moves balance.
const Twit = require("twit");
const config = require("config");
const winston = require("winston");
require("winston-daily-rotate-file");
const Client = require("bitcoin-core");
const lbry = new Client({
  version: "0.12.0",
  username: config.get("lbrycrd.username"),
  password: config.get("lbrycrd.password"),
  port: config.get("lbrycrd.port")
});
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "move-helper-%DATE%.log",
      dirname: "./logs",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d"
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: "debug"
    })
  ]
});
let notSynced = [];

const T = new Twit({
  consumer_key: config.get("twitter.consumer_key"),
  consumer_secret: config.get("twitter.consumer_secret"),
  access_token: config.get("twitter.access_token"),
  access_token_secret: config.get("twitter.access_token_secret"),
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true // optional - requires SSL certificates to be valid.
});

async function main(){
  let accs = await getAccounts();
  logger.info(`Trying to move ${accs.length} accounts...`)
  for (let i in accs){
    try {
      //Get user details from twitter.
      let data = await T.get('users/show', { screen_name: accs[i] });
      //Create a account for the user by id.
      let usr = data.data.id_str;
      await getAddress(id(usr));
      //Move over from old account to the new account
      const balanceFromOld = await lbry.getBalance(`twttr-${accs[i]}`);
      if (balanceFromOld !== 0) {
        let res = await lbry.move(
          `twttr-${accs[i]}`,
          id(usr),
          Number(balanceFromOld)
        );
        // If move is successful, log it!
        if (res) logger.info(`Transferred ${balanceFromOld} LBC from twttr-${accs[i]} to ${id(usr)}!`);
      }
    }catch(e){
      logger.info(`Could not sync ${accs[i]}, error occured:`, e.allErrors);
      notSynced.push({ user: accs[i], error: e.allErrors});
      logger.info("Could not sync these:"+JSON.stringify(notSynced));
    }
  }
}
// Get a list of all twitter accounts on lbrycrd.
async function getAccounts(){
  let accs = await lbry.listAccounts();
  accs = Object.entries(accs);
  let accsArr = [];
  for (let i in accs){
    if(accs[i][0].startsWith('twttr-')) accsArr.push(accs[i][0].substring(6));
  }
  return accsArr;
}

async function getAddress(userId) {
  try {
    let uAddresses = await lbry.getAddressesByAccount(userId);
    if (uAddresses.length > 0) return;
    await lbry.getNewAddress(userId);
  } catch (e) {
    throw("Something went wrong while creating an account for the user: ", e);
  }
}

function id(usrId){
  return `t-${usrId}`;
}
main();
