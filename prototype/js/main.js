

/* Global variables */
let MAIN_CONTAINER_HEIGHT_RATIO = 0.85;

const navList = $("#navList");
const hamburgerMenu = $("<li></li>");
const mobileMenu = $("#mobileMenu");
let isMobileMenuOpen = false;

const searchBarInput = $("#searchInput").clone().attr("id", "searchInputMobile");
const searchButton = $("#searchButton").clone().attr("id", "searchButtonMobile");
const searchBarForm = $("#navSearch").clone().css("display", "none").attr("id", "navSearchMobile");
searchBarForm.html("");
searchBarForm.append(searchBarInput);
searchBarForm.append(searchButton);

const signinBtn = $("#signinLink").clone().css("display", "none");
const signupBtn = $("#signupLink").clone().css("display", "none");

$(() => {
	const mainContainer = $($(".main-container")[0]);
	if ($(window).width() < 600) {
		MAIN_CONTAINER_HEIGHT_RATIO = 0.91;
	} else {
		MAIN_CONTAINER_HEIGHT_RATIO = 0.85;
	}

	const newHeight = ($(window).height() * MAIN_CONTAINER_HEIGHT_RATIO);

	searchBarForm.on('keypress', (e) => {
		if(e.which == 13) {
			const searchText = searchBarInput.val().toLowerCase();
			window.location.assign(`/prototype/search.html?searchTerm=${searchText}&page=1`);
		}
	});

	searchButton.click(e => {
		const searchText = searchBarInput.val().toLowerCase();
		window.location.assign(`/prototype/search.html?searchTerm=${searchText}&page=1`);
	});

	mainContainer.height(newHeight);
	createMobileMenu();
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
		'img/eevee.png',
		'img/bulbasaur.png',
		'img/charmander.png',
		'img/Pikachu.png'];
	   var size = images.length -1;
	   var x = Math.floor(size * Math.random());
	   console.log(x);
	   console.log(images.length);
    $('#banner-left').css('background-image', "url("+ images[x] + ") ");
	$('#banner-right').css('background-image', "url("+ images[x] + ") ");

});

const DELAY_BEFORE_ANIMATION = 0; // How long to wait before the animation starts
const ANIMATION_LENGTH = 250; // How long the animation lasts
$("body").delay(DELAY_BEFORE_ANIMATION).animate({"opacity": "1"}, ANIMATION_LENGTH);

function createMobileMenu() {
	mobileMenu.append(searchBarForm);
	mobileMenu.append(signinBtn);
	mobileMenu.append(signupBtn);

	const hamburgerMenuBtn = $("<button></button>");
	hamburgerMenuBtn.attr("id", "hamburgerMenuBtn");
	const hamburgerMenuIcon = $("<i class='fa fa-bars fa-3x'></i>");
	hamburgerMenuIcon.addClass("hamburgerMenuIcon");
	hamburgerMenuBtn.append(hamburgerMenuIcon);
	hamburgerMenu.append(hamburgerMenuBtn);
}

function handleMobileMenu() {
	if ($(window).width() <= 949) {
		navList.prepend(hamburgerMenu);

		const hamburgerMenuBtn = $("#hamburgerMenuBtn");

		hamburgerMenuBtn.unbind().click(e => {
			handleMobileMenuClick();
		});
	} else {
		mobileMenu.css("display", "none");
		hamburgerMenu.remove();
	}
}

function handleMobileMenuClick() {
	if (isMobileMenuOpen) {
		mobileMenu.css("display", "none");
		mobileMenu.remove();
		isMobileMenuOpen = false;
	} else {
		searchBarForm.css("display", "block");
		signinBtn.css("display", "block");
		signupBtn.css("display", "block");

		$($("nav")[0]).append(mobileMenu);
		mobileMenu.css("display", "block");
		isMobileMenuOpen = true;
	}
}