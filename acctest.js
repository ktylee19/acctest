var Data = new Meteor.Collection("data");

if (Meteor.isClient) {
  
  var ax = 0;
  var ay = 0;
  var sensitivity = 1;

  window.addEventListener('devicemotion', function (e) {
    ax = e.accelerationIncludingGravity.x * sensitivity;
    ay = -e.accelerationIncludingGravity.y * sensitivity;
    Data.insert({point: ax});
  }, false);

  Template.hello.helpers({
    data: function () {
      return Data.find({});
    },
    onePoint: function () {
      //return Data.find({}, {sort:{ "createdAt": -1}})[0].point;
      //return 0;
      return Data.findOne({},{sort:{ "createdAt": -1}}).point;
    }

  });

  Template.hello.greeting = function () {
    return "Welcome to acctest.";
  };

  Template.hello.acceleration = function() {
    return eventData.acceleration;
  }

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
        Data.insert({ point:"hi",
                      createdAt: new Date() });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
