function upload(file, total, qty, inputName, inputClass){
  console.log("upload file called");
  fileExt = file.name.split('.').pop();
  var date = new Date();
  var timestamp = date.getTime();
  console.log(fileExt);
  uploadFileName = `${timestamp}_${total}$_${qty[0]}stickers_${qty[1]}pins_${fullName}_${office}_${inputName}_${inputClass}.${fileExt}`;
  console.log(uploadFileName);


  console.log("file:", file);
  var xhr = new XMLHttpRequest();
  // var uploadURL = `https://graph.microsoft.com/v1.0/me/drive/root:/ourspacemerchdata/${uploadFileName}:/content`;
  var uploadURL = `https://graph.microsoft.com/v1.0/users/67fca77d-969b-4e7a-9bc9-97fb0b34fe46/drive/items/root:/ourspacemerchdata/${uploadFileName}:/content`
  xhr.open("PUT", uploadURL, true);
  xhr.setRequestHeader('Authorization', bt);
  xhr.setRequestHeader('Content-Type', file.type);
  xhr.onreadystatechange = function(ev){
    if (xhr.readyState === 4){
      console.log(xhr.responseText);
    }
  };
  xhr.send(file);
  
  // xhr.onreadystatechange = function(){
  //   if(xhr.readyState == XMLHttpRequest.DONE){
  //     console.log(xhr.response);
  //   }
  // }
  // xhr.open("GET", "https://graph.microsoft.com/v1.0/me/drive/sharedWithMe", true);
  // xhr.setRequestHeader('Authorization', bt);
  // xhr.send();
}