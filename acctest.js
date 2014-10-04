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
        Data.insert({point:"hi"});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
