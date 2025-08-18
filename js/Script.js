// Typing effect
const text = "Anshuman Singh Tomar";
let i = 0;
function typing() {
  if(i < text.length){
    document.querySelector(".typing-text").innerHTML += text.charAt(i);
    i++;
    setTimeout(typing, 100);
  }
}
typing();

// Scroll-to-top
const scrollBtn = document.getElementById("scrollTopBtn");
window.onscroll = () => {
  if(window.scrollY > 300){
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
};
scrollBtn.onclick = () => window.scrollTo({top:0, behavior:"smooth"});
