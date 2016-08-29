// JavaScript Document
var isLoaded = false;
var isWaiting = false;
var impendingObj = '';
var AuthKey = '';
var editing = 0;
$(function(){
	$('#submit').on('click',function(e){
		if($('#username').val() == '' || $('#password').val() == ''){
		}
		else{
			document.getElementById('submit').disabled = true;
			document.getElementById('submit').innerHTML ="<span style='text-transform:lowercase'>working <i class='fa fa-spinner fa-spin'></i></span>";
			params = {username:$('#username').val(), passkey:$('#password').val()};
			$.post('/signum',params,function(data){
				if(data === "Okay"){
					location.replace('/');
				}
				else{
					$('#cont').html(data);
					document.getElementById('submit').disabled = false;
					document.getElementById('submit').innerHTML ="Sign in";
				}
			});
		}
	});
});

$(document).ready(function(){
  $("#jilla").click(function(){
	$("#shakeF").slideToggle("slow");
	if(!isLoaded){
		
	}
  });
});

$(document).ready(function(){
  $("#createI").click(function(){
	title = $("#title").val();
	details = simplemde.value();
	un = $("#creator").val();
	privacy = $("#privacy").val();
	cat = $("#categories").val();
	if(title === '' || title.length < 5 || details.length < 10 || un === ''){
		$("#warning").html("one or more field is not in valid state");
		$("#success").html("");
	}
	else{
		$("#warning").html("");
		document.getElementById('createI').disabled = true;
		document.getElementById('createI').innerHTML ="<i class='fa fa-spinner fa-spin'></i> a moment";
		params = {user:un, tit:title, det:details, privaty:privacy, cat : cat};
		$.post('/addidea',params,function(data){
				if(data === "Okay"){
					document.getElementById('createI').disabled = false;
					document.getElementById('createI').innerHTML ="Upload content";
					simplemde.value("");
					$("#title").val()
					$("#success").html(" <i class='fa fa-check-square-o'></i> Your Idea was posted succesfully ");
				}
				else{
					$("#warning").html(data);
					document.getElementById('createI').disabled = false;
					document.getElementById('createI').innerHTML ="Upload content";
				}
				alert(data);
			});
	}
  });
});


$(document).ready(function(){
  $("#private").click(function(){
	$("#privacy").val(0);
	$("#public").attr('class', 'btn btn-sm btn-default');
	$("#private").attr('class', 'btn btn-sm btn-success');
  });
});
$(document).ready(function(){
  $("#public").click(function(){
	$("#privacy").val(1);
	$("#private").attr('class', 'btn btn-sm btn-default');
	$("#public").attr('class', 'btn btn-sm btn-success');
  });
});
function reveal(id){
	$(document).ready(function(){
	$("#"+id).slideToggle("slow");
});
}
function vote(great, id){
	if(great){
		$("#thumbneg"+id).html('<i class="fa fa-thumbs-o-down"></i>');
		$("#thumbpos"+id).html('<i class="fa fa-thumbs-up"></i>');
	}
	else{
		$("#thumbpos"+id).html('<i class="fa fa-thumbs-o-up"></i>');
		$("#thumbneg"+id).html('<i class="fa fa-thumbs-down"></i>');
	}
	$("#vdown"+id).html('<i class="fa fa-spinner fa-spin"></i>');
	$("#vup"+id).html('<i class="fa fa-spinner fa-spin"></i>');
	params = {idea_id:id, isGreat:great};
	$.post('/voteidea',params,function(data){
				if(data !== ""){
					vals = data.split(',');
					$("#vdown"+id).html(vals[0]);
					$("#vup"+id).html(vals[1]);
				}
				else{
				}
			});
}
function cvote(great, id){
	$("#cvh"+id).html('<i class="fa fa-spinner fa-spin"></i>');
	$("#cvu"+id).html('<i class="fa fa-spinner fa-spin"></i>');
	params = {comment_id:id, isGreat:great};
	$.post('/voteComment',params,function(data){
				if(data !== ""){
					vals = data.split(',');
					$("#cvh"+id).html(vals[0]);
					$("#cvu"+id).html(vals[1]);
				}
				else{
				}
			});
}
function fetchcomment(id, keep){
	if(keep){
		$("#commentplace"+id).slideToggle("slow");
		$("#commentplace"+id).slideToggle("slow");
	}
	else{
		$("#commentplace"+id).slideToggle("slow");
	}
	document.getElementById("tarea"+id).focus();
	param = {ide : id, j :id};
	$.post('getComment', param, function(data){
		$("#userc"+id).html(data);
	})
}
function addcomment(ID){
	comment = $("#tarea"+ID).val();
	if(comment.length > 1){
	this.diabaled = true;
	params = {idea_id:ID, comment:comment};
	$.post('/addcomment',params,function(data){
				if(data === "Okay"){
					$("#tarea"+ID).val("");
					fetchcomment(ID, true);
				}
				else{
				}
		});
	}
	else{
	}
}
function delpost(id, k){
	j = confirm("Do you realy wish to remove this post?");
	if(j){
		if(typeof k === 'string'){
			params = {key: k, delId: id};
			$.post('/delete',params,function(data){
				if(data === "Okay"){
					$("#jashCont"+id).remove();
				}
				else{
				}
		});
		}
		else{
			alert(typeof k);
		}
	}
	else{
	}
}
function turn(type, obj, auth, editin){
	if(	isWaiting){
		//alert('Kindly finish editing the current field then doubleClick to save');
		/*if(type === 0 && obj !== '' && obj.length > 5){
			
		}
		else{
			alert('Kindly finish editing the current field then doubleClick to save. And please you cannot leave any field empty');
			alert(type);
		}*/
	}
	else{
		if(type == 'textarea'){
			obj.innerHTML = "<textarea id='details' style='width:100%; font-size:14px; font-weight:light; padding:6px;' class='form-control' onDblClick='uploadto( 1 , this)'>"+obj.innerHTML+"<textarea>";
				isWaiting = true;
				//alert(auth)
				impendingObj = obj;
				AuthKey = auth;
				editing = editin;
		}
		else{
			obj.innerHTML = "<input id='title' type='text' value ='"+obj.innerHTML+"' style='width:100%; font-size:14px; font-weight:light; padding:6px;' class='form-control' onDblClick='uploadto( 0 , this)'>";
				isWaiting = true;
				alert(auth)
				impendingObj = obj;
				AuthKey = auth;
				editing = editin;
		}
	}
}
function uploadto(type, obj){
	if(AuthKey === '' || editing === 0){
		alert('Authentication Breach occurred. Reloading this page up signing in again helps');
	}
	else{
		if(isWaiting){
			if(type === 0 || type ===1 && obj.value !== '' && obj.value.length > 5){
				obj.disabled = true;
				newD = escapeUnsafe(obj.value);
				params = {key: AuthKey, pid: editing, ty:type, newData:newD};
				$.post('/updateIdea',params,function(data){
					if(data === "Okay"){
						//$("#jashCont"+id).remove();
						impendingObj.innerHTML = newD;
						editing = 0;
						impendingObject = '';
						isWaiting = false;
					}
					else{
						alert(data);
					}
				});
			}
			else{
				alert('Kindly finish editing the current field then doubleClick to save. And please you cannot leave any field empty');
				//alert(type);
			}
		}
	}
}
function escapeUnsafe(unsafe){
	return unsafe
	.replace(/&/g, "&amp;")
	.replace(/</g, "&lt;")
	.replace(/>/g, "&gt;")
	.replace(/"/g, "&quot;")
	.replace(/'/,"&sbquo;");
}
function edit(){
	alert("To use edit. Click on the field you wish to edit and double click when you are done.");
}
function priva(t, id, key, obj){
	if(obj.className === "btn btn-success"){
		alert('conflict')
	}
	else{
		//alert(obj.className);
		params = {key: key, pid: id, ty:t};
		$.post('/updatepriv',params,function(data){
			if(data === "Okay"){
				if(obj.id === "public"+id){
					obj.className = 'btn btn-success';
					document.getElementById("lock"+id).className = 'btn btn-default';
				}
				else{
					obj.className = 'btn btn-success';
					document.getElementById("public"+id).className = 'btn btn-default';
				}
			}
			else{
				alert(data);
			}
		});
	}
}
var cards = [];
function setcard(id){
	sentC = document.getElementById("check"+id);
	if(sentC.className == 'fa fa-check-square-o selected'){
		popThis(id);
		sentC.className = 'fa fa-check-square-o';
	}
	else{
		cards.push(id);
		sentC.className = 'fa fa-check-square-o selected';
	}
	//alert(cards);
}
function initcard(card){
	card = card.split(',');
	if(card.length < 1){
	}
	else{
		cards = card;
	}
	//alert(cards);
}
function popThis(val){
	ncard = [];
	start = 0;
	while(start < cards.length){
		if(cards[start] === val){
		}
		else{
			ncard.push(cards[start]);
		}
		start++;
	}
	cards = ncard;
}
function updateCards(user, key, el){
	newCards = cards.toString();
	params = {key: key, user: user, ncards:newCards};
	el.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Please wait";
		$.post('/updatecards',params,function(data){
			if(data === "Okay"){
				el.innerHTML = "<i class='fa fa-check'></i> Change was made";
				el.className = "btn btn-success";
			}
			else{
				alert(data);
			}
		});
}
function setIm(src, user, key){
	document.getElementById("setIM").innerHTML = "<i class='fa fa-spinner fa-spin fa-2x'></i>";
	params = {key: key, user: user, avatar:src};
	$.post('/updateavatar',params,function(data){
		if(data === "Okay"){
			document.getElementById("setIM").innerHTML = "<img src='"+src+"' />";
		}
		else{
			alert(data);
		}
	});
}