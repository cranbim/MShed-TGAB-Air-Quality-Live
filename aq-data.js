function AQData(baseData,timesteps){
  this.params={
    minVal:0,
    rangeVal:50,
    minValDisplayAvg:-10,
    rangeValDisplayAvg:60,
    whoLimit:25,
    UKLimit:40
  }

  this.rawData=populateRawData(baseData);
  console.log(this.rawData);

  var dataFetcher=new DataFetcher();

  function populateRawData(baseData){
    var newData={
      hours:[],
      data:[]
    };
    var timeComponents=calculateTimes(23);
    // console.log(timeComponents);
    var hourStart=timeComponents.start.h;
    var hourNow=timeComponents.now.h;
    var k=0;
    for(var i=hourStart; i<24; i++){
      newData.hours[k]=i-24;
      k++;
    }
    for(var i=0; i<=hourNow; i++){
      newData.hours[k]=i;
      k++;
    }
    for(var j=0; j<8; j++){ //across locations.
      newData.data[j]=[];
      var k=0;
      for(var i=hourStart; i<24; i++){
        // console.log(baseData[j][i]);
        newData.data[j][k]=baseData[j][i];//{date:99,hour:i,value:10};//
        newData.data[j][k].live=false;
        k++;
      }
      for(var i=0; i<=hourNow; i++){
        // console.log(baseData[j][i]);
        newData.data[j][k]=baseData[j][i];//{date:99,hour:i,value:10};
        newData.data[j][k].live=false;
        k++;
      }
    }
    return newData
  }

  var timeSteps=[
    // -4,
    // -1,
    // 2,
    // 5,
    // 8,
    // 11,
    // 14,
    // 17

    -5,
    -2,
    1,
    4,
    7,
    10,
    11,
    16
  ];

  var currentTimeStep=-1;

  let locations=[
    "Wells Road",//airport road, sensorsb01
    "Brislington Depot", //Black Castle, sensorsb02
    "Colston Avenue",//Beacon, sensorsb03
    "Fishponds Road", //Fishponds, sensorsb04
    "Marlborough Street", //BRI, sensorsb05
    "Temple Way", //Cabots, sensorsb06
    "Parson Street School", //Parson st, sensorsb07
    "AURN St Pauls",//st pauls, sensorsb08
  ]


  this.avg24Vals=new Array(8).fill(0);
  //=[22,34,20,21,25,23,19,21];

  // average pattern
  this.randomRanges=[
    [10,25],//8pm
    [5,20],//11pm
    [2,10],//2am
    [15,25],//5am
    [25,50],//8am
    [15,35],//11am
    [5,26],//2pm
    [25,40],//5pm
    // [2,10],//5-6
    // [15,25],//7-8
    // [15,40],//9-10
    // [10,25],//11-12
    // [5,16],//13-14
    // [10,25],//15-16
    // [20,35],//17-18
    // [5,25],//19-20
    // [12,30],//21-23
  ];

  this.dataForUse=[];
  this.availableData=[];
  for(var j=0; j<8; j++){//rows of birds, 6,8,10,12,14,16,18,20
    var dataRow=new Array(8).fill({val:0, live:false});
    this.dataForUse.push(dataRow);
    this.availableData.push(false);
  }
  console.log(this.dataForUse, this.availableData);

  // this.advanceCurrentTimeStep=function(){
  //   if(currentTimeStep<7){
  //     currentTimeStep++;
  //   }
  //   console.log("timestep: "+currentTimeStep);
  // };

  this.checkTimeStep=function(){
    var hourNow=calculateTime();
    // console.log(hourNow);
    // console.log(timeSteps);
    var timeStepNow=-1;
    for(var i=0; i<timeSteps.length; i++){
      if(hourNow>=timeSteps[i]){
        timeStepNow=i;
      }
    }
    console.log(hourNow+ " current timeStep: "+timeStepNow+" "+timeSteps[timeStepNow]);
    currentTimeStep=timeStepNow;
  }

  this.checkRawDataHour=function(){
    var hourNow=calculateTime();
    console.log(hourNow, this.rawData.hours[this.rawData.hours.length-1]);
    if(hourNow>this.rawData.hours[this.rawData.hours.length-1]){
      for(var j=0; j<8; j++){
        this.rawData.data[j].push(this.rawData.data[j][0]); //this just cycles data from the oldest, but really we will retrieve new data
        this.rawData.data[j].shift();
      }
      this.rawData.hours.push(hourNow);
      this.rawData.hours.shift();
      console.log(">>>> advanced hours and data for rawData");
      console.log(this.rawData);
    }
  };

  this.testCalculateAverages=function(){
    // for(var i=0; i<8; i++){
    //   this.avg24Vals[i]=floor(random(testAverageRanges[i][0],testAverageRanges[i][1])*10)/10;
    // }
    var locationTotals=new Array(8).fill(0);
    for(var j=0; j<8; j++){//rows of birds
      for(var i=0; i<8; i++){//locations
        locationTotals[i]+=this.dataForUse[j][i].val;
      }
    }
    for(var i=0; i<8; i++){//locations
      this.avg24Vals[i]=floor(10*locationTotals[i]/8)/10;//floor(random(30,50)*10)/10
    }
  };

  this.recalculateAverages=function(){
    // this.testCalculateAverages();
    this.calculateAverages();
  };

  this.calculateAverages=function(){
    var locationTotals=new Array(8).fill(0);
    for(var j=0; j<8; j++){//rows of birds
      for(var i=0; i<24; i++){//locations
        locationTotals[j]+=this.rawData.data[j][i].value;
      }
    }
    console.log(locationTotals);
    for(var i=0; i<8; i++){//locations
      this.avg24Vals[i]=floor(10*locationTotals[i]/24)/10;//floor(random(30,50)*10)/10
    }
  };

  this.generateRandomTestData=function(){
    for(var j=0; j<8; j++){//rows of birds, 6,8,10,12,14,16,18,20
      var dataRow=[];
      for(var i=0; i<8; i++){//locations
        var range=this.randomRanges[j][1]-this.randomRanges[j][0]
        dataRow[i]={val:Math.random()*range+this.randomRanges[j][0], live:false};
      }
      this.dataForUse[j]=dataRow;
      this.availableData[j]=true;
    }
    // console.log(this.dataForUse);
    // console.log(this.availableData);
  };

  this.addDataRowsByTimeFake=function(){//
    for(var j=0; j<=currentTimeStep; j++){//rows of birds, 6,8,10,12,14,16,18,20
      if(!this.availableData[j]){
        var dataRow=[];
        for(var i=0; i<8; i++){//locations
          var range=this.randomRanges[j][1]-this.randomRanges[j][0]
          dataRow[i]={val:Math.random()*range+this.randomRanges[j][0], live:false};
        }
        this.dataForUse[j]=dataRow;
        this.availableData[j]=true;
        // break;
      }
    }
    // this.recalculateAverages();
    console.log(this.dataForUse);
    console.log(this.availableData);
  };

  this.addDataRowsByTime=function(){//RealData
    for(var j=0; j<=currentTimeStep; j++){//rows of birds,
      if(true){
        var dataRow=[];
        var rawDataIndex=-1;
        for(var k=0; k<24; k++){
          if(this.rawData.hours[k]==timeSteps[j]){
            rawDataIndex=k;
          }
        }
        for(var i=0; i<8; i++){//locations
          if(rawDataIndex>-1){
            dataRow[i]={val:this.rawData.data[i][rawDataIndex].value, live:this.rawData.data[i][rawDataIndex].live};
            // console.log(j,timeSteps[j],rawDataIndex,this.rawData.data[i][rawDataIndex].hour,this.rawData.data[i][rawDataIndex].value);
          }
        }
        if(rawDataIndex>-1){
          this.dataForUse[j]=dataRow;
          this.availableData[j]=true;
        }
      }
    }
    // this.recalculateAverages();
    console.log(this.dataForUse);
    console.log(this.availableData);
  };

  // this.addNextDataRow=function(){
  //   for(var j=0; j<8; j++){//rows of birds, 6,8,10,12,14,16,18,20
  //     if(!this.availableData[j]){
  //       var dataRow=[];
  //       for(var i=0; i<8; i++){//locations
  //         var range=this.randomRanges[j][1]-this.randomRanges[j][0]
  //         dataRow[i]=Math.random()*range+this.randomRanges[j][0];
  //       }
  //       this.dataForUse[j]=dataRow;
  //       this.availableData[j]=true;
  //       break;
  //     }
  //   }
  //   console.log(this.dataForUse);
  //   console.log(this.availableData);
  // };

  this.refreshData=function(){
    // this.generateRandomTestData();
  };

  this.fetchAPIData=function(){
    for(var i=0; i<8; i++){
      dataFetcher.fetch24(i);
    }
  };

  this.updateFromFetchedData=function(){
    console.log("check if data changed: "+dataFetcher.didChange);
    if(dataFetcher.didChange){
      console.log("update from fetched Data");
      //do stuff
      for(var j=0; j<dataFetcher.fetchedData.length; j++){
        for(var i=0; i<dataFetcher.fetchedData[j].length; i++){
          var d=dataFetcher.fetchedData[j][i];
          if(true){ //check if data hour is within rawData hours
            for(var k=0; k<24; k++){
              // console.log(k,d.hour, this.rawData.data[j][k].hour);
              if(d.hour == this.rawData.data[j][k].hour){
                // console.log(d.date, d.hour, d.value);
                this.rawData.data[j][k].date=d.date;
                // this.rawData.data[j][k].hour=d.hour;
                this.rawData.data[j][k].value=d.value;
                this.rawData.data[j][k].live=true;
              }
            }
          }
        }
      }
      dataFetcher.didChange=false;
      this.recalculateAverages();
    }
  };

  function calculateTime(){
    var timeNow=new Date();
    var hourNow=timeNow.getHours();
    return hourNow;
  }

  function calculateTimes(hourGap){
    var timeNow=new Date();
    var timeNowComponents={y:timeNow.getYear(), m:timeNow.getMonth(), d:timeNow.getDate(), h:timeNow.getHours()};
    var timeStart=new Date(timeNow-hourGap*60*60*1000);
    var timeStartComponents={y:timeStart.getYear(), m:timeStart.getMonth(), d:timeStart.getDate(), h:timeStart.getHours()};
    return {start:timeStartComponents, now:timeNowComponents};
  }

  this.refreshData();
  this.recalculateAverages();
  console.log(this.dataForUse);
  console.log(this.avg24Vals);

  function DataFetcher(baseData){
    var numHours=24;
    var numLocations=8;
    let fetchURLAssembled;

    var fetchedData=[];
    this.fetchedData=fetchedData;
    this.didChange=false;

    for(var i=0; i<numLocations; i++){
      fetchedData.push(new Array(numHours).fill(0));
    }
    for(var i=0; i<8; i++){
      fetchedData[i]=[];
      // for(var j=0; j<24; j++){
      //   fetchData[i][j]={date:0, hour:0, value:0};
      // }
    }
    console.log(fetchedData);

    // this.getData=function(){
    //   return rawData;
    // }

    this.fetch24=function(currentLocation){
      console.log("Get 24 hour data for location: "+currentLocation+" "+locations[currentLocation]);
      createFetchURL(currentLocation,24);
      getData(currentLocation);
      this.didChange=true;
    };


    async function getData(currentLocation){
      const response=await fetch(fetchURLAssembled);
      const data=await response.json();
      // console.log(data);
      fetchedData[currentLocation]=[];
      data.records.forEach(function(dr){
        var myDate=new Date(dr.fields.date_time);
        var dateYear=dr.fields.date_time.substring(0,4);
        var dateMonth=dr.fields.date_time.substring(5,7);
        var dateDay=dr.fields.date_time.substring(8,10);
        var timeHour=dr.fields.date_time.substring(11,13);
        // if(dr.fields.no2 && dr.fields.no2>-1){
        //   valueSlots[Number(timeHour)]={wholeDate: myDate, date:Number(dateDay),hour:Number(timeHour),no2:dr.fields.no2};
        // }
        if(dr.fields.no2 && dr.fields.no2>-1){
          fetchedData[currentLocation].push({
            date:dateDay, hour:timeHour, value:dr.fields.no2
          });
        }
        // // console.log(dr.fields);
        // console.log(dateDay, timeHour, dr.fields.no2);
      });
      // rawData[currentLocation]=dayData;
      console.log("api data fetched for: "+currentLocation);
      console.log(fetchedData);
    }


    function createFetchURL(locationID,periodLength){
      let fetchBase='https://opendata.bristol.gov.uk/api/records/1.0/search/?dataset=air-quality-data-continuous&';
      let dateComponents=calculateTimes(periodLength-1);
      // console.log(dateComponents);
      let fetchDateEnd=nf(dateComponents.now.y,4,0)+
                    "-"+nf(dateComponents.now.m,2,0)+
                    "-"+nf(dateComponents.now.d,2,0)+
                    "T"+nf(dateComponents.now.h,2,0);
      let fetchDateStart=nf(dateComponents.start.y,4,0)+
                    "-"+nf(dateComponents.start.m,2,0)+
                    "-"+nf(dateComponents.start.d,2,0)+
                    "T"+nf(dateComponents.start.h,2,0);
      let fetchLocation=locations[locationID];//'Brislington+Depot';
      fetchURLAssembled=fetchBase+'q=date_time%3A%5B'+
                          fetchDateStart+'%3A00%3A00Z+TO+'+
                          fetchDateEnd+'%3A59%3A59Z%5D&'+
                          'facet=date_time&'+
                          'facet=location&'+
                          'rows=24'+
                          '&refine.location='+fetchLocation;
      // console.log(fetchURLAssembled);
    }

    function calculateTimes(hourGap){
      var timeNow=new Date();
      var timeNowComponents={y:timeNow.getFullYear(), m:timeNow.getMonth()+1, d:timeNow.getDate(), h:timeNow.getHours()};
      var timeStart=new Date(timeNow-hourGap*60*60*1000);
      var timeStartComponents={y:timeStart.getFullYear(), m:timeStart.getMonth()+1, d:timeStart.getDate(), h:timeStart.getHours()};
      return {start:timeStartComponents, now:timeNowComponents};
    }
  }
}
