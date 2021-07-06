var db = firebase.database();
function sendOrder(date, qty, total, inputName, inputClass){
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
    // sysname: fullName,
    sysclass: office,
    quantity: qty,
    datestring: dateString,
    totalprice: total,
    inputname: inputName,
    inputclass: inputClass,
  }
  console.log("order:", order);
  var updates = {};
  updates[`/${fullName}/` + date.getTime()] = order;
  console.log("updates", updates);
  return db.ref().update(updates, function(error){
    console.log(error);
  });
}