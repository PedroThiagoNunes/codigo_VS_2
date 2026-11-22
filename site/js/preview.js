const $ = (id) => document.getElementById(id);
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const SEM_IMAGEM =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">' +
      '<rect width="300" height="300" fill="#f5f1ea"/>' +
      '<text x="150" y="158" font-family="sans-serif" font-size="16" fill="#7a6a70" text-anchor="middle">sem imagem</text>' +
      "</svg>"
  );

function render(d) {
  const nome = d.nome || "Nome do produto";
  const preco = parseFloat(d.preco) || 0;
  const desc = Math.min(Math.max(parseFloat(d.desconto) || 0, 0), 90);
  const final = preco * (1 - desc / 100);

  $("nome").textContent = nome;
  $("nome2").textContent = nome;
  $("img").src = d.imagem || SEM_IMAGEM;
  $("img2").src = d.imagem || SEM_IMAGEM;

  const p = $("preco");
  p.textContent = "";
  if (desc > 0 && preco > 0) {
    const antigo = document.createElement("span");
    antigo.className = "antigo";
    antigo.textContent = brl(preco);
    p.append(antigo);
  }
  p.append(brl(final));

  const selo = $("selo");
  selo.hidden = !(desc > 0);
  selo.textContent = "-" + desc + "%";

  $("cat").textContent = d.categoria || "Categoria";
  $("desc").textContent = d.descricao || "A descrição do produto aparece aqui.";
  $("parc").textContent = final > 0 ? "ou 3x de " + brl(final / 3) + " sem juros" : "";

  const estoque = parseInt(d.estoque);
  const esgotado = estoque === 0;
  $("estq").textContent = isNaN(estoque)
    ? ""
    : esgotado
    ? "Indisponível"
    : estoque <= 5
    ? "Últimas " + estoque + " unidades"
    : "Em estoque";
  $("estq").style.color = esgotado ? "#b3261e" : "var(--vinho)";

  $("card").classList.toggle("esgotado", esgotado);
  $("btn").textContent = esgotado ? "INDISPONÍVEL" : "ADICIONAR AO CARRINHO";
  $("btn").disabled = esgotado;
}

render({});

window.addEventListener("message", (e) => {
  if (e.data && e.data.tipo === "produto") render(e.data.dados);
});

// Avisa a página principal que está pronta para receber dados
parent.postMessage({ tipo: "preview-pronto" }, "*");