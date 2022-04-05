const fsPromises = require('fs').promises;
const sharp = require("sharp");

var index = 0;
var end = 0;
var brand = "";
var template = "";
var reseller = [];
var data_resource = [];
var informasi = {};
var folder_induk = ``;

async function generatPNG(lokasi_svg,nama_folder,nama_file){
	sharp(lokasi_svg)
		.png()
		.toFile(nama_folder+"/"+nama_file)
		.then(function(info) {
			fsPromises.unlink(lokasi_svg)
			return true;
		})
		.catch(function(err) {
			console.log(err)
		})
}

async function generate() {
	let data = {};
	data.nama = reseller[index].nama;
	data.wa = reseller[index].wa;
	// var data = Object.assign({},informasi,data_resource[index]);
	var desain_ig = require(`../desain/${brand}/${template}/ig.js`);
	var desain_wa = require(`../desain/${brand}/${template}/wa.js`);
	var desain_fb = require(`../desain/${brand}/${template}/fb.js`);
	var kode_unik = Date.now();
	// 1. Buat Folder
		let tanggal = new Date();
		var get_bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
		var nama_folder = `/reseller/${brand} ${tanggal.getDate()} ${get_bulan[tanggal.getMonth()]} ${tanggal.getFullYear()} - ${data.nama} - ${kode_unik}/`;

		await fsPromises.mkdir(`${nama_folder}`,{recursive:true});

		// 2. Buat Notepad untuk Judul FBMP, Lokasi Posting & Caption
		// var konten_notepad = `Judul :\n${data.kata_opening} ${data.kategori} (${data.kata_penutup}) ${data.nama_produk} - ${data.kecamatan} (${informasi.kota})\n\nLokasi :\n${data.kecamatan}, ${informasi.kota}, ${informasi.provinsi}\n\nCaption :\n${data.deskripsi}`;

		// await fsPromises.writeFile(`${nama_folder}/caption.txt`,konten_notepad);

	// 3. Buat File SVG
		
		var lokasi_svg_ig = `ig-${kode_unik}.svg`;
		var lokasi_svg_fb = `fb-${kode_unik}.svg`;
		var lokasi_svg_wa = `wa-${kode_unik}.svg`;

		// var resource = 
		var svg_ig = desain_ig(data);
		var svg_fb = desain_fb(data);
		var svg_wa = desain_wa(data);

		await fsPromises.writeFile(lokasi_svg_ig,svg_ig);
		await fsPromises.writeFile(lokasi_svg_wa,svg_wa);
		await fsPromises.writeFile(lokasi_svg_fb,svg_fb);

		// 4. Generate PNG
		var hasil_ig = await generatPNG(lokasi_svg_ig,nama_folder,"ig.png");
		var hasil_fb = await generatPNG(lokasi_svg_fb,nama_folder,"fb.png");
		var hasil_wa = await generatPNG(lokasi_svg_wa,nama_folder,"wa.png");

		index++;
		return index;
}
async function loopSatu() {
	var proses = await generate();
	if (proses >= end) {
		return "done";
	}else{
		loopDua();
	}
}
async function loopDua() {
	var proses = await generate();
	if (proses >= end) {
		return "done";
	}else{
		loopDua();
	}
}

module.exports = async function (data ={}) {
	brand = data.brand;
	template = data.template;
	reseller = data.reseller;
	end = data.reseller.length;
	var result = await loopSatu();
	return result;
}