/*=============== SHOW HIDDEN - PASSWORD ===============*/
const showHiddenPass = (signupPass, signupEye) => {
  const input = document.getElementById(signupPass),
    iconEye = document.getElementById(signupEye);

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

showHiddenPass("signup-pass", "signup-eye");

/*=============== Menu ===============*/
document.querySelector(".menu__button").addEventListener("click", () => {
  const menuContent = document.querySelector(".menu__content");
  if (menuContent.style.display === "none" || !menuContent.style.display) {
    menuContent.style.display = "flex";
  } else {
    menuContent.style.display = "none";
  }
});
