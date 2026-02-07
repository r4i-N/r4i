const amount = document.getElementById("kingaku");
const naiyou = document.getElementById("naiyou");
const day = document.getElementById("hiduke");
const tableBody = document.getElementById("calenderBody")
const Btn = document.getElementById("kettei")

//入力したデータをテーブルに追加　データの保存

window.onload = () =>{
    const list = JSON.parse(localStorage.getItem("myList"))||[];
    list.forEach(item=> addRowToTable(item));
};
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
        addRowToTable(dataObj);

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

function addRowToTable(dataObj){
    const newRow =document.createElement("tr")

    newRow.dataset.id =dataObj.id;

        newRow.innerHTML =`
        <td>${dataObj.hiduke}</td>
        <td>${Number(dataObj.kingaku).toLocaleString()}円</td>
        <td>${dataObj.naiyou}</td>`;

        tableBody.appendChild(newRow);
    }
//--------------------

//テーブルの表示、非表示
const Calender = document.getElementById("table")
const Open = document.getElementById("kongetu");
Open.addEventListener("click",()=>{
    Calender.classList.toggle("open");
})
//-------------------

//編集ボタンの追加 データの削除
const deleteBtn = document.getElementById("hensyu");
deleteBtn.addEventListener("click",()=>{
    const allTh = document.querySelectorAll("#targetTable thead th");
    let targetIndex =-1;
    allTh.forEach((th,index)=>{
        if (th.innerText === "編集") targetIndex = index; 
    });

        if(targetIndex === -1) {
            const headerRow = document.querySelector("#targetTable thead tr");
            const newTh = document.createElement("th");
            newTh.className ="oomoji";
            newTh.innerText ="編集";
            headerRow.appendChild(newTh);

            const bodyRows = document.querySelectorAll("#calenderBody tr");

            bodyRows.forEach(row =>{

                const newTd = document.createElement("td");
                newTd.innerHTML =`<button class="row-delete-btn">削除</button>`;
                row.appendChild(newTd);

                newTd.querySelector(".row-delete-btn").addEventListener("click",()=>{
                    if(confirm("この記録を削除しますか？")){

                        const targetId = Number(row.dataset.id);

                        row.remove();
                        removeFromStorage(targetId);
                    }
                });
            });
        }else{
            if(confirm("編集を終了しますか？")){
                allTh[targetIndex].remove();

                const bodyRows = document.querySelectorAll("#calenderBody tr");
                bodyRows.forEach(row => {
                    if(row.cells[targetIndex]){
                        row.cells[targetIndex].remove();
                    }
                });
            }

        }
});
//------------------
//データ削除機構
function removeFromStorage(id) {
    let list =JSON.parse(localStorage.getItem("myList"))|| [];
    list = list.filter(item =>item.id !== id);
    localStorage.setItem("myList",JSON.stringify(list));
}
//------------------