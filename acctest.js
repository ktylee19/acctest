var Data = new Meteor.Collection("data");
var tempHolder = new Meteor.Collection("tempHolder");

// find average of a list
var average = function(myList) {
  var sum = 0;
  for(var i = 0; i < myList.length; i++) {
    sum += myList[i]; //don't forget to add the base
  }
  return sum/myList.length;
}

// client-side code
if (Meteor.isClient) {
  var ax = 0; // m/s^2
  var ay = 0;
  var dx = 0; // mm
  var dy = 0; 
  var vx = 0; // mm/s
  var vy = 0; 
  var t = 0; // ms
  var axAvg = 0;
  var ayAvg = 0;
  var sensitivity = 1;
  var axList = [];
  var ayList = [];
  var startTime = new Date().getTime();
  var endTime = new Date().getTime();
  Data.insert( { currentNode: true,
                 ax: ax,
                 ay: ay,
                 vx: vx,
                 vy: vy,
                 dx: dx,
                 dy: dy,
                 t:  t 
               } );

  window.addEventListener('devicemotion', function (e) {
    if (axList.length == 0) {
      startTime = new Date().getTime();
      console.log("hiere")
    }
    ax = e.acceleration.x * sensitivity;
    ay = e.acceleration.y * sensitivity;
    
    axList.push(ax);
    ayList.push(ay);

    if (axList.length == 4) {
      axAvg = average(axList);
      ayAvg = average(ayList);
      endTime = new Date().getTime(); 
      t = endTime - startTime;
      var tempNode = Data.findOne();
      dx = tempNode.dx + (tempNode.vx * tempNode.t)/1000; // to get m*10^-3 instead of m^10-6
      dy = tempNode.dy + (tempNode.vy * tempNode.t)/1000; 
      vx = tempNode.vx + (tempNode.ax * tempNode.t); // to get mm/s
      vy = tempNode.vy + (tempNode.ay * tempNode.t);
      
      Data.insert( { currentNode: true,
                 ax: axAvg.toFixed(3),
                 ay: ayAvg.toFixed(3),
                 vx: vx,
                 vy: vy,
                 dx: dx,
                 dy: dy,
                 t:  t  });
      axList = [];
      ayList = [];
    }

  } , false) ;

  Template.hello.helpers({
    data: function () {
      return Data.find({});
    }
  });

  Template.hello.greeting = function () {
    return "Welcome to acctest.";
  };

  Template.hello.acceleration = function() {
    return eventData.acceleration;
  }
  Template.hello.events({
    'click #click': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
        Data.insert({ ax:4,
                      ay:9 });
    },
    'click #clear': function () {
      Meteor.call('removeAllData');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    return Meteor.methods({
      removeAllData: function(){
        return Data.remove({});
      }
    })
    // code to run on server at startup
  });
}
