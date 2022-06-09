"use strict";

// Tenta resolver o problema do cache
try {
	window.applicationCache.swapCache();
} catch {
	// só para evitar o erro
}

const dados = {
	tabelaDePrecos: [
		{ "Água mineral": 4.00 },
		{ "Cerveja Heineken": 7.00 },
		{ "Chocolate quente": 5.00 },
		{ "Quentão pequeno": 6.00 },
		{ "Quentão grande": 7.00 },
		{ "Refrigerante": 6.00 },
		{ "Suco": 5.00 },
		{ "Vinho Reserve 1853 - Tinto 750ml": 150.00 },
		{ "Vinho Terras Lusas - Tinto taça 150ml": 15.00 },
		{ "Vinho Sol Fa Soul - Tinto 750ml": 100.00 },
		{ "Algodão-doce": 6.00 },
		{ "Arroz carreteiro": 18.00 },
		{ "Batata frita pequena": 10.00 },
		{ "Batata frita grande": 13.00 },
		{ "Bobó de camarão": 20.00 },
		{ "Bobó vegano (vegetariano)": 15.00 },
		{ "Cachorro-quente": 8.00 },
		{ "Caldos": 8.00 },
		{ "Camarão empanado": 15.00 },
		{ "Canjica": 8.00 },
		{ "Churrasco": 10.00 },
		{ "Crepe": 18.00 },
		{ "Curau": 7.00 },
		{ "Galinhada": 16.00 },
		{ "Milho-verde": 5.00 },
		{ "Pamonha": 12.00 },
		{ "Pastel": 8.00 },
		{ "Pipoca": 6.00 },
		{ "Pizza brotinho": 10.00 },
		{ "Tapioca recheada": 10.00 },
		{ "Tapioca simples": 5.00 },
		{ "Argola": 8.00 },
		{ "Cadeia": 5.00 },
		{ "Correio elegante": 5.00 },
		{ "Embalagem": 2.00 },
		{ "Pescaria": 8.00 },
		{ "Pula-pula": 8.00 }
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
									.append($('<th class="col-md-1">').append('Qtd'))))
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
	const dinheiro = $('#dinheiro').val();
	let troco = '';
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
		if (dinheiro > 0) {
			troco = dinheiro - total;
			if (troco < 0) {
				troco = "";
			}
		}
	}

	$('#total').append(formataPreco(total));

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
											.append(formataPreco(total))))
							.append($('<tr>')
									.append($('<th colspan="3">')
											.append('Dinheiro'))
									.append($('<th>')
											.append('<input type="number" id="dinheiro" class="form-control" min="0" max="1000" value="' + dinheiro + '">')))
							.append($('<tr>')
									.append($('<th colspan="3">')
											.append('Troco'))
									.append($('<th>')
											.append('<input type="number" id="troco" class="form-control" min="0" max="1000" disabled value="' + troco + '">')))));
}

$(document).ready(async function() {
	montaCalculadora();
});
