const Discord = require("discord.js");
const fetch = require("node-fetch");
const { prefix, token } = require("./config.json");
const client = new Discord.Client();
const subreddits = {"animeirl":"anime_irl", "animemes":"animemes", "fuckinweeb":"whataweeb", "hanimemes":"hentaimemes",
                              "moescape":"moescape", "wanimemes":"wholesomeanimemes"};


client.login(token);

client.once("ready", () => {
    console.log("Ready!")
})

client.on("message", message => {
    if(message.content.startsWith(`${prefix}`))
    {
        var phrase = message.content.slice(1);
        switch (phrase)
        {
            case "list":
                var keys = Object.keys(subreddits);
                var list_subreddits = "";
                keys.forEach(key => list_subreddits += key + " => /r/" + subreddits[key]);
                message.channel.send("Type in the phrase with a \"!\" before it to get an image from the supported subreddits.\n" +
                                    "(phrase => subreddit)\n" +
                                    "random => (random subreddit listed)\n" +
                                    list_subreddits);
                break;
            case "random":
                var keys = Object.keys(subreddits);
                sendPost(message.channel, subreddits[keys[keys.length * Math.random() << 0]]);
                break;
            default:
                if(subreddits.hasOwnProperty(phrase))
                {
                    sendPost(message.channel, subreddits[phrase]);
                }
                else
                {
                    message.channel.send("Did you call? Try \"!list\" to see how to trigger me.");
                }
                break;
        }
    }
})

// Sends a message to the channel with an image from the given sub
function sendPost(channel, sub)
{
    getPost(sub)
        .then(content => { channel.send(content.title, {files: [content.url]})
            .catch(() => channel.send(content.title + "\n" + content.url))});
}

// Gets a random post from a random page between 1 and 10
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
                // After searching for 50 times, send a predetermined image and title
                if(counter >= 50)
                {
                    randomPost.title = "404 Couldn't find something to post"
                    randomPost.url = "https://i.imgur.com/YGVw2po.gif"
                    break;
                }
            }while (!randomPost.url.endsWith(".gif") &&
                    !randomPost.url.endsWith(".png") &&
                    !randomPost.url.endsWith(".jpg") &&
                    !(randomPost.stickied == false)); // Must end with .gif/.png/.jpg and is not a stickied post

            return randomPost;
        });

    return post;
}
