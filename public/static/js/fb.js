(function(){
  // Auth
  var provider = new firebase.auth.OAuthProvider('microsoft.com');
  provider.setCustomParameters({
    // Force re-consent.
    prompt: 'consent',
    // Target specific email with login hint.
    login_hint: 'username@acsians.acsi.edu.sg',
    tenant: '3b2f12de-4d54-490b-908f-dc26b91244dc'
  });

  // UI support function
  function hideShowFade(selectorHide, selectorShow, fadeOutDuration, fadeInDuration){
    $(selectorHide).fadeOut(fadeOutDuration, function(){
      $(selectorHide).addClass("d-none");
      $(selectorShow).removeClass("d-none");
      $(selectorShow).hide().fadeIn(fadeInDuration);
    });
  }

  // initial authUI
  function initAuthUI(isLoggedIn){
    console.log("authUI is called");
    if(isLoggedIn){
      hideShowFade("#landingPage", "#cartPage", 0, 1000);
    }else{
      hideShowFade("#cartPage", "#landingPage", 0, 1000);
    }
  }
  
  // getRedirectResult
  firebase.auth().getRedirectResult().then((result)=>{
    console.log("result", result);
    if(result!= null){
      var credential = result.credential;
      acToken = credential.accessToken;
      var idToken = credential.idToken;
      console.log(credential);
    }else{
      console.log("null result");
    }
  })
  .catch(error=>{
    console.log("getredirectresult error:", error);
  });
  
  // listeners
  function attachListener(user){
    var dbref = firebase.database().ref(`${user.uid}`);
    dbref.on('value', snapshot=>{
      if(snapshot.exists()){
        var start = `
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Time</th>
              <th scope="col">Die-cut Sticker</th>
              <th scope="col">Enamel Pins</th>
            </tr>
          </thead>
        <tbody>`;
        var body = ``;
        var end = `
        </tbody>
        </table>`;
        var i = 0;
        snapshot.forEach(order=>{
          console.log("order:", order.key, order.val());
          ++i;
          v = order.val();
          var t = v["datestring"];
          var [q1, q2] = v["qty"];
          var b = `<tr>
          <th scope="col">${i}</th>
          <td scope="col">${t}</td>
          <td scope="col">${q1}</td>
          <td scope="col">${q2}</td>
          </tr>`;
          console.log(b);
          body += b;
        });
        $("#yourOrdersContainer").html(start + body + end);
        $("#yourOrdersContainer").hide().fadeIn(1000);
      }else{
        s = `<p class="text-center" id="noOrdersText">You have no orders.</p>`
        $("#yourOrdersContainer").html(s);
      }
    })
  }

  // onAuthStateChanged listener
  firebase.auth().onAuthStateChanged(user=>{
    if(user){
      var uid = user.uid;
      console.log("user:", user, "uid: ", uid);
      initAuthUI(true);
      $(".welcomeTitle").each(function(){
        $(this).text(`${user.displayName}`);
      });
      attachListener(user);
    }else{
      initAuthUI(false);
      console.log("not logged in");
    }
  });

  // signIn function
  function signIn(){
    console.log("firebase signIn called");
    firebase.auth().signInWithRedirect(provider);
  }

  // signOut function
  function signOut(){
    console.log("firebase signOut called");
    firebase.auth().signOut().then(()=>{
      console.log('sign out successful');
    }).catch(e=>{
      console.log("firebase signout error:", e);
    })
  }

  // APP CALCULATIONS AND RESPONSIVENESS
  var qty = [0, 0];
  var price = [2, 10];
  var total = 0;

  // reset function
  function reset(){
    qty = [0, 0];
    total = 0;
    // $("#nameInput").val("");
    // $("#classInput").val("");
    $("infoForm").reset();
  }
  // update, calculate and display
  function display(){
    console.log('display called');
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

  // change quantities when minus and plus buttons are clicked, powered by event bubbling
  $("#cartPage").click(function (e) { 
    e.preventDefault();
    if($(e.target).hasClass("minusBtn") || $(e.target).hasClass("plusBtn")){
      itemNo = parseInt($(e.target).attr("data-item"));
      if($(e.target).hasClass("minusBtn")){
        qty[itemNo] = Math.max(0, qty[itemNo]-1);
      }else{
        qty[itemNo] = Math.min(99, qty[itemNo]+1);
      }
      display();
    }
  });

  // navigation button functionalities
  $("#signInBtn1").click(function(e){
    e.preventDefault();
    signIn();
  });
  $("#signOutBtn1, #signOutBtn2").click(function(e){
    e.preventDefault();
    signOut();
  });
  $("#nextToPayment").click(function(e){
    e.preventDefault();
    if(qty.reduce((a, b)=>a+b, 0) == 0){
      alert("Please choose an item!");
    }else{
      console.log('to payment page');
      hideShowFade("#cartPage", "#paymentPage", 500, 500);
      display(); //backup
    }
  });
  $("#backToCart").click(function(e){
    e.preventDefault();
    hideShowFade("#paymentPage", "#cartPage", 500, 500);
    display(); //backup
  });
  $("#viewOrdersBtn").click(function(e){
    e.preventDefault();
    hideShowFade("#endPage", "#cartPage", 500, 500);
    display();
  })

  // BACK-END
  function sendOrder(u, file, total, qty, inputName, inputClass){
    console.log("uploading image to storage...");
    fileExt = file.name.split('.').pop();
    var date = new Date();
    var timestamp = date.getTime();
    console.log(fileExt);
    var uid = u.uid;
    var dpName = u.displayName;
    uploadFileName = `${total}_${qty[0]}stickers_${qty[1]}pins_${dpName}_${inputName}_${inputClass}_${uid}_${timestamp}.${fileExt}`;
    console.log(uploadFileName);

    var storageRef = firebase.storage().ref(`records/${uploadFileName}`);
    var task = storageRef.put(file);
    task.on('state_changed', function progress(snapshot) {
    }, function error(err) {
      alert("There was an error with the upload process, please try again.");
    },function complete() {
      console.log('upload image completed');
      uploadRecordsToRTDB(u, date, total, qty, inputName, inputClass);
    });
  }

  function uploadRecordsToRTDB(u, date, total, qty, inputName, inputClass){
    var db = firebase.database();
    var dateString = date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    console.log("datestring:", dateString);
    var order = {
      sysname: u.displayName,
      total: total,
      qty: qty,
      inputname: inputName,
      inputclass: inputClass,
      datestring: dateString,
    }
    console.log("order:", order);
    var updates = {};
    updates[`/${u.uid}/` + date.getTime()] = order;
    console.log("updates", updates);
    
    db.ref().update(updates, function(error){
      if(error){
        alert("There was an error with the upload process, please try again.");
      }else{
        console.log("upload records completed");
      }
    });
  }
  $("#infoForm").submit(function(e){
    e.preventDefault();
    if(firebase.auth().currentUser){
      var u = firebase.auth().currentUser;
      // authenticated therefore authorized
      console.log("begin uploading process");
      var file = document.getElementById("receiptUpload").files[0];
      if(!file.name.match(/.(jpg|jpeg|png|gif)$/i)){
        // check type is image
        alert("Please upload an image!");
      }else{
        inputName = $("#nameInput").val();
        inputClass = $("#classInput").val();
        console.log("sent order");
        sendOrder(u, file, total, qty, inputName, inputClass);
        hideShowFade("#paymentPage", "#endPage", 500, 500);
        display();
        reset();
        // TO-DO: check progress
      }
    }else{
      alert("You are not logged in. Please log in and try again.")
    }
  });
})();