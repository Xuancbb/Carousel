let angleLeft = document.querySelector('.angle-left');
let angleRight = document.querySelector('.angle-right');
let slideContent = document.querySelector('.section-featured .row');
let initialSlideContent = 0;
let picGroup = document.querySelectorAll('.item-merge .pic');
let imgWidth = 0;
let count = 0;
let intervalID = null;
let drag = false;
let point = {
    startX: 0,
    endX: 0,
    distance: 0
}
let endWallMove = 0;
let starDownPoint = 0;


window.onload = function () {
    imgWidth = picGroup[0].offsetWidth;
    initialSlideContent = slideContent.offsetWidth;
    endWallMove = picGroup[picGroup.length - 4].getBoundingClientRect().left;
}


window.addEventListener('mousedown', function (e) {
    e.preventDefault();
})


// 上一張圖
function setPrev() {
    count--;
    sliderImg();
    resetAutoPic();
}

//下一張圖
function setNext() {
    count++;
    sliderImg();
    resetAutoPic();
}

// 圖片容器移動
function sliderImg() {
    count = count < 0 || count > picGroup.length - 4 ? 0 : count;
    slideContent.style.transform = `translateX(${-imgWidth * count}px)`;
    point.distance = -imgWidth * count;

}

// 重設計時器
function resetAutoPic() {
    clearInterval(intervalID);
    intervalID = setInterval(autoPicSlider, 3000);
}

// 自動輪播
function autoPicSlider() {
    count++;
    sliderImg();
}

// 開始拖曳
function starDrag(e) {
    drag = true;
    point.startX = e.pageX;
    starDownPoint = point.startX;
    this.classList.add('drag');
}

// 拖曳過程
function dragMove(e) {
    if (drag === false) {
        return
    }

    point.endX = e.pageX;
    point.distance += (point.endX - point.startX); // 移動距離 = 結尾座標 - 初始座標


    point.startX = point.endX; // 重新設定初始座標
    slideContent.style.transform = `translateX(${point.distance}px)`;

}

// 暫停拖曳
function stopMove() {
    drag = false;
    let howMoveImg = Math.abs(point.distance / imgWidth);

    this.classList.remove('drag');

    // 如果只有點擊放開沒有移動就跳出函式
    if (point.startX === starDownPoint) {
        return
    }; 

   
    slideContent.style.transform = `translateX(${- Math.round(howMoveImg) * imgWidth}px)`;
    point.distance = -(Math.round(howMoveImg) * imgWidth);
    count = Math.abs(point.distance / imgWidth);


    hitWall();

}


// 圖片容器超出界線
function hitWall() {
    let picEndRight = picGroup[picGroup.length - 1].getBoundingClientRect().right; // 取得最後一張圖的末端點到螢幕起始端的距離

   
    // 移動容器 > 0 讓移動容器回到原點
    if (slideContent.getBoundingClientRect().left > 0) {
        slideContent.style.transform = `translateX(${0}px)`;
        point.distance = 0;
    }


    // 最後一張圖距離螢幕起點 < 移動容器的寬度, 移動容器卡在最後一張圖的邊緣
    if (picEndRight < initialSlideContent) {
        slideContent.style.transform = `translateX(${-endWallMove}px)`;
        point.distance = -endWallMove;
    }


}


angleLeft.addEventListener('click', setPrev);
angleRight.addEventListener('click', setNext);
intervalID = setInterval(autoPicSlider, 3000);

slideContent.addEventListener('mouseenter', function () {
    clearInterval(intervalID);
})
slideContent.addEventListener('mousedown', starDrag);
slideContent.addEventListener('mousemove', dragMove);
slideContent.addEventListener('mouseup', stopMove);
slideContent.addEventListener('mouseleave', function () {
    drag = false;
    this.classList.remove('drag');
    hitWall();
    intervalID = setInterval(autoPicSlider, 3000);

})