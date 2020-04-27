var myPort = browser.runtime.connect({name:"port-from-cs"});
var tabidis = 0;
myPort.postMessage({greeting: window.location.hostname});
myPort.onMessage.addListener(function(m) {
  tabidis = m.tabid;
  // alert("reçut : " +m.tabid);
});


var waitForEl = function(selector, callback, count) {
  if (jQuery(selector).length) {
    callback();
  } else {
    setTimeout(function() {
      if(!count) {
        count=0;
      }
      count++;
      console.log("github version count: " + count);
      if(count<10) {
        waitForEl(selector,callback,count);
      } else {
        // myPort.postMessage({close: true});
        myPort.postMessage({greeting: "selctor not found !"});

        return;
      }
    }, 1000);
  }
};

var selector = $('div[id="CenterPanel"]');

waitForEl(selector, function() {
  // work the magic
  // var titre = "OKKKKK : " + $(document).find("title").text();
  // myPort.postMessage({greeting: titre});
  // myPort.postMessage({data: titre});
  //
  $('li[class="sresult lvresult clearfix li"]').eq(0).each(function(i, elem) {
      	var countprix = $(this).find('li[class="lvprice prc"]').length;

        var image = $(this).find('img[class="img"]').attr('src');
	      console.log("img url : " + image);

      	var name = $(this).find('a[class="vip"]').attr('title');
        name = name.substring(36);
      	console.log("Nom : " + name);

      	var prix = $.trim($(this).find('li[class="lvprice prc"]').eq(0).text());
      	console.log("Prix (enchère) : " + prix);

      	if(countprix > 1){
      		var priximm = $.trim($(this).find('li[class="lvprice prc"]').eq(1).text());
      		console.log("Prix (Achat immédiat) : " + priximm);
      	}

      	if($(this).find('span[class="fee"]').length){
      		var livraison = $.trim($(this).find('span[class="fee"]').text());
      		console.log("LIVRAISON : " + livraison);
      	}
      	else{
      		var livraison = $.trim($(this).find('span[class="bfsp"]').text());
      		console.log("LIVRAISON : " + livraison);
      	}
        var link = $(this).find('a[class="vip"]').attr('href');

        // Clean LINK //

        // const regex = /([^?]+)//g;
        var regex = new RegExp("([^?]+)","g");
        var myarray = link.match(regex);
        link = myarray[0];
        console.log("Lien (sans la fin) : " + link);

        //extract id link //

        // const regex2 = /\d{12,12}//g;
        var regex2 = new RegExp("\d{12,12}","g");
        var myarray2 = link.match(regex2);
        var id = myarray2[0];
        console.log("ID : " + id);

        var text = '{ "dataebay" : [' +
        '{ "id":"'+ id +'" , "nom":"'+ name +'" , "prix1":"'+ prix +'", "prix2":"'+ priximm +'", "livraison":"'+ livraison +'" , "lien":"'+ link +'" }' +
        ']}';

        var newdata = {
          "id": id,
          "titre": name,
          "prix1": prix,
          "prix2": priximm,
          "livraison": livraison,
          "lien": link,
          "image": image
        };

        myPort.postMessage({savedata: newdata });
        myPort.postMessage({close: id });
  });



  alert("v3.0");

});
