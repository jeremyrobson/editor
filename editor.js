var canvas, context;
var saveButton, openButton;
var map;
var colors = ["rgb(55,55,200)","rgb(55,155,255","rgb(205,205,55)","rgb(55,255,155)"];
var drawing = false;
var seltype = 3;
var brushRadius = 4;

function clamp(n, max) {
    if (n < 0)
        return 0;
    if (n > max)
        return max;
    return n;
}

function mouse_down(e) {
    drawing = true;
    mouse_move(e);
}

function mouse_up(e) {
    drawing = false;
}

function mouse_move(e) {
    var mousex = Math.floor(e.offsetX / 2);
    var mousey = Math.floor(e.offsetY / 2);
    if (drawing) {
        var r = Math.floor(brushRadius / 2);
        var mx, my;
        for (var x=-r;x<=r;x++) {
            for (var y=-r;y<=r;y++) {
                if (Math.abs(x) + Math.abs(y) >= brushRadius)
                    continue;
                mx = clamp(mousex + x, 255);
                my = clamp(mousey + y, 255);
                map[mx][my] = seltype;
                context.fillStyle = colors[seltype];
                context.fillRect(mx*2,my*2,2,2);
            }
        }
    }
}

function draw_map() {
    for (var x=0;x<256;x++) {
        for (var y=0;y<256;y++) {
            context.fillStyle = colors[map[x][y]];
            context.fillRect(x*2,y*2,2,2);
        }
    }
}

function load_map(u8) {
    var x, y;
    for (var i=0;i<u8.length;i++) {
        x = Math.floor(i/256);
        y = i % 256;
        map[x][y] = u8[i];
    }    

    draw_map();
}

function save_map() {
    var u8 = new Uint8Array(map.length * map[0].length);
    var x, y;
    for (var i=0;i<u8.length;i++) {
        x = Math.floor(i/256);
        y = i % 256;
        u8[i] = map[x][y];
    }    
    var b = new Blob([u8], {type: ''});
    var downloadLink = document.createElement("a");
    downloadLink.download = "map.dat";
    //downloadLink.innerHTML = "FFFFFFFUUUUUUUUUU";
    downloadLink.href = window.webkitURL.createObjectURL(b);
    downloadLink.click();
}

function open_map() {
    var u8 = new Uint8Array(8);
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        var data8 = new Uint8Array(data);
        load_map(data8);
    };
    reader.readAsArrayBuffer(openButton.files[0]);
}

function new_map() {
    map = [];
    for (var x=0;x<256;x++) {
        map[x] = [];
        for (var y=0;y<256;y++) {
            map[x][y] = 0;
        }
    }
    draw_map();
}

window.onload = function() {
    canvas = document.getElementById("canvas");
    canvas.onmousedown = mouse_down;
    canvas.onmouseup = mouse_up;
    canvas.onmousemove = mouse_move;
    context = canvas.getContext("2d");
    saveButton = document.getElementById("save");
    saveButton.onclick = save_map;
    openButton = document.getElementById("load");
    openButton.onchange = open_map;
    new_map();
};
