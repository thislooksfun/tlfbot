# tlfbot

This is a fairly simple chat bot for [beam.pro](http://beam.pro) build in Node.js. (It looks more complex than it really is, because I love over-complicating things, and making them easy to expand, but not easy to maintain.)

## Note:
In this document I will be specifying variable items (either ones you need to input, or things that aren't fixed) with the syntax `<item description>`

---

If you want actual examples of any of the following syntax, please click [here](https://github.com/thislooksfun/tlfbot/blob/master/Examples.md).

---

## To use:
1. Install [Node.js](https://nodejs.org/)
2. Clone/download this code
3. Create a file called "login.json" in your install directory, and give it the structure:
```json
{
	"username": "<bot name>",
	"password": "<bot password>",
	"channels": ["<channels you want to connect to>", "<seperated by commas>"]
}
```
**NOTE**: Only the first channel will be read at the moment.

4. `cd` to the install dir, and run `node botcontrol.js`  
You **must** cd to the install dir, or it *will* crash!
5. You now have your own beam.pro chat bot!

## Adding/changing commands
To add a command, simply add a file to the `commands` folder, with the following syntax:
```js
module.exports = [
	{
		name: "<name>",
		usage: "<usage>",
		aliases: ["<alias 1>", "<alias 2>", ... "<alias n>"],
		perm: 0,
		f: function() {
			return "<resp>";
		}
	}
];
```
### Explanations:
`name` - The name of your command. This is what will be typed to run your command  
**NOTE:** this will be prefixed with "!" automatically, so having a name of `"!foo"` will require the user to type `!!foo`  
`usage` - How to use your command. This should be in the form `!<name> [args]`  
`aliases` - (Optional) Any aliases for your command  
`perm` - The permission level (see "permissions" below)  
`f` - The actual code that will be run (see "function" below)

---

### Permissions
The permission levels are as follows:  
0) Anyone can use  
1) Only mods and higher  
2) Only admins and higher can use  
3) Only the channel owner can use

---

### Function
The function `<f>` is defined as follows:
```js
function(args, sender) { return "<msg>" }
```
`args` are the arguments of the command. (`args[0]` will always be the command name.)  
`sender` is the command sender in the form:
```js
{user: "<username>", perm: <permission level - as defined above>}
```
**Both of the arguments (`args` and `sender`) are entirely optional, you don't need to specify them if you don't need them. However, if you want `sender`, you need `args` too, even if you don't use them.**

`msg` is the optional return message. This will be sent to the entire chat. If you don't need a message sent back, simply don't return anything.

---

### Errors
All errors thrown in any commands will be caught, and printed to the console. It will also send a message to the chat room saying `"An unknown error occurred running command '<cmd>'"`  
If the command is invalid (doesn't exist), it will send the message `"Unknown command '<c>'"` where `<c>` is the command name minus the args. (The `c` for `!hello 1 3 5 yes` is `!hello`)

##Chat listeners
-- Coming soon --

# License
This work is copywrited under the [GPL v2 licence](https://github.com/thislooksfun/tlfbot/blob/master/LICENSE).
