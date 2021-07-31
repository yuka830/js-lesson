"use strict";

const loading = () => {
  const wrapper = document.getElementById("js-wrapper");
  const loader = document.createElement("div");
  const loaderImage = document.createElement("img");
  loader.id = "loader";
  loader.classList.add("loading");
  loaderImage.src = "img/loading-circle.gif";
  wrapper.appendChild(loader).appendChild(loaderImage);
};

const loaded = () => {
  const loader = document.getElementById("loader");
  loader.classList.add("loaded");
};

window.onload = () => {
  loading();
  const fetchedData = new Promise((resolve, reject) => {
    const listItems = [
      { to: "bookmark.html", img: "1.png", alt: "画像1", text: "ブックマーク" },
      { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" },
    ];
    setTimeout(() => {
      resolve(listItems);
    }, 2500);
  });

  const createNewList = (data) => {
    const ul = document.getElementById("js-lists");
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
    ul.appendChild(fragment);
  };

  const callLists = async () => {
    try {
      const listsContents = await fetchedData;
      createNewList(listsContents);
    } catch (error) {
      console.error(error);
    } finally {
      loaded();
    }
  };

  callLists();
};
