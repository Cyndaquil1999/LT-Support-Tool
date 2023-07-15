(function($,doc,win){
    //Variables
    var hour = $('#hr');
    var min = $('#min');
    var sec = $('#sec');
    var liNum = 75;
    var flip = false;
    var intervalCounter = 0;
    //Buttons
    var btnStartStop = $('#btn-start-stop');
    var labelStartStop = $('#label-start-stop');
    var btnReset = $('#btn-reset');
    //Elements for Animations
    var icnClockLine = $('#icn-clock-line');
    var icnClockLineDeg = 180;
    var clockLines = $('.clockline').find('li');
    var clockLines_arr = [];
      for (var i = 0; i < clockLines.length; i++) {
          clockLines_arr.push(clockLines[i]);
      }
    //Time
    var currentTime = 0;
    //States
    var stop = true;
    //Method
    var sWatchMethod ={
      timer: function(){
        var interval = 10;
        time = setInterval(function() {
                  intervalCounter +=interval;
                  if (!stop) {
                   
                    if((intervalCounter%1000)==0){
                      currentTime += 1000;
                      var appendHour = currentTime / (1000 * 60 * 60) | 0; 
                      var appendMinute = currentTime % (1000 * 60 * 60) / (1000 * 60) | 0;
                      var appendSecond = currentTime  % (1000 * 60) / 1000 | 0;
                    
                      appendHour = appendHour < 10 ? "0" + appendHour : appendHour;
                      appendMinute = appendMinute < 10 ? "0" + appendMinute : appendMinute;
                      appendSecond = appendSecond < 10 ? "0" + appendSecond : appendSecond;
                      hour.html(appendHour);
  min.html(appendMinute);
  sec.html(appendSecond);
          
                      }
                    
                    //------
                    
                      var target = $('#clockline li').eq(liNum);
            
                      if(!flip){
                      target.css('background','#339dac');
                      }else{
                        target.css('background','#fff');
                      }
                      
                      liNum += 1;
                      if(liNum>100){
                        liNum=0;
                      }
                      if(liNum ==75){
                        flip =!flip;
                      }
                  }
  
              }, 10); 
      },
      startAndStop: function(){
  
        $('#btn-start-stop .stop-watch').addClass('sw-click');
        setTimeout(function(){
          $('#btn-start-stop .stop-watch').removeClass('sw-click');
        },200);
        stop = !stop;
        if(!stop){
        labelStartStop.html('STOP');
          if(!intervalCounter){
           sWatchMethod.timer();
          }
        }else{ 
       
        labelStartStop.html('START');
        //clearInterval(time);
        //clearInterval(time2);
        }
        
        
        btnReset.css('opacity',1);
        $('.btn-reset .bl-parts').css('transition','transform 0s');
        btnReset.removeClass('br-click');
        setTimeout(function(){
        $('.btn-reset .bl-parts').css('transition','transform 0.5s');
          },200);
      },
      reset: function(){
        if(!stop){
          stop = !stop;
          labelStartStop.html('START');
        }
        clearInterval(time);
        if(intervalCounter){
        currentTime = 0;
        intervalCounter = 0;
        hour.html("00");
        min.html("00");
        sec.html("00");
        liNum = 75;
        flip = false;
        for (var i = 0; i < clockLines.length; i++) {
          $('#clockline li').eq(i).css('background','#fff');
        }
        
        $(this).css('opacity',0.5);
        $(this).addClass('br-click');
        }
      },
      init: function(){
        btnStartStop.on('click',sWatchMethod.startAndStop);
        btnReset.on('click',sWatchMethod.reset); 
      }
    }
    
    $(document).ready(sWatchMethod.init);
    }(jQuery,document,window));