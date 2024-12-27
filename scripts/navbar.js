/* Navbar and Footer Functionality */

// navbar
 function renderNavbar() {
    const navbar =`<div>
        <a href="index.html">Home</a>
        <a href="signup.html">Sign Up</a>
        <a href="login.html">Log In</a>
        <a href="todos.html">Todos</a>
      </div>`;

      document.getElementById('nav').innerHTML = navbar;
  }

  
  // footer
 function renderFooter() {
    const footer =  `<p>&copy; 2024 Todo App. All rights reserved.</p>`;

    document.getElementById('footer').innerHTML = footer;
  }

  export {renderNavbar, renderFooter};