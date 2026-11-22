

        const carrinho = JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];

        const lista = document.getElementById("resumoCarrinho");

        let subtotal = 0;
        let descontoTotal = 0;
        let total = 0;

        // DATA E HORÁRIO
        document.getElementById("dataHora").textContent =
            new Date().toLocaleString("pt-BR");

        // MOSTRAR PRODUTOS
        carrinho.forEach(item => {

            const quantidade = Number(item.quantidade) || 1;
            const preco = Number(item.preco) || 0;
            const desconto = Number(item.desconto) || 0;

            const valorOriginal = preco * quantidade;
            const valorDesconto = valorOriginal * (desconto / 100);
            const valorFinal = valorOriginal - valorDesconto;

            subtotal += valorOriginal;
            descontoTotal += valorDesconto;
            total += valorFinal;

            const li = document.createElement("li");

            li.innerHTML = `
                <img src="${item.imagem}" alt="${item.nome}">

                <div class="item-info">
                    <strong>${item.nome}</strong>

                    <p>Preço unitário: R$ ${preco.toFixed(2).replace(".", ",")}</p>

                    <p>Quantidade: ${quantidade}</p>

                    ${
                        desconto > 0
                        ? `<p class="desconto">
                            Desconto: ${desconto}%
                           </p>
                           <p class="preco-antigo">
                            R$ ${valorOriginal.toFixed(2).replace(".", ",")}
                           </p>`
                        : `<p>Sem desconto</p>`
                    }

                    <strong>
                        Total: R$ ${valorFinal.toFixed(2).replace(".", ",")}
                    </strong>
                </div>
            `;

            lista.appendChild(li);

        });

        // MOSTRAR VALORES
        function moeda(valor) {
            return valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        }

        document.getElementById("subtotal").textContent =
            moeda(subtotal);

        document.getElementById("descontoTotal").textContent =
            moeda(descontoTotal);

        document.getElementById("totalCompra").textContent =
            "Total: " + moeda(total);

        // CONFIRMAR PEDIDO
        function confirmarPedido() {

            if (carrinho.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }

            const pagamento =
                document.getElementById("formaPagamento").value;

            if (!pagamento) {
                alert("Escolha uma forma de pagamento!");
                return;
            }

            const confirmar = confirm(
                "Deseja confirmar seu pedido?\n\n" +
                "Pagamento: " + pagamento +
                "\nTotal: " + moeda(total)
            );

            if (confirmar) {

                alert(
                    "Pedido realizado com sucesso! ❤️\n\n" +
                    "Forma de pagamento: " + pagamento +
                    "\nTotal: " + moeda(total)
                );

                localStorage.removeItem("carrinho");

                window.location.href = 'finalizar.html';
            }
        }

        // VOLTAR PARA LOJA
        function voltarLoja() {
            window.location.href = "produtos.html";
        }

    