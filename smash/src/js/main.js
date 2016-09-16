(function (window){

  var searchBtn = document.querySelector('.searchBtn');
  var searchBox = document.querySelector('.searchBox');
  var menuBtn = document.querySelector('.menuBtn');
  var nav = document.querySelector('header nav');
  var toTopBtn = document.querySelector('.toTopBtn');

  searchBtn.addEventListener('click', function (e) {

    if(menuBtn.classList.contains('active')){
      menuBtn.click();
    }
    this.classList.toggle('active');
    searchBox.classList.toggle('hide');
    if(searchBtn.classList.contains('active')){
      searchBox.querySelector('input').focus();
    }
  });
  menuBtn.addEventListener('click', function (e) {
    if(searchBtn.classList.contains('active')){
      searchBtn.click();
    }
    this.classList.toggle('active');
    nav.classList.toggle('hide');
  });

  toTopBtn.addEventListener('click', function (e) {
    window.scrollTo(0,0);
  });

}(window));
