# TrueLayer integration server

## REQUIREMENTS

1. Node.js v10.x.x and npm v6.x.x
2. MySQL v8.x 

## GLOBAL PACKAGE DEPENDENCIES

None

## How to setup application

1. Clone repo
```sh
git clone git@github.com:ivanski1024/truelayer-basic.git
```

2. Install repo

```sh
cd truelayer-basic
npm install
```

3. Configure application with TrueLayer Account and Database Connection Details. 

- Copy the .env-template 
```bash
cp .env-template .env
```

- Then edit it with the corresponding details

4. Some more common configuration is located in `config/default.json` 

5. You need to add the callback url (with the current configuration): `http://localhost:1337/callback` in the `Redirect URIs` section of the TrueLayer settings located in `Settings` -> `Application` in the TrueLayer's Console.

5. Then to run the application type:
```sh
npm start
```


## USAGE

1. First you need to got to either `http://localhost:1337`. This will redirect you to TrueLayer's login page.

2. After you authenticate in TrueLayer this will redirect you back to the callback endpoint which after resolving your request will return you your user's id. 

3. To get your transactions just call `http://localhost:1337/user/transactions?userId=<your_user_id>`

4. To get debug information you can access `http://localhost:1337/user/debug?userId=<your_user_id>` and pass the userId again.