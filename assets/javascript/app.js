$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD4ZSo-UA1537Npb_KWFjqsKjftbcsjRr0",
        authDomain: "train-scheduler-91c4d.firebaseapp.com",
        databaseURL: "https://train-scheduler-91c4d.firebaseio.com",
        projectId: "train-scheduler-91c4d",
        storageBucket: "train-scheduler-91c4d.appspot.com",
        messagingSenderId: "28385700777"
    };
    firebase.initializeApp(config);
    //End initialization


    var database = firebase.database();
    var name;
    var destination;
    var start;
    var frequency;
    var snapshot;

    $(".submit").on("click", function() {

        event.preventDefault();

        name = $(".name").val();
        destination = $(".destination").val();
        start = $(".start").val();
        frequency = $(".frequency").val();

        database.ref("/train-schedule").push({
            name: name,
            destination: destination,
            start: start,
            frequency: frequency
        });

        $(".reset").trigger("reset");

    })

    setInterval(function() {
        $("tbody").empty();

        database.ref("/train-schedule").on("child_added", function(childSnapshot) {

        snapshot = childSnapshot.val();
        var key = childSnapshot.key;

        // console.log(childSnapshot.key);

        //Time Conversion
        var time = moment(snapshot.start, "hh:mm").subtract(1, "years");
        var difference = moment().diff(moment(time), "minutes");
        var remainder = difference % snapshot.frequency;
        var minutes = snapshot.frequency - remainder;
        var nextCalc = moment().add(minutes, "minutes");
        var nextTrain = moment(nextCalc).format("hh:mm");
        //End Time Conversion

        var newRow = $("<tr>").attr("data-key", key);

        // console.log(snapshot);

        newRow.append("<td>" + snapshot.name + "</td>");
        newRow.append("<td>" + snapshot.destination + "</td>");
        // newRow.append("<td>" + snapshot.start + "</td>");
        newRow.append("<td>" + snapshot.frequency + "</td>");
        newRow.append("<td>" + nextTrain + "</td>");
        newRow.append("<td>" + minutes + "</td>");
        newRow.append("<td><button id='delete'>X</button></td>");

        $("tbody").append(newRow);

    })
      }, 1000);

    $(document).on("click", "#delete", function() {
        var key = $(this).parent().parent().attr("data-key");
        console.log(key);
        database.ref("/train-schedule").child(key).remove();
        location.reload();

    })

    $(document).on("click", ".enter", function() {

        event.preventDefault();

        var yourName = $(".your-name").val();
        var yourComment = $(".your-comment").val();

        database.ref("/comments").push({
            name: yourName,
            comment: yourComment
        });

        $(".input-box").trigger("reset");

    })

    database.ref("/comments").on("child_added", function(childSnapshot) {

        dbComment = childSnapshot.val();

        $(".feedback").append("<div><strong>" + dbComment.name + ": </strong>" + dbComment.comment + "</div>");

    })

    $(".your-name").focus(function() {
        $(this).attr("value", "");
    })
    $(".your-comment").focus(function() {
        $(this).attr("value", "");
    })
    $(".your-name").blur(function() {
        $(this).attr("value", "Your Name");
    })
    $(".your-comment").blur(function() {
        $(this).attr("value", "Your Comment");
    })

    /*setInterval(function() {
      location.reload();
    }, 10000);*/


})