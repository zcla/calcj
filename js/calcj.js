"use strict";

// Tenta resolver o problema do cache
try {
	window.applicationCache.swapCache();
} catch {
	// só para evitar o erro
}

const dados = {
	tabelaDePrecos: [
		{ "ÁGUA MINERAL": 4.00 },
		{ "CERVEJA HEINEKEN": 7.00 },
		{ "CHOCOLATE QUENTE": 5.00 },
		{ "QUENTÃO": 6.00 },
		{ "REFRIGERANTE": 6.00 },
		{ "SUCO": 5.00 },
		{ "VINHO RESERVE 1853 TINTO - 750ml": 150.00 },
		{ "VINHO TERRAS LUSAS TINTO (TAÇA 150 ML)": 15.00 },
		{ "VINHO SOL FA SOUL TINTO - 750ml": 100.00 },
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

let atual = [];

function idProduto(produto) {
	return produto
		.replaceAll(' ', '_')
		.replaceAll('-', '_')
		.replaceAll('(', '_')
		.replaceAll(')', '_');
}

function formataPreco(preco) {
	return "R$&nbsp;" + preco.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function montaCalculadora() {
	const tbody = $('<tbody>');
	for (const item of dados.tabelaDePrecos) {
		const produto = Object.keys(item)[0];
		const preco = item[produto];
		tbody
				.append($('<tr>')
						.append($('<td class="produto">')
								.append(produto))
						.append($('<td class="preco text-end">')
								.append(formataPreco(preco)))
						.append($('<td class="quantidade">')
								.append($('<div class="input-group mb-3">')
										.append($('<button class="btn btn-danger btn-sm" type="button" onclick="javascript:add(\'' + idProduto(produto) + '\', -1);">&minus;</button>'))
										.append($('<input type="number" class="form-control" id="qtd_' + idProduto(produto) + '" value="0">'))
										.append($('<button class="btn btn-success btn-sm" type="button" onclick="javascript:add(\'' + idProduto(produto) + '\', 1);">&plus;</button>')))));
	}

	$('#calcj')
			.append($('<table class="table table-sm table-bordered table-striped table-hover tabelaDePrecos">')
					.append($('<thead>')
							.append($('<tr>')
									.append($('<th class="col-md-10">').append('Produto'))
									.append($('<th class="col-md-1">').append('Preço'))
									.append($('<th class="col-md-1">').append('Quantidade'))))
					.append(tbody));
	total();
}

function add(produto, quantidade) {
	if (!atual[produto]) {
		atual[produto] = 0;
	}
	atual[produto] += quantidade;
	if (atual[produto] < 0) {
		atual[produto] = 0;
	}
	$('#qtd_' + produto).val(atual[produto]);
	total();
}

function zera() {
	atual = [];
	$('input[type="number"]').val(0);
	total();
}

function total() {
	$('#total').empty();
	$('#conferencia').empty();
	let total = 0;
	const tbody = $('<tbody>');

	const ulConferencia = $('<ul>')
	for (const item of dados.tabelaDePrecos) {
		const produto = Object.keys(item)[0];
		const preco = item[produto];
		const quantidade = $('#qtd_' + idProduto(produto)).val();
		const totalItem = quantidade * preco
		total += totalItem;
		if (quantidade > 0) {
			tbody
					.append($('<tr>')
							.append($('<td>')
									.append(produto))
							.append($('<td class="text-end">')
									.append(formataPreco(preco)))
							.append($('<td class="text-end">')
									.append(quantidade))
							.append($('<td class="text-end">')
									.append(formataPreco(totalItem))));
		}
	}

	$('#total').val(formataPreco(total));

	$('#conferencia')
			.append($('<h1>')
					.append('Conferência'))
			.append($('<table class="table table-sm table-bordered table-striped table-hover tabelaDePrecos">')
					.append($('<thead>')
							.append($('<tr>')
									.append($('<th class="col-md-10">').append('Produto'))
									.append($('<th class="col-md-1">').append('Preço'))
									.append($('<th class="col-md-1">').append('Qtd'))
									.append($('<th class="col-md-1">').append('Total'))))
					.append(tbody)
					.append($('<tfoot>')
							.append($('<tr>')
									.append($('<th colspan="3">')
											.append('TOTAL'))
									.append($('<th class="text-end">')
											.append(formataPreco(total))))));
}

$(document).ready(async function() {
	montaCalculadora();
});
