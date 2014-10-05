var Data = new Meteor.Collection("data");
var tempHolder = new Meteor.Collection("tempHolder");

// find average of a list
// var average = function(myList) {
//   var sum = 0;
//   for(var i = 0; i < myList.length; i++) {
//     sum += myList[i]; //don't forget to add the base
//   }
//   return sum/myList.length;
// }

// client-side code
if (Meteor.isClient) {
  var ax = 0;
  var ay = 0;
  var dx = 0;
  var dy = 0;
  var vx = 0;
  var vy = 0;
  var t = 0;
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
    // if (axList.length == 0) {
    //   startTime = new Date().getTime();
    //   console.log("hiere")
    // }
    // else {
    //   console.log('haiiii')
    // }
    // ax = e.acceleration.x * sensitivity - .05;
    // ay = e.acceleration.y * sensitivity - .05;
    
    // axList.push(ax);
    // ayList.push(ay);
    console.log("listening");
    console.log(axList);
    console.log(ayList);

    // // 0.4 second lag 
    // if (axList.length == 5) {
    //   console.log("length");
    //   axAvg = average(axList);
    //   ayAvg = average(ayList);
    //   endTime = new Date().getTime(); 
    // t = endTime - startTime;
    var tempNode = Data.findOne();
    dx = tempNode.dx + (tempNode.vx * tempNode.t);
    dy = tempNode.dy + (tempNode.vy * tempNode.t);
    vx = tempNode.vx + (tempNode.ax * tempNode.t);
    vy = tempNode.vy + (tempNode.ay * tempNode.t);
    t = tempNode.t;
    
    Data.insert( { currentNode: true,
               ax: axAvg.toFixed(2),
               ay: ayAvg.toFixed(2),
               vx: vx,
               vy: vy,
               dx: dx,
               dy: dy,
               t:  t  });
    //   axList = [];
    //   ayList = [];
    // }

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
    },
    // 'click #stop': function() {
    //   window.removeEventListener('devicemotion', listener, false);
    // },
    // 'click #start': function() {
    //   window.addEventListener('devicemotion', listener, false);
    // }
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
