// create list property
const li = document.createElement("li");

// create anchor property
const a = document.createElement("a");
a.href = "1.html";
a.textContent = "これです";

// create img property
const img = document.createElement("img");
img.src = "bookmark.png";
img.alt = "ブックマーク";

// add them in ul property
const ul = document.getElementById("js-lists");

ul.appendChild(li).appendChild(a).appendChild(img);