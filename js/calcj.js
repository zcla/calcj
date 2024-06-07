"use strict";

// Tenta resolver o problema do cache
try {
	window.applicationCache.swapCache();
} catch {
	// só para evitar o erro
}

const dados = {
	tabelaDePrecos: [
		{ "BEBIDAS": 0 },
		{ "Água mineral": 5.00 },
		{ "Cerveja Heineken": 10.00 },
		{ "Chocolate quente": 6.00 },
		{ "Quentão": 10.00 },
		{ "Refrigerante": 8.00 },
		{ "Suco": 8.00 },
		{ "ALIMENTAÇÃO": 0 },
		{ "Algodão-doce": 6.00 },
		{ "Arroz carreteiro": 25.00 },
		{ "Batata frita pequena": 12.00 },
		{ "Batata frita grande": 17.00 },
//		{ "Biscoitos amanteigados (saquinho)": 4.00 },
		{ "Bobó de camarão": 26.00 },
		{ "Bobó vegano (vegetariano)": 20.00 },
		{ "Bolo de pote": 10.00 },
		{ "Cuzcuz de tapioca": 10.00 },
		{ "Cachorro-quente": 10.00 },
		{ "Caldos": 12.00 },
		{ "Camarão empanado": 18.00 },
		{ "Canjica": 10.00 },
		{ "Churrasco": 15.00 },
		{ "Crepe": 20.00 },
		{ "Curau": 10.00 },
		{ "Galinhada": 20.00 },
		{ "Milho verde": 5.00 },
		{ "Pamonha": 17.00 },
		{ "Pastel": 10.00 },
		{ "Pipoca pequena": 6.00 },
		{ "Pipoca grande": 10.00 },
		{ "Pizza brotinho": 12.00 },
		{ "Tapioca recheada": 12.00 },
		{ "Tapioca simples": 6.00 },
		{ "Maçã do amor": 10.00 },
		{ "Uva/morango com chocolate": 15.00 },
		{ "DIVERSOS": 0 },
		{ "Argola": 12.00 },
		{ "Cadeia": 5.00 },
		{ "Correio elegante": 5.00 },
		{ "Embalagem": 2.00 },
		{ "Pescaria": 12.00 },
		{ "Pula-pula": 10.00 }
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
	const tabelaDePrecos = dados.tabelaDePrecos;
	for (const item of tabelaDePrecos) {
		const produto = Object.keys(item)[0];
		const preco = item[produto];
		if (preco > 0) {
			tbody
					.append($('<tr>')
							.append($('<td class="produto">')
									.append(produto))
							.append($('<td class="preco text-end">')
									.append(formataPreco(preco)))
							.append($('<td class="quantidade">')
									.append($('<div class="input-group">')
											.append($('<button class="btn btn-danger btn-sm" type="button" onclick="javascript:add(\'' + idProduto(produto) + '\', -1);">&minus;</button>'))
											.append($('<input type="number" class="form-control" id="qtd_' + idProduto(produto) + '" value="0" disabled>'))
											.append($('<button class="btn btn-success btn-sm" type="button" onclick="javascript:add(\'' + idProduto(produto) + '\', 1);">&plus;</button>')))));
		} else {
			tbody
					.append($('<tr>')
							.append($('<th class="subtitulo" colspan="3">')
									.append(produto)));
		}
	}

	$('#calcj')
			.append($('<table class="table table-sm table-bordered table-striped table-hover tabelaDePrecos">')
					.append($('<thead>')
							.append($('<tr>')
									.append($('<th class="col-md-10">')
										.append('Produto'))
									.append($('<th class="col-md-1">')
										.append('Preço'))
									.append($('<th class="col-md-1">')
										.append('Qtd'))))
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

function nota(nota) {
	$('#dinheiro').val(nota);
	total();
}

function notasProvaveis(total) {
	if (total == 0) {
		return [];
	}
	const NOTAS_EXISTENTES = [.01, .05, .1, .25, .5, 1, 2, 5, 10, 20, 50, 100];

	// Pagamentos com uma nota só
	const umaNota = [];
	for (const nota of NOTAS_EXISTENTES) {
		if (nota >= total) {
			umaNota.push(nota);
		}
	}

	// Pagamentos com duas notas
	const duasNotas = [...umaNota];
	for (const nota1 of NOTAS_EXISTENTES) {
		if (nota1 < total) {
			for (const nota2 of NOTAS_EXISTENTES) {
				if (nota2 <= nota1) {
					if ((nota1 + nota2 >= total)) {
						if (!duasNotas.includes(nota1 + nota2)) {
							duasNotas.push(nota1 + nota2);
						}
					}
				}
			}
		}
	}

	// Valores maiores que a maior nota
	const result = [...duasNotas];
	if (result.length == 0) {
		const maiorNota = NOTAS_EXISTENTES[NOTAS_EXISTENTES.length - 1];
		const segundaMaiorNota = NOTAS_EXISTENTES[NOTAS_EXISTENTES.length - 2];
		if (total % maiorNota <= segundaMaiorNota) {
			result.push(Math.trunc(total / maiorNota) * maiorNota + segundaMaiorNota);
		}
		result.push((Math.trunc(total / maiorNota) + 1) * maiorNota);
	}
	return result.sort(function(a, b) { return a - b; }).slice(0, 5);
}

function total() {
	let dinheiro = 0;
	if ($('#dinheiro').val() > 0) {
		dinheiro = $('#dinheiro').val();
	}
	let troco = '';
	$('#total').empty();
	$('#conferencia').empty();
	let total = 0;
	const tbody = $('<tbody>');

	for (const item of dados.tabelaDePrecos) {
		const produto = Object.keys(item)[0];
		const preco = item[produto];
		if (preco > 0) {
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
	}

	const divDinheiro = $('<div class="input-group">');
	divDinheiro
			.append($('<span class="input-group-text" id="basic-addon1" style="border-radius: 0;">')
					.append('Dinheiro'));
	const notas = notasProvaveis(total);
	for (const nota of notas) {
		divDinheiro.append('<button class="btn btn-warning btn-sm btn-outline-dark" type="button" onclick="javascript:nota(' + nota + ');">' + nota + '</button>');
	}
	divDinheiro
			.append($('<input type="number" min="0" step="10" class="form-control" id="dinheiro" value="' + dinheiro + '" style="border-radius: 0;" onchange="javascript:total();">'));

	if (dinheiro > 0) {
		troco = dinheiro - total;
		if (troco < 0) {
			troco = "Dinheiro insuficiente";
		} else {
			troco = formataPreco(troco);
		}
	}

	$('#total').append(formataPreco(total));

	$('#conferencia')
			.append($('<h1>')
					.append('Conferência'))
			.append($('<table class="table table-sm table-bordered table-striped table-hover conferencia">')
					.append($('<thead>')
							.append($('<tr>')
									.append($('<th class="col-md-10">').append('Produto'))
									.append($('<th class="col-md-1">').append('Preço'))
									.append($('<th class="col-md-1">').append('Qtd'))
									.append($('<th class="col-md-1">').append('Total'))))
					.append(tbody)
					.append($('<tfoot>')
							.append($('<tr>')
								.append('<th colspan="4" class="bg-dark">'))
							.append($('<tr>')
									.append($('<th colspan="3">')
											.append('TOTAL'))
									.append($('<th class="text-end">')
											.append(formataPreco(total))))
							.append($('<tr>')
									.append($('<th colspan="4"style="padding: 0; border: 0;">')
											.append(divDinheiro)))
							.append($('<tr>')
									.append($('<th colspan="3">')
											.append('Troco'))
									.append($('<th class="text-end">')
											.append(troco)))));
}

$(document).ready(async function() {
	montaCalculadora();
});
