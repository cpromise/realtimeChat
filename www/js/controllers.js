angular.module('starter.controllers', ['firebase'])



.controller('ChatsCtrl', ['$scope', '$firebase', '$rootScope', '$localstorage',
	function( $scope, $firebase, $rootScope, $localstorage){
		//firebase1탄에서 만들었던 본인의 계정을 입력해주세요
		var ref = new Firebase('http://rhammer2.firebaseio.com/');

		//firebase 서버와 동기화를 합니다.
		var sync = $firebase(ref);

		//서버에 저장된 데이터를 동기적으로 담아줄 배열선언. 세부내용은 Firebase API참조!
		$scope.chats = sync.$asArray();

		//채팅에서 전송을 하면 실행될 메소드
		$scope.sendChat = function(chat){
			if($localstorage.get("authData")){
				var authData = $localstorage.getObject("authData");

				//페이스북으로 로그인한 경우
				if(authData.loginType == "facebook"){
					$scope.chats.$add({
						user: authData.facebook.displayName,
						message: chat.message,
						img: authData.facebook.profileImageURL
					});
					
					//채팅내용을 전송하면 채팅창 비워줘야겠죠? 채팅메시지를 빈문자열로 초기화
					chat.message = "";									
				}

				//이메일인증으로 로그인한 경우
				else if(authData.loginType == "email"){
					$scope.chats.$add({
						user: authData.password.email,
						message: chat.message,
						img: ""
					});
					
					//채팅내용을 전송하면 채팅창 비워줘야겠죠? 채팅메시지를 빈문자열로 초기화
					chat.message = "";
				}
			}
			else{
				alert("You need to login");
			}

		}

		//카메라 부분
		//사진 업로드용 (+)버튼 토글 이벤트
		jQuery('.imgSndBtn').click(function () {
			jQuery('.sndBtnWrap').slideToggle();
		});

		var takePicture = function(){
			var options = {
				quality          : 75,
				destinationType  : Camera.DestinationType.DATA_URL,
				sourceType       : Camera.PictureSourceType.CAMERA,
				allowEdit        : true,
				encodingType     : Camera.EncodingType.JPEG,
				targetWidth      : 300,
				targetHeight     : 300,
				popoverOptions   : CameraPopoverOptions,
				saveToPhotoAlbum : false
			};
			navigator.camera.getPicture(function(imageURI) {

			}, function(err) {

			}, options);
		};
		$scope.takePicture = takePicture;

		var uploadPhoto = function(){
			var options = {
				quality          : 75,
				destinationType  : Camera.DestinationType.DATA_URL,
				sourceType       : Camera.PictureSourceType.PHOTOLIBRARY,
				allowEdit        : true,
				encodingType     : Camera.EncodingType.JPEG,
				targetWidth      : 300,
				targetHeight     : 300,
				popoverOptions   : CameraPopoverOptions,
				saveToPhotoAlbum : false
			};
			navigator.camera.getPicture(function(imageURI) {

			}, function(err) {

			}, options);
		};
		$scope.uploadPhoto = uploadPhoto;
}])



.controller('AccountCtrl', function($scope, $rootScope, $localstorage) {
	//페이스북으로 로그인버전에서는 인증하는 메소드 내부에 선언했는데, 기능 확장을 위해서 바깥에 선언했습니다.
	var ref = new Firebase("https://rhammer2.firebaseio.com");
	var isLogged = $localstorage.get("authData") != null;

	$scope.login = function(username, password){
		ref.authWithPassword({
			email    : username,
			password : password
		}, function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				// 기존에 사용하던 rootScope사용 코드를 삭제해줍니다.
				// $rootScope.authData = authData;
				// $rootScope.authData.loginType = "email";

				// localstorage에 로그인정보를 담습니다.
				authData.loginType = "email";
				$localstorage.setObject("authData",authData);
				console.log("Authenticated successfully with payload:", authData);
			}
		});
	};

	$scope.register = function(username, password){
		ref.createUser({
			email    : username,
			password : password
		}, function(error, userData) {
			if (error) {
				console.log("Error creating user:", error);
			} else {
				//register에서는 로그인이 되지 않도록 수정했습니다.
				console.log("Successfully created user account with uid:", userData.uid);
			}
		});
	};

	$scope.resetPassword = function(username){
		ref.resetPassword({
			email : username
		}, function(error) {
			if (error === null) {
				console.log("Password reset email sent successfully");
			} else {
				console.log("Error sending password reset email:", error);
			}
		});
	};

	$scope.deactivate = function(username, password){
		ref.removeUser({
			email    : username,
			password : password
		}, function(error) {
			if (error === null) {
				console.log("User removed successfully");
			} else {
				console.log("Error removing user:", error);
			}
		});		
	};

	$scope.loginWithFacebook = function(){
		ref.authWithOAuthPopup("facebook", function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
		    console.log("Authenticated successfully with payload:", authData);
		    // $rootScope.authData = authData;
		    // $rootScope.authData.loginType = "facebook"; //추가 인증수단이 생김으로서 facebook로그인임을 표시.

		    authData.loginType = "facebook"
			$localstorage.setObject("authData",authData);
		  }
		},{remember:"default"});
	}
});
