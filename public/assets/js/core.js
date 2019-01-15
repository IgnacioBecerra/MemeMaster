// Initialize Firebase
var config = {
    apiKey: "AIzaSyA4B8e1CETSVPZY2v9_lmdfDK7pXq8NbOw",
    authDomain: "mememaster-9b27a.firebaseapp.com",
    databaseURL: "https://mememaster-9b27a.firebaseio.com",
    projectId: "mememaster-9b27a",
    storageBucket: "mememaster-9b27a.appspot.com",
    messagingSenderId: "825635617975"
};

var defaultApp = firebase.initializeApp(config);
const firestore = firebase.firestore();
var storage = firebase.storage();
var storageRef = storage.ref();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);
var db = firebase.firestore();



function logOut() {
	firebase.auth().signOut().then(function() {
	  console.log("logged out");
	  window.location = './index.html';
	}, function(error) {
	  // An error happened.
	});
}


/* Code for library.htmkl */
if(document.body.id === 'library') {


    window.onload = function() {

    	 /* LOGOUT FUNCTION
            
            */

    	firebase.auth().onAuthStateChanged(function(user) {
    	    if (user) {
    	        var triangle = String.fromCharCode(9662);
    	        document.getElementById('profile').text = user.email + triangle;
    	        // ...
    	    } else {
    	        window.location = './signup.html';
    	    }
    	});

        var source = document.getElementById("results-template").innerHTML;
        var template = Handlebars.compile(source);

        var parentDiv = document.getElementsByClassName('meme-grid')[0];

      firebase.auth().onAuthStateChanged(user => {
          if(user) {
            console.log("logged in");

            var name = '';

            // Gets a snap of all the documents; done to get size
            db.collection(firebase.auth().currentUser.email).get().then(snap => {
                name = snap.size.toString();

                // display no memes message
                if(name === 0) {
                	document.getElementById('nomemes').style.display= '';
                }

                db.collection(firebase.auth().currentUser.email).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        var curHtml = template(doc.data());
                        
                        let box = document.createElement('div');
                        box.innerHTML = curHtml;
                        parentDiv.append(box);
                    });
                });
            });
          }
        });
    };
}


if(document.body.id === 'signup') {
	function addUser() {
	    
	    var email = document.getElementById('email').value;
	    var password = document.getElementById('password').value;
	    var confirm_password = document.getElementById("confirm_password").value;

	    if(password != confirm_password) {
	        alert("Passwords Don't Match");
	        return;
	    } 
	    
	
	    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
	        var errorCode = error.code;
	        var errorMessage = error.message;
	        if (errorCode == 'auth/weak-password') {
	          alert('The password is too weak.');
	        } else {
	          alert(errorMessage);
	        }
	        console.log(error);

	    });

	    firebase.auth().onAuthStateChanged(user => {
	      if(user) {
	        window.location = './library.html'; //After successful login, user will be redirected to home.html
	      }
	    });
	}
}

if(document.body.id === 'login') {
    function login() {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("signed in");
                window.location = './library.html'
                // ...
            } else {
                // User is signed out.
                // ...
            }
        });
    }
}

if(document.body.id === 'createNew1') {

	/* Load if localStorage has something saved from earlier */
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	  	var triangle = String.fromCharCode(9662);
	  	document.getElementById('profile').text = user.email + triangle;


	  	// load image from library to canvas
	    if(localStorage.getItem('name')) {
	    	let name = localStorage.getItem('name');

	    	// Load image that needs to be edited
	    	db.collection(firebase.auth().currentUser.email).doc(name.toString()).get().then(function(doc) {
	    		canvas.clear();

	    		// load cnavas from json
	    	    canvas.loadFromJSON(doc.data().jsonImage, function() {
	    	    	let box = 1;

	    	    	canvas.forEachObject(function(obj){

	    	    		// load image and set previous properties
	    	    		if(obj.type === 'image') {
	    	    			obj.scaleToHeight(400);
	    	    			obj.scaleToWidth(400);
	    	    			if(obj.height > canvas.height) {

	    	    			    let newHeight = (400*obj.height)/obj.width;
	    	    			    canvas.setHeight(newHeight);
	    	    			    text2.top = newHeight*0.80;
	    	    			}
	    	    			obj.lockMovementX = true;
	    	    			obj.lockMovementY = true;
	    	    			obj.lockScalingX = true;
	    	    			obj.lockScalingY = true;
	    	    			obj.lockRotation = true;
	    	    			obj.selectable = false;
	    	    			canvas.hoverCursor = 'defaultCursor';

	    	    			// link text boxes 1 and 2 to input boxes
	    	    		} else if(obj.type === 'textbox' && box === 1) {
	    	    			text1 = obj;
	    	    			document.getElementById('cardalltexthex1').value = obj.text;
	    	    			document.getElementById('cardalltexthex1').setAttribute('data-text', obj.text);
	    	    			box++;
	    	    		} else if(obj.type === 'textbox' && box === 2) {
	    	    			document.getElementById('cardalltexthex2').value = obj.text;
	    	    			document.getElementById('cardalltexthex2').setAttribute('data-text', obj.text);
	    	    		}
	    	    	});
	    	       canvas.renderAll();
	    	    })

	    	    document.getElementById('keywordTag').value = doc.data().tag;
	    	    document.getElementById('editCheck').innerHTML = name.toString();
	    	});

	    } else {
	    	document.getElementById('editCheck').innerHTML = 'false';
	    	canvasClear();
	    }
	  } else {
	    // User is signed out.
	    // ...
	  }
	});


	function changeColor(e, id) {
	    let col = '#' + e;

	    if(id === 1) {
	        text1.set({fill: col});
	        canvas.remove(text1);
	        canvas.add(text1);
	    } else if(id === 2) {
	        canvas.remove(text2);
	        text2.set({fill: col});
	        canvas.add(text2);
	    }

	    if(id === 1.5) {
	        text1.set({stroke: col});
	        canvas.remove(text1);
	        canvas.add(text1);
	    } else if(id === 2.5) {
	        canvas.remove(text2);
	        text2.set({stroke: col});
	        canvas.add(text2);
	    }
	}

	function canvasClear() {
	    canvas.clear();
	    document.getElementById("file").value = null;

	    document.getElementById("file").value = null;
	    document.getElementById('cardalltexthex1').value = 'text1';
	    document.getElementById('cardalltexthex2').value = 'text2';
	     document.getElementById('keywordTag').value = '';

	    document.getElementById('cardalltexthex1').setAttribute('data-text', 'TEXT1');
	    document.getElementById('cardalltexthex2').setAttribute('data-text', 'TEXT2');

	    text1.text = 'TEXT1';
	    text2.text = 'TEXT2';
	}

	var canvas = new fabric.Canvas('canvas');
	canvas.selection = false;
	canvas.forEachObject(function(o) {
	    o.selectable = false;
	});

	var text1 = new fabric.Textbox("Text", {
	    width: 400,
	    fixedWidth: 400,
	    id: "cardalltexthex1",
	    fontFamily: "Impact",
	    fontSize: 40,
	    left: 0,
	    top: 10,
	    text: "TEXT1",
	    fill: 'white',
	    stroke: 'black',
	    strokeWidth : 2,
	    textAlign: 'center',
	    editable: false
	});

	var text2 = new fabric.Textbox("Text", {
	    width: 400,
	    fixedWidth: 400,
	    id: "cardalltexthex2",
	    fontFamily: "Impact",
	    fontSize: 40,
	    left: 0,
	    top: 425,
	    text: "TEXT2",
	    fill: 'white',
	    stroke: 'black',
	    strokeWidth: 2,
	    textAlign: 'center',
	    editable: false
	});



	document.getElementById('file').addEventListener("change", function (e) {
	    canvas.clear();
	    var file = e.target.files[0];
	    var reader = new FileReader();

	    reader.onload = function (f) {
	        var data = f.target.result;                    
	        fabric.Image.fromURL(data, function (img) {
	            var oImg = img.set({left: 0, top: 0, angle: 0});
	            oImg.scaleToHeight(400);
	            oImg.scaleToWidth(400);
	            if(oImg.height > canvas.height) {

	                let newHeight = (400*oImg.height)/oImg.width;
	                canvas.setHeight(newHeight);
	                text2.top = newHeight*0.80;
	                canvas.add(text2);
	            }
	            oImg.lockMovementX = true;
	            oImg.lockMovementY = true;
	            oImg.lockScalingX = true;
	            oImg.lockScalingY = true;
	            oImg.lockRotation = true;
	            oImg.selectable = false;
	            canvas.hoverCursor = 'defaultCursor'
	            canvas.add(oImg).sendToBack(oImg).renderAll();
	        });
	    };
	    reader.readAsDataURL(file);
	    canvas.add(text1);
	    canvas.add(text2);
	    canvas.renderAll();

	});

	$('.input').on('keyup', function() {
	    id = $(this).attr('id');
	    val = $(this).attr('data-text');
	    newtext = $(this).val();
	    input = $(this);

	    var objs = canvas.getObjects();
	    objs.forEach(function(obj) {
	        if (obj && obj.text == val) {
	            obj.text = newtext.toUpperCase();
	            input.attr("data-text", newtext.toUpperCase());
	            canvas.renderAll();
	        }
	    });
	});

	var link = document.createElement('a');
	link.id = 'link';
	link.addEventListener('click', function(ev) {
	    link.href = canvas.toDataURL('image/png');
	    console.log(link.href);
	    link.download = "mypainting.png";
	}, false);
	document.getElementById("downloadImageID").appendChild(link);

	var but = document.createElement('button');
	but.innerHTML = "Download Image";
	document.getElementById('link').appendChild(but)

	function processImage() {

		if(document.getElementById('editCheck').innerHTML != 'false') {

			let editableCanvas = JSON.stringify(canvas);
	    	let flatImg = canvas.toDataURL('image/png');
	    	var keyword = document.getElementById("keywordTag").value;
			var n = document.getElementById('editCheck').innerHTML;


			db.collection(firebase.auth().currentUser.email).get().then(snap => {
		        db.collection(firebase.auth().currentUser.email).doc(n).set({
		            jsonImage: editableCanvas,
		            imgURL: flatImg,
		            index: n,
	                tag: keyword
		        });
	    	});
	    	localStorage.clear();
        
       		setTimeout(function() {
	    		window.location = './library.html';
	    	}, 2000);
	    	return;
		}

	    var blank = document.createElement('canvas');
	    blank.width = canvas.width;
	    blank.height = canvas.height;

	    // if canvas is empty
		if(canvas.toDataURL() == blank.toDataURL()) {

			if(document.getElementById('file').value === "") {
				alert("Please add a picture.");
				return;
			}
		}

		if(document.getElementById('keywordTag').value === "") {
			alert("Please add a keyword.");
			return;
		}

	    canvas.forEachObject(function(obj){
	        obj.sourcePath = '/URL/FILE.svg';
	        console.log(obj.sourcePath)
	    });

	    let editableCanvas = JSON.stringify(canvas);
	    let flatImg = canvas.toDataURL('image/png');
	    var name;
        var keyword = document.getElementById("keywordTag").value;

	    db.collection(firebase.auth().currentUser.email).get().then(snap => {
	        name = snap.size.toString();
	        db.collection(firebase.auth().currentUser.email).doc(name).set({
	            jsonImage: editableCanvas,
	            imgURL: flatImg,
	            index: name,
                tag: keyword
	        });

	        firebase.storage().ref().child(firebase.auth().currentUser.email + '/' + name).putString(flatImg, 'data_url');
	    });

	    localStorage.clear();
        
        
        setTimeout(function() {
	    			window.location = './library.html';
	    		}, 2000);
	}   
}


// Edit: saves name to localStorage, and opens canvas edit
function editPicture(name) {

    localStorage.setItem('name', name);
    window.location = './create_new.html'
}


function deletePicture(name) {
	var c = confirm("Would you like to delete this meme?");

	if(c === false) {
		return;
	}

	db.collection(firebase.auth().currentUser.email).doc(name.toString()).delete();
	document.getElementById('memeBox'+ name.toString()).outerHTML = '';
	setTimeout(function() {
	    			window.location = './library.html';
	    		}, 2000);
}

function sharePicture(name) {
	firebase.storage().ref().child(firebase.auth().currentUser.email + '/' + name.toString()).getDownloadURL().then(function(url) {
		
		document.getElementById('imageURL').href = url;
		document.getElementById('imageURL').target = '_blank';
		document.getElementById('shareBox').style.display = '';
		
		document.getElementById('emailShare').href = 'mailto:' + url;

		document.getElementById('fb-share').href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
		document.getElementById('twitter-share').href = 'https://twitter.com/share?url=' + encodeURIComponent(url);

        }).catch(function(error) {
          // Handle any errors here
    });
}

function closeShare() {
	document.getElementById('shareBox').style.display = 'none';
}

function searchMemes() {
	var searchTerms = document.getElementById('searchbar').value;
	var source = document.getElementById("results-template").innerHTML;
	var template = Handlebars.compile(source);

	var parentDiv = document.getElementsByClassName('meme-grid')[0];

	db.collection(firebase.auth().currentUser.email).get().then(function(querySnapshot) {
	    
		parentDiv.innerHTML = '';
	    querySnapshot.forEach(function(doc) {



	    	if(doc.data().tag.split(",").includes(searchTerms)) {

	    		var curHtml = template(doc.data());
	    		
	    		let box = document.createElement('div');
	    		box.innerHTML = curHtml;
	    		parentDiv.append(box);
	    	}
	       
	    });
	});
}

if(document.body.id === 'importMeme') {
	var canvas = new fabric.Canvas('canvas');
	canvas.selection = false;

	canvas.forEachObject(function(o) {
	    o.selectable = false;
	});



	document.getElementById('file').addEventListener("change", function (e) {
	    canvas.clear();
	    var file = e.target.files[0];
	    var reader = new FileReader();

	    reader.onload = function (f) {
	        var data = f.target.result;                    
	        fabric.Image.fromURL(data, function (img) {
	            var oImg = img.set({left: 0, top: 0, angle: 0});
	            oImg.scaleToHeight(400);
	            oImg.scaleToWidth(400);
	            if(oImg.height > canvas.height) {

	                let newHeight = (400*oImg.height)/oImg.width;
	                canvas.setHeight(newHeight);
	            }
	            oImg.lockMovementX = true;
	            oImg.lockMovementY = true;
	            oImg.lockScalingX = true;
	            oImg.lockScalingY = true;
	            oImg.lockRotation = true;
	            oImg.selectable = false;
	            canvas.hoverCursor = 'defaultCursor'
	            canvas.add(oImg).sendToBack(oImg).renderAll();
	        });
	    };
	    reader.readAsDataURL(file);
	    canvas.renderAll();

	});

	function saveOldMeme() {
	    var blank = document.createElement('canvas');
	    blank.width = canvas.width;
	    blank.height = canvas.height;

	    // if canvas is empty
		if(canvas.toDataURL() == blank.toDataURL()) {

			if(document.getElementById('file').value === "") {
				alert("Please add a picture.");
				return;
			}
		}

		if(document.getElementById('keywordTag').value === "") {
			alert("Please add a keyword.");
			return;
		}

		let editableCanvas = JSON.stringify(canvas);
    	let flatImg = canvas.toDataURL('image/png');
    	var keyword = document.getElementById("keywordTag").value;
		var name;


		db.collection(firebase.auth().currentUser.email).get().then(snap => {
			name = snap.size.toString();
	        db.collection(firebase.auth().currentUser.email).doc(name).set({
	            jsonImage: editableCanvas,
	            imgURL: flatImg,
	            index: name,
                tag: keyword
	        });
    	});

   		setTimeout(function() {
    		window.location = './library.html';
    	}, 2500);
	}
}

if(document.body.id === 'index') {
	firebase.auth().onAuthStateChanged(function(user) {
	    if (user) {
	    	console.log("asad");
	        window.location = './library.html';
	        // ...
	    }
	});
}

