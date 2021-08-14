# How to Mint Evs
1. Crop Ev image to 1:1, convert to jpg, and upload to Google Drive
2. Inspect element, and get permalink to image
3. ssh into samramirez.io, /var/html/RareEveretts/ and upload image with:
    `wget -O <ev id>.jpg <url to google image>`
4. create a json file with ev image data named: `<ev id>`
5. run truffle console for rinkeby with:
    `truffle console --network rinkeby`
6. in console instantiate contract reference with:
    `let evs = await RareEveretts.deployed()`
7. mint: `evs.mint()`
8. update everetts.json with new Ev info
9. commit and deploy to Heroku with `git push origin prod`

# How to Add someones alias to site
Add them to the array in app.js and make sure to toLower their address

    
