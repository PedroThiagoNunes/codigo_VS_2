const $ = (id) => document.getElementById(id);
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const campos = ["nome", "categoria", "custo", "preco", "desconto", "estoque", "descricao"];
let imagem = "";

function lerDados() {
  const d = { imagem };
  campos.forEach((id) => (d[id] = $(id).value));
  return d;
}

function enviar() {
  const d = lerDados();
  const preco = parseFloat(d.preco) || 0;
  const custo = parseFloat(d.custo) || 0;
  const desc = Math.min(Math.max(parseFloat(d.desconto) || 0, 0), 90);

  const final = preco * (1 - desc / 100);
  const lucro = final - custo;

  $("final").textContent = brl(final);
  $("lucro").textContent = brl(lucro);
  $("lucro").className = lucro < 0 ? "neg" : "";
  $("mg").textContent = final > 0 ? ((lucro / final) * 100).toFixed(1).replace(".", ",") + "%" : "0%";
  $("mg").className = lucro < 0 ? "neg" : "";

  parent.postMessage({ tipo: "produto", dados: d }, "*");
}

campos.forEach((id) => $(id).addEventListener("input", enviar));

$("foto").addEventListener("change", (e) => {
  const arquivo = e.target.files[0];
  if (!arquivo) {
    imagem = "";
    enviar();
    return;
  }
  const leitor = new FileReader();
  leitor.onload = () => {
    imagem = leitor.result;
    enviar();
  };
  leitor.readAsDataURL(arquivo);
});

$("salvar").addEventListener("click", () => {
  const d = lerDados();
  if (!d.nome || !parseFloat(d.preco)) {
    $("aviso").textContent = "Informe ao menos o nome e o preço de venda.";
    return;
  }
  parent.postMessage({ tipo: "salvar", dados: d }, "*");
  $("aviso").textContent = "Produto pronto para ser enviado ao servidor ✓";
});

enviar();