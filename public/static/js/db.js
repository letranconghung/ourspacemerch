function upload(file, total, qty, inputName, inputClass){
  fileExt = file.name.split('.').pop();
  console.log(fileExt);
  uploadFileName = `${total}$_${qty[0]}stickers_${qty[1]}pins_${fullName}_${office}_${inputName}_${inputClass}.${fileExt}`;
  console.log(uploadFileName);
  var storageRef = firebase.storage().ref(`records/${uploadFileName}`);
  var task = storageRef.put(file);
  task.on('state_changed', function progress(snapshot) {
    var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
    document.getElementById("uploader").value = percentage;
  }, function error(err) {
    alert("There was an error with the upload process, please try again.");
  },function complete() {
    console.log('upload completed');
  });
}