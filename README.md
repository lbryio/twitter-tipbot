# Twitter tipbot - A twitter tipbot for LBRY

This repo contains the twitter tipbot used by LBRY. This bot allows users to tip each other LBC on twitter.

## Installation
### Prerequisites
* Lbrycrd-daemon
* Node.js v8+
* Yarn
* A twitter application on the tipbot account

>To get started you should clone the git:
```
git clone https://github.com/lbryio/twitter-tipbot
```
>Install all modules with yarn:
```
yarn install
```
>Rename default.example.json to default.json and enter the twitter tokens and daemon settings.

>Run the bot with:
```
node index.js
```
>If you want to move over accounts from the old tipbot format which used usernames as identifier, run move_helper.js:
```
node move_helper.js
```
>It will automatically move over the old accounts to the new id based system.

## Contributing

Contributions to this project are welcome, encouraged, and compensated. For more details, see [lbry.tech/contribute](https://lbry.tech/contribute)

## License
This project is MIT Licensed &copy; [LBRYio](https://github.com/lbryio)

## Security

We take security seriously. Please contact security@lbry.com regarding any security issues.
Our PGP key is [here](https://keybase.io/lbry/key.asc) if you need it.

## Contact

The primary contact for this project is [@filipnyquist](https://github.com/filipnyquist) (filip@lbry.com)
