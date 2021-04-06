const sslChecker = require("ssl-checker");
const data = require('./data.json')

var success = {}
var warning = {}
var errors = {}

async function getDetails(hostname) {
	await sslChecker(hostname)
		.then(data => {
			if (data.daysRemaining > 15) {
				success[hostname] = {
					code: 'OK',
					data: data
				}
			} else if (data.daysRemaining > 0) {
				warning[hostname] = {
					code: 'EXPIRING',
					data: data
				}
			} else {
				errors[hostname] = {
					code: 'EXPIRED',
					data: data
				}
			}
		})
		.catch(e => {
			errors[hostname] = {
				code: 'NETWORK',
				error: e
			}
		})
}

var callback = []

for (var i in data.url) {
	callback.push(getDetails(data.url[i]))
}

Promise.all(callback).then(e => {
	console.log(success)
	console.log(warning)
	console.log(errors)
})