/*=============== SHOW HIDDEN - PASSWORD ===============*/
const showHiddenPass = (loginPass, loginEye) => {
  const input = document.getElementById(loginPass),
    iconEye = document.getElementById(loginEye);

  iconEye.addEventListener("click", () => {
    // Change password to text
    if (input.type === "password") {
      // Switch to text
      input.type = "text";

      // Icon change
      iconEye.classList.add("fa-eye");
      iconEye.classList.remove("fa-eye-slash");
    } else {
      // Change to password
      input.type = "password";

      // Icon change
      iconEye.classList.remove("fa-eye");
      iconEye.classList.add("fa-eye-slash");
    }
  });
};

showHiddenPass("login-pass", "login-eye");

/*=============== Menu ===============*/
document.querySelector(".menu__button").addEventListener("click", () => {
  const menuContent = document.querySelector(".menu__content");
  if (menuContent.style.display === "none" || !menuContent.style.display) {
    menuContent.style.display = "flex";
  } else {
    menuContent.style.display = "none";
  }
});
