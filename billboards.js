function BillBoard(w,h, phrase, palette){
  var prevPhrase="";
  var fillShade=random(255);
  var buf=createGraphics(w,h);
  // buf.fill(0,50,fillShade);
  buf.clear();
  // buf.fill(255);
  // buf.stroke(0);
  // buf.strokeWeight(5);
  buf.noStroke();
  buf.rect(0,0,w,h);
  buf.fill(palette[0],palette[1],palette[2]);
  buf.noStroke();
  buf.strokeWeight(1);
  buf.textAlign(LEFT, BASELINE);
  buf.textFont("antarctican-headline");
  buf.textSize(w*0.12);
  buf.text(phrase,w*0.025,w*0.025,w*0.95,h-w*0.05);
  this.img=buf.get();
}

function BBImage(xo,yo,w3,h3,w,h,phrases,palettes, billboardChangeIntervalMinutes, bgImgBillboards ){
  // console.log(">>>>>>"+billboardChangeIntervalMinutes);
  // console.log(bgImgBillboards);
  var this2=this;//yuk
  var numPhraseChoices=floor(phrases.length/3);
  var currentPhraseChoices=new Array(3).fill(0);
  var bbs=[];
  var buf3=createGraphics(w3,h3,WEBGL);
  var changeTime;

  this.buf3img=createImage(floor(w3),floor(h3));
  // bbs[0]=new BillBoard(w,h,phrases[0][0],palettes[5]);
  // bbs[1]=new BillBoard(w,h,phrases[1][0],palettes[5]);
  // bbs[2]=new BillBoard(w,h,phrases[2][0],palettes[5]);
  // buf3.push();
  // // buf3.background(128);
  // buf3.translate(-w3/2,-h3/2,0);
  // showBB(bbs[0].img,0.15,0.3,-10,-PI*0.05,250,150);
  // showBB(bbs[1].img,0.85,0.6,-10,PI*0.05,250,150);
  // showBB(bbs[2].img,0.5,0.4,-10,0,250,150);
  // displayFirstBillboards();
  bbs[0]=new BillBoard(w,h,phrases[0][0],palettes[5]);
  bbs[1]=new BillBoard(w,h,phrases[1][0],palettes[5]);
  bbs[2]=new BillBoard(w,h,phrases[2][0],palettes[5]);
  buf3.push();
  // buf3.background(128);
  buf3.translate(-w3/2,-h3/2,0);
  showBB(bbs[0].img,0.25,0.425,0,-PI*0.0125,0.4,0.225);
  showBB(bbs[1].img,0.775,0.29,0,PI*0.02,0.33,0.18);
  showBB(bbs[2].img,0.69,0.73,0,PI*0.02,0.3,0.18);
  buf3.pop();
  this.buf3img=buf3.get();
  changeTime=setInterval(changeBillboard,billboardChangeIntervalMinutes*60*1000);

  var billboardToChange=0;


  this.change=function(){
    console.log("change billboard messages");
    this.render();
  };



  this.render=function(){
    this.buf3img=render();
  }

  function render(){
    // console.log(">>>>>"+billboardToChange);

    // for(var i=0; i<phrases.length; i++){
    currentPhraseChoices[billboardToChange]=(currentPhraseChoices[billboardToChange]+1)%phrases[billboardToChange].length;
    // }
    // currentPhraseChoice=(currentPhraseChoice+1)%numPhraseChoices;
    // console.log("up:"+currentPhraseChoice+" of "+numPhraseChoices);
    // bbs=[];
    bbs[0]=new BillBoard(w,h,phrases[0][(currentPhraseChoices[0])],palettes[5]);
    bbs[1]=new BillBoard(w,h,phrases[1][(currentPhraseChoices[0])],palettes[5]);
    bbs[2]=new BillBoard(w,h,phrases[2][(currentPhraseChoices[0])],palettes[5]);
    // bbs[1]=new BillBoard(w,h,phrases[1][(currentPhraseChoices[1])],palettes[5]);
    // bbs[2]=new BillBoard(w,h,phrases[2][(currentPhraseChoices[2])],palettes[5]);
    billboardToChange=0;//(billboardToChange+1)%3;

    buf3.clear();
    buf3.push();
    // buf3.background(128);
    buf3.translate(-w3/2,-h3/2,0);
    // showBB(bbs[0].img,0.15,0.3,-10,-PI*0.05,250,150);
    // showBB(bbs[1].img,0.85,0.6,-10,PI*0.05,250,150);
    // showBB(bbs[2].img,0.5,0.4,-10,0,250,150);
    showBB(bbs[0].img,0.25,0.425,0,-PI*0.0125,0.4,0.225);
    showBB(bbs[1].img,0.775,0.29,0,PI*0.02,0.33,0.18);
    showBB(bbs[2].img,0.69,0.73,0,PI*0.02,0.3,0.18);
    buf3.pop();
    // this.buf3img=buf3.get();
    return buf3.get();
  };

  function changeBillboard(){
    this2.buf3img=render();
  }

  this.show=function(){
    image(bgImgBillboards,xo,yo,w3,h3);
    image(this.buf3img,xo,yo);
  };

  function showBB(img,x,y,z,ry,w,h){
    buf3.push();
    // buf3.image(this.img,0,0);
    buf3.fill(255);
    buf3.noStroke();
    buf3.translate(w3*x,h3*y,z);
    buf3.rectMode(CENTER);
    // buf3.rotateY(ry);
    buf3.shearY(ry);
    buf3.rect(0,0,w3*w,w3*h);
    buf3.translate(0,0,1);
    buf3.imageMode(CENTER);
    buf3.image(img,0,0,w3*w*0.95,w3*h-w3*w*0.05);
    buf3.pop();
  }
}

// function BBImage(xo,yo,w3,h3,w,h,phrases){
//   var bbs=[];
//   bbs[0]=new BillBoard(w,h,phrases[0]);
//   bbs[1]=new BillBoard(w,h,phrases[1]);
//   bbs[2]=new BillBoard(w,h,phrases[2]);
//   var buf3=createGraphics(w3,h3,WEBGL);
//   buf3.background(200);
//   buf3.translate(-w3/2,-h3/2,0);
//   showBB(bbs[0].img,0.2,0.3,-50,PI*0.35,w,h);
//   showBB(bbs[1].img,0.8,0.6,-50,-PI*0.4,w,h);
//   showBB(bbs[2].img,0.5,0.4,-60,0,w,h);
//   this.buf3img=buf3.get();
//
//   this.show=function(){
//     image(this.buf3img,xo,yo);
//   };
//
//   function showBB(img,x,y,z,ry,w,h){
//     buf3.push();
//     // buf3.image(this.img,0,0);
//     buf3.fill(255);
//     buf3.noStroke();
//     buf3.translate(w3*x,h3*y,z);
//     buf3.rectMode(CENTER);
//     buf3.rotateY(ry);
//     buf3.rect(0,0,w,h);
//     buf3.translate(0,0,1);
//     buf3.imageMode(CENTER);
//     buf3.image(img,0,0,w*0.95,h-w*0.05);
//     buf3.pop();
//   }
// }
