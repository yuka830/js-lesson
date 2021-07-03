const ul = document.getElementById("js-lists");
const li = document.createElement("li");
const a = document.createElement("a");
const img = document.createElement("img");

a.href = "1.html";
a.textContent = "これです";

img.src = "bookmark.png";
img.alt = "ブックマーク";

ul.appendChild(li).appendChild(a).insertAdjacentElement("afterbegin", img);
