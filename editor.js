var canvas, context, buffer, bufferctx;
var map;
var layer, tool, size, color, view;
var mx, my, pressed;

function clamp(n, max) {
    if (n < 0)
        return 0;
    if (n > max)
        return max;
    return n;
}

function load_map(u8) {
    var x, y;
    for (var i=0;i<u8.length;i++) {
        x = Math.floor(i/256);
        y = i % 256;
        map[x][y] = u8[i];
    }    

    draw();
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

function set_layer() {
    layer = parseInt($("#layerselect").val()) - 1;
    console.log(layer);
}

function set_color() {
    var r = $("#colorR").val();
    var g = $("#colorG").val();
    var b = $("#colorB").val();
    var a = $("#colorA").val();
    var alpha = (a / 255).toFixed(2);
    
    $("#colorRText").val(r);
    $("#colorGText").val(g);
    $("#colorBText").val(b);
    $("#colorAText").val(a);
    
    color = "rgba("+r+","+g+","+b+","+alpha+")";
    $("#pickerdiv").css("background-color", color);
    console.log("Color", color);
}

function set_size() {
    size = $("#size").val();
    $("#sizetext").val(size);
    console.log("Size", size);
    
}

function mouse_move(e) {
    mx = e.offsetX;
    my = e.offsetY;
    
    if (pressed) {
        draw(bufferctx[layer]);
        
        context.drawImage(buffer[0], 0, 0);
        context.drawImage(buffer[1], 0, 0);
    }
}

function mouse_down(e) {
    mouse_move(e);
    pressed = true;
}

function mouse_up(e) {
    mouse_move(e);
    pressed = false;
}

function mouse_leave(e) {
    pressed = false;   
}

function draw(ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(mx-size/2, my-size/2, size, size);
}

$(document).ready(function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
    canvas.onmousemove = mouse_move;
    canvas.onmousedown = mouse_down;
    canvas.onmouseup = mouse_up;
    canvas.onmouseleave = mouse_leave;
    
    buffer = [
        document.createElement("canvas"),
        document.createElement("canvas")
    ];
    
    buffer[0].width = 640;
    buffer[0].height = 480;

    buffer[1].width = 640;
    buffer[1].height = 480;

    bufferctx = [
        buffer[0].getContext("2d"),
        buffer[1].getContext("2d")  
    ];
    
    layer = $("#layerselect").val();
    $("#layer0").attr("checked", true);
    $("#layerselect").change(function(e) {
        set_layer(); 
    });
    
    tool = 0;
    $("#tool0").attr("checked", true);
    
    size = 1;
    
    $(".viewlayer").attr("checked", true);
    
    $(".colorselector").change(function(e) {
       set_color();
    });
    
    $(".sizeselector").change(function(e) {
       set_size(); 
    });
    
    set_color();
    set_size();
    
    p = [];
    for (var i=0; i<3; i++) {
        p[i] = [];
        for (var x=0;x<640;x++) {
            p[i][x] = [];
            for (var y=0;y<480;y++) {
                p[i][x][y] = [0,0,0,255];
            }
        }
    }
});