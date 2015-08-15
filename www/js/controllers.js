angular.module('starter.controllers', ['firebase'])



.controller('ChatsCtrl', ['$scope', '$firebase', '$rootScope',
	function( $scope, $firebase, $rootScope){
		//firebase1탄에서 만들었던 본인의 계정을 입력해주세요
		var ref = new Firebase('http://rhammer2.firebaseio.com/');

		//firebase 서버와 동기화를 합니다.
		var sync = $firebase(ref);

		//서버에 저장된 데이터를 동기적으로 담아줄 배열선언. 세부내용은 Firebase API참조!
		$scope.chats = sync.$asArray();

		//채팅에서 전송을 하면 실행될 메소드
		$scope.sendChat = function(chat){

			if($rootScope.authData){
				//$add는 Firebase에서 제공하는 메소드입니다.

				//페이스북으로 로그인한 경우
				if($rootScope.authData.loginType == "facebook"){
					$scope.chats.$add({
						user: $rootScope.authData.facebook.displayName,
						message: chat.message,
						img: $rootScope.authData.facebook.profileImageURL
					});
					
					//채팅내용을 전송하면 채팅창 비워줘야겠죠? 채팅메시지를 빈문자열로 초기화
					chat.message = "";									
				}

				//이메일인증으로 로그인한 경우
				else if($rootScope.authData.loginType == "email"){
					$scope.chats.$add({
						user: $rootScope.authData.password.email,
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
}])



.controller('AccountCtrl', function($scope, $rootScope) {
	//페이스북으로 로그인버전에서는 인증하는 메소드 내부에 선언했는데, 기능 확장을 위해서 바깥에 선언했습니다.
	var ref = new Firebase("https://rhammer2.firebaseio.com");

	$scope.login = function(username, password){
		ref.authWithPassword({
			email    : username,
			password : password
		}, function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
			} else {
				$rootScope.authData = authData;
				$rootScope.authData.loginType = "email";
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
				$rootScope.authData = authData;
				$rootScope.authData.loginType = "email";
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
		    $rootScope.authData = authData;
		    $rootScope.authData.loginType = "facebook"; //추가 인증수단이 생김으로서 facebook로그인임을 표시.
		  }
		},{remember:"default"});
	}
});
