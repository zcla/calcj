"use strict";

const dados = {
	precos: [
		{ "ÁGUA MINERAL": 4.00 },
		{ "CERVEJA HEINEKEN": 7.00 },
		{ "CHOCOLATE QUENTE": 5.00 },
		{ "QUENTÃO": 6.00 },
		{ "REFRIGERANTE": 6.00 },
		{ "SUCO": 5.00 },
		{ "VINHO RESERVE 1853 TINTO – 750ml": 150.00 },
		{ "VINHO TERRAS LUSAS TINTO (TAÇA 150 ML)": 15.00 },
		{ "VINHO SOL FA SOUL TINTO – 750ml": 100.00 },
		{ "ALGODÃO DOCE": 6.00 },
		{ "ARROZ CARRETEIRO": 18.00 },
		{ "BATATA FRITA P": 10.00 },
		{ "BATATA FRITA G": 13.00 },
		{ "BOBÓ DE CAMARÃO": 20.00 },
		{ "BOBÓ VEGANO (VEGETARIANO)": 15.00 },
		{ "CACHORRO QUENTE": 8.00 },
		{ "CALDOS": 8.00 },
		{ "CAMARÃO EMPANADO": 15.00 },
		{ "CANJICA": 8.00 },
		{ "CHURRASCO": 10.00 },
		{ "CREPE": 18.00 },
		{ "CURAU": 7.00 },
		{ "DOCES (A PARTIR DE)": 4.00 },
		{ "GALINHADA": 16.00 },
		{ "MILHO VERDE": 5.00 },
		{ "PAMONHA": 12.00 },
		{ "PASTEL": 8.00 },
		{ "PIPOCA": 6.00 },
		{ "PIZZA BROTINHO": 10.00 },
		{ "TAPIOCA RECHEADA": 10.00 },
		{ "TAPIOCA SIMPLES": 5.00 },
		{ "ARGOLA": 8.00 },
		{ "CADEIA": 5.00 },
		{ "CORREIO ELEGANTE": 5.00 },
		{ "EMBALAGEM": 2.00 },
		{ "PESCARIA": 8.00 },
		{ "PULA-PULA": 8.00 }
	]
};

class Menu {
	static async calculadora() {
		const table = $('<table class="table table-sm table-bordered table-striped table-hover ministros">');
		
		const thead = $('<thead>');
		thead
				.append($('<tr>')
						.append($('<th>').append('Produto'))
						.append($('<th>').append('Preço')));
		table.append(thead);

		const tbody = $('<tbody>');

		for (const item of dados.precos) {
			const produto = Object.keys(item)[0];
			const preco = item[produto];
			tbody
					.append($('<tr>')
							.append($('<td class="produto">')
									.append(produto))
							.append($('<td class="preco text-end">')
									.append("R$ ")
									.append(preco.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))));
		}

		table.append(tbody);
		$('#calcj').append(table);
	}
}

$(document).ready(async function() {
	Menu.calculadora();
});
