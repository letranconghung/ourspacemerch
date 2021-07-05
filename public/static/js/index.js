qty = [0, 0];
price = [2, 10];
total = 0;
function display(){
  $(".qtyText").each(function(){
    itemNo = parseInt($(this).attr("data-item"));
    $(this).text(qty[itemNo]);
  });
  total = 0;
  $(".subTotalText").each(function(){
    itemNo = parseInt($(this).attr("data-item"));
    subTotal = qty[itemNo] * price[itemNo];
    total += subTotal;
    $(this).text(`$${subTotal}`);
  });
  $("#total").text(`$${total}`);
  $("#paymentTotalText").text(`Total: $${total}`);
}
display();
$("#cartPage").click(function (e) { 
  e.preventDefault();
  if($(e.target).hasClass("minusBtn") || $(e.target).hasClass("plusBtn")){
    itemNo = parseInt($(e.target).attr("data-item"));
    console.log(itemNo);
    if($(e.target).hasClass("minusBtn")){
      qty[itemNo] = Math.max(0, qty[itemNo]-1);
    }else{
      qty[itemNo] = Math.min(99, qty[itemNo]+1);
    }
    display();
  }
});

$("#nextToPayment").click(function(e){
  e.preventDefault();
  console.log('clickked');
  if(qty.reduce((a, b)=>a+b, 0) == 0){
    alert("Please choose an item!");
  }else{
    console.log('to payment page');
    $("#cartPage").fadeOut(500, function(){
      $("#cartPage").addClass("d-none");
      $("#paymentPage").removeClass("d-none");
      $("#paymentPage").hide().fadeIn(500, function(){});
    });
    display();
  }
});

$("#backToCart").click(function(e){
  e.preventDefault();
  $("#paymentPage").fadeOut(500, function(){
    $("#paymentPage").addClass("d-none");
    $("#cartPage").removeClass("d-none");
    $("#cartPage").hide().fadeIn(500, function(){});
  });
});

$("#infoForm").submit(function(e){
  e.preventDefault();
  console.log("submitted");
  var file = document.getElementById("receiptUpload").files[0];
  console.log(file.name);
  if(!file.name.match(/.(jpg|jpeg|png|gif)$/i)){
    alert("Please upload an image!");
  }else{
    $("#paymentPage").fadeOut(500, function(){
      $("#paymentPage").addClass("d-none");
      $("#endPage").removeClass("d-none");
      $("#endPage").hide().fadeIn(500, function(){});
    });
    inputName = $("#nameInput").val();
    inputClass = $("#classInput").val();
    console.log(inputName, inputClass);
    upload(file, total, qty, inputName, inputClass);
  }
});