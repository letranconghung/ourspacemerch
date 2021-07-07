let fullName = "";
let office = "";

function authUI(isLoggedIn){
    if(isLoggedIn){
        $("#cartPage").removeClass("d-none");
        $("#landingPage").addClass("d-none");
    }else{
        $("#landingPage").removeClass("d-none");
        $("#cartPage").addClass("d-none");
    }
}

function handleSignInData(account){
    console.log("handleSignInData called");
    $(".welcomeTitle").each(function(){
        $(this).text(`${account.name}`);
    });
    fullName = account.name;
    seeProfile();
}

function handleGraphData(data, endpoint) {
    console.log("handleGraphData called");
    console.log('Graph API responded at: ' + new Date().toString());
    if (endpoint === graphConfig.graphMeEndpoint) {
        console.log('reach graphMeEndpoint');
        console.log(data);
        office = data.officeLocation;
        console.log(`class: ${office}`);
    } else{
        console.log('mail endpoint');
    }
}
