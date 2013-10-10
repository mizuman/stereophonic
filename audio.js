window.onload = init;
var context;
var pannerNode = [];
var position = {x:0,y:0,z:0};


// forked from fumito_ito's "svg girl music" http://jsdo.it/fumito_ito/aqaV
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index){
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    var loader = this;
    request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
        request.response,
        function(buffer) {
        if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length) {
            loader.onload(loader.bufferList);
        }
        }
    );
    };
    request.onerror = function() {
    alert('BufferLoader: XHR error');
    };
    request.send();
};

BufferLoader.prototype.load = function(){
    for (var i = 0; i < this.urlList.length; ++i) {
        this.loadBuffer(this.urlList[i], i);
    }
};

function setPosition(nodeNo){
    pannerNode[nodeNo].setPosition(position.x,
                  position.y,
                  position.z);
}

function setTemplatePos(formation){
    switch (formation) {
        case 'scatter':
            document.getElementById("range0").value = 2;
            showValue(0);
            document.getElementById("range1").value = 0;
            showValue(1);
            document.getElementById("range2").value = -2;
            showValue(2);
            break;

        case 'gather':
            document.getElementById("range0").value = 0;
            showValue(0);
            document.getElementById("range1").value = 0;
            showValue(1);
            document.getElementById("range2").value = 0;
            showValue(2);
            break;

    }

}

// var init = function() {
//     // なにはともあれAudioContextを作る。役割はその名の通り。
//     // webkitの独自実装なのでプレフィックスがつく。
//     try{
//         context = new webkitAudioContext();
//     } catch(e) {
//         console.log(e);
//     }
//     // context.samplingRate = 48000;
// };

function init() {
  context = new webkitAudioContext();
  bufferLoader = new BufferLoader(context,['mp3/raiten_mayu.mp3','mp3/watakbe.mp3','mp3/ichiyo_rour.mp3' ],function(){console.log("finish load.");});
  bufferLoader.load();
}


function showValue (rangeNo) {

    switch(rangeNo) {
        case 0:
            document.getElementById("showRangeArea0").innerHTML = document.getElementById("range0").value;
            position.x = document.getElementById("range0").value;
            setPosition(0);
            break;

        case 1:
            document.getElementById("showRangeArea1").innerHTML = document.getElementById("range1").value;
            position.x = document.getElementById("range1").value;
            setPosition(1);
            break;

        case 2:
            document.getElementById("showRangeArea2").innerHTML = document.getElementById("range2").value;
            position.x = document.getElementById("range2").value;
            setPosition(2);
            break;
    }

}

var playmp3 = function(){
    var url = ["mp3/raiten_mayu.mp3","mp3/watakbe.mp3","mp3/ichiyo_rour.mp3"];
    // url = ('mp3/raiten_mayu.mp3');
    var bufferLoader = new BufferLoader(context, url, function(bufferList){
        for (var i = 0; i <= bufferList.length; i++) {
            // console.log('source=' + i + 'src=' + url );
            var source = context.createBufferSource();
            source.buffer = bufferList[i];
            source.loop = true;

            pannerNode[i] = context.createPanner();
            // source.connect(context.destination);
            source.connect(pannerNode[i]);
            pannerNode[i].connect(context.destination);
            source.noteOn(0);
        }
    });
    bufferLoader.load();
};


// var audio = function(){
//     // Bufferを生成して、そこからChannelDataを取得する。
//     // var buffer = context.createBuffer( 1, 48000, 48000 );
//     var butffer = loadDogSound("./mp3/001-sibutomo.mp3");
//     var channel = buffer.getChannelData(0);

//     // 300Hzから利得が落ちていく特性のフィルタを定義する。
//     var filter = context.createBiquadFilter();
//     filter.type = "lowpass";
//     filter.frequency.value = 300;
//     filter.Q.value = 1;

//     // ChannelDataには1サンプルごとの音声データが入る。
//     // とりあえず正弦波作って入れる。
//     for( var i=0; i < channel.length; i++ )
//     {
//         channel[i] = Math.sin( i / 100 * Math.PI);
//     }

//     // Sourceを作る。これが入力になる。
//     // 入力にBufferを入れる。
//     var src = context.createBufferSource();
//     src.buffer = buffer;

//     // Modular Routing。Sourceをdest(出力)に直結する。
//     // src.connect(context.destination);

//     // Modular Routingにフィルタを加える
//     src.connect(filter);
//     filter.connect(context.destination);

//     // そして再生。
//     src.noteOn(context.currentTime);
// };

// document.querySelector("#play").addEventListener("click", function(){audio();}, false);
document.querySelector("#play").addEventListener("click", function(){playmp3();}, false);
document.querySelector("#scatter").addEventListener("click", function(){setTemplatePos('scatter');}, false);
document.querySelector("#gather").addEventListener("click", function(){setTemplatePos('gather');}, false);
// document.querySelector("#play").addEventListener("click", function(){finishedLoading();}, false);
init();