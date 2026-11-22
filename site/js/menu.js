document.getElementById('btn_open').addEventListener('click', function(){
    document.getElementById('sidebar').classList.toggle('open-sidebar')
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn_logout");
  if (!btn) return;

  btn.addEventListener("click", () => {
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1200);
  });
});


