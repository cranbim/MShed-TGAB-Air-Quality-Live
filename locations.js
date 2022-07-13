function LocationData(x,y,w,h,n,picsLine, picsOutl,labels){
  var graphs=[];
  var vals=new Array(n).fill(0);
  for(var i=0; i<n; i++){
    // graphs.push(new Graph(x+w*0.05+i*w*0.9/n, y, w*0.9/n, h, random(), pics[i%pics.length],labels[i%labels.length]));
    graphs.push(new Graph(x+w*0.0+i*w*1.0/n, y, w*1.0/n, h, random(), picsLine[i%picsLine.length], picsOutl[i%picsLine.length],labels[i%labels.length]));
  }

  this.reset=function(){
    graphs.forEach(function(g){
      g.targetVal=random();
    });
  };

  this.update=function(vals){
    graphs.forEach(function(g,i){
      g.targetVal=vals[i];
    });
  }

  this.show=function(aqData,palettes){
    push();
    translate(x,y);
    for(var i=0; i<n; i++){
      // fill(180+(i%2==1?0:10));
      // fill(220-(i%2==0?0:20));
      // rect(w/2-w*0.45+(i)*w*0.9/(n),0,w*0.9/(n),h);
      // fill(0);
      // noStroke();
      // textSize(sparrowSize);
      // textAlign(CENTER,BOTTOM);
      // text(placeLabels[i],w/2-w*0.45+(i+0.5)*w*0.9/(sparrowsPerWire),h);

    }
    pop();
    // fill(255,100);
    // rectMode(CORNER);
    // rect(x,y,w,h);
    graphs.forEach(function(g,i){
      g.targetVal=(aqData.avg24Vals[i]-aqData.params.minValDisplayAvg)/aqData.params.rangeValDisplayAvg;
      g.actualVal=aqData.avg24Vals[i];
      g.show(aqData.params, palettes[1]);
      g.run();
    });
    push();
    translate(x,y);
    var whoLine=(aqData.params.whoLimit-aqData.params.minValDisplayAvg)/aqData.params.rangeValDisplayAvg;
    // var whoLineY=h*0.95-h*0.85*whoLine;
    var whoLineY=h*0.425-h*0.45*whoLine;
    strokeWeight(h*0.015);
    stroke(255,0,0,150);
    line(w*0.01,whoLineY,w*0.99,whoLineY);
    // var UKLine=(aqData.params.UKLimit-aqData.params.minValDisplayAvg)/aqData.params.rangeValDisplayAvg;
    // var UKLineY=h*0.95-h*0.85*UKLine;
    // strokeWeight(h*0.01);
    // stroke(palettes[4][0],palettes[4][1],palettes[4][2],150);
    // line(w*0.01,UKLineY,w*0.99,UKLineY);

    // textFont("loretta");
    // textSize(w*0.025);
    // textAlign(LEFT,BOTTOM);
    // fill(255,0,0,130);
    // noStroke();
    // text('World Health Organisation',w*0.05,whoLineY-w*0.005);
    // text('24hr recommended limit 25µg/m3',w*0.05,whoLineY+w*0.03);
    pop();
  };
}


function Graph(x,y,w,h,targetVal, picLine, picOutl, label){
  this.actualVal=0;
  this.val=0;
  this.targetVal=targetVal;
  var iar=picLine.width/picLine.height;
  var iscl=w*0.96/picLine.width;
  var isclLine=iscl*0.9;

  this.run=function(){
    this.val+=(this.targetVal-this.val)*0.05;
  }

  this.show=function(params,palette){
    push();
    translate(x,y);
    noStroke();
    fill(palette[0],palette[1],palette[2]);
    // rect(w*0.02,h*0.95,w*0.96,-h*0.85*this.val);//all in one block
    rect(w*0.02,h*0.95,w*0.96,-h*0.5);//base block
    fill(palette[0],palette[1],palette[2]);
    rect(w*0.02,h*0.425,w*0.96,-h*0.45*this.val);//graph block
    // fill(palette[0],palette[1],palette[2],50);
    // rect(w*0.02,h*0.95,w*0.96,-h*0.85*this.val);
    push();
    translate(w*0.5,h*0.95-h*0.55-h*0.45*this.val);
    scale(iscl);
    image(picOutl,-picLine.width/2,-picOutl.height);
    pop();
    push();
    translate(w*0.5,h*0.675);
    scale(isclLine);
    image(picLine,-picLine.width/2,-picLine.height);
    pop();
    push();
    translate(0,h*0.75);
    textFont("loretta");
    textSize(w*0.155);//0.195
    textAlign(LEFT,BOTTOM);
    fill(0);
    noStroke();
    label.forEach(function(l){
      text(l,w*0.05,0);
      translate(0,w*0.2);
    });
    // text(label,w/2,0);
    pop();
    push();
    translate(0,h*0.93);
    textFont("loretta");
    textSize(w*0.25);
    textAlign(LEFT,BOTTOM);
    fill(0);
    noStroke();
    var avgVal=this.actualVal;
    var tw=textWidth(avgVal)*1.05;
    var unit="µg/m3"
    text(avgVal,w*0.05,0);
    textSize(w*0.15);
    text(unit,w*0.05+tw,0);
    pop();
    pop();
  }
}
