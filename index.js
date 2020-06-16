const Discord = require("discord.js");
const fetch = require("node-fetch");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();

client.login(token);

client.once("ready", () => {
    console.log("Ready!")
})

client.on("message", message => {
    var content = "";

    if(message.content.startsWith(`${prefix}animemes`)) {
        getPost("animemes")
            .then(content => message.channel.send(content));
    }
    else if(message.content.startsWith(`${prefix}animeirl`)) {
        getPost("anime_irl")
            .then(content => message.channel.send(content));
    }
    else if(message.content.startsWith(`${prefix}hmemes`)) {
        getPost("hentaimemes")
            .then(content => message.channel.send(content));
    }

})

// Gets a random post from a random page between 1 and 5
function getPost(subreddit) {
    var url = "https://www.reddit.com/r/" + subreddit + ".json?limit=100&after="
    var page = Math.floor(Math.random() * 5);
    var after = "";
    var content = "";

    // Go to random page
    for(var i = 0; i < page; i++) {
        after = fetch(url + after)
            .then(res => res.json())
            .then(json => { return json.data.after; });
    }

    var content = fetch(url + after)
        .then(res => res.json())
        .then(json => json.data.children.map(v => v.data.url))
        .then(posts => {
            var randomURL = posts[Math.floor(Math.random() * posts.length)];
            return randomURL;
        });

    return content;
}
