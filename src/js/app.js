var ownersG;
var g_rareEvsInstance;
App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load everetts.
    $.getJSON('../everetts.json', function(data) {
      var everettsRow = $('#everettsRow');
      var everettTemplate = $('#everettTemplate');

      for (i = 0; i < data.length; i ++) {
        everettTemplate.find('.panel').attr('data-id', i);
        everettTemplate.find('.panel-title').text(data[i].name);
        everettTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        everettsRow.append(everettTemplate.html());
      }
    });
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      console.log("No web3 provider found - falling back to infura");
      App.web3Provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/0997ffefa60b424dbca9b5efd061e76c');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('RareEveretts.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var RareEverettsArtifact = data;
      App.contracts.RareEveretts = TruffleContract(RareEverettsArtifact);

      // Set the provider for our contract
      App.contracts.RareEveretts.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted everetts
      return App.markAdopted();
    });

    if(window.ethereum) {
        window.ethereum.on('accountsChanged', function () {
            web3.eth.getAccounts(function(error, accounts) {
              window.alert("Ethereum account changed.");
              App.markAdopted();
            });
        });
    }
    return App.bindEvents(); 
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function() {
    var rareEvsInstance;

    App.contracts.RareEveretts.deployed().then(function(instance) {
      rareEvsInstance = instance;
      g_rareEvsInstace = instance;

      return rareEvsInstance.getTokenCounter.call();
    }).then(function(tokenCount) {
      tokenCount = tokenCount.toNumber();
      let data = [];
      for (i = 0; i < tokenCount; i++) {
        data.push(rareEvsInstance.ownerOf(i));
        data.push(rareEvsInstance.tokenURI(i).then(function(uri) {
          return new Promise(function(resolve, reject) {
            $.getJSON(uri, resolve);
          });
        }));
      }
      return Promise.all(data);
    }).then(function(data) {
      for(i=0;i<data.length;i=i+2){
        var currId = i / 2;
        var currPanel = App.getPanel(currId);
        var ownerNameLabel =  currPanel.find('.owner-name');
        var ownerAddressLabel =  currPanel.find('.owner-address');
        var ownerAddress = data[i];
        var currentAccount = web3.eth.accounts[0]
        var isCurrentAccount = ownerAddress === currentAccount;
        var knownOwner;
        if(isCurrentAccount) {
          ownerNameLabel.text("You!");
        } else if((knownOwner = App.addressToKnownOwner[ownerAddress]) !== undefined) {
            ownerNameLabel.html("<a href='https://discord.gg/YjqRxGwDV9'>"+knownOwner+"</a> ");
        } else {
          ownerNameLabel.text("Unknown");
        }
        ownerAddressLabel.text(ownerAddress);
        ownerNameLabel.toggleClass("owner", isCurrentAccount);
        currPanel.find(".transfer-row").toggleClass("vishidden", !isCurrentAccount);
        currPanel.find("img").attr('src', data[i+1].image);
        currPanel.find(".panel-title").attr('src', data[i+1].name);
      }
    }).catch(function(err) {
      console.log('Error: ' + err.message);
    });
  },
  addressToKnownOwner: {

      "0x6106bb608593b8214adbcc9c60c5b61ff066f19c": "Ryhan",
      "0x4cf457e6226d7add647915935047eb982465bcda": "sram1337",
      "0xdfee3331dc196bcdb31ce156688788d918ab7ff6": "LukasPalukas",
      "0xa8c0f3e7c04b36eecb1e2c176f2adf49632500de": "WillJoslin",
      "0x331ab9008ecedad6fab4bf6d1ae1200ef8986a87": "CaptainInsano",
      "0xcff44ada03447d242b2b552a1c02aa5b80a8d8ed": "Bhavin",
  },
  handleAdopt: function(event) {
    event.preventDefault();

    var everettId = parseInt($(event.target).data('id'));

    var rareEvsInstance; 
    web3.eth.defaultAccount = web3.eth.accounts[0]
    //personal.unlockAccount(web3.eth.defaultAccount)
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      var toAddress = App.getPanel(everettId).find('.toAddress').val();

      App.contracts.RareEveretts.deployed().then(function(instance) {
        rareEvsInstance = instance;

        // Execute adopt as a transaction by sending account
        return rareEvsInstance.safeTransferFrom(account, toAddress, everettId);
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  getPanel: function(id) {
    return $('#everettsRow .panel[data-id='+id+']');
  }
};

$(function() {
  $(window).load(function() {
    App.init().catch(function(err){ console.log(err.message); });
  });
});
