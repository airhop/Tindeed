$(document).ready(function(){
  $("#jobViewDiv").hide();
  $("#resultsListDiv").hide();
  $("#showMatchesBtn").hide();
  $("#startOverBtn").hide();

  likednum = 0;
  counter = 0;


  $('#startOverBtn').click(function(){
     window.location.replace("http://ec2-52-34-157-203.us-west-2.compute.amazonaws.com/creative-project3/Tindeed/index.html#/home");
      $("#resultsListDiv").hide();
      $("#startOverBtn").hide();
	location.reload();
  });
});
//Inputted Variables

var FirstName = "User";
var LastName = "User";
var InputCity = "Provo";
var InputState = "Utah";
var Radius = 500;
var JobType = "fulltime";
var Keyword1 = "";
var Keyword2 = "";

//Other Needed Global Variables

var JobLatitude = "51.508742"; //London, England (just because)
var JobLongitude = "-0.120850";
var url = "http://api.indeed.com/ads/apisearch?publisher=8641809710838622&&format=json&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&latlong=1&limit=25&q=";
var alljobs = "";
var LikedJobs = new Object(); //JS object to hold liked jobs in
var counter = 0; //Global overall job counter
var likednum = 0; //Global liked jobs counter
function generateCard(){

    JobLatitude = alljobs.results[counter].latitude;
    JobLongitude = alljobs.results[counter].longitude;
    initialize();

  //Other Job Info Fields Set
    $('#welcomeName').html(FirstName);
    $('#jobTitle').html(alljobs.results[counter].jobtitle);
    $('#jobLocation').html(alljobs.results[counter].formattedLocation);
    $('#jobDescription').html(alljobs.results[counter].snippet)
    $('#jobCompany').html(alljobs.results[counter].company)
    $('#jobPosted').html(alljobs.results[counter].formattedRelativeTime)
    $('#jobSource').html(alljobs.results[counter].source)
    
    counter++;
    return true;
  }
 function showRes(){
      $("#jobViewDiv").hide();
      $("#resultsListDiv").show();
      $("#showMatchesBtn").hide();
      $("#startOverBtn").show();
      generateResults();
      $state.go('res');
}
  function generateResults() {
    for (i=0; i<likednum; i++) {
      $('#listTheResults').append("<tr><td>"+LikedJobs[i].jobtitle+"</td><td>"+LikedJobs[i].company+"</td><td>"+LikedJobs[i].formattedLocation+"</td><td><a target='_blank' href='"+LikedJobs[i].url+"''><button class='btn btn-danger'>Apply Now</button></a></td></tr>");
    }
  }

  var map;
  function initialize() {
    map = new google.maps.Map(document.getElementById("map"),{
      center:new google.maps.LatLng(JobLatitude,JobLongitude),
      draggable:false,
      scrollwheel:false,
      zoom:12,
      mapTypeId:google.maps.MapTypeId.ROADMAP
    });
  };
angular.module('News', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('res', {
      url: '/res',
      templateUrl: '/res.html',
      controller: 'MainCtrl'
    })
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })
    .state('swipe', {
      url: '/swipe',
      templateUrl: '/swipe.html',
      controller: 'MainCtrl'
    });

  $urlRouterProvider.otherwise('home');
}]) 
.controller('MainCtrl', [
'$scope', '$state',
function($scope, $state){

  $scope.nobut = function(){
      if (counter<Object.keys(alljobs.results).length){
        generateCard();
      }
      else {
      $("#jobViewDiv").hide();
      $("#resultsListDiv").show();
      $("#showMatchesBtn").hide();
      $("#startOverBtn").show();
      generateResults();
      $state.go('res');
      }
};
  $scope.yesbut = function(){
      $("#showMatchesBtn").show();
      if (counter<Object.keys(alljobs.results).length){
        LikedJobs[likednum] = alljobs.results[counter-1];
        generateCard();
        likednum++
      }
      else {
      $("#jobViewDiv").hide();
      $("#resultsListDiv").show();
      $("#showMatchesBtn").hide();
      $("#startOverBtn").show();
      generateResults();
      $state.go('res');
      }
};

  $scope.changeToSwipe = function(){
    $("#inputFormDiv").hide();
    $("#jobViewDiv").show();

  // Set Global JS variables with inputted info
    if($('#inputFirstName').val()){
      FirstName = $("#inputFirstName").val();
    }
    if($('#inputLastName').val()){
      LastName = $("#inputLastName").val();
    }
    if($('#inputCity').val()){
      InputCity = $("#inputCity").val();
      InputState = $("#selectState").val();
    }
    if ($('#checkBox').prop('checked')) {
      Radius = 50;
    }
    JobType = $("#selectJobType").val();
    Keyword1 = $("#inputKeyword1").val();
    Keyword2 = $("#inputKeyword2").val();

  // Build Indeed API Request URL
    url += Keyword1+"+"+Keyword2+"&l="+InputCity+",%20"+InputState+"&jt="+JobType+"&radius="+Radius+""

    var data="";
    $.ajax({
      url:url,
      dataType:"jsonp",
      async:true,
      success: function(data){
        alljobs = data;
        if(alljobs.totalResults == 0){
          $("#error").modal();
          throw $break;
        }
        else {
          generateCard();
        }
      }
    });
 $("#showMatchesBtn").hide();
    $state.go('swipe');
      $("#showMatchesBtn").hide();
  };

}]);


