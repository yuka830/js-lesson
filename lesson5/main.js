"use strict";

const fetchedData = new Promise((resolve, reject) => {
  const listItems = [
    { to: "bookmark.html", img: "1.png", alt: "画像1", text: "ブックマーク" },
    { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" },
  ];
  resolve(listItems);
});

function createNewList(data) {
  const fragment = document.createDocumentFragment();
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
  return fragment;
}

function insertList(data) {
  const ul = document.getElementById("js-lists");
  ul.appendChild(data);
}

fetchedData.then((listItems) => insertList(createNewList(listItems)));
