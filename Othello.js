// 初期画面起動時
// 初期変数定義
var turn = 0; // ターン 1:黒、-1:白
// 盤面の状況を二次元配列で定義

var ban_ar = createBoard();

function createBoard() {
    const board = [  
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
    ];
    return board;
}
// 盤面に振るID
const rowId = ["A", "B", "C", "D", "E", "F", "G", "H"];

// HTMLで定義したテーブルを取得
var ban = document.getElementById('field');

// 取得したテーブルに盤面生成
ban_new();

// 盤面を初期化する
ban_init();

// クリックした時に実行されるイベント
for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
        var select_cell = ban.rows[x].cells[y];
        select_cell.onclick = function () {
            // クリックされた場所に石がない場合は、その場所にターン側の石が置けるかチェックし
            // 置ける場合は、盤面を更新。相手のターンへ移る
            if (ban_ar[this.parentNode.rowIndex][this.cellIndex] == 0) {
                if (check_reverse(this.parentNode.rowIndex, this.cellIndex) > 0) {
                    ban_ar[this.parentNode.rowIndex][this.cellIndex] = turn;
                    ban_set();
                    change_turn();
                } 
            }
        }
    }
}

// テーブルで盤面を作成する処理
function ban_new() {
    for (var x = 0; x < 8; x++) {
        var tr = document.createElement("tr");
        ban.appendChild(tr);
        for (var y = 0; y < 8; y++) {
            var td = document.createElement("td");
            td.setAttribute('id', (y + 1) + rowId[x]);
            tr.appendChild(td);
        }
    }
};

// 盤面を初期化する処理
function ban_init() {
    ban_ar = createBoard();
    ban_ar[3][3] = ban_ar[4][4] = -1;
    ban_ar[3][4] = ban_ar[4][3] = 1;
    ban_set();
    turn = 1;
    document.getElementById('view_tarn').textContent = "黒の手番です";
};

// 盤面状況(配列)を実際の盤面へ反映させる処理
function ban_set() {
    for (let i = 0; i < ban_ar.length; i++) {
        for (let j = 0; j < ban_ar.length; j++) {
            if(ban_ar[i][j] === 0) {
                document.getElementById(j + 1 + rowId[i]).textContent = "";
            } else if(ban_ar[i][j] === 1) {
                document.getElementById(j + 1 + rowId[i]).textContent = "●";
            } else {
                document.getElementById(j + 1 + rowId[i]).textContent = "○";
            }
        }
    }
};

// ターンを変更する処理
function change_turn() {
    if (turn === 1) {
        turn = -1;
        document.getElementById('view_tarn').textContent = "白の手番です";
    } else {
        turn = 1;
        document.getElementById('view_tarn').textContent = "黒の手番です";
    }
};

// 指定したセルにターン側の石が置けるか確認
function check_reverse(row_index, cell_indx) {
    let count = 0;
    if (ban_ar[row_index][cell_indx] !== 0) {
        return count;
    }
    
    // 上
    if(canPutDown(row_index, cell_indx, 0, -1)) {
        count += 1;
        reverse(row_index, cell_indx, 0, -1);
    }
    // 下
    if(canPutDown(row_index, cell_indx, 0, 1)) {
        count += 1;
        reverse(row_index, cell_indx, 0, 1);
    }
    // 右
    if(canPutDown(row_index, cell_indx, 1, 0)) {
        count += 1;
        reverse(row_index, cell_indx, 1, 0);
    }
    // 左
    if(canPutDown(row_index, cell_indx, -1, 0)) {
        count += 1;
        reverse(row_index, cell_indx, -1, 0);
    }
    // 右上
        if(canPutDown(row_index, cell_indx, 1, -1)) {
        count += 1;
        reverse(row_index, cell_indx, 1, -1);
    }
    // 右下
        if(canPutDown(row_index, cell_indx, 1, 1)) {
        count += 1;
        reverse(row_index, cell_indx, 1, 1);
    }
    // 左上
        if(canPutDown(row_index, cell_indx, -1, -1)) {
        count += 1;
        reverse(row_index, cell_indx, -1, -1);
    }
    // 左下
        if(canPutDown(row_index, cell_indx, -1, 1)) {
        count += 1;
        reverse(row_index, cell_indx, -1, 1);
    }
    return count;
}


// 指定したセルから指定した方向へreverseを行う
function canPutDown(y, x, vecX, vecY) {
    let putStone;

    // 打つ石を決定
    if (turn === 1) {
        putStone = 1;
    } else {
        putStone = -1;
    }

    // 隣の場所へ。どの隣かは(vecX, vecY)が決める。
    x += vecX;
    y += vecY;
    // 盤面外だったら打てない
    if (x < 0 || x >= 8 || y < 0 || y >= 8) { 

        return false; }
    // 隣が自分の石の場合は打てない
    if (ban_ar[y][x] == putStone) { 
        return false; }
    // 隣が空白の場合は打てない
    if (ban_ar[y][x] == 0) { 
        return false; }

    // さらに隣を調べていく
    x += vecX;
    y += vecY;
    // となりに石がある間ループがまわる
    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        // 空白が見つかったら打てない（1つもはさめないから）
        if (ban_ar[y][x] == 0) { 
            return false; }
        // 自分の石があればはさめるので打てる
        if (ban_ar[y][x] == putStone) {
            return true; 
        }
        x += vecX;
        y += vecY;
    }
    // 相手の石しかない場合はいずれ盤面の外にでてしまうのでこのfalse
    return false;
}

function reverse(y, x, vecX, vecY) {
    let putStone;
    
    if (turn === 1) {
        putStone = 1;
    } else {
        putStone = -1;
    }

    // 相手の石がある間ひっくり返し続ける
    // (x,y)に打てるのは確認済みなので相手の石は必ずある
    x += vecX;
    y += vecY;
    while (ban_ar[y][x] != putStone) {
        // ひっくり返す
        ban_ar[y][x] = putStone;
        x += vecX;
        y += vecY;
    }
}

document.getElementById("ban_init").onclick = ban_init;
document.getElementById('pass').onclick = change_turn;