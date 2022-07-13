var par=9/16;//10/16;//12/21;//3/4;
var orientLandscape=true; //true is normal projector orientation, flase is projector side mounted.)
var cw,ch,pw,ph,ox,oy;
var visualisation;
var numLocations=8;
var locationImages=[];
var locationLineImages=[];
var locationLabels=[
  ["Wells","Road"],//"Airport Road",
  ["Brislington","Depot"],//"Black Castle",
  ["Colston","Avenue"],//"Beacon",
  ["Fishponds","Road"],//"Fishponds",
  ["Marlborough","Street"],//"BRI",
  ["Temple","Way"],//"Cabot",
  ["Parson","Street"],//"Parson Street",
  ["St. Pauls"]//"St Pauls",
];

var billboardPhrases=[];
var billboardChangeIntervalMinutes=0.25;//probably set to 10


var sparrowsPerWire=numLocations;
var numWires=8;
// var sparrowVis;

var birdFrames=[];
var flyFrames=[];
var dirtFrames=[];
var bgImgBillboards;
var bgImgBirds;
var numBirdFrames=9;
var numFlyFrames=8;
var numDirtFrames=4;
// var wireLabels=["8 pm", "11 pm", "2 am", "5 am", "8 am", "11 am", "2 pm", "5 pm"];
var wireLabels=["7 pm", "10 pm", "1 am", "4 am", "7 am", "10 am", "1 pm", "4 pm"];
var timesteps=[2,5,8,11,14,17,20,23];
// var placeLabels=["one","two","three","four","five","six","seven","eight"];
var baseData;


var palettes=[
  [249,181,196], //pale pink
  [240,205,160],  //peach
  [255,125,120], //mid pink
  [205,235,240], //pale blue
  [103,46,69], //maroon brown
  [0,85,128]//dark blue
];

var aqData;


function preload(){
  baseData=loadJSON('baseData.json');
  for(var i=0; i<numLocations; i++){
    // locationImages.push(loadImage("assets/sensorsb"+nf(i+1,2,0)+".png"));
    locationImages.push(loadImage("assets/sensorsOutb"+nf(i+1,2,0)+".png"));
  }
  for(var i=0; i<numLocations; i++){
    locationLineImages.push(loadImage("assets/sensorsb6"+nf(i+1,2,0)+".png"));
  }
  // billboardPhrases=loadStrings('billboard-words.txt');
  billboardPhrases[0]=loadStrings('phrases-i-need.txt');
  billboardPhrases[1]=loadStrings('phrases-i-go.txt');
  billboardPhrases[2]=loadStrings('phrases-i-feel.txt');
  // billboardINeeds=loadStrings('phrases-i-need.txt');
  for(var i=0; i<numBirdFrames; i++){
    birdFrames.push(loadImage("assets/sparrow0"+(i+1)+".png"));
  }
  for(var i=0; i<numFlyFrames; i++){
    flyFrames.push(loadImage("assets/sparrowFly0"+(i+1)+".png"));
  }
  for(var i=0; i<numDirtFrames; i++){
    dirtFrames.push(loadImage("assets/blot0"+(i+1)+".png"));
  }
  bgImgBillboards=loadImage("assets/bgImgBillboards.png");
  bgImgBirds=loadImage("assets/bgImgBirds.png");
}

function setup() {
  calcSize();
  createCanvas(cw,ch);
  aqData=new AQData(baseData,timesteps);
  //remove blank last line
  billboardPhrases[0].pop();
  billboardPhrases[1].pop();
  billboardPhrases[2].pop();
  //remove first line with prompt
  billboardPhrases[0].shift();
  billboardPhrases[1].shift();
  billboardPhrases[2].shift();
  // console.log(billboardPhrases)
  visualisation=new RenderVis(ox,oy,pw,ph,
                              locationLineImages,locationImages,locationLabels,
                              billboardPhrases,billboardChangeIntervalMinutes,
                              numWires, numLocations,
                              birdFrames,flyFrames,dirtFrames, wireLabels, locationLabels,
                              bgImgBillboards,bgImgBirds,
                              palettes
                            );

  // aqData=new AQData(numWires,sparrowsPerWire);
}

//To be removed
function keyPressed(){
  if(key=="o" || key=="O"){
    orientLandscape=!orientLandscape;
    calcSize();
    resizeCanvas(cw,ch);
    visualisation=null;
    visualisation=new RenderVis(ox,oy,pw,ph,
                                locationLineImages,locationImages,locationLabels,
                                billboardPhrases,billboardChangeIntervalMinutes,
                                numWires, numLocations,
                                birdFrames,flyFrames,dirtFrames, wireLabels, locationLabels,
                                bgImgBillboards,bgImgBirds,
                                palettes
                              );
  } else if(key=='d' || key=='D'){
    visualisation.pressedDForData();
  } else if(key=='t' || key=='T'){
    visualisation.pressedTForTimestep();
  } else if(key=='f' || key=='D'){
    visualisation.pressedFForFetch();
  } else if(key=='u' || key=='T'){
    visualisation.pressedUForUpdateData();
  }

}

function draw() {
  background(0);
  push();
  // before render
  if(orientLandscape){

  } else {
    rotate(orientLandscape?0:PI/2);
    translate(0, -width);
  }
  //do all rendering
  visualisation.show(aqData);
  // testCard();
  //after render
  pop();
  // textSize(40);
  // fill(0);
  // textAlign(CENTER, CENTER);
  // textFont("antarctican-headline");
  // text("ANTARCTICAN HEADLINE", width/2, height/2);
  // textFont("loretta");
  // text("loretta", width/2, height*0.75);
  // rectMode(CENTER);
  // for(var i=0; i<5; i++){
  //   fill(palettes[i][0],palettes[i][1],palettes[i][2])
  //   rect((i+1)*width/6,100,50,50);
  // }
}

function mousePressed(){
  visualisation.click();
}

function calcSize(){
  if(orientLandscape){
    ch=windowHeight;
    cw=windowWidth;
    if(cw/ch>par){
      ph=ch;
      pw=ph*par;
      oy=0;
      ox=(cw-pw)/2;
    } else {
      pw=cw;
      ph=pw/par;
      ox=0;
      oy=(ch-ph)/2;
    }
  } else {
    ch=windowHeight;
    cw=windowWidth;
    console.log(cw/ch,1/par)
    if(cw/ch>1/par){
      pw=ch;
      ph=pw/par;
      ox=0;
      oy=(cw-ph)/2;
    } else {
      ph=cw;
      pw=ph*par;
      oy=0;
      ox=(ch-pw)/2;
    }
  }
}

// function AQData(times,places){
//   var data=[];
//
//   for(var j=0; j<numWires; j++){
//     data[j]={};
//     data[j].values=[];
//     for(var i=0; i<sparrowsPerWire; i++){
//       data[j].values[i]=[0,0,0];
//     }
//     data[j].avg24=random();
//   }
//   console.log(data);
// }


function RenderVis(xo,yo,w,h,
                  locationLineImages,locationImages,locationLabels,
                  billboardPhrases,billboardChangeIntervalMinutes,
                  numWires, numLocations,
                  birdFrames,flyFrames,dirtFrames, wireLabels, placeLabels,
                  bgImgBillboards,bgImgBirds,
                  palettes
                ){
  let vProp0=0.3;//0.25 billboards
  let vProp1=0.45;//0.45 birds
  let vProp2=0.2;//0.3 location averages
  let vProp3=0.05;//bottom labels

  let y=0;
  // let billboards=new BillboardZone(xo+0,yo+y,w,h*vProp0);
  let billboards=new BBImage(xo+0,yo+y,w,h*vProp0,w*0.33,w*0.18, billboardPhrases, palettes, billboardChangeIntervalMinutes, bgImgBillboards);
  y+=h*vProp0;
  // let sparrows=new SparrowZone(xo+0,yo+y,w,h*vProp1);
  let sparrows=new SparrowVis(xo+0,yo+y,w,h*vProp1,numWires,numLocations,birdFrames,flyFrames,dirtFrames, bgImgBirds, wireLabels, placeLabels);
  y+=h*vProp1;
  let locationData=new LocationData(xo+0,yo+y,w,h*vProp2,numLocations,locationLineImages,locationImages, locationLabels);
  y+=h*vProp2;

  // sparrows.activateNext(aqData);
  let triggerIntervalMinutesShort=0.25;
  let triggerIntervalMinutesLong=10;
  let triggerFetchFreshData=setInterval(fetchDataFromAPI,triggerIntervalMinutesLong*60*1000);
  let triggerUpdateRawFromFetchedData=setInterval(updateRawFromFetchedData,triggerIntervalMinutesShort*60*1000);
  let triggerTimeAdvance=setInterval(timeStepAdvance,triggerIntervalMinutesShort*60*1000);
  let triggerUpdateTimer=setInterval(triggerUpdate,triggerIntervalMinutesShort*60*1000);
  let hDistort=w*0.01;
  let vDistort=w*0.01;
  let emv=new EdgeMaskV(xo+w-vDistort,yo,xo+w-vDistort,yo+h,vDistort*1.2);
  let emh=new EdgeMaskH(xo,yo+h-hDistort,xo+w,yo+h-hDistort,hDistort*1.2);
  // let emv=new EdgeMaskV(390,0,390,400,10);

  triggerUpdate();
  fetchDataFromAPI();

  function fetchDataFromAPI(){
    console.log("trigger fetch Data from API at "+new Date());
    aqData.fetchAPIData();
  }

  function updateRawFromFetchedData(){
    console.log("trigger update Raw from fetched data at "+new Date());
    aqData.updateFromFetchedData();
  }

  function triggerUpdate(){
    console.log("trigger check if next bird row is ready at "+new Date());
    // sparrows.activateNext(aqData);
    aqData.addDataRowsByTime();
    sparrows.activateNextTry(aqData);
  }

  function timeStepAdvance(){
    // console.log("force advance timeStep");
    // aqData.advanceCurrentTimeStep();
    console.log("check current timeStep and advance if needed at "+new Date());
    aqData.checkTimeStep();
    aqData.checkRawDataHour();
  }

  this.click=function(){
    console.log("triggered by click test");
    // aqData.addNextDataRow();
    sparrows.activateNextTry(aqData);
    billboards.change();
  };

  this.pressedDForData=function(){
    // aqData.addNextDataRow();
    aqData.addDataRowsByTime();
  };

  this.pressedTForTimestep=function(){
    // aqData.addNextDataRow();
    // aqData.advanceCurrentTimeStep();
    aqData.checkTimeStep();
  };

  this.pressedFForFetch=function(){
    aqData.fetchAPIData();
  };

  this.pressedUForUpdateData=function(){
    aqData.updateFromFetchedData();
  };


  this.show=function(aqData){
    fill(255);//220
    noStroke();
    rectMode(CORNER);
    rect(xo,yo,w,h);
    // noStroke();
    // fill(255);
    // textAlign(CENTER, CENTER);
    // textSize(w*0.2);
    // text("blub",xo+w/2,yo+h/2);
    billboards.show();
    sparrows.preShow();
    locationData.show(aqData,palettes);
    emv.show();
    emh.show();
    sparrows.show(palettes);
    locationText(xo+0,yo+y,w,h*vProp3);
  };

  function locationText(lx,ly,lw,lh){
    push();
    translate(lx,ly);
    fill(palettes[5][0],palettes[5][1],palettes[5][2]);
    // rect(0,0,w,h)
    noStroke();
    textFont("loretta");
    textSize(lh*0.35);
    textAlign(LEFT,TOP);
    text("24-hour average levels",lw*0.05,lh*0.0);
    text("Tuesday 26 April 2022",lw*0.05,lh*0.4);
    text("Nitrogen dioxide (NO2)",lw*0.55,lh*0.0);
    text("Air Monitor data from BCC",lw*0.55,lh*0.4);
    pop();
  }
}


function EdgeMaskH(p0x,p0y, p1x, p1y,bow){
  var range=p1x-p0x;
  var controlRange=range*0.3;
  var cp0x=p0x+controlRange;
  var cp1x=p1x-controlRange;
  var cp0y=p0y+bow;
  var cp1y=p1y+bow;

  this.show=function(){
    noStroke();
    fill(255,0,0,150);
    beginShape();
    vertex(p1x,p1y);
    vertex(p1x,p1y+100);
    vertex(p0x,p0y+100);
    vertex(p0x,p0y);
    bezierVertex(cp0x,cp0y,cp1x,cp1y,p1x,p1y);
    endShape();
  }
}

function EdgeMaskV(p0x,p0y, p1x, p1y,bow){
  var range=p1y-p0y;
  var controlRange=range*0.3;
  var cp0y=p0y+controlRange;
  var cp1y=p1y-controlRange;
  var cp0x=p0x+bow;
  var cp1x=p1x+bow;

  this.show=function(){
    noStroke();
    fill(255,0,0,150);
    beginShape();
    vertex(p1x,p1y);
    vertex(p1x+100,p1y);
    vertex(p0x+100,p0y);
    vertex(p0x,p0y);
    bezierVertex(cp0x,cp0y,cp1x,cp1y,p1x,p1y);
    endShape();
  }
}


function testCard(){
  noStroke();
  fill(220);
  rectMode(CORNER);
  rect(ox,oy,pw,ph);
  fill(128);
  ellipse(ox,oy,30);
  ellipse(ox+pw,oy,30);
  ellipse(ox+pw,oy+ph,30);
  ellipse(ox,oy+ph,30);
  fill(0,100);
  noStroke();
  textSize(pw*0.1);
  textAlign(CENTER, CENTER);
  text("hello",ox+pw*0.5,oy+ph*0.5,0);
}
