var Data = new Meteor.Collection("data");

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
  var t = 200; // ms
  var axAvg = 0;
  var ayAvg = 0;
  var sensitivity = 1;
  var axList = [];
  var ayList = [];
  var startTime = new Date().getTime();
  var endTime = new Date().getTime();
  var oldNode = Data.findOne();
  // if (oldNode) {
  //   Data.update( { _id: oldNode._id },
  //                { $set: { currentNode: true,
  //                  ax: ax,
  //                  ay: ay,
  //                  vx: vx,
  //                  vy: vy,
  //                  dx: dx,
  //                  dy: dy,
  //                  t:  t 
  //                }},
  //                { upsert: true } );
  // } else {
      Data.insert( { currentNode: true,
                     ax: 0,
                     ay: 0,
                     vx: 0,
                     vy: 0,
                     dx: 0,
                     dy: 0,
                     t:  t });
  // }

  window.addEventListener('devicemotion', function (e) {
    if (axList.length == 0) {
      startTime = new Date().getTime();
      console.log("hiere")
    }
    ax = (e.acceleration.x-.00) * sensitivity;
    ay = (e.acceleration.y-.00) * sensitivity;
    
    axList.push(ax);
    ayList.push(ay);

    if (axList.length == 5) {
       //axAvg = average(axList);
       //ayAvg = average(ayList);
      ax = axList.sort()[Math.round(axList.length/2)];
      ay = ayList.sort()[Math.round(ayList.length/2)];
      endTime = new Date().getTime(); 
      t = endTime - startTime;
      // var tempNode = Data.findOne();
      //var tempNode = Data.find({},sort({createdAt:-1})).limit(-1).getNext();
      //var tempNode = Data.find().sort({_id:-1});
      //var tempNode = Data.findOne({}, {sort: {createdAt:-1}});
      var tempNode = Data.findOne({}, {sort: {createdAt:1}});
      //dx = tempNode.dx + (tempNode.vx * tempNode.t)/1000; // to get m*10^-3 instead of m^10-6
      //dy = tempNode.dy + (tempNode.vy * tempNode.t)/1000; 
      dx = tempNode.dx + (tempNode.vx * tempNode.t/1000) + (0.5 * ax * tempNode.t/1000 * tempNode.t/1000); // to get m*10^-3 instead of m^10-6
      dy = tempNode.dy + (tempNode.vy * tempNode.t/1000) + (0.5 * ay * tempNode.t/1000 * tempNode.t/1000); 
      vx = tempNode.vx + (ax * tempNode.t/1000); // to get mm/s
      vy = tempNode.vy + (ay * tempNode.t/1000);

      // Data.update( { _id: oldNode._id },
      //              { $set: { currentNode: true,
      //                ax: axAvg.toFixed(3),
      //                ay: ayAvg.toFixed(3),
      //                vx: vx,
      //                vy: vy,
      //                dx: dx,
      //                dy: dy,
      //                t:  t  } },
      //              { upsert: true });
      Data.insert( { currentNode: true,
                     ax: ax.toFixed(3),
                     ay: ay.toFixed(3),
                     vx: vx.toFixed(3),
                     vy: vy.toFixed(3),
                     dx: dx.toFixed(3),
                     dy: dy.toFixed(3),
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
                      ay:9,
                      timer:new Date().getTime() });
        //var tempNode = Data.find( {} , {sort: {_id:-1} } ).limit(-1);
        var tempNode = Data.findOne({}, {sort: {createdAt:1}});
        console.log(tempNode)
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
