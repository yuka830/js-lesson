const jsonUrl = "https://myjson.dit.upm.es/api/bins/7a1x";
const tableWrap = document.getElementById("js-table-wrapper");

const createElementWithClassName = (element, name) => {
  const createdElement = document.createElement(element);
  createdElement.classList.add(name);
  return createdElement;
};

const createLoader = () => {
  const loader = document.createElement("div");
  const loaderImage = document.createElement("img");
  loader.id = "js-loader";
  loaderImage.src = "img/loading-circle.gif";
  loader.appendChild(loaderImage);
  return loader;
};

const loading = () => {
  const loader = document.getElementById("js-loader");
  loader.classList.add("loading");
};

const loaded = () => {
  const loader = document.getElementById("js-loader");
  loader.classList.add("loaded");
};

const fetchDataInSecond = (sec, jsonUrl) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fetch(jsonUrl));
    }, sec);
  });
};

const fetchPersonalData = async () => {
  try {
    const response = await fetchDataInSecond(3000, jsonUrl);
    const json = await response.json();
    return json.data;
  } catch (e) {
    tableWrap.textContent = "データの取得ができませんでした。";
    console.error(e);
  } finally {
    loaded();
  }
};

const renderTable = (usersData) => {
  const table = createTable();
  table.appendChild(createTableHeader(usersData));
  table.appendChild(createTableData(usersData));
  tableWrap.appendChild(table);
};

const createTable = () => {
  const table = createElementWithClassName("table", "users-table");
  table.id = "js-table";
  return table;
};

const createTableHeader = (usersData) => {
  const trOfThead = document.createElement("tr");
  const fragment = document.createDocumentFragment();
  for (let key in usersData[0]) {
    const th = createElementWithClassName("th", "users-table__th");
    key === "id"
      ? (th.textContent = key.toUpperCase())
      : (th.textContent = key);
    fragment.appendChild(th);
  }
  trOfThead.appendChild(fragment);
  return trOfThead;
};

const createTableData = (usersData) => {
  const fragment = document.createDocumentFragment();
  usersData.forEach((userData) => {
    const trOfTdata = document.createElement("tr");
    Object.keys(userData).forEach((key) => {
      const td = createElementWithClassName("td", "users-table__td");
      td.textContent = userData[key];
      trOfTdata.appendChild(td);
    });
    fragment.appendChild(trOfTdata);
  });
  return fragment;
};

const init = async () => {
  tableWrap.insertAdjacentElement("beforebegin", createLoader());
  loading();
  let usersData;
  try {
    usersData = await fetchPersonalData();
  } catch (e) {
    console.error(e);
  } finally {
    console.log("処理が完了しました。");
  }
  if (usersData.length === 0) {
    tableWrap.textContent = "データがありません。";
    return;
  } else {
    renderTable(usersData);
  }
};
init();
