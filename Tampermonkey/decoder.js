// ==UserScript==
// @name         Loveread Decoder
// @namespace    http://loveread.ec/
// @version      1
// @description  Decoder book
// @author       ibolit
// @match        http://loveread.ec/*
// @license      MIT
// @grant        none
// ==/UserScript==

const local = localStorage.getItem('libs')
const genere = {'Боевики':20, 'Военные':21, 'Детективы':3, 'Детская проза':24, 'Домашняя':26, 'Драма':4, 'Историческая проза':27, 'Классика':6, 'Медицина':30, 'Научная фантастика':7, 'Политика':44, 'Приключение':8, 'Психология':9, 'Романы':5, 'Сказки':12, 'Современная проза':40, 'Триллеры':14, 'Ужасы и мистика':43, 'Фэнтези':16, 'Эротика':18, 'Юмористическая проза':19}
const libs = []

function $genere (e) {
	for (let i in genere) {
		if (genere[i] === e) return i
	}
}

function $go (arr) {
	arr.forEach(function (element, i, mass) {
		if (i%5 === 0) {
			const book = {
				genere: $genere(+element),
				name: mass[i + 1],
				watch: +mass[i + 2],
				score: +mass[i + 3],
				src: 'http://loveread.ec/view_global.php?id=' + mass[i + 4]
			}
			libs.push(book)
		}
	})
}

function $filter(g) {
	libs = libs.sort((a, b) => b.watch - a.watch)
	if (g === undefined) return libs
	libs = libs.filter((element) => element.genere === g)
	libs.forEach((element) => delete element.genere)
	return libs
}

$go(local)

let json = JSON.stringify($filtr(), null, 1) //Тут жанры в $filtr //Минифицировать без null, 1
console.log(json)
