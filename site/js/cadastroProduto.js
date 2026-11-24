// Ponte: repassa as mensagens do formulário para a pré-visualização
const iframePreview = document.getElementById("preview");

let ultimaMensagem = null;

window.addEventListener("message", (e) => {
  const msg = e.data;
  if (!msg) return;

  if (msg.tipo === "produto") {
    ultimaMensagem = msg;
    iframePreview.contentWindow.postMessage(msg, "*");
  } else if (msg.tipo === "preview-pronto" && ultimaMensagem) {
    iframePreview.contentWindow.postMessage(ultimaMensagem, "*");
  } else if (msg.tipo === "salvar") {
    // AQUI você envia msg.dados ao seu back-end (fetch POST).
    // Para a foto, prefira upload de arquivo em vez de base64.
    console.log("Produto a salvar:", msg.dados);
  }
});