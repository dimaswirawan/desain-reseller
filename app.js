const fsPromises = require('fs').promises;
var generate = require('./app/generate.js');

(async ()=>{
	var data = {};
	const data_reseller = await fsPromises.readFile(`db/reseller.json`);
	var string_reseller = data_reseller.toString();
	let reseller = JSON.parse(string_reseller);
	// console.log(reseller);
	let resource = {
		brand: "cucibos",
		template: "promo-member-baru",
		reseller: reseller
	}
	var build = await generate(resource);
	console.log(build)
})();