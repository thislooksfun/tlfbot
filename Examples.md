#Examples

---

##login.json
```json
{
	"username": "tlfbot",
	"password": "<REDACTED>",
	"channels": ["thislooksfun", "tlfbot"]
}
```

---

##Command example: hi.js
```js
module.exports = [
	{
		name: "hi",
		usage: "!hi",
		aliases: ["hello"],
		perm: 0,
		f: function() { return "Hello"; }
	}
];
```