var lang = {
    "html": "95%",
    "css": "90%",
    "javascript": "100%",
    "php": "96%",
    
  };
  
  var multiply = 4;
  
  $.each( lang, function( language, pourcent) {
  
    var delay = 700;
    
    setTimeout(function() {
      $('#'+language+'-pourcent').html(pourcent);
    },delay*multiply);
    
    multiply++;
  
  });