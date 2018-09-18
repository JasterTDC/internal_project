(function(){
  var _loginForm = {},
      _loginUsername = {},
      _loginPassword = {},
      _loginConfig = {
        url : '/login/',
        method : 'POST'
      },
      _loginRequest = new XMLHttpRequest();

  var
  _onLoginRequest = function(){
    console.log( this );

    if ( this.readyState == 4 ){
      JSON.parse(this.responseText)
    }
  },
  _onLoginSubmit = function(evt){
    evt.preventDefault();

    _loginRequest.onreadystatechange = _onLoginRequest;
    _loginRequest.open( _loginConfig.method, _loginConfig.url, true );
    _loginRequest.setRequestHeader( 'Content-Type', 'application/json' );
    _loginRequest.send(JSON.stringify({
      username : _loginUsername.value,
      password : _loginPassword. value
    }));
  },
  _onDomLoad = function(evt){
    _loginForm = document.getElementById( 'login-form' );
    _loginUsername = document.getElementById( 'username' );
    _loginPassword = document.getElementById( 'password' );

    _loginForm.addEventListener( 'submit', _onLoginSubmit );
  };

  document.addEventListener( 'DOMContentLoaded', _onDomLoad );

})();
