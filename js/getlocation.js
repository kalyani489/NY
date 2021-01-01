function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
}

var lat2;
var lon2;

function showPosition(position) {
    
    lat2=position.coords.latitude;
    lon2 = position.coords.longitude;
    if($('#lat').length !== 0){
        $('#lat').prop('value',lat2);
        $('#long').prop('value',lon2);
    }
}
getLocation();
nearbyCheck();
$('#gamecodeinput').click( function() {
    getLocation();
    nearbyCheck();
})
$('#nearbyrows tr').click(function(e){
    console.log($('#nearbyrows tr')[0].childNodes[1].innerText);
  });
  $('#nearbygames').hide();
function tableFilter(gamecodefilter) {
  // Declare variables 
  var table, tr, td, i;
  table = document.getElementById("#nearbyrows");
  tr = $('#nearbyrows tr');
    var final
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = $('#nearbyrows')[0].rows[i].cells[1].innerHTML;
    if (td) {
      if (td.toUpperCase().indexOf(gamecodefilter) > -1) {
        final =  true;
        break;
      } else {
        final = false;
      }
    } 
  }
  return final;
}
var showinggamecode = false;
function nearbyCheck(){
  if(!showinggamecode){
    
    console.log("RECHECKING");
    //UTC:
// UNCOMMENT IF GAME CODES NOT SHOWING: console.log('CJECLING');
$.ajax({
    type: 'POST',
      data: {checking: true},
      dataType: "html",
url: '../ajax/nearby.php',
success: function(data){
JSON.parse(data).forEach(item => {

var madlat = item.latitude;
var madlong = item.longitude;
var gamename = item.game_name;

switch (gamename) {
case "couch":
	gamename = "Couch Game";
	break;
case "mouthful":
	gamename = "Mouthful";
	break;
case "pindrop":
gamename = "Pin Drop";
case "draft":
gamename = "Draft Wars";
case "fam":
gamename = "Family Friendzy";
break;
default:
	gamename;
}
var gamecode = item.game_code;

// TIME WINDOW IS TAKEN CARE INSIDE NEARBY.PHP

function showGCL(){
var lat1 = madlat;
var lon1= madlong;
var gn = gamename;
var gc = gamecode;
var R =  6371e3;  // metres
var  φ1  = lat1 * Math.PI / 180;
var  φ2  = lat2* Math.PI / 180;
var Δφ  =(lat2-lat1)* Math.PI / 180;
var Δλ  = (lon2-lon1)* Math.PI / 180;

var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

var d = R * c;
d = 0.000621371*d;

var boolean = lat1 == 0 && lon1 == 0;
console.log(gc+": "+d+" miles away.");

if(d<0.5 && !boolean){
if(!tableFilter(gc)){
$('#nearbyrows').prepend('<tr ><td>'+gn+'</td><td class="gamecode" id='+gc+'><span class="code-highlighter">'+gc+'</span></td></tr>');//
$('#'+gc).parent().click(function(){
$('#gamecodeinput').prop('value',$(this).find('.gamecode')[0].innerText);
$('#vericon').html('<i style="color:green;" class="fa fa-check-circle jello animated"></i>');
$('#vericon').show();
$('#joinbutton').prop('disabled',false);
$('#joinbutton').click();
});

}
}else if(tableFilter(gc)){
for(var i = 0;i <$('#nearbyrows')[0].rows.length; i++){
if(gc == $('#nearbyrows')[0].rows[i].cells[1].innerHTML){
  $('#nearbyrows tr:eq('+i+')').remove();
}
}

}
}
showGCL();
if($('#nearbyrows tr').length==0){
$('#nearbygames').fadeOut(1000);
}else{
$('#nearbygames').fadeIn(1000);
}
})

}

}).always(function() {
// Schedule the next request after this one completes,
// even after error
//console.log('Waiting ' + (1000) + ' seconds');
setTimeout(nearbyCheck, 5000);
});
}else{
  $('#nearbygames').hide();
}
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
    ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
    }
    : null;
}
function randcolor(){
    //NEW COLOR PALETTE
    var colorArray = [
                            "#4286f4",
                            "#7e52aa",
                            "#42b278",
                            "#e54e4e",
                            "#fc9c46",
                            "#ad3d73",
                            "#51a7de",
                            "#AE173D"
                            ];
                            return colorArray[Math.floor(Math.random()*colorArray.length)];
    //OLD CODE CREATES PURELY RANDOM COLORS THAT ARE NOT TOO DARK OR LIGHT
    /*colorcode = "";
    while(colorcode.length < 6){
        colorcode += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)];
    }
    newcolor = "#" + colorcode;
    var hex = hexToRgb(newcolor);
    var sum = hex.r + hex.g + hex.b;
    var lowdiff = (Math.abs(hex.r-hex.g) < 30) || (Math.abs(hex.g-hex.b) < 30) || (Math.abs(hex.b-hex.r) < 30);
    if(sum<100 || sum>400 || lowdiff){
        return randcolor();
    }else{
        return newcolor;
    }*/
}

$('#controlbars').click(function(){
                                          blurBackground();
                                          $('body').css('overflow-y','auto');
                                          $('body').css('-webkit-overflow-scrolling','auto');
                                          $('#controlpage').css('width','100%');
                                          $('body').css('overflow','hidden');
                                          $(this).animate({opacity: 0});
                                          $('#controlback').css({'display':'initial','opacity':0});
                                          setTimeout(
                                                      function()
                                                      {
                                                      $('#controlback').css({'opacity':1});
                                                      $('.controlbutton').css('opacity','1');
                                                      }, 200);
                                          })
                  $('#controlback').click(function(){
                                          unblurBackground();
                                          $('body').css('overflow','scroll');
                                          $('body').css('-webkit-overflow-scrolling','touch');
                                          $('.controlbutton').css('opacity','0');
                                          $('#controlback').css({'display':'none','opacity':0});
                                          $("#controlpage").animate({ scrollTop: 0 }, "fast");
                                          setTimeout(
                                                      function()
                                                      {
                                                      $('#controlpage').css('width','0%');
                                                      $('#controlbars').animate({opacity: 1});
                                                      }, 200);
                                          })
$('#templogo').click(function(){
							window.location.href = "../";
						});
$('#gohome').click(function(){
$(this)
  .delay(200)
  .queue(function (next) {
    window.location.href = "../";                                                
    next();
  });                
});
$('#aboutlogo').click(function(){
  window.location.href = "../about";                                                
});
$('#goabout').click(function(){
$(this)
  .delay(200)
  .queue(function (next) {
    window.location.href = "../about";
    next();
  });
});
$('#feedbacklogo').click(function(){
	window.location.href = "../contact";
});
$('#gofeedback').click(function(){
  $(this)
  .delay(200)
  .queue(function (next) {
    window.location.href = "../contact";
    next();
  });
});
$('#profilelogo').click(function(){
  window.location.href = "../profile";
});
$('#goprofile').click(function(){
      $(this)
  .delay(200)
  .queue(function (next) {
    window.location.href = "../profile";                                                
    next();
  }); 
});
$('#gosignout, #signoutlogo').click(function(){
  var confirmsignout = confirm('You are signing out.');
  if(confirmsignout){
    $.ajax({
      url: '../ajax/signout.php',
      type: 'POST',
      data: {signout: confirmsignout},
      dataType: "html",
      success: function(data){
        window.location.href = "../";
      }
    })
  }
})

$('#gosignin, #signinlogo').click(function(){
  if($('#fieldset').html()==undefined){
    console.log('this ran');
               window.location.href = "../#fieldset";
  }else{
    $('#controlback').click();
     $("html, body").animate({ scrollTop: $('fieldset').offset().top }, 1000);
     $(this)
       .delay(500)
       .queue(function (next) {
          next();
        });
  }
               });



function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


var canvas = document.querySelector('#starrynight');
if(canvas){
canvas.width = $(document).width();
canvas.height = $(document).height();
}
innerWidth = $(document).width();
innerHeight = $(document).height();
function blurBackground(){
  $('#header, #newinstructions, #controlbars, #pagewrapper, #vol, #feedbacklogo, #aboutlogo, #profilelogo, #signoutlogo, #signinlogo').css('filter','blur(10px)');
  }
function unblurBackground(){
  $('#header, #newinstructions, #controlbars, #pagewrapper, #vol, #feedbacklogo, #aboutlogo, #profilelogo, #signoutlogo, #signinlogo').css('filter','unset');
}
$(document).ready(function() {
  if(isMobile()){
    $('#fbpage').click(function(){
      $.get("fb://profile/175884013079091").done(function () {}).fail(function () {
        $('#outerlink').attr('href','https://www.facebook.com/gamenightplus/');
        $('#outerlink')[0].click();
      })
      $('#outerlink').attr('href','fb://profile/175884013079091');
      $('#outerlink')[0].click();
    })
    $('#igpage').click(function(){
      $.get("instagram://user?username=gamenightplus").done(function () {}).fail(function () {
        $('#outerlink').attr('href','https://www.instagram.com/gamenight.plus/');
        $('#outerlink')[0].click();
      })
      $('#outerlink').attr('href','instagram://user?username=gamenight.plus');
      $('#outerlink')[0].click();
    })
    $('#twtpage').click(function(){
      $('#outerlink').attr('href','twitter://user?screen_name=gamenightplus');
      $('#outerlink')[0].click();
      $.get("twitter://user?screen_name=gamenightplus").done(function () {
          $('#outerlink').attr('href','twitter://user?screen_name=gamenightplus');
          $('#outerlink')[0].click();
      }).fail(function () {
        $('#outerlink').attr('href','https://www.twitter.com/gamenightplus/');
        $('#outerlink')[0].click();
      })
    })
    $('#tchpage').click(function(){
      $('#outerlink').attr('href','twitch://open?stream=gamenightplus');
          $('#outerlink')[0].click();
      $.get("twitch://open?stream=gamenightplus").done(function () {
          $('#outerlink').attr('href','twitch://open?stream=gamenightplus');
          $('#outerlink')[0].click();
      }).fail(function () {
        $('#outerlink').attr('href','https://www.twitch.tv/gamenightplus');
        $('#outerlink')[0].click();
      })
    })

}else{
    $('#fbpage').attr('href','https://www.facebook.com/gamenightplus/');
    $('#igpage').attr('href','https://www.instagram.com/gamenight.plus/');
    $('#twtpage').attr('href','https://www.twitter.com/gamenightplus/');
    $('#tchpage').attr('href','https://www.twitch.tv/gamenightplus');
}
  $('#ytpage').attr('href','https://www.youtube.com/channel/UCUaegLhnI4c2JPgmnFwSg6g');

$('.fa-handshake').click(function(){
  $('#controlback').click();
  blurBackground();
  if($('#footer').width()){
                  if($(document).innerWidth()<=812){
                           $('#donationpage').css({'bottom':'140px'});
                         }else{
                          $('#donationpage').css({'bottom':'140px'});
                         }
                       }else{
                        $('#donationpage').css({'bottom':'0'});
                       }
                           })
$('#back2games').click(function(){
                       $('#donationpage').css({'bottom':'100%'});
                       unblurBackground();
                       })
                if($('#video').width()){
                      $('#pagecontent').css('margin-top',$('#header').height()+40);
                }

                  var footerheight;
                  if($('#footer').width()){
                  if($(document).innerWidth()<=812){
                    footerheight = 140;
                    $('#gamecodeinput').css('width','300px');
                  }else{
                    footerheight = 140;
                    $('#gamecodeinput').css('width','300px');
                    $('#controlback').click();
                  }
                  $('#controlpage').animate({bottom: '140px'});
                  $('#cancelbutton').click(function () {
                                   $('#social, #social2, #donate, #popup').fadeIn();
                                   $('#footer').animate({height: footerheight+'px'});
                                   $('#controlpage').animate({bottom: '140px'});
                                   $("html, body").css('overflow','initial');
                                   $('#cancelbutton').hide();
                                   unblurBackground();
                                   })
                }
                  var onresize = function() {
                    if($('#video').width()){
                      $('#pagecontent').css('margin-top',$('#header').height()+40);
                }
                    if(canvas){
                    canvas.width = $(document).width();
                    canvas.height = $(document).height();
                  }
                    innerWidth = $(document).width();
                    //console.log(innerWidth);
                  innerHeight = $(document).height();
                  if($('#footer').width()){
                  if($(document).innerWidth()<=812){
                    footerheight = 140;
                    $('#gamecodeinput').css('width','300px');
                    if($('#donationpage').height()>0){
                    $('#donationpage').css({'height':'auto','bottom':'140px'});
                  }
                  }else{
                    footerheight = 140;
                    $('#gamecodeinput').css('width','300px');
                    if($('#donationpage').height()>0){
                    $('#donationpage').css({'height':'auto','bottom':'140px'});
                  }
                    $('#controlback').click();
                  }
                  if($('#footer').height()<=140){
                    $('#footer').css({'height': footerheight+'px'});
                    unblurBackground();
                  }else{
                    blurBackground();
                  }
                }

                if($('#contact').width() || $('#feedbackform').width()){
                  if($('body').innerWidth()>812){
                    if($('#donationpage').height()>0){
                    blurBackground();
                  }else{
                    $('#controlback').click();
                  }
                  
                  }
                }
                  
}
window.addEventListener("resize", onresize);
                  if (isMobile()) {
                  $('#joinbutton').click(function () {
                                         $(this).css({'background-color':'#38acec','border-color':'#38acec','color':'white'});
                                         $(this)
                                         .delay(200)
                                         .queue(function (next) {
                                         $(this).css({'background-color':'transparent','border-color':'white'})
                                                next();
                                                });
                                         });
                  
                  }
                  $('#joingameform input[type="text"]').click(function () {
                                       $("html, body").animate({ scrollTop: 0 }, 100);
                                       $('#footer').animate({height: '100%'});
                                       $("html, body").css('overflow','hidden');
                                       $('body').css('-webkit-overflow-scrolling','auto');
                                       $('#controlback').click();
                                       $('#back2games').click();
                                       $('#social, #social2,#donate, #popup').fadeOut();
                                       $('#cancelbutton').show();
                                       blurBackground();
                                         });
                  //FOR POPUP
                  function changeOpacity(time){
    var el = document.getElementById('popup');
    var oel = document.getElementById('myPopup');
    if(el){
    if(el.style.opacity == 1){
        $(this)
        .delay(time)
        .queue(function (next) {
               $('.popup').css('opacity',0);
               $(this)
               .delay(1000)
               .queue(function (next) {
                      changeOpacity();
                      next();
                      });
               next();
               });
    }else{
        $(this)
        .delay(time)
        .queue(function (next) {
               $('.popup').css('opacity',1);
               $(this)
               .delay(2000)
               .queue(function (next) {
                      changeOpacity();
                      next();
                      });
               next();
               });
    }
  }
}

changeOpacity(500);
                  
              })

//VERIFICATION
if (isMobile()) {
    $pos = -5;
} else {$pos = -3;}
$(document).ready(function() {

  if(!isMobile()){
      $('#vericon').css({'font-size':'26px','top':'4px'});
     }

//Shake vericon
(function($){
     $.fn.shake = function(settings) {
        if(typeof settings.interval == 'undefined'){
         settings.interval = 100;
     }
 
        if(typeof settings.distance == 'undefined'){
            settings.distance = 10;
     }
 
     if(typeof settings.times == 'undefined'){
        settings.times = 4;
     }
 
     if(typeof settings.complete == 'undefined'){
        settings.complete = function(){};
     }
  
     for(var iter=0; iter<(settings.times+1); iter++){
        $(this).animate({ right:((iter%2 == 0 ? settings.distance-$pos : (settings.distance * -1)-$pos)) }, settings.interval);
     }
 
     $(this).animate({ right: -1*$pos}, settings.interval, settings.complete);
     };
 })(jQuery);

 //Verification in input with check icons and exclamation icon
                  $('#gamecodeinput').on('input', function() {

                                         if($('#gamecodeinput').val().length > 4){
                                         $('#joinbutton').attr('disabled', 'disabled');
                                         var gamecode = $("#gamecodeinput").val().toUpperCase();
                                         $.ajax({
                                                url: 'https://www.gamenight.plus/ajax/verifygame.php',
                                                type: 'POST',
                                                data: {gamecode: gamecode},
                                                dataType: "html",
                                                success: function(data){
                                                if(data==1){
                                                $('#vericon').html('<i style="color:white;" class="fa fa-check-circle jello animated"></i>');
                                                $('#vericon').show();
                                                //$('#vericon').toggleClass('')
                                                $('#joinbutton').removeAttr("disabled");
                                                }else {
                                                $('#vericon').html('<i style="color:red;" class="fa fa-exclamation-circle" title="code does not exist!"></i>');
                                                $('#vericon').show();
                                                $('#vericon').shake({
                                                                    interval: 100,
                                                                    distance: 5,
                                                                    times: 2
                                                                    });
                                                }
                                                }
                                                });
                                         }else{
                                         $('#vericon').html('');
                                         $('#vericon').hide();
                                         $('#joinbutton').removeAttr("disabled");
                                         }
                                         
                                         })
              })

//ANIMATE .CSS for footer
$('#footer').addClass('animated slideInUp');
$('#pagetitle').toggleClass('animated bounceInDown');

//INHIBITING JOIN INPUT TO ALPHABET ONLY
function alphaOnly(event) {
      var key = event.keyCode;
      return ((key >= 65 && key <= 90) || key == 8 || key == 13 || key == 37 ||key == 39);
    };