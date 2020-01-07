let file = {
    again_btn_png: {
        h: 69,
        offX: 0,
        offY: 0,
        sourceH: 69,
        sourceW: 194,
        w: 193,
        x: 761,
        y: 221
    },
    arrow_png: {
        h: 112,
        offX: 0,
        offY: 0,
        sourceH: 112,
        sourceW: 139,
        w: 139,
        x: 618,
        y: 221
    },
    balance_base_bg_png: {
        h: 381,
        offX: 15,
        offY: 0,
        sourceH: 387,
        sourceW: 640,
        w: 612,
        x: 2,
        y: 2
    },
    share_btn_png: {
        h: 68,
        offX: 2,
        offY: 3,
        sourceH: 73,
        sourceW: 195,
        w: 193,
        x: 761,
        y: 294
    },
    share_guide_png: {
        h: 215,
        offX: 2,
        offY: 0,
        sourceH: 216,
        sourceW: 357,
        w: 355,
        x: 618,
        y: 2
    },
    start_btn_png: {
        h: 51,
        offX: 0,
        offY: 0,
        sourceH: 51,
        sourceW: 411,
        w: 411,
        x: 2,
        y: 387
    },
    white_line_png: {
        h: 8,
        offX: 9,
        offY: 0,
        sourceH: 8,
        sourceW: 621,
        w: 612,
        x: 2,
        y: 442
    }
};
let colorArr = [
    "#FF9966",
    "#FF6666",
    "#99CCFF",
    "#666633",
    "#6699CC",
    "#CCCCFF",
    "#CC3399",
    "#66CCCC",
    "#CC0066"
];
let img = new Image();
img.src = "./preloadsheet.png";
// 随机颜色
randomColor = () => colorArr[Math.floor(Math.random() * colorArr.length)]

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

let game = {
    stageW: 360,
    stageH: 640,
    score: 0,
    center: {
        x: 360 / 2,
        y: 640 / 2
    }
};

// 设置画布大小
canvas.width = game.stageW;
canvas.height = game.stageH;

// 绘制背景
drawBg = () => {
    ctx.fillStyle = "#eaeaea";
    ctx.fillRect(0, 0, game.stageW, game.stageH);
}

// 绘制小球

// 圆心坐标 半径 颜色 是否填充
drawCircle = (x, y, r, color, fill) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

// 准备场景

let a = {
    r: 50,
    maxR: 50,
    minR: 40,
    zoom: false,
    color: randomColor()
};
let b = {
    r: 30,
    maxR: 30,
    minR: 20,
    zoom: false,
    color: randomColor()
};

updateZoom = (obj) => {
    if (!obj.zoom) {
        obj.r -= 0.3;
        obj.zoom = obj.r <= obj.minR ? true : false;
    } else {
        obj.r += 0.3;
        obj.zoom = obj.r >= obj.maxR ? false : true;
    }
    // drawCircle(game.center.x, game.center.y, obj.r, "red", true);
}


// 开始按钮参数
let start_btn_png = {
    name: "start_btn_png",
    w: (game.stageW * 2) / 4,
    h: ((file["start_btn_png"].h / file["start_btn_png"].w) * (game.stageW * 2)) / 4,
    x: (game.stageW - (game.stageW * 2) / 4) / 2,
    y: game.stageH / 2 + 50
};

// 画出按钮
drawBtn = (obj) => {
    ctx.drawImage(
        img,
        file[obj.name].x,
        file[obj.name].y,
        file[obj.name].w,
        file[obj.name].h,
        obj.x,
        obj.y,
        obj.w,
        obj.h
    );
}

// 游戏准备
ready = () => {
    // 更新两个小球 半径
    updateZoom(a);
    updateZoom(b);
    // 画出两个小球
    drawCircle(game.center.x - a.minR, game.center.y - a.maxR, a.r, a.color, true);
    drawCircle(game.center.x + b.minR, game.center.y - b.maxR, b.r, b.color, true);

    // 画出开始按钮
    // ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);

    drawBtn(start_btn_png);
}
let bollspeed = 3
// 球球构造器
class Boll {
    constructor(m, n) {
        this.r = randomNum(m, n);
        this.color = randomColor();
        this.over = false;
    }
    //球球原始位置生成
    generateCoord() {
        this.x = -this.r;
        // game.stageW + this.r
        // 随机数代表方向
        let num = randomNum(0, 3);
        switch (num) {
            case 0:
                // 从上面
                this.x = randomNum(-this.r, game.stageW + this.r);
                this.y = -this.r;
                break;
            case 1:
                // 从右面
                this.x = game.stageW + this.r;
                this.y = randomNum(-this.r, game.stageH + this.r);

                break;
            case 2:
                // 从下面
                this.x = randomNum(-this.r, game.stageW + this.r);
                this.y = game.stageH + this.r;
                break;

            case 3:
                // 左边
                this.x = -this.r;
                this.y = randomNum(-this.r, game.stageH + this.r);
                break;
        }
    }
    // 球球速度生成
    generateSpeed() {
        if (this.x > game.stageW) {
            this.sx = -randomFloor(0, bollspeed);
            this.sy = randomFloor(-bollspeed, bollspeed);
        }
        if (this.x < 0) {
            this.sx = randomFloor(0, bollspeed);
            this.sy = randomFloor(-bollspeed, bollspeed);
        }
        if (this.y > game.stageH) {
            this.sx = randomFloor(-bollspeed, bollspeed);
            this.sy = -randomFloor(0, bollspeed);
        }
        if (this.y < 0) {
            this.sx = randomFloor(-bollspeed, bollspeed);
            this.sy = randomFloor(0, bollspeed);
        }
    }
    // 球球移动
    move() {
        this.x = this.x + this.sx;
        this.y = this.y + this.sy;
    }
    // 球球超出
    checkOver() {
        let rightOver = this.x > game.stageW + this.r;
        let leftOver = this.x < -this.r;
        let bottomOver = this.y > game.stageH + this.r;
        let topOver = this.y < -this.r;
        this.over = rightOver || leftOver || topOver || bottomOver;
    }
}


// 我方球球构造器
class OurBoll {
    constructor() {
        this.x = game.center.x;
        this.y = game.center.y;
        this.r = 5;
        this.color = "#333333";
        this.loop = {
            r: this.r,
            minR: this.r,
            maxR: this.r + 10,
            color: randomColor(),
            zoom: true
        };
    }
}

// 创建我方小球
let o = new OurBoll();
//  drawCircle(o.x, o.y, o.r, o.color, true);

// 所有球球数组
let segements = [];
// 帧数
let frames = 0;
let score = 0;

// 随机数
randomNum = (m, n) => Math.round(Math.random() * (n - m)) + m;

randomFloor = (m, n) => Math.random() * (n - m) + m;

checkCrash = (boll) => {
    // 勾股定理 毕达哥拉斯定理
    let s = Math.sqrt((boll.x - o.x) * (boll.x - o.x) + (boll.y - o.y) * (boll.y - o.y));
    if (s < boll.r + o.r && !boll.over) {
        console.log("xx");
        return true;
    }
}


// 游戏开始
start = () => {
    // console.log("游戏开始");
    // 增加帧数
    frames++;

    // 更新我方小球 圆环动画
    updateZoom(o.loop);
    // 画出实心球 和 圆环
    drawCircle(o.x, o.y, o.r, o.color, true);
    drawCircle(o.x, o.y, o.loop.r, o.loop.color, false);

    // 生成新球球
    if (!(frames % 10)) {
        let newBoll = new Boll(o.r - 4, o.r + 20);
        newBoll.generateCoord();
        newBoll.generateSpeed();

        segements.push(newBoll);
    }

    // 遍历所有敌方
    segements.forEach(function (boll, index) {
        // 移动所有 小球
        boll.move();
        // 根据新位置画
        drawCircle(boll.x, boll.y, boll.r, boll.color, true);

        // 检测碰撞
        if (checkCrash(boll)) {
            // 判断半径
            if (boll.r > o.r) {
                // 游戏结束
                gameover();
            } else {
                // 标记死亡（超出）
                boll.die = true;
                // console.log(boll);

                // 我方球球半径增加 圆环半径也要增加
                let addR = boll.r / 10;
                // 不要直接加吃掉的小球半径 太大了
                o.r += addR;
                o.loop.r += addR;
                o.loop.minR += addR;
                o.loop.maxR += addR;

                // 增加score
                score++;
            }
        }

        // 检测标记超出
        boll.checkOver();
    });

    // 删除数组里面已经超出的球球
    segements.forEach((boll, index) => {
        if (boll.over || boll.die) {
            segements.splice(index, 1);
            // console.log('shanchu');
        }
    })

    // 更新得分
    ctx.font = "30px Arial";
    ctx.fillStyle = "#333333";
    ctx.fillText(score, 10, 50);
}
gameover = () => {
    clearInterval(id);
    if (localStorage.score) {
        let oldArr = JSON.parse(localStorage.score);
        // 循环数组
        for (let i = 0; i < oldArr.length; i++) {
            // 检查每一个得分数组对象
            for (key in oldArr[i]) {
                // console.log(key);
                if (key == score) {
                    oldArr[i][key]++;
                    localStorage.score = JSON.stringify(oldArr);
                    return;
                }
            }
        }

        let newScore = {};
        newScore[score] = 1;
        oldArr.push(newScore);
        localStorage.score = JSON.stringify(oldArr);

    } else {
        // console.log("第一次");
        let newScore = {};
        newScore[score] = 1;

        localStorage.score = JSON.stringify([newScore]);
    }
}

// 游戏主体
let id = setInterval(() => {
    // 每一帧开始 都清空画布
    ctx.clearRect(0, 0, game.stageW, game.stageH);

    // 画出背景
    drawBg();

    // 判断游戏是否已经开始
    if (!game.start) {
        // 准备界面
        ready();
    } else {
        // 开始游戏
        start();
    }
}, 30)

canvas.onclick = (event) => {
    // console.log(event);
    let xCrash = event.offsetX >= start_btn_png.x && event.offsetX <= start_btn_png.x + start_btn_png.w;
    let yCrash = event.offsetY >= start_btn_png.y && event.offsetY <= start_btn_png.y + start_btn_png.h;
    if (xCrash && yCrash) {
        // console.log("xxx");
        // 开始游戏
        game.start = true;
    }

    // 点击小球才开始 监听鼠标移动 PC
    if (Math.abs(event.offsetX - game.center.x) < 5 && Math.abs(event.offsetY - game.center.y) < 5) {
        canvas.onmousemove = (event)=>{
             // console.log(event.offsetX, event.offsetY);
            // 根据鼠标移动位置 更新我方 位置
            o.x = event.offsetX;
            o.y = event.offsetY;
        }
    }

    if (navigator.maxTouchPoints) {
        canvas.ontouchmove = (event)=>{
             // console.log(event);
             o.x = event.touches[0].pageX;
             o.y = event.touches[0].pageY;
        }
    }
}