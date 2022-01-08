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



function setPrev() {
    count--;
    sliderImg();
    resetAutoPic();
}

function setNext() {
    count++;
    sliderImg();
    resetAutoPic();
}


function sliderImg() {
    count = count < 0 || count > picGroup.length - 4 ? 0 : count;
    slideContent.style.transform = `translateX(${-imgWidth * count}px)`;
    point.distance = -imgWidth * count;

}


function resetAutoPic() {
    clearInterval(intervalID);
    intervalID = setInterval(autoPicSlider, 4000);
}

function autoPicSlider() {
    count++;
    sliderImg();
}

function starDrag(e) {
    drag = true;
    point.startX = e.pageX;
    starDownPoint = point.startX;
    this.classList.add('drag');

}


function dragMove(e) {
    if (drag === false) {
        return
    }

    point.endX = e.pageX;
    point.distance += (point.endX - point.startX); // 移動距離 = 結尾座標 - 初始座標


    point.startX = point.endX; // 重新設定結尾座標
    slideContent.style.transform = `translateX(${point.distance}px)`;

}


function stopMove() {
    drag = false;
    this.classList.remove('drag');

    if (point.startX === starDownPoint) { return }; // 如果只有點擊放開沒有移動就跳出函式


    // Math.abs(point.distance / imgWidth) 取得移動距離是圖片寬度的幾倍取絕對值
    // Math.round(Math.abs(point.distance / imgWidth)) 移動距離是圖片寬度的倍數,轉絕對值四捨五入
    // 當(倍數 < 進位後的倍數)代表移動的距離已經超過圖片的寬度,圖片進到下一張
    if (Math.abs(point.distance / imgWidth) < Math.round(Math.abs(point.distance / imgWidth))) {

        // Math.ceil(Math.abs(point.distance / imgWidth)) * imgWidth 再乘於圖片寬度之前,先獲取(移動距離 / 圖片寬)獲得的倍數 ,圖片寬乘於倍數 = 下一張圖
        // (移動距離 / 圖片寬) * 圖片寬
        slideContent.style.transform = `translateX(${- Math.ceil(Math.abs(point.distance / imgWidth)) * imgWidth}px)`;
        point.distance = -(Math.ceil(Math.abs(point.distance / imgWidth)) * imgWidth); // 更新移動距離

    } else { //(倍數 >  進位後的倍數)代表移動的距離已經超過圖片的寬度,圖片進到上一張
        //  ((移動距離 / 圖片寬) * 圖片寬) - 圖片寬  =  上一張
        slideContent.style.transform = `translateX(${- (Math.ceil(Math.abs(point.distance / imgWidth)) * imgWidth - imgWidth)}px)`;
        point.distance = -(Math.ceil(Math.abs(point.distance / imgWidth)) * imgWidth - imgWidth); // 更新移動距離

    }

    // 移動距離 / 圖片寬 = 目前計數器
    count = Math.abs(point.distance) / imgWidth;
    hitWall(); // 拖曳時超出第一張圖 或 大於最後一張圖,將移動的容器拉回來

}

function hitWall() {
    let picEndRight = picGroup[picGroup.length - 1].getBoundingClientRect().right; // 取得最後一張圖的末端點到螢幕起始端的距離

    // 移動容器 > 0 讓移動容器回到原點
    if (slideContent.getBoundingClientRect().left > 0) {
        slideContent.style.transform = `translateX(${0}px)`;
        point.distance = 0;
    }


    // 最後一張圖 < 移動容器的寬度, 移動容器卡在最後一張圖的邊緣
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