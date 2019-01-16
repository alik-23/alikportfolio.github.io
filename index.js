(function() {

    var prevScrollPos = window.pageYOffset || document.documentElement.scrollTop;

    window.onscroll = function() {
        var currentScrolPos = window.pageYOffset || document.documentElement.scrollTop;
        var navbar = document.querySelector('.navbar');
        var navbarHeight = navbar.getBoundingClientRect().height;
        if (currentScrolPos > prevScrollPos) {
            navbar.style.top = -navbarHeight + 'px';
        } else {
            navbar.style.top = '0';
        }
        prevScrollPos = currentScrolPos;
    }

    



}());