// ==UserScript==
// @name         Loveread Felter
// @namespace    http://loveread.ec/
// @version      1
// @description  Фильтр по просмортам 05.04.22
// @author       ibolit
// @match        http://loveread.ec/
// @match        http://loveread.ec/index*
// @license      MIT
// @grant        none
// ==/UserScript==

/* Долго ждать @require (9 секунд). Отказ в пользу createElement('script') :строка 60
// @require https://rawcdn.githack.com/ibolit45/filter_loveread/64ea2ef434e220607f1fa64c2292f018af2e07fe/test/js/min/books.js
*/
const a = document.createElement('a')
const li = document.createElement('li')
const local = localStorage.getItem('books')
// Создаём кнопку Фильтр
a.textContent = a.title = 'Фильтр'
a.href = '#filter'
a.style.backgroundColor = local ? '#EE82EE' : 'white'
a.onclick = () => {
	local ? localStorage.removeItem('books') : localStorage.setItem('books', true)
	location.reload()
}

li.append(a)
document.getElementById('menu_left').prepend(li)
// Проверяем включен ли фильрт через localStorage
if (local && /http:\/\/loveread.ec\/$|index/.test(location)) {
	const genere_num = location.match(/\d+/) || 1
	const navigation = document.querySelectorAll('.navigation a')
	// На главной рандом элемнтов отключаем. ps. Была мысль дублировать на главной и следующей странице, но это не интуитивно.
	if ($id() > 30) {
		$link(navigation[1], $id('end'))
	} else navigation[1].style.display = 'none'

	function $link(link, fun) {
		link.href = fun;
		link.textContent = link.href.split('=')[2]
	}

	function $id(e, num = 1) {
		let current = +document.querySelector('.current').textContent
		let max = Math.max(+navigation[0].title.match(/\d+/), +navigation[1].title.match(/\d+/), current)
		let list = max - num ? max - num : 1
		switch(e) {
			case 'end': return 'http://loveread.ec/index_book.php?id_genre=' + genere_num + '&p=' + list
			default: return (max - current) * 6
		}
	}
	// Проверяем на главной ли мы, переходим на следующую.
	if ($id() == 0) {
		window.location.href = $id('end')
	} else {
		const body = document.querySelector('body')
		const js = document.createElement('script')
		// Подключаем min/books.js
		js.src = 'https://rawcdn.githack.com/ibolit45/filter_loveread/64ea2ef434e220607f1fa64c2292f018af2e07fe/test/js/min/books.js';
		body.append(js)
		// Ждать window дольше
		js.onload = () => {
			const td = document.querySelectorAll('.td_center_color')
			let genere = {'Боевики':20, 'Военные':21, 'Детективы':3, 'Детская проза':24, 'Домашняя':26, 'Драма':4, 'Историческая проза':27, 'Классика':6, 'Медицина':30, 'Научная фантастика':7, 'Политика':44, 'Приключение':8, 'Психология':9, 'Романы':5, 'Сказки':12, 'Современная проза':40, 'Триллеры':14, 'Ужасы и мистика':43, 'Фэнтези':16, 'Эротика':18, 'Юмористическая проза':19}
			let libs = $genere(books)
			let id = $id() < libs.length ? $id() - 6: libs.length - 6 // Узнаём индекс. Корректируем.
				// Заменяем ссылку на последнюю в фильте
				if ($id() < libs.length - 20) $link(navigation[navigation.length - 2], $id('end', Math.round(libs.length / 6)))

			function $genere(arr) {
				for (let i in genere) {
					if (genere[i] == genere_num) return arr.filter((e) => e.genere == i)
				}
				return arr
			}

			function $recursy(element) {
				element.childNodes.forEach(node => {
					if (node.className == 'table_gl') {
						node.querySelector('.td_text_10 p:last-child').textContent = 'Оценка: ' + libs[id].score
						node.querySelector('.td_top_color td:last-child').innerHTML = ''
						node.querySelector('.td_text_10 p').textContent = 'Просмотры: ' + libs[id].watch
						node.querySelector('.td_bottom_color td:last-child a').href = libs[id].src
						node.querySelector('.td_bottom_color a').textContent = ''
						node.querySelector('.td_top_text strong').textContent = libs[id].name
						node.querySelector('.td_top_color p').textContent = libs[id].genere
						node.style.width = '500px' // Умеьшаем ширину результата...так лучше?
						id += 1
					} else {
						$recursy(node)
					}
				})
			}

			function $clear (element) {
				for (let i of element) {
					i.innerHTML = ''
				}
			}

			$clear(td)
			$recursy(body)
		}
	}
}
