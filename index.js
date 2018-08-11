const Discord = require("discord.js");
const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
//const date = require("date");
const YTDL = require("ytdl-core");
const Chance = require("chance");
var config = require("./config.json");
var cleverbot = require("cleverbot.io"),
	clever = new cleverbot(config.apiuser, config.apikey);
const bot = new Discord.Client();
const prefix = "!";
const botToken = config.discord;

clever.setNick("discord");

function play(connection, message) {
	var server =servers[message.guild.id];

	server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

	server.queue.shift();

	server.dispatcher.on("end", function() {
		if (server.queue[0]) play(connection, message);
		else connection.disconnect();
	});
}

var chance = new Chance();

bot.on("ready", () => {
	bot.user.setActivity("Skriv !help för hjälp");
	console.log("Discord.js Connected");
});

clever.create(function (err, session) {
	console.log("Cleverbot.io Connected");
	if (err){
		console.log(err);
	}
});

var hurExempel = require("./hurExempel");

var klasslista = require("./klasslista");

var servers = {};

var borde = [
	"Ja",
	"Ja",
	"Ja",
	"Nej",
	"Nej",
	"Nej",
	"Kanske"
];

var dabRespond = [
	"Du kan inte tvinga mig",
	"Du kan inte tvinga mig",
	"Du kan inte tvinga mig",
	"Du kan inte tvinga mig",
	"Du kan inte tvinga mig",
	"Du kan inte tvinga mig",
	"Vad är det du inte förstår?",
	"Jävla människor ska alltid komma och tjata",
	"Okej då, ***DAB***"
];


var inCash;
var betWinner;
var betWinnerCall;
var bet;
var betStarterId;
var betStarter;
var betLoserCall;
var betLoser;
var betExist = false;
var skott;
var pistolLaddad = false;
var widthSchema = "600";
var heightSchema = "600";

function fixSwedish(i) {
	if(i < 3) {
		return ":a";
	}else {
		return ":e";
	}
}

function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp);
	var months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var time = date + fixSwedish(date) + " " + month + " " + year + " klockan " + hour + ":" + min;
	return time;
}

bot.on("message", (message) => {
	if (message.channel.id == config.memeroom)  {
		if (message.content.startsWith("http") || message.attachments.size != "0"){
			message.react("👍");
			setTimeout(function(){
				message.react("👎");
			}, 500);
		}     
	}
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix) && (message.channel.id == config.cleverbot || message.channel.type === "dm")) {
		message.channel.startTyping();
		clever.ask(message.content, function (err, response) {
			if (err) {
				console.log(err);
				return;
			}
			message.channel.send(response);
		});
		message.channel.stopTyping();
	}
	if (!message.content.startsWith(prefix)) return;

	var split = message.content.substring(prefix.length).split(" ");
	
	switch (split[0].toLowerCase()) {
	case "h":
	case "help":
		message.channel.send({
			embed: new Discord.RichEmbed()
				.setAuthor("Kommandon:", bot.user.avatarURL)
				.addField("Allmäna kommandon:", "!help - visar denna meny\n!dab - sprid cancer\n!poll <fråga> - Starta en ja eller nej fråga\n!pinpoll - samma som !poll fast den pinnar också\n!borde - låt boten svara på livets svåra frågor\n!ryss - spela rysk roulette\n!nummer <nummer1>-<nummer2> - ger dig ett slumpmässigt nummer\n!vem <påstående> - låter boten välja vem påståendet bäst passar in på\n!hur - säger hur något hände\n!tid - ger en slumpmässig tid")
				.addField("Skolrelaterade kommandon:", "!schema - visar veckans schema\n!schemavecka <vecka> - visar schemat från en viss vecka\n!vecka - visar veckan\n!wikipedia <sida> - låter dig gå till en viss Wikipedia hemsida\n!wikise <sida> - låter dig gå till en svenska Wikipedia sida\n!wikisök <sök> - söker på Wikipedia\n!google <sök> - söker på google")
				.addField("Discord kommandon:", "!hex - ger dig en slumpmässig färg\n!hexdisplay <hex> - visar fägen som det inskrivna hex nummret ger\n!github - skickar länken till botens github repo\n!ping - visar botens internal ping (för felsökning)\n!getid - visar ditt user id\n!info - visar info om servern")
				.setColor("0x111111")
		});
		message.channel.send({
			embed: new Discord.RichEmbed()
				.addField("Ekonomi kommandon:", "!plånbok - skapar en personlig plånbok åt dig\n!saldo - visar ditt saldo\n!bet <amount> - flipa en slant med någon och se vem som vinner pengarna\n!resetplånbok - resetar din plånbok\n!removebet - tar bort det senaste betet")
				.addField("Musik kommandon:", "!play <url> - spelar en youtube url\n!skip - skippar låten som spelas nu\n!stop - stoppar musiken helt\n!theend - spelar upp ett visst tal")
				.setColor("0x111111")
		});
		break;
	case "hur":
		message.channel.send("Av "+hurExempel[Math.floor(Math.random() * hurExempel.length)]);
		break;
	case "saldo":
		var saldo;
		fs.readFile("wallets/"+message.author.id+".txt", function read(err, data) {
			if (err) {
				message.channel.send("```Du måste skapa en plånbok först\nSkriv !plånbok för att skapa en```");
				return;
			}
			saldo = data;
			message.channel.send(message.author.toString()+" Ditt saldo är: "+saldo);
		});
			
		
		break;
	case "resetplånbok":
		fs.stat("wallets/"+message.author.id+".txt", function(err) {
			if(err == null) {
				var wstream = fs.createWriteStream("wallets/"+message.author.id+".txt");
				wstream.write("10");
				message.channel.send("Din plånbok är resetad");
				return;
			} else if(err.code == "ENOENT") {
				message.channel.send("Du har ingen plånbok, skriv !plånbok för att skapa en");
			} else {
				console.log("Some other error: ", err.code);
			}
		});
		break;
	case "removebet":
		betExist = false;
		message.channel.send("Betet på "+bet+" är nu borttaget");
		break;
	case "bet":
		var vinnarensSaldo = "";
		var loserSaldo = "";
		fs.readFile("wallets/"+message.author.id+".txt", function read(err, data) {
			if (err) {
				message.channel.send("```Du måste skapa en plånbok först\nSkriv !plånbok för att skapa en```");
				return;
			}
			inCash = parseInt(data) + 1;
			if (betExist === false) {
				betStarter = message.member;
				betStarterId = message.author.id;
				bet = message.content.substring(5);
				if (parseInt(inCash) <= parseInt(bet)) {
					message.channel.send(message.author.toString()+" Du kan inte betta mer än du har");
					return;
				}
				if (bet == parseInt(bet, 10)) {
					if (parseInt(bet) < 0) {
						message.channel.send("Du kan inte betta negativ nummer");
						return;
					}
					message.channel.send(betStarter.toString()+" bettar "+bet+"\nSkriv !bet för att betta emot");
					betExist = true;
					return;
				}
				message.channel.send("Jag tror inte "+bet+" är ett nummer.");
				return;
			}
				
			else {
				if (message.author.id === betStarterId) {
					message.channel.send("Du kan inte betta mot dig själv");
					return;
				}
				if (parseInt(inCash) <= parseInt(bet)) {
					message.channel.send(message.author.toString()+" Du kan inte betta mer än du har");
					return;
				}
				betWinner = Math.random() < 0.5 ? betStarterId : message.author.id;
				if (betWinner === betStarterId) {
					betWinnerCall = betStarter;
					betLoser = message.author.id;
					betLoserCall = message.member;
				}
				else {
					betWinnerCall = message.member;
					betLoser = betStarterId;
					betLoserCall = betStarter;
				}
					

				fs.readFile("wallets/"+betWinner+".txt", function read(err, data) {
					if (err) {
						message.channel.send("```Du måste skapa en plånbok först\nSkriv !plånbok för att skapa en```");
						return;
					}
					vinnarensSaldo = parseInt(data)  +  parseInt(bet);
					fs.writeFileSync("wallets/"+betWinner+".txt", vinnarensSaldo);
					betExist = false;
					fs.readFile("wallets/"+betLoser+".txt", function read(err2, data2) {
						if (err2) {
							message.channel.send("```Du måste skapa en plånbok först\nSkriv !plånbok för att skapa en```");
							return;
						}
						loserSaldo = parseInt(data2)  -  parseInt(bet);
						fs.writeFileSync("wallets/"+betLoser+".txt", loserSaldo);
							
						message.channel.send({
							embed: new Discord.RichEmbed()
								.addField(betWinnerCall.nickname+ " Vann betet på "+bet, betLoserCall.nickname+" saldo är nu: "+loserSaldo+"\n"+betWinnerCall.nickname+" saldo är nu: "+vinnarensSaldo)
								.setColor("0x009900")
						});
					});
				});
			}  
		});	
		break;
	case "shop":
		message.channel.send({
			embed: new Discord.RichEmbed()
				.addField("150¤", "Rosa")
				.setColor("0xff80ff")
		});
		message.channel.send({
			embed: new Discord.RichEmbed()
				.addField("200¤", "Grön")
				.setColor("0x339933")
		});
		message.channel.send({
			embed: new Discord.RichEmbed()
				.addField("300¤", "Orange")
				.setColor("0x#ff8533")
		});
		message.channel.send({
			embed: new Discord.RichEmbed()
				.addField("500¤", "ValfriFärg")
				.addBlankField()
				.addField("Hur man köper:", "Köp en färg genom att skriva !köp följt av namnet på färgen")
				.setColor("0x"+("000000"+Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6))
		});
		break;
	case "köp":
		switch (message.content.substring(5).toLowerCase()) {
		case "rosa":
			var pris = 150;
			var saldo;
			fs.readFile("wallets/"+message.author.id+".txt", function read(err, data) {
				if (err) {
					message.channel.send("```Du måste skapa en plånbok först\nSkriv !plånbok för att skapa en```");
					return;
				}
				saldo = data;
				if (saldo < pris) {
					var saknar = pris - saldo;
					message.channel.send("Du saknar "+saknar+"¤");
					return;
				}
				var saldoLeft = saldo - pris;
				fs.writeFileSync("wallets/"+message.author.id+".txt", saldoLeft);
				message.member.addRole("448615484749905941");
			});
			break;
		case "grön":
			var pris = 200;
			var saldo;
			fs.readFile("wallets/"+message.author.id+".txt", function read(err, data) {
				if (err) {
					message.channel.send("```Du måste skapa en plånbok först\nSkriv !plånbok för att skapa en```");
					return;
				}
				saldo = data;
				if (saldo < pris) {
					var saknar = pris - saldo;
					message.channel.send("Du saknar "+saknar+"¤");
					return;
				}
				var saldoLeft = saldo - pris;
				fs.writeFileSync("wallets/"+message.author.id+".txt", saldoLeft);
				message.member.addRole("448615705168838667");
			});
			break;
		case "orange":
			var pris = 300;
			var saldo;
			fs.readFile("wallets/"+message.author.id+".txt", function read(err, data) {
				if (err) {
					message.channel.send("```Du måste skapa en plånbok först\nSkriv !plånbok för att skapa en```");
					return;
				}
				saldo = data;
				if (saldo < pris) {
					var saknar = pris - saldo;
					message.channel.send("Du saknar "+saknar+"¤");
					return;
				}
				var saldoLeft = saldo - pris;
				fs.writeFileSync("wallets/"+message.author.id+".txt", saldoLeft);
				message.member.addRole("448615774374985729");
			});
			break;
		case "valfrifärg":
			var pris = 500;
			var saldo;
			fs.readFile("wallets/"+message.author.id+".txt", function read(err, data) {
				if (err) {
					message.channel.send("```Du måste skapa en plånbok först\nSkriv !plånbok för att skapa en```");
					return;
				}
				saldo = data;
				if (saldo < pris) {
					var saknar = pris - saldo;
					message.channel.send("Du saknar "+saknar+"¤");
					return;
				}
				var saldoLeft = saldo - pris;
				fs.writeFileSync("wallets/"+message.author.id+".txt", saldoLeft);
				message.channel.send("Ändra färg på din roll med kommandot !färg <hexkod>\nSkriv !hex för att få fram en slumpmässig hex kod");
				message.guild.createRole({
					name: message.member.nickname,
					position: 7,
				})
					.then(newrole => message.member.addRole(newrole));
			});
			break;
		default:
			message.channel.send(message.content.substring(5)+" är inte en färg som säljs, skriv !shop för att se vilka färger som finns\nFör valfrifärg skriver du !köp valfrifärg");
		}
		break;
	case "färg":
		if (message.channel.type === "dm") {
			message.channel.send("Detta kommando funkar inte i DM");
			break;
		}
		if (message.member.roles.find("name", message.member.nickname) == null) {
			message.channel.send("Du har inte köpt varlfrifärg");
			break;
		}
		message.member.roles.find("name", message.member.nickname).setColor(message.content.substring(6));
		break;
	case "roller":
		console.log(message.guild.roles);
		break;
	case "plånbok":
		fs.stat("wallets/"+message.author.id+".txt", function(err) {
			if(err == null) {
				message.channel.send("Du har redan en plånbok!");
			} else if(err.code == "ENOENT") {
				var wstream = fs.createWriteStream("wallets/"+message.author.id+".txt");
				wstream.write("100");
				message.channel.send("Du har nu en plånbok");
				return;
			} else {
				console.log("Some other error: ", err.code);
			}
		});
		break;
	case "vecka":
		Date.prototype.getWeek = function() {
			var onejan = new Date(this.getFullYear(), 0, 1);
			return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
		};
		var weekNumber = (new Date()).getWeek();
		message.channel.send(weekNumber);
		break;
	case "play":
		if (message.content.substring(5) === "") {
			message.channel.send("Glöm inte bort att skicka en länk också");
			return;
		}

		if (!message.member.voiceChannel) {
			message.channel.send("Du måste vara i en voicechannel först");
			return;
		}

		if(!servers[message.guild.id]) servers[message.guild.id] = {
			queue: []
		};

		var server = servers[message.guild.id];

		server.queue.push(message.content.substring(6));

		if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
			play(connection, message);
		});
		break;
	case "skip":
		var server = servers[message.guild.id];

		if (server.dispatcher) server.dispatcher.end();
		break;
	case "theend":
		if (!message.member.voiceChannel) {
			message.channel.send("Du måste vara i en voicechannel först");
			return;
		}
		if(!servers[message.guild.id]) servers[message.guild.id] = {
			queue: []
		};
		var server = servers[message.guild.id];
		server.queue.push("https://youtu.be/pdRH5wzCQQw");
		if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
			play(connection, message);
		});
		break;
	case "stop":
		var server = servers[message.guild.id];
		if (message.guild.voiceConnection)
		{
			for (var i = server.queue.length - 1; i >= 0; i--) 
			{
				server.queue.splice(i, 1);
			}
			server.dispatcher.end();
			console.log("[" + new Date().toLocaleString() + "] Stopped the queue.");
		}
		break;
	case "s":
	case "schema":
		var valfriVecka;
		Date.prototype.getWeek = function() {
			var onejan = new Date(this.getFullYear(), 0, 1);
			return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
		};
		var weekNumber = (new Date()).getWeek();
		if (message.content.charAt(4) === "e") {
			valfriVecka = message.content.substring(8);
		}
		else {
			valfriVecka = message.content.substring(3);
		}

		if (valfriVecka === "") {
			valfriVecka = weekNumber;
		}
			
		message.channel.send({
			embed: new Discord.RichEmbed()
				.setAuthor("Schema v."+valfriVecka+":")
				.setImage("http://www.novasoftware.se/ImgGen/schedulegenerator.aspx?format=png&schoolid=80220/sv-se&type=1&id={EA17E85E-CBFC-4836-935C-04780337F6D5}&period=&week="+valfriVecka+
					"&mode=0&printer=0&colors=32&head=0&clock=0&foot=0&day=0&width="+widthSchema+"&height="+heightSchema+"&maxwidth=1883&maxheight=847")
				.setColor("0x"+("000000"+Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6))
		});
		break;
	case "github":
		message.author.send("https://github.com/ChilladeChillin/ITGDiscordBot");
		break;
	case "gr":
		message.delete(0);
		var rad = message.content.substring(4);
		message.channel.send("https://github.com/ChilladeChillin/ITGDiscordBot/blob/master/index.js#L"+rad);
		break;
	case "dab":
		message.channel.send(dabRespond[Math.floor(Math.random() * dabRespond.length)]);
		break;
	case "säg":
	case "say":
		message.delete(0);
		if (message.author.id==="164283691802165250") {
			message.channel.send(message.content.substring(5));
		}
		else {
			message.author.send("Du har inte tillåtelse att använda detta kommando");
		}
		break;
	case "ping":
		message.channel.send(bot.ping+" ms");
		break;
	case "hex":
		var randomhex = ("000000"+Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
		message.channel.send({
			embed: new Discord.RichEmbed()
				.setAuthor("Hex:")
				.setDescription("#"+randomhex)
				.setColor("0x"+randomhex)
		});
		break;
	case "poll":
		var question = message.content.substring(6);
		message.delete(0);
		message.channel.send(question+"\n\n`👍=JA 👎=NEJ`")
			.then(function (message) {
				message.react("👍");
				setTimeout(function(){
					message.react("👎");
				}, 500);
			}).catch(function() {
				console.log("Reaktionen gick inte hela vägen fram");
			});
		break;
	case "pollpin":
	case "pinpoll":
		var question = message.content.substring(9);
		message.delete(0);
		message.channel.send(question+"\n\n`👍=JA 👎=NEJ`")
			.then(function (message) {
				message.react("👍");
				message.pin();
				setTimeout(function(){
					message.react("👎");
				}, 500);
			}).catch(function() {
				console.log("Reaktionen gick inte hela vägen fram (pinpoll)");
			});
		break;
	case "hd":
	case "hexdisplay":
		var hexMessageFix;
		var hexMessage;
		if (message.content.charAt(4) === "d") {
			hexMessage = message.content.substring(12);
		}
		else {
			hexMessage = message.content.substring(4);
		}
		if (hexMessage.charAt(0) === "#") {
			hexMessageFix = hexMessage.substring(1);
		}
		else {
			hexMessageFix = hexMessage;
		}
		message.channel.send({
			embed: new Discord.RichEmbed()
				.setAuthor("Hex:")
				.setDescription("#"+hexMessageFix)
				.setColor("0x"+hexMessageFix)
		});
		break;
	case "getid":
		message.channel.send(message.author.id);
		break;
	case "getchannelid":
		message.channel.send(message.channel.id);
		break;
	case "itg,":
	case "itg":
	case "har":
	case "ska":
	case "gillar":
	case "vet":
	case "hade":
	case "skulle":
	case "kommer":
	case "är":
	case "borde":
		message.channel.send(borde[Math.floor(Math.random()*borde.length)]+" "+message.author.toString());
		break;
	case "ryss":
		if (pistolLaddad === false) {
			message.channel.send("Laddar Pistolen");
			pistolLaddad = true;
			skott = Math.floor((Math.random() * 6) + 1);
		}
		else {
			if (skott === 1) {
				message.channel.send("Du dog "+message.author.toString());
				pistolLaddad = false;
			}
			else {
				message.channel.send("Du överlevde "+message.author.toString());
				skott -= 1;
			}
		}
		break;
	case "lmgtfy":
		var wikiSearch = message.content.substring(8).replace(/ /g,"+");
		message.channel.send("http://lmgtfy.com/?q="+wikiSearch);
		break;
	case "wikipedia":
		wikiSearch = message.content.substring(11).replace(/ /g,"_");
		message.channel.send("https://en.wikipedia.org/wiki/"+wikiSearch);
		break;
	case "wikise":
		wikiSearch = message.content.substring(8).replace(/ /g,"_");
		message.channel.send("https://sv.wikipedia.org/wiki/"+wikiSearch);
		break;
	case "wikisök":
		wikiSearch = message.content.substring(9).replace(/ /g,"+");
		message.channel.send("https://en.wikipedia.org/w/index.php?search="+wikiSearch);
		break;
	case "google":
		var googleSearch = message.content.substring(8).replace(/ /g,"+");
		message.channel.send("https://www.google.se/search?q="+googleSearch);
		break;
	case "slang":
		var slangSearch = message.content.substring(7).replace(/å/gi,"%E5").replace(/ä/gi,"%E4").replace(/ö/gi,"%F6");
		var slang_url = "http://www.slangopedia.se/ordlista/?ord=" + slangSearch;
		request(slang_url, function(err, resp, body) {
			var $ = cheerio.load(body);

			var slang_title = $(".word").first();
			var slang_titleText = slang_title.text();

			var slang_def = $(".definition").first();
			slang_def.find("br").replaceWith("\n");
			var slang_defText = slang_def.text();

			var slang_ex = $(".example").first();
			slang_ex.find("br").replaceWith("\n");
			var slang_exText = slang_ex.text();

			if (slang_titleText == "" && slang_defText == "") {
				message.channel.send(new Discord.RichEmbed().addField("**Kunde inte hitta slanget \"" + split[1] + "\".**").setColor(0xffcc77));
			} else {
				message.channel.send({
					embed: new Discord.RichEmbed()
						//.setAuthor()
						.addField(slang_titleText.charAt(0).toUpperCase() + slang_titleText.slice(1), slang_defText)
						.addBlankField()
						.addField("Exempel:","*"+slang_exText+"*")
						.setColor(0xffcc77)
				});		
			}
		});
		break;
	case "info":
		message.author.send({
			embed: new Discord.RichEmbed()
				.addField("Serverinformation:", "Antal medlemmar: " + message.guild.memberCount + "\nDu gick med den " + timeConverter(message.guild.joinedTimestamp) + "\nServerns admin är: " + message.guild.owner)
				.setThumbnail(message.guild.iconURL)
				.setColor("0x111111")
		});
		break;
	case "tid":
		message.channel.send(chance.date({string: true, american: false})+" Klockan "+chance.hour()+":"+chance.minute());
		break;
	case "nummer":
		var meddelandetsContent = message.content.substring(8);
		var mittenStreck = meddelandetsContent.indexOf("-");
		var förstaTalet = meddelandetsContent.substring(0, mittenStreck);
		var andraTalet = meddelandetsContent.substring(mittenStreck+1);
		message.channel.send(Math.floor(Math.random() * parseInt(andraTalet) + parseInt(förstaTalet)));
		break;
	case "vem":
		if (message.channel.type === "text") {
			var statement = message.content.substring(5);
			if (statement.endsWith("?")) {
				statement = message.content.substring(5).replace("?", ".");
			}
			message.channel.send(message.guild.members.random().toString()+" "+statement);
		}
		break;
	case "vemalla":
		var statement = message.content.substring(9);
		if (statement.endsWith("?")) {
			statement = message.content.substring(9).replace("?", ".");
		}
		message.channel.send(klasslista[Math.floor(Math.random()*klasslista.length)]+" "+statement);
		break;
		/*case "test":
			var meddelandet = chance.currency();
			message.channel.send("Här: "+JSON.stringify(meddelandet));
			break;*/
	default:
		message.channel.send("```Detta kommando existerar inte (än)\nSkriv !help för att se de kommandon som faktiskt existerar```");
	}
});

bot.login(botToken);