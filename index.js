const Discord = require("discord.js");
const fetch = require("node-fetch");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();

client.login(token);

client.once("ready", () => {
    console.log("Ready!")
})

client.on("message", message => {
    if(message.content.startsWith(`${prefix}animemes`))
    {
        getPost("animemes")
            .then(content => message.channel.send(content.title, {files: [content.url]}))
            .catch(error => console.log(error));
    }
    else if(message.content.startsWith(`${prefix}animeirl`))
    {
        getPost("anime_irl")
            .then(content => message.channel.send(content.title, {files: [content.url]}))
            .catch(error => console.log(error));
    }
    else if(message.content.startsWith(`${prefix}hanimemes`))
    {
        getPost("hentaimemes")
            .then(content => message.channel.send(content.title, {files: [content.url]}))
            .catch(error => console.log(error));
    }
    else if(message.content.startsWith(`${prefix}moescape`))
    {
        getPost("moescape")
            .then(content => message.channel.send(content.title, {files: [content.url]}))
            .catch(error => console.log(error));
    }
    else if(message.content.startsWith(`${prefix}fuckinweeb`))
    {
        getPost("whataweeb")
            .then(content => message.channel.send(content.title, {files: [content.url]}))
            .catch(error => console.log(error));
    }
    else if(message.content.startsWith(`${prefix}test`))
    {
        content => message.channel.send("Test", {files: ["https://i.imgur.com/YGVw2po.gif"]})
    }
})

// Gets a random post from a random page between 1 and 5
function getPost(subreddit)
{
    var url = "https://www.reddit.com/r/" + subreddit + ".json?limit=100&after="
    var page = Math.floor(Math.random() * 10);
    var after = "";
    var content = "";

    // Go to random page
    for(var i = 0; i < page; i++)
    {
        after = fetch(url + after)
            .then(res => res.json())
            .then(json => { return json.data.after; });
    }

    var post = fetch(url + after)
        .then(res => res.json())
        .then(json => json.data.children.map(v => v.data))
        .then(posts_list => {
            var counter = 0;
            // Looks for an image/gif that it can post
            do
            {
                var num = Math.floor(Math.random() * posts_list.length);
                var randomPost = posts_list[num];

                counter++;
                if(counter >= 50)
                {
                    randomPost = {"title":"404 Couldn't find something to post", "url":"https://i.imgur.com/YGVw2po.gif"}
                    break;
                }
                console.log(randomPost.url);
            }while (!randomPost.url.endsWith(".gif") &&
                    !randomPost.url.endsWith(".png") &&
                    !randomPost.url.endsWith(".jpg"));

            return randomPost;
        });

    return post;
}
