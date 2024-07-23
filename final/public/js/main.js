/* Global variables */
let MAIN_CONTAINER_HEIGHT_RATIO = 0.85;

let isMobileMenuOpen = false;

$(() => {
	const mainContainer = $($(".main-container")[0]);
	if ($(window).width() < 600) {
		MAIN_CONTAINER_HEIGHT_RATIO = 0.91;
	} else {
		MAIN_CONTAINER_HEIGHT_RATIO = 0.85;
	}

	const newHeight = ($(window).height() * MAIN_CONTAINER_HEIGHT_RATIO);

	mainContainer.height(newHeight);
	createMobileMenu()
	handleMobileMenu();

	/* Make Navbar Dynamic */
	$(window).resize(e => {
		handleMobileMenu();
	});
});

$(window).resize(e => {
	const mainContainer = $($(".main-container")[0]);

	if ($(window).width() < 600) {
		MAIN_CONTAINER_HEIGHT_RATIO = 0.91;
	} else {
		MAIN_CONTAINER_HEIGHT_RATIO = 0.85;
	}

	const newHeight = ($(window).height() * MAIN_CONTAINER_HEIGHT_RATIO);
	mainContainer.height(newHeight);
});

/* When page is refreshed, the banner will change */
  $(function(){
	var images = [
		'/img/eevee.png',
		'/img/bulbasaur.png',
		'/img/charmander.png',
		'/img/Pikachu.png'];
	   var size = images.length -1;
	   var x = Math.floor(size * Math.random());
	   
    $('#banner-left').css('background-image', "url("+ images[x] + ") ");
	$('#banner-right').css('background-image', "url("+ images[x] + ") ");

});

const DELAY_BEFORE_ANIMATION = 0; // How long to wait before the animation starts
const ANIMATION_LENGTH = 250; // How long the animation lasts
$("body").delay(DELAY_BEFORE_ANIMATION).animate({"opacity": "1"}, ANIMATION_LENGTH);

function createMobileMenu() {
	const navList = $("nav");
	const hamburgerMenuBtn = $("<button></button>");
	hamburgerMenuBtn.attr("id", "hamburgerMenuBtn");
	
	const hamburgerMenuIcon = $("<i class='fa fa-bars fa-3x'></i>");
	hamburgerMenuIcon.addClass("hamburgerMenuIcon");
	hamburgerMenuBtn.append(hamburgerMenuIcon);
	hamburgerMenuBtn.css("display", "none");

	navList.prepend(hamburgerMenuBtn);
}

function handleMobileMenu() {
	const navList = $("nav");
	const navCont = $("#navCont");
	const mobileMenu = $("#mobileMenu");

	if ($(window).width() <= 969) {
		const hamburgerMenuBtn = $("#hamburgerMenuBtn");

		hamburgerMenuBtn.css("display", "inline");
		navCont.css("display", "none");

		hamburgerMenuBtn.unbind().click(e => {
			handleMobileMenuClick();
		});
	} else {
		navCont.css("display", "flex");
		$("#hamburgerMenuBtn").css("display", "none");
	}
}

function handleMobileMenuClick() {
	const navList = $("nav");
	const navCont = $("#navCont");

	if (isMobileMenuOpen) {
		navCont.css("display", "none");
		isMobileMenuOpen = false;
	} else {
		navList.append(mobileMenu);
		navCont.css("display", "flex");
		isMobileMenuOpen = true;
	}
}