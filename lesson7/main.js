"use strict";

const ul = document.getElementById("js-lists");
const fragment = document.createDocumentFragment();
const loader = document.getElementById("loader");

window.onload = () => {
  const fetchedData = new Promise((resolve, reject) => {
    const listItems = [
      { to: "bookmark.html", img: "1.png", alt: "画像1", text: "ブックマーク" },
      { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" }
    ];
    setTimeout(() => {
      resolve(listItems);
    }, 2500);
  });

function createNewList(data) {
  data.forEach((key) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const img = document.createElement("img");

    a.href = `/${key.to}`;
    a.textContent = key.text;
    img.src = key.img;
    img.alt = key.alt;

    fragment
      .appendChild(li)
      .appendChild(a)
      .insertAdjacentElement("afterbegin", img);
  });
  ul.appendChild(fragment);
}

fetchedData.then((listItems) => {
  loader.classList.add('loaded');
  createNewList(listItems);
});
}
