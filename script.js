const amount = document.getElementById("kingaku");
const naiyou = document.getElementById("naiyou");
const day = document.getElementById("hiduke");
const tableBody = document.getElementById("calenderBody")
const Btn = document.getElementById("kettei")
const yearFilter = document.getElementById("allYear");
const monthFilter =document.getElementById("allMonth");
const deleteBtn = document.getElementById("hensyu");
let isEditMode = false;
deleteBtn.disabled= true;

//入力したデータをテーブルに追加　データの保存

window.onload = () =>{
    renderTable();
};

yearFilter.addEventListener("change",renderTable);
monthFilter.addEventListener("change",renderTable);

Btn.addEventListener("click",()=>{
    const AMOUNT = amount.value;
    const NAIYOU = naiyou.value;
    const DAYTIME = day.value;

    if(AMOUNT===""||NAIYOU===""||DAYTIME===""){
        alert ("金額、内容、日付を入力してください")


    }else{
        const dataObj = {
            id:Date.now(),
            hiduke:DAYTIME,
            kingaku:AMOUNT,
            naiyou:NAIYOU
        };

        saveToStorage(dataObj);
        renderTable();

        amount.value = "";
        naiyou.value = "";
        day.value = "";
    }
});
//データを一度開いて、そのデータを整理してもどす
function saveToStorage(dataObj) {
    const list = JSON.parse(localStorage.getItem("myList"))||[];
    list.push(dataObj);
    localStorage.setItem("myList",JSON.stringify(list));
}

function renderTable(){
    if(!yearFilter||!monthFilter||!tableBody) return

    const list = JSON.parse(localStorage.getItem("myList"))||[];
    const targetYear = parseInt(yearFilter.value);
    const targetMonth = parseInt(monthFilter.value);

    const filteredList = list.filter(item=>{
        const itemDate = new Date(item.hiduke);
        const isYearMatch = itemDate.getFullYear() === targetYear;
        const isMonthMatch = (itemDate.getMonth()+1) === targetMonth;
        return isYearMatch && isMonthMatch;
    })

    .sort((a,b)=> new Date(b.hiduke)-new Date(a.hiduke));

    tableBody.innerHTML="";

    filteredList.forEach(item=> {

        const newRow =document.createElement("tr")
        newRow.dataset.id =item.id;

        let rowHtml =`
            <td>${item.hiduke}</td>
            <td>${Number(item.kingaku).toLocaleString()}円</td>
            <td>${item.naiyou}</td>`;

        if (isEditMode) {
            rowHtml +=`<td><button class="row-delete-btn">削除</button></td>`;
        }

        newRow.innerHTML = rowHtml;

        if (isEditMode) {
            newRow.querySelector(".row-delete-btn").addEventListener("click",() => {
                if(confirm("この記録を削除しますか？")){
                    newRow.remove();
                    removeFromStorage(item.id);
                }
            });
        }

        tableBody.appendChild(newRow);
    });
}
    
//--------------------

//テーブルの表示、非表示
const Calender = document.getElementById("table")
const Open = document.getElementById("kongetu");
Open.addEventListener("click",()=>{
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth() + 1;

    yearFilter.value = thisYear;
    monthFilter.value = thisMonth;

    renderTable();

    Calender.classList.toggle("open");
    allYear.classList.remove("selectOpen");
    allMonth.classList.remove("selectOpen");
    deleteBtn.disabled = !Calender.classList.contains("open");
})
//-------------------

//先月のデータを表示する
const lastMonthBtn = document.getElementById("lastMonth");

lastMonthBtn.addEventListener("click",() => {
    const today = new Date();
    const lastMonthDate = new Date(today.getFullYear(),today.getMonth()-1,1);

    yearFilter.value = lastMonthDate.getFullYear();
    monthFilter.value = lastMonthDate.getMonth()+1;

    renderTable();

    Calender.classList.toggle("open");
    allYear.classList.remove("selectOpen");
    allMonth.classList.remove("selectOpen");
    deleteBtn.disabled = !Calender.classList.contains("open");
})


//-------------------


//編集ボタンの追加 データの削除
deleteBtn.addEventListener("click",()=>{
    if(isEditMode){
        if(!confirm("編集モードを終了しますか？")) return;
    }
    isEditMode = !isEditMode

    const headerRow = document.querySelector("#targetTable thead tr");
    if (isEditMode){
        const newTh = document.createElement("th");
        newTh.className ="oomoji";
        newTh.id= "edit-header";
        newTh.innerText ="編集";
        headerRow.appendChild(newTh);
    }else{
        const targetTh = document.getElementById("edit-header");
        if(targetTh) targetTh.remove();
    }
    renderTable();
});
//------------------
//データ削除機構
function removeFromStorage(id) {
    let list =JSON.parse(localStorage.getItem("myList"))|| [];
    list = list.filter(item =>item.id !== id);
    localStorage.setItem("myList",JSON.stringify(list));
}
//------------------

//ボタンを押したら全データ表示
const selectBtn = document.getElementById("select");
const allYear = document.getElementById("allYear");
selectBtn.addEventListener("click",() => {
    allMonth.classList.toggle("selectOpen");
    allYear.classList.toggle("selectOpen");
    Calender.classList.toggle("open");

    if(allYear.classList.contains("selectOpen")){
        Calender.classList.add("open");
    }

    deleteBtn.disabled = !Calender.classList.contains("open");
});
//------------------

//スクロール検知からのフッター非表示
let lastScrollY = window.scrollY;
const footer = document.querySelector('.footer');
window.addEventListener('scroll',()=>{
    if (Math.abs(window.scrollY - lastScrollY) >5) {
        if(window.scrollY > lastScrollY){
            footer.classList.add('footerHiden');
        }else{
            footer.classList.remove('footerHiden');
        }
        lastScrollY = window.scrollY;
    }
});
//------------------