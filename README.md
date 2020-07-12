## Get Started
```
git clone https://github.com/SaitamaSama/Frission
cd Frission
npm i
npx tsc
npx webpack
```
Create a file `.env` in the root
```
APP_MODE="production" # or development
HTTP_PORT=80
DB_USER="" # DB User
DB_PASS="" #DB Password
```

Run it
```
node backend-dist/backend/main.js
```