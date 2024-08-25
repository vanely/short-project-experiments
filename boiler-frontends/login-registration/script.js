document.getElementById('register-link').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent default anchor behavior

  document.getElementById('form-title').innerText = 'Register';
  document.getElementById('auth-form').innerHTML = `
        <div class="input-group">
            <label for="new-username">Username</label>
            <input type="text" id="new-username" name="username" required>
        </div>
        <div class="input-group">
            <label for="new-password">Password</label>
            <input type="password" id="new-password" name="password" required>
        </div>
        <div class="input-group">
            <button type="submit" class="btn">Register</button>
        </div>
        <div class="oauth-group">
            <button type="button" class="btn oauth-btn" id="google-register">Sign up with Google</button>
        </div>
        <div class="register-link">
            <p>Already have an account? <a href="#" id="login-link">Login here</a></p>
        </div>
    `;
  document.getElementById('login-link').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('form-title').innerText = 'Login';
    document.getElementById('auth-form').innerHTML = `
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="input-group">
                <button type="submit" class="btn">Login</button>
            </div>
            <div class="oauth-group">
                <button type="button" class="btn oauth-btn" id="google-login">Sign in with Google</button>
            </div>
            <div class="register-link">
                <p>Don't have an account? <a href="#" id="register-link">Register here</a></p>
            </div>
            <div class="forgot-password">
                <a href="#" id="forgot-password-link">Forgot Password?</a>
            </div>
        `;
    // Reattach event listeners for the new login form
    document.getElementById('register-link').addEventListener('click', arguments.callee);
    document.getElementById('forgot-password-link').addEventListener('click', showForgotPasswordForm);
  });
});

// Function to show the forgot password form
function showForgotPasswordForm(event) {
  event.preventDefault(); // Prevent default anchor behavior
  document.getElementById('form-title').innerText = 'Forgot Password';
  document.getElementById('auth-form').innerHTML = `
        <div class="input-group">
            <label for="forgot-email">Enter your email</label>
            <input type="email" id="forgot-email" name="email" required>
        </div>
        <div class="input-group">
            <button type="submit" class="btn">Send Recovery Link</button>
        </div>
        <div class="register-link">
            <p>Remember your password? <a href="#" id="login-back-link">Login here</a></p>
        </div>
    `;
  document.getElementById('login-back-link').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('form-title').innerText = 'Login';
    document.getElementById('auth-form').innerHTML = `
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="input-group">
                <button type="submit" class="btn">Login</button>
            </div>
            <div class="oauth-group">
                <button type="button" class="btn oauth-btn" id="google-login">Sign in with Google</button>
            </div>
            <div class="register-link">
                <p>Don't have an account? <a href="#" id="register-link">Register here</a></p>
            </div>
            <div class="forgot-password">
                <a href="#" id="forgot-password-link">Forgot Password?</a>
            </div>
        `;
    // Reattach event listeners for the new login form
    document.getElementById('register-link').addEventListener('click', arguments.callee);
    document.getElementById('forgot-password-link').addEventListener('click', showForgotPasswordForm);
  });
}