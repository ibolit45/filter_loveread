// ==UserScript==
// @name         Loveread Parser
// @namespace    http://loveread.ec/
// @version      1
// @description  Parser book
// @author       ibolit
// @match        http://loveread.ec/index_book.php*
// @license      MIT
// @grant        none
// ==/UserScript==

const body = document.querySelector('body')
let textNode = localStorage.getItem('libs') //У localStorage ограничение памяти, ниже проверка номера страницы < 6000
const Genere = {'Жанр Боевики':20, 'Жанр Военные':21, 'Жанр Детективы':3, 'Жанр Детская проза':24, 'Жанр Домашняя':26, 'Жанр Драма':4, 'Жанр Историческая проза':27, 'Жанр Классика':6, 'Жанр Медицина':30, 'Жанр Научная фантастика':7, 'Жанр Политика':44, 'Жанр Приключение':8, 'Жанр Психология':9, 'Жанр Романы':5, 'Жанр Сказки':12, 'Жанр Современная проза':40, 'Жанр Триллеры':14, 'Жанр Ужасы и мистика':43, 'Жанр Фэнтези':16, 'Жанр Эротика':18, 'Жанр Юмористическая проза':19}

function $recursy(element) {
	element.childNodes.forEach(node => {
		if (node.className == 'table_gl') {
			let score = node.querySelector('.td_text_10 p:last-child').textContent
			score = (score == 'Рейтинг онлайн книги:  нет') ? 0 : +score.match(/\d+/)
			let watch = +node.querySelector('.td_text_10 p').textContent.match(/\d+/)
			let src = +node.querySelector('.td_bottom_color a:last-child').href.match(/\d+/)
			let name = node.querySelector('.td_top_text strong').textContent.replace(/\,/g, ' ')
			let genere = Genere[node.querySelector('.td_top_color p').textContent]
			const book = [genere,name,watch,score,src]
			if (textNode == undefined) {
				textNode.push(book)
			} else textNode = textNode + ',' + book
		} else $recursy(node)
	})
}

$recursy(body)
localStorage.setItem('libs', textNode)
window.onload = function () {
	let href = document.createElement('a')
	let http = document.location.href.split('=')
	http[2] = +http[2] + 1
	href.href = http.join('=')
	if (http[2] <= 6000) href.click() //Проверка
}
