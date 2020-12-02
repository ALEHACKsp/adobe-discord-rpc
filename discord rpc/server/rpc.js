const RPC = require('discord-rpc')

var monitor = require('active-window');
var activeApp = require('./activeApp');

var apps = require("./adobe.json");

var global = {}
var timestamp = {}

var _activeApp;
var _previousApp;
var data;

var smallImageKeyOld
var smallImageTextOld
var largeImageTextOld
var detailsOld
var stateOld
var partySizeOld
var partyMaxOld

module.exports = discord

function discord(_data){
    data = JSON.parse(_data)
}

function callback(window){
    try {

        if(activeApp.run(window.app) === undefined) return;

        _activeApp = activeApp.run(window.app);

        if(_activeApp != _previousApp){
            if(global[activeApp.run(window.app)]) global[activeApp.run(window.app)].destroy()
            global[activeApp.run(window.app)] = new RPC.Client({
                transport: "ipc"
            })
            if(!timestamp[_activeApp]){
                timestamp[_activeApp] = new Date();
            }
        }

        if(smallImageKeyOld != data[_activeApp].smallImageKey || 
            smallImageTextOld != data[_activeApp].smallImageText || 
            largeImageTextOld != data[_activeApp].largeImageText ||
            detailsOld != data[_activeApp].details ||
            stateOld != data[_activeApp].state ||
            partySizeOld != data[_activeApp].partySize ||
            partyMaxOld != data[_activeApp].partyMax) run();
        
        function run(){

        var rpc = global[_activeApp];

        //Error: child "activity" fails because [child "small_image" fails because ["small_image" is not allowed to be empty]]]
        for (var item in data[_activeApp]) {
            if(data[_activeApp][item] === "") data[_activeApp][item] = undefined;
        }
        console.log(data[_activeApp])

        smallImageKeyOld = data[_activeApp].smallImageKey
        smallImageTextOld = data[_activeApp].smallImageText
        largeImageTextOld = data[_activeApp].largeImageText
        detailsOld = data[_activeApp].details
        stateOld = data[_activeApp].state,
        partySizeOld = data[_activeApp].partySize
        partyMaxOld = data[_activeApp].partyMax

        rpc.on("ready", () => {
            rpc.setActivity({
                largeImageKey: "logo",
                smallImageKey: data[_activeApp].smallImageKey,
                smallImageText: data[_activeApp].smallImageText,
                largeImageText: data[_activeApp].largeImageText,
                details: data[_activeApp].details,
                state: data[_activeApp].state,
                startTimestamp: timestamp[_activeApp],
                partySize: parseInt(data[_activeApp].partySize),
                partyMax: parseInt(data[_activeApp].partyMax)
            })
        })
        if(_previousApp){
            if(_previousApp != _activeApp) {
                global[_previousApp].destroy()
                delete global[_previousApp];
            };
        }

        rpc.login({
            clientId: apps[_activeApp].clientID
        }).then(() => {
            _previousApp = _activeApp
        })
    }

    }catch(err) {
        throw err
    } 
  }

monitor.getActiveWindow(callback, -1, 2);


