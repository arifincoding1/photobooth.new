let video = document.getElementById("video");
let result = document.getElementById("result");
let filterSelect = document.getElementById("filter");
let photos = [];

// akses kamera
navigator.mediaDevices.getUserMedia({video:true})
.then(stream=>{
    video.srcObject = stream;
})
.catch(()=>{
    alert("Kamera tidak diizinkan!");
});

async function startBooth(){
    result.innerHTML="";
    photos=[];
    for(let i=0;i<3;i++){
        await countdown(3);
        takePhoto();
    }
    createStrip();
}

function takePhoto(){
    let canvas = document.createElement("canvas");
    canvas.width=350;
    canvas.height=260;
    let ctx = canvas.getContext("2d");

    ctx.filter = filterSelect.value;
    ctx.drawImage(video,0,0,canvas.width,canvas.height);

    // watermark
    let name = document.getElementById("watermark").value;
    ctx.fillStyle="white";
    ctx.font="20px Arial";
    ctx.fillText(name,10,250);

    photos.push(canvas);
}

function createStrip(){
    let stripCanvas = document.createElement("canvas");
    stripCanvas.width=350;
    stripCanvas.height=820;
    let ctx = stripCanvas.getContext("2d");

    ctx.fillStyle="white";
    ctx.fillRect(0,0,stripCanvas.width,stripCanvas.height);

    for(let i=0;i<photos.length;i++){
        ctx.drawImage(photos[i],0, i*270 +10,350,260);
    }

    let img=document.createElement("img");
    img.src=stripCanvas.toDataURL("image/png");

    let div=document.createElement("div");
    div.className="strip";
    div.appendChild(img);

    result.appendChild(div);

    window.finalImage=stripCanvas;
}

function downloadStrip(){
    if(!window.finalImage) return alert("Ambil foto dulu!");
    let link=document.createElement("a");
    link.download="photobooth.png";
    link.href=window.finalImage.toDataURL();
    link.click();
}

function countdown(sec){
    return new Promise(resolve=>{
        let count=sec;
        let interval=setInterval(()=>{
            document.querySelector("h1").innerText="Foto dalam "+count;
            count--;
            if(count<0){
                clearInterval(interval);
                document.querySelector("h1").innerText="📸 Photobooth Pro";
                resolve();
            }
        },1000);
    });
}
